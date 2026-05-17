import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';

import { Sidebar } from '../../../shared/sidebar/sidebar';
import { AuthService } from '../../../services/auth';
import { ResumeService } from '../../../services/resume';
import { UserReputationService } from '../../../services/user-reputation';
import { UserLevelService } from '../../../services/user-level';
import { LocationService } from '../../../services/location.service';
import { Resume, Education, Experience, SkillEntry, Certification, Training, Project } from '../../../models/resume';
import { UserReputation } from '../../../models/user-reputation';
import { UserLevel } from '../../../models/user-level';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Sidebar],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  currentUser: any;

  loading = true;
  saving = false;
  saved = false;
  saveError = '';
  activeTab = 'personal';
  resume: Resume | null = null;
  reputation: UserReputation | null = null;
  level: UserLevel | null = null;
  profileCompletion = 0;
  missingFields: string[] = [];
  showPreview = false;

  // Location data
  divisions: string[] = [];
  districts: string[] = [];

  // Dropdown options
  genders = ['Male', 'Female', 'Other'];
  maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  religions = ['Islam', 'Hinduism', 'Christianity', 'Buddhism', 'Other'];
  careerLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Top Level'];
  availableForOptions = ['Full-time', 'Part-time', 'Remote', 'Freelance', 'Internship'];
  englishProficiencies = ['Basic', 'Conversational', 'Proficient', 'Fluent', 'Native'];
  skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  visibilityOptions = ['Public', 'Private', 'Recruiters Only'];
  jobCategories = ['Software Development', 'Web Development', 'Mobile Development', 'Data Science', 'UI/UX Design', 'Digital Marketing', 'Accounting', 'HR Management'];

  form!: FormGroup;

  tabs = [
    { key: 'personal', label: 'Personal Info', icon: 'bi-person' },
    { key: 'career', label: 'Career', icon: 'bi-briefcase' },
    { key: 'education', label: 'Education', icon: 'bi-mortarboard' },
    { key: 'experience', label: 'Experience', icon: 'bi-building' },
    { key: 'skills', label: 'Skills', icon: 'bi-tools' },
    { key: 'certifications', label: 'Certifications', icon: 'bi-patch-check' },
    { key: 'projects', label: 'Projects', icon: 'bi-code-slash' },
    { key: 'social', label: 'Social & CV', icon: 'bi-share' },
  ];

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private reputationService: UserReputationService,
    private levelService: UserLevelService,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
    if (!this.currentUser) {
      this.loading = false;
      return;
    }
    this.divisions = this.locationService.getDivisions();
    this.buildForm();
    this.loadData();
  }


  // ── Form Builder ──────────────────────────────────────────────

  buildForm(): void {
    this.form = this.fb.group({

      // Personal
      resumeHeadline: [''],
      careerObjective: [''],
      fatherName: [''],
      motherName: [''],
      gender: [''],
      dateOfBirth: [''],
      nationality: ['Bangladeshi'],
      religion: [''],
      maritalStatus: [''],
      bloodGroup: [''],

      // Contact
      division: [''],
      district: [''],
      upazila: [''],
      postCode: [''],
      presentAddress: [''],
      permanentAddress: [''],

      // Career
      careerSummary: [''],
      careerLevel: [''],
      presentSalary: [0],
      expectedSalary: [0, Validators.min(0)],
      availableFor: [''],
      preferredJobCategories: [[]],
      preferredLocations: [[]],
      englishProficiency: [''],
      languagesKnown: [[]],

      // Social
      linkedinUrl: [''],
      githubLink: [''],
      portfolioLink: [''],
      behanceUrl: [''],
      dribbbleUrl: [''],

      // CV settings
      cvVisibility: ['Public'],
      nidNumber: [''],

      // Dynamic arrays
      educations: this.fb.array([]),
      experiences: this.fb.array([]),
      skillEntries: this.fb.array([]),
      certificationList: this.fb.array([]),
      trainings: this.fb.array([]),
      projects: this.fb.array([]),
    });

    // Update districts when division changes
    this.form.get('division')?.valueChanges.subscribe(div => {
      this.districts = this.locationService.getDistricts(div);
      this.form.get('district')?.setValue('');
    });

    // Real-time profile strength calculation
    this.form.valueChanges.subscribe(val => {
      this.calculateRealTimeCompletion(val);
    });
  }

  calculateRealTimeCompletion(val: any): void {
    // Construct a temporary resume object to pass to the service
    const tempResume: Resume = {
      ...this.resume,
      ...val,
      // Handle the specialized arrays from form value
      educations: val.educations || [],
      experiences: val.experiences || [],
      skillEntries: val.skillEntries || [],
      certificationList: val.certificationList || [],
      projects: val.projects || [],
      languagesKnown: val.languagesKnown || []
    } as Resume;

    this.profileCompletion = this.resumeService.calculateProfileCompletion(tempResume);
    this.missingFields = this.resumeService.getMissingFields(tempResume);
    this.cdr.markForCheck();
  }

  // ── FormArray Getters ─────────────────────────────────────────

  get educationsArray(): FormArray {
    return this.form.get('educations') as FormArray;
  }

  get experiencesArray(): FormArray {
    return this.form.get('experiences') as FormArray;
  }

  get skillEntriesArray(): FormArray {
    return this.form.get('skillEntries') as FormArray;
  }

  get certificationListArray(): FormArray {
    return this.form.get('certificationList') as FormArray;
  }

  get trainingsArray(): FormArray {
    return this.form.get('trainings') as FormArray;
  }

  get projectsArray(): FormArray {
    return this.form.get('projects') as FormArray;
  }

  // ── Form Group Builders ───────────────────────────────────────

  newEducation(data?: Partial<Education>): FormGroup {
    return this.fb.group({
      id: [data?.id || ''],
      degree: [data?.degree || '', Validators.required],
      groupMajor: [data?.groupMajor || ''],
      institute: [data?.institute || '', Validators.required],
      board: [data?.board || ''],
      result: [data?.result || ''],
      passingYear: [data?.passingYear || new Date().getFullYear()],
      duration: [data?.duration || ''],
      achievements: [data?.achievements || ''],
    });
  }

  newExperience(data?: Partial<Experience>): FormGroup {
    return this.fb.group({
      id: [data?.id || ''],
      companyName: [data?.companyName || '', Validators.required],
      designation: [data?.designation || '', Validators.required],
      department: [data?.department || ''],
      employmentPeriod: [data?.employmentPeriod || ''],
      currentlyWorking: [data?.currentlyWorking || false],
      responsibilities: [data?.responsibilities || ''],
      achievements: [data?.achievements || ''],
    });
  }

  newSkillEntry(data?: Partial<SkillEntry>): FormGroup {
    return this.fb.group({
      id: [data?.id || ''],
      skillName: [data?.skillName || '', Validators.required],
      skillLevel: [data?.skillLevel || 'Intermediate'],
      yearsOfExperience: [data?.yearsOfExperience || 1],
    });
  }

  newCertification(data?: Partial<Certification>): FormGroup {
    return this.fb.group({
      id: [data?.id || ''],
      courseName: [data?.courseName || '', Validators.required],
      institute: [data?.institute || ''],
      completionYear: [data?.completionYear || new Date().getFullYear()],
      credentialId: [data?.credentialId || ''],
    });
  }

  newTraining(data?: Partial<Training>): FormGroup {
    return this.fb.group({
      id: [data?.id || ''],
      title: [data?.title || '', Validators.required],
      institute: [data?.institute || ''],
      duration: [data?.duration || ''],
      year: [data?.year || new Date().getFullYear()],
    });
  }

  newProject(data?: Partial<Project>): FormGroup {
    return this.fb.group({
      id: [data?.id || ''],
      projectName: [data?.projectName || '', Validators.required],
      technologies: [data?.technologies || ''],
      description: [data?.description || ''],
      githubLink: [data?.githubLink || ''],
      liveLink: [data?.liveLink || ''],
    });
  }

  // ── Add / Remove Array Items ──────────────────────────────────

  addEducation(): void { this.educationsArray.push(this.newEducation()); }
  removeEducation(i: number): void { this.educationsArray.removeAt(i); }

  addExperience(): void { this.experiencesArray.push(this.newExperience()); }
  removeExperience(i: number): void { this.experiencesArray.removeAt(i); }

  addSkill(): void { this.skillEntriesArray.push(this.newSkillEntry()); }
  removeSkill(i: number): void { this.skillEntriesArray.removeAt(i); }

  addCertification(): void { this.certificationListArray.push(this.newCertification()); }
  removeCertification(i: number): void { this.certificationListArray.removeAt(i); }

  addTraining(): void { this.trainingsArray.push(this.newTraining()); }
  removeTraining(i: number): void { this.trainingsArray.removeAt(i); }

  addProject(): void { this.projectsArray.push(this.newProject()); }
  removeProject(i: number): void { this.projectsArray.removeAt(i); }

  // ── Chip/Tag Helpers ──────────────────────────────────────────

  newCategory = '';
  newLocation = '';
  newLanguage = '';

  addToArray(field: string, value: string): void {
    if (!value.trim()) return;
    const current: string[] = this.form.get(field)?.value || [];
    if (!current.includes(value.trim())) {
      this.form.get(field)?.setValue([...current, value.trim()]);
    }
  }

  removeFromArray(field: string, item: string): void {
    const current: string[] = this.form.get(field)?.value || [];
    this.form.get(field)?.setValue(current.filter(v => v !== item));
  }

  getArrayValue(field: string): string[] {
    return this.form.get(field)?.value || [];
  }

  // ── Load Data ─────────────────────────────────────────────────

  loadData(): void {
    const userId = this.currentUser?.id;
    if (!userId) {
      this.loading = false;
      return;
    }

    // Safety net — always stop spinner within 5s
    const loadingTimeout = setTimeout(() => {
      this.loading = false;
    }, 5000);

    this.resumeService.findByUserId(userId).subscribe({
      next: (resumes) => {
        clearTimeout(loadingTimeout);
        if (resumes.length > 0) {
          this.resume = resumes[0];
          this.patchForm(this.resume);
          this.profileCompletion = this.resume.profileCompletion || 0;
          this.missingFields = this.resumeService.getMissingFields(this.resume);
        }
        // For new users with no resume, the form is already empty — just show it
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        clearTimeout(loadingTimeout);
        this.loading = false;
      }
    });

    this.reputationService.findByUserId(userId).subscribe({
      next: (reps) => { if (reps.length > 0) this.reputation = reps[0]; }
    });

    this.levelService.findByUserId(userId).subscribe({
      next: (levels) => { if (levels.length > 0) this.level = levels[0]; }
    });
  }

  patchForm(r: Resume): void {
    // Patch scalar fields
    this.form.patchValue({
      resumeHeadline: r.resumeHeadline || '',
      careerObjective: r.careerObjective || '',
      fatherName: r.fatherName || '',
      motherName: r.motherName || '',
      gender: r.gender || '',
      dateOfBirth: r.dateOfBirth || '',
      nationality: r.nationality || 'Bangladeshi',
      religion: r.religion || '',
      maritalStatus: r.maritalStatus || '',
      bloodGroup: r.bloodGroup || '',
      division: r.division || '',
      district: r.district || '',
      upazila: r.upazila || '',
      postCode: r.postCode || '',
      presentAddress: r.presentAddress || '',
      permanentAddress: r.permanentAddress || '',
      careerSummary: r.careerSummary || '',
      careerLevel: r.careerLevel || '',
      presentSalary: r.presentSalary || 0,
      expectedSalary: r.expectedSalary || 0,
      availableFor: r.availableFor || '',
      preferredJobCategories: r.preferredJobCategories || [],
      preferredLocations: r.preferredLocations || [],
      englishProficiency: r.englishProficiency || '',
      languagesKnown: r.languagesKnown || [],
      linkedinUrl: r.linkedinUrl || '',
      githubLink: r.githubLink || '',
      portfolioLink: r.portfolioLink || '',
      behanceUrl: r.behanceUrl || '',
      dribbbleUrl: r.dribbbleUrl || '',
      cvVisibility: r.cvVisibility || 'Public',
      nidNumber: r.nidNumber || '',
    });

    // Update districts list after patching division
    if (r.division) {
      this.districts = this.locationService.getDistricts(r.division);
    }

    // Patch arrays
    this.educationsArray.clear();
    (r.educations || []).forEach(e => this.educationsArray.push(this.newEducation(e)));

    this.experiencesArray.clear();
    (r.experiences || []).forEach(e => this.experiencesArray.push(this.newExperience(e)));

    this.skillEntriesArray.clear();
    (r.skillEntries || []).forEach(s => this.skillEntriesArray.push(this.newSkillEntry(s)));

    this.certificationListArray.clear();
    (r.certificationList || []).forEach(c => this.certificationListArray.push(this.newCertification(c)));

    this.trainingsArray.clear();
    (r.trainings || []).forEach(t => this.trainingsArray.push(this.newTraining(t)));

    this.projectsArray.clear();
    (r.projects || []).forEach(p => this.projectsArray.push(this.newProject(p)));
  }

  // ── Save ──────────────────────────────────────────────────────

  onSave(): void {
    this.saving = true;
    this.saved = false;
    this.saveError = '';

    const formValue = this.form.value;

    const resumeData: Resume = {
      ...(this.resume || {}),
      userId: this.currentUser?.id ?? '',

      // keep existing fields
      summary: this.resume?.summary || '',
      education: this.resume?.education || '',
      experience: this.resume?.experience || '',
      certifications: this.resume?.certifications || '',

      // extended fields
      resumeHeadline: formValue.resumeHeadline,
      careerObjective: formValue.careerObjective,
      fatherName: formValue.fatherName,
      motherName: formValue.motherName,
      gender: formValue.gender,
      dateOfBirth: formValue.dateOfBirth,
      nationality: formValue.nationality,
      religion: formValue.religion,
      maritalStatus: formValue.maritalStatus,
      bloodGroup: formValue.bloodGroup,
      division: formValue.division,
      district: formValue.district,
      upazila: formValue.upazila,
      postCode: formValue.postCode,
      presentAddress: formValue.presentAddress,
      permanentAddress: formValue.permanentAddress,
      careerSummary: formValue.careerSummary,
      careerLevel: formValue.careerLevel,
      presentSalary: formValue.presentSalary,
      expectedSalary: formValue.expectedSalary,
      availableFor: formValue.availableFor,
      preferredJobCategories: formValue.preferredJobCategories,
      preferredLocations: formValue.preferredLocations,
      englishProficiency: formValue.englishProficiency,
      languagesKnown: formValue.languagesKnown,
      linkedinUrl: formValue.linkedinUrl,
      githubLink: formValue.githubLink,
      portfolioLink: formValue.portfolioLink,
      behanceUrl: formValue.behanceUrl,
      dribbbleUrl: formValue.dribbbleUrl,
      cvVisibility: formValue.cvVisibility,
      nidNumber: formValue.nidNumber,
      nidVerified: this.resume?.nidVerified || false,

      // arrays
      educations: formValue.educations,
      experiences: formValue.experiences,
      skillEntries: formValue.skillEntries,
      certificationList: formValue.certificationList,
      trainings: formValue.trainings,
      projects: formValue.projects,

      profileCompletion: 0,
    };

    this.resumeService.saveExtendedResume(resumeData).subscribe({
      next: (saved) => {
        this.resume = saved;
        this.profileCompletion = saved.profileCompletion;
        this.missingFields = this.resumeService.getMissingFields(saved);
        
        // Sync with dashboard stats
        this.syncDashboardStats(saved.profileCompletion);
        
        this.saving = false;
        this.saved = true;
        setTimeout(() => this.saved = false, 3000);
      },
      error: () => {
        this.saving = false;
        this.saveError = 'Failed to save. Please try again.';
      }
    });
  }

  syncDashboardStats(completion: number): void {
    const userId = this.currentUser?.id;
    if (!userId) return;

    // Update jobseeker stats
    this.resumeService.updateDashboardCompletion(userId, completion).subscribe();
    
    // Update freelancer stats
    this.resumeService.updateFreelancerCompletion(userId, completion).subscribe();
  }

  // ── CV Actions ──────────────────────────────────────────────

  onPreview(): void {
    this.showPreview = true;
  }

  async onDownload(): Promise<void> {
    const element = document.getElementById('cv-pdf-template');
    if (!element) {
      alert('Error: CV template not found');
      return;
    }

    try {
      this.saving = true;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const filename = `resume-${this.currentUser?.name?.replace(/\s+/g, '-') || 'user'}.pdf`;
      pdf.save(filename);
      this.saving = false;
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. Please try again.');
      this.saving = false;
    }
  }

  // ── Helpers ───────────────────────────────────────────────────

  getCompletionColor(): string {
    if (this.profileCompletion >= 80) return 'bg-success';
    if (this.profileCompletion >= 50) return 'bg-warning';
    return 'bg-danger';
  }

  getLevelBadge(): string {
    const l = this.level?.freelancerLevel;
    if (l === 'topseller') return 'bg-warning text-dark';
    if (l === 'level2') return 'bg-primary';
    if (l === 'level1') return 'bg-info text-dark';
    return 'bg-secondary';
  }

  getSkillLevelColor(level: string): string {
    const map: Record<string, string> = {
      'Beginner': 'bg-secondary', 'Intermediate': 'bg-info text-dark',
      'Advanced': 'bg-primary', 'Expert': 'bg-success'
    };
    return map[level] || 'bg-secondary';
  }

  asFormGroup(ctrl: AbstractControl): FormGroup {
    return ctrl as FormGroup;
  }
}