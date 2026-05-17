import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private url = 'http://localhost:3000/users';
  private STORAGE_KEY = 'workbridge_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  // ─── Original 5 CRUD Methods ──────────────────────────────────

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  getById(id: string | number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  save(user: User): Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  update(id: string | number, user: User): Observable<User> {
    return this.http.put<User>(`${this.url}/${id}`, user);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // ─── Additional Filter Methods ────────────────────────────────

  findByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?email=${email}&isDeleted=false`);
  }

  findByStatus(status: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?status=${status}`);
  }

  findByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?role=${role}`);
  }

  findAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?role=admin`);
  }

  findActive(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?isDeleted=false&status=active`);
  }

  searchByName(name: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?name_like=${name}`);
  }

  // ─── Register ─────────────────────────────────────────────────
  // Role is ALWAYS forced to 'user' — admin cannot be registered
  register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    city: string;
    area: string;
    role: 'user' | 'company';
  }): Observable<{ success: boolean; message: string; user?: User }> {
    return this.registerUser(data);
  }
  registerUser(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    city: string;
    area: string;
    role: 'user' | 'company';
  }): Observable<{ success: boolean; message: string; user?: User }> {

    return new Observable(observer => {

      // Step 1 — Check if email already taken
      this.findByEmail(data.email).subscribe({
        next: (existing) => {

          if (existing.length > 0) {
            observer.next({ success: false, message: 'Email already registered. Please login.' });
            observer.complete();
            return;
          }

          // Step 2 — Build new user
          const newUser: User = {
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            password: data.password,
            phone: data.phone.trim(),
            city: data.city,
            area: data.area.trim(),
            profileImage: `https://i.pravatar.cc/150?u=${encodeURIComponent(data.email)}`,
            isVerified: false,
            status: 'active',
            isDeleted: false,
            createdAt: new Date().toISOString(),
            role: data.role,
            isSuperAdmin: false,
          };

          // Step 3 — Save user, then auto-provision all required records
          this.save(newUser).subscribe({
            next: (savedUser) => {
              const uid = String(savedUser.id);

              // Auto-provision: Wallet (Always)
              this.http.post('http://localhost:3000/wallets', {
                userId: uid, balance: 0
              }).subscribe();

              if (savedUser.role === 'user') {
                // Auto-provision: Empty Resume/Profile
                this.http.post('http://localhost:3000/resumes', {
                  userId: uid,
                  resumeHeadline: '',
                  careerObjective: '',
                  cvVisibility: 'Public',
                  profileCompletion: 0,
                  educations: [],
                  experiences: [],
                  skillEntries: [],
                  certificationList: [],
                  projects: [],
                  trainings: [],
                  languagesKnown: []
                }).subscribe();

                // Auto-provision: Jobseeker Dashboard Stats
                this.http.post('http://localhost:3000/jobseekerDashboardStats', {
                  userId: uid,
                  profileCompletion: 0,
                  appliedJobs: 0,
                  profileViews: 0,
                  interviewInvitations: 0,
                  savedJobs: 0,
                  recommendedJobsCount: 0,
                  applicationsByStatus: []
                }).subscribe();

                // Auto-provision: Freelancer Stats
                this.http.post('http://localhost:3000/freelancerStats', {
                  userId: uid,
                  totalEarnings: 0,
                  monthlyEarnings: 0,
                  ordersCompleted: 0,
                  responseRate: 100,
                  completionRate: 100,
                  averageRating: 0,
                  weeklyEarnings: [0, 0, 0, 0, 0, 0, 0]
                }).subscribe();
              } else if (savedUser.role === 'company') {
                // Auto-provision: Employer Stats
                this.http.post('http://localhost:3000/employerDashboardStats', {
                  userId: uid,
                  activeJobs: 0,
                  totalApplicants: 0,
                  hired: 0,
                  shortlisted: 0,
                  interviewsScheduled: 0,
                  jobViews: 0,
                  topJobTitle: '',
                  topJobApplicants: 0,
                  totalSpent: 0,
                  orderedGigsCount: 0
                }).subscribe();
              }

              // Welcome notification
              this.http.post('http://localhost:3000/notifications', {
                userId: uid,
                message: `Welcome to WorkBridge, ${savedUser.name}! Complete your profile to get started.`,
                type: 'system',
                isRead: false,
                createdAt: new Date().toISOString()
              }).subscribe();

              this.storeUser(savedUser);
              observer.next({ success: true, message: 'Registration successful!', user: savedUser });
              observer.complete();
            },
            error: () => {
              observer.next({ success: false, message: 'Registration failed. Try again.' });
              observer.complete();
            }
          });
        },
        error: () => {
          observer.next({ success: false, message: 'Server error. Is JSON Server running?' });
          observer.complete();
        }
      });
    });
  }

  // ─── Login ────────────────────────────────────────────────────
  // Validates BOTH email AND password

  login(email: string, password: string): Observable<{ success: boolean; message: string; user?: User }> {

    return new Observable(observer => {

      // Step 1 — Find user by email
      this.findByEmail(email.trim().toLowerCase()).subscribe({
        next: (users) => {

          if (users.length === 0) {
            observer.next({ success: false, message: 'Email not found. Please register.' });
            observer.complete();
            return;
          }

          const user = users[0];

          // Step 2 — Check account status
          if (user.isDeleted) {
            observer.next({ success: false, message: 'This account has been deleted.' });
            observer.complete();
            return;
          }

          if (user.status === 'banned') {
            observer.next({ success: false, message: 'Your account has been banned. Contact support.' });
            observer.complete();
            return;
          }

          if (user.status === 'suspended') {
            observer.next({ success: false, message: 'Your account is suspended. Contact support.' });
            observer.complete();
            return;
          }

          // Step 3 — Validate password
          // NOTE: JSON Server has no encryption — plain text comparison
          // Spring Boot will use BCrypt when you switch backends
          if (user.password !== password) {
            observer.next({ success: false, message: 'Incorrect password. Please try again.' });
            observer.complete();
            return;
          }

          // Step 4 — Store user and return success
          this.storeUser(user);
          observer.next({ success: true, message: 'Login successful!', user });
          observer.complete();
        },
        error: () => {
          observer.next({ success: false, message: 'Server error. Is JSON Server running?' });
          observer.complete();
        }
      });
    });
  }

  // ─── Session Management ───────────────────────────────────────

  storeUser(user: User): void {
    // Store user WITHOUT password for security
    const safeUser = { ...user };
    delete (safeUser as any).password;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(safeUser));
    this.currentUserSubject.next(safeUser);
  }

  private getStoredUser(): User | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as User;
    } catch {
      return null;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): string | number | undefined {
    return this.getCurrentUser()?.id;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  // ─── Role Checks ──────────────────────────────────────────────

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'admin';
  }

  isCompany(): boolean {
    return this.getCurrentUser()?.role === 'company';
  }

  isSuperAdmin(): boolean {
    return this.getCurrentUser()?.isSuperAdmin === true;
  }

  isUser(): boolean {
    return this.getCurrentUser()?.role === 'user';
  }
}