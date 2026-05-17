import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { JobService } from '../../services/job';
import { GigService } from '../../services/gig';
import { GigPackageService } from '../../services/gig-package';
import { JobApplicationService } from '../../services/job-application';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';
import { Job } from '../../models/job';
import { Gig } from '../../models/gig';
import { GigPackage } from '../../models/gig-package';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, Navbar, Footer],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details implements OnInit {

  type = '';
  id = '';

  job: Job | null = null;
  gig: Gig | null = null;
  packages: GigPackage[] = [];
  relatedJobs: Job[] = [];
  relatedGigs: Gig[] = [];
  loading = true;
  error = '';

  // Apply modal
  showModal = false;
  applyForm: FormGroup;
  applying = false;
  applied = false;
  saved = false;

  // Gig state
  selectedPackage: GigPackage | null = null;
  activeImageIndex = 0;
  activeFaqIndex = -1;
  activeTab: 'description' | 'reviews' | 'faq' = 'description';

  // Countdown
  daysLeft = 0;

  hiringStages = [
    { label: 'Applied', icon: 'bi-file-text' },
    { label: 'Screening', icon: 'bi-eye' },
    { label: 'Interview', icon: 'bi-camera-video' },
    { label: 'Offer', icon: 'bi-envelope-open' },
    { label: 'Hired', icon: 'bi-trophy' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private gigService: GigService,
    private gigPackageService: GigPackageService,
    private jobAppService: JobApplicationService,
    private orderService: OrderService,
    public auth: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.applyForm = this.fb.group({
      coverLetter: ['', [Validators.required, Validators.minLength(50)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type')?.toLowerCase() || '';
      this.id = params.get('id') || '';
      console.log('Details Loading:', this.type, this.id);
      this.loading = true;
      this.error = '';
      this.loadData();
    });
  }

  loadData(): void {
    if (!this.id || !this.type) {
      this.error = 'Invalid URL parameters.';
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }

    if (this.type === 'job') {
      this.jobService.getById(this.id).subscribe({
        next: (job) => {
          console.log('Job Loaded Successfully:', job);
          if (!job || !job.id) {
            this.error = 'Job not found in database.';
            this.loading = false;
            this.cdr.markForCheck();
          } else {
            this.job = job;
            try {
              this.calculateDeadline();
              this.loadRelatedJobs();
            } catch (e) {
              console.error('Error processing job data:', e);
            }
            this.loading = false;
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          console.error('Job Fetch Error:', err);
          this.error = 'Failed to load job details. Please try again.';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    } else if (this.type === 'gig') {
      this.gigService.getById(this.id).subscribe({
        next: (gig) => {
          console.log('Gig Loaded Successfully:', gig);
          if (!gig || !gig.id) {
            this.error = 'Gig not found in database.';
          } else {
            this.gig = gig;
            try {
              this.loadPackages();
              this.loadRelatedGigs();
            } catch (e) {
              console.error('Error processing gig data:', e);
            }
          }
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Gig Fetch Error:', err);
          this.error = 'Failed to load gig details.';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.error = 'Unknown details type: ' + this.type;
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  loadPackages(): void {
    if (!this.gig?.id) return;
    this.gigPackageService.findByGigId(this.gig.id).subscribe({
      next: (pkgs) => {
        this.packages = pkgs;
        this.selectedPackage = pkgs.find(p => p.popular) || pkgs[1] || pkgs[0] || null;
        this.cdr.markForCheck();
      }
    });
  }

  loadRelatedJobs(): void {
    this.jobService.findOpenJobs().subscribe({
      next: (jobs) => {
        this.relatedJobs = jobs.filter(j => j.id !== this.id).slice(0, 3);
        this.cdr.markForCheck();
      }
    });
  }

  loadRelatedGigs(): void {
    this.gigService.findActiveGigs().subscribe({
      next: (gigs) => {
        this.relatedGigs = gigs.filter(g => g.id !== this.id).slice(0, 3);
        this.cdr.markForCheck();
      }
    });
  }

  calculateDeadline(): void {
    if (!this.job?.deadline) return;
    const deadline = new Date(this.job.deadline);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    this.daysLeft = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  openApplyModal(): void {
    if (!this.auth.isLoggedIn()) { this.router.navigate(['/login']); return; }
    this.showModal = true;
  }

  submitApplication(): void {
    if (this.applyForm.invalid) return;
    this.applying = true;
    const userId = this.auth.getCurrentUserId();
    if (!userId) {
      this.applying = false; return;
    }

    this.jobAppService.save({
      jobId: this.id,
      applicantId: userId,
      coverLetter: this.applyForm.get('coverLetter')?.value,
      status: 'pending',
      appliedAt: new Date().toISOString()
    }).subscribe({
      next: () => {
        this.applying = false;
        this.applied = true;
        this.showModal = false;
      },
      error: () => { this.applying = false; }
    });
  }

  orderGig(pkg: GigPackage): void {
    if (!this.auth.isLoggedIn()) { this.router.navigate(['/login']); return; }
    const userId = this.auth.getCurrentUserId();
    if (!userId || !this.gig) return;

    this.applying = true; // Use applying state for loading
    const order = {
      gigId: this.gig.id!,
      clientId: userId,
      freelancerId: this.gig.freelancerId,
      totalAmount: pkg.price,
      commissionAmount: Math.round(pkg.price * 0.1),
      status: 'active' as const,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      completedAt: ''
    };

    this.orderService.save(order).subscribe({
      next: () => {
        this.applying = false;
        this.router.navigate(['/dashboard/orders']);
      },
      error: () => {
        this.applying = false;
        alert('Failed to place order. Please try again.');
      }
    });
  }

  orderGigDefault(): void {
    if (this.selectedPackage) {
      this.orderGig(this.selectedPackage);
    } else if (this.packages.length > 0) {
      this.orderGig(this.packages[0]);
    } else {
      if (!this.auth.isLoggedIn()) { this.router.navigate(['/login']); return; }
      alert('No packages available for this gig.');
    }
  }

  toggleSave(): void { this.saved = !this.saved; }

  toggleFaq(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? -1 : index;
  }

  getStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => {
      if (i < Math.floor(rating)) return 'bi-star-fill';
      if (i < rating) return 'bi-star-half';
      return 'bi-star';
    });
  }

  getPackageBorderColor(name: string): string {
    const map: Record<string, string> = {
      basic: '#6c757d', standard: '#0d6efd', premium: '#ffc107'
    };
    return map[name] || '#6c757d';
  }

  getDeadlineUrgency(): string {
    if (this.daysLeft <= 3) return 'text-danger fw-bold';
    if (this.daysLeft <= 7) return 'text-warning fw-bold';
    return 'text-success';
  }

  getAvgRating(): number {
    if (!this.gig?.reviews?.length) return this.gig?.rating || 0;
    const sum = this.gig.reviews.reduce((a, r) => a + r.rating, 0);
    return Math.round((sum / this.gig.reviews.length) * 10) / 10;
  }

  getRevisionLabel(rev: number): string {
    return rev >= 999 ? 'Unlimited' : `${rev} Revisions`;
  }
}