import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { AuthService } from '../../../services/auth';
import { JobService } from '../../../services/job';
import { JobApplicationService } from '../../../services/job-application';
import { HiringPipelineService } from '../../../services/hiring-pipeline';
import { InterviewRoundService } from '../../../services/interview-round';
import { Job } from '../../../models/job';
import { JobApplication } from '../../../models/job-application';
import { HiringPipeline } from '../../../models/hiring-pipeline';
import { InterviewRound } from '../../../models/interview-round';

@Component({
  selector: 'app-jobs-management',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, Sidebar],
  templateUrl: './jobs-management.html',
  styleUrl: './jobs-management.css'
})
export class JobsManagement implements OnInit {

  activeTab = '';
  loading = true;
  isCompany = false;
  isUser = false;

  // Applied jobs (job seeker view)
  appliedJobs: JobApplication[] = [];

  // Posted jobs (employer view)
  postedJobs: Job[] = [];
  showPostForm = false;
  postForm: FormGroup;
  posting = false;
  postSuccess = false;
  postError: string | null = null;

  // Pipeline
  pipeline: HiringPipeline[] = [];
  pipelineStages = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];

  // Interviews
  interviews: InterviewRound[] = [];

  userId: string | number = '';

  jobTypes = ['full-time', 'part-time', 'remote', 'contract'];
  cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'];

  constructor(
    private auth: AuthService,
    private jobService: JobService,
    private jobAppService: JobApplicationService,
    private pipelineService: HiringPipelineService,
    private interviewService: InterviewRoundService,
    private fb: FormBuilder,
    private cdr:ChangeDetectorRef
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      companyName: ['', Validators.required],
      city: ['', Validators.required],
      area: [''],
      jobType: ['full-time', Validators.required],
      salaryMin: [0, Validators.min(0)],
      salaryMax: [0, Validators.min(0)],
      experienceRequired: [''],
      description: ['', Validators.required],
      deadline: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const userId = this.auth.getCurrentUserId();
    if (!userId) {
      this.loading = false;
      return;
    }
    this.userId = userId;
    console.log('Current User ID:', this.userId);
    this.isCompany = this.auth.isCompany();
    this.isUser = this.auth.isUser();

    const currentUser = this.auth.getCurrentUser();
    if (this.isCompany && currentUser) {
      this.postForm.patchValue({ companyName: currentUser.name });
    }

    // Set default tab based on role
    if (this.isCompany) {
      this.activeTab = 'posted';
    } else {
      this.activeTab = 'applied';
    }

    this.loadAll();
  }

  loadAll(): void {
    this.loadApplied();
    this.loadPosted();
    if (this.isUser) {
      this.loadPipeline();
    }
    this.loadInterviews();
    this.cdr.markForCheck();
  }

  loadApplied(): void {
    const t = setTimeout(() => { this.loading = false; }, 5000);
    this.jobAppService.findByApplicantId(this.userId).subscribe({
      next: (apps) => { clearTimeout(t); this.appliedJobs = apps; this.loading = false;  this.cdr.markForCheck(); },
      error: () => { clearTimeout(t); this.loading = false; }
    });
  }

  loadPosted(): void {
    if (!this.userId) {
      console.warn('Cannot load posted jobs: No userId found');
      return;
    }
    const eid = String(this.userId);
    console.log('Loading posted jobs for employerId:', eid);
    
    this.jobService.findAll().subscribe({
      next: (jobs) => {
        // Robust filtering: compare as strings to avoid type issues
        this.postedJobs = jobs.filter(j => 
          (String(j.employerId) === eid) && !j.isDeleted
        );
        console.log('Filtered Jobs for User:', eid, 'Count:', this.postedJobs.length);
        this.cdr.detectChanges();
        // Load pipeline after jobs are loaded so we can filter
        if (this.isCompany) {
          this.loadPipeline();
        }
      },
      error: (err) => {
        console.error('Error loading posted jobs:', err);
      }
    });
  }

  loadPipeline(): void {
    if (this.isUser) {
      this.pipelineService.findByApplicantId(this.userId).subscribe({
        next: (p) => { this.pipeline = p; this.cdr.markForCheck(); }
      });
    } else if (this.isCompany) {
      const jobIds = this.postedJobs.map(j => String(j.id));
      this.pipelineService.findAll().subscribe({
        next: (all) => {
          this.pipeline = all.filter(p => jobIds.includes(String(p.jobId)));
          this.cdr.detectChanges();
        }
      });
    }
  }

  loadInterviews(): void {
    if (this.isUser) {
      this.interviewService.findByApplicantId(this.userId).subscribe({
        next: (r) => this.interviews = r
      });
    } else if (this.isCompany) {
      // In a real app, you'd fetch interviews for all your jobs
      // For now, we'll keep it empty or fetch all for simplicity in mock
      this.interviewService.findAll().subscribe({
        next: (r) => this.interviews = r
      });
    }
  }

  getJobsByStage(stage: string): HiringPipeline[] {
    return this.pipeline.filter(p => p.stage === stage);
  }

  submitJob(): void {
    if (this.postForm.invalid) return;
    this.posting = true;
    const v = this.postForm.value;
    console.log('Submitting Job:', v);

    const currentUser = this.auth.getCurrentUser();
    const job: Job = {
      ...v,
      employerId: String(this.userId),
      companyLogo: currentUser?.profileImage || '',
      status: 'open',
      isDeleted: false,
      createdAt: new Date().toISOString(),
      publishedDate: new Date().toISOString(),
      vacancyCount: 1,
      workplaceType: 'onsite',
      division: v.city,
      district: v.city,
      fullAddress: v.area || '',
      industry: (currentUser as any)?.industry || '',
      educationLevel: 'Any',
      preferredUniversities: [],
      experienceYearsMin: 0,
      experienceYearsMax: 5,
      preferredIndustries: [],
      requiredSkills: [],
      softSkills: [],
      languageRequirements: 'Bengali, English',
      responsibilities: [],
      dailyTasks: [],
      kpis: [],
      benefits: [],
      salaryNegotiable: true,
      festivalBonus: false,
      mobileAllowance: false,
      medicalAllowance: false,
      lunchFacility: false,
      performanceBonus: false,
      flexibleHours: false,
      workFromHome: false,
      genderPreference: 'Any',
      isUrgent: false,
      isFeatured: false,
      tags: [],
      viewCount: 0,
      applicantsCount: 0,
      companyInfo: {
        website: (currentUser as any)?.website || '',
        industry: (currentUser as any)?.industry || '',
        companySize: '',
        foundedYear: 0,
        overview: (currentUser as any)?.bio || '',
        linkedinUrl: '',
        facebookUrl: '',
        isVerified: currentUser?.isVerified || false,
        officeImages: []
      },
      teamEnvironment: '',
      growthOpportunity: '',
    };

    this.jobService.save(job).subscribe({
      next: (saved) => {
        this.postedJobs.unshift(saved);
        this.posting = false;
        this.postSuccess = true;
        this.postError = null;
        this.showPostForm = false;
        this.postForm.reset({ jobType: 'full-time', salaryMin: 0, salaryMax: 0 });
        if (this.isCompany) {
          const user = this.auth.getCurrentUser();
          if (user) this.postForm.patchValue({ companyName: user.name });
        }
        setTimeout(() => this.postSuccess = false, 3000);
        this.cdr.markForCheck();
      },
      error: (err) => { 
        this.posting = false;
        this.postError = 'Failed to post job. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }

  closeJob(job: Job): void {
    if (!job.id) return;
    this.jobService.update(job.id, { ...job, status: 'closed' }).subscribe({
      next: () => job.status = 'closed'
    });
  }

  withdrawApplication(app: JobApplication): void {
    if (!app.id || !confirm('Withdraw this application?')) return;
    this.jobAppService.delete(app.id).subscribe({
      next: () => {
        this.appliedJobs = this.appliedJobs.filter(a => a.id !== app.id);
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'pending': 'bg-warning text-dark',
      'reviewed': 'bg-info text-dark',
      'shortlisted': 'bg-primary',
      'hired': 'bg-success',
      'rejected': 'bg-danger',
      'open': 'bg-success',
      'closed': 'bg-secondary',
      'paused': 'bg-warning text-dark',
      'scheduled': 'bg-primary',
      'completed': 'bg-success',
      'cancelled': 'bg-danger',
    };
    return map[status] || 'bg-secondary';
  }

  getInterviewTypeIcon(type: string): string {
    const map: Record<string, string> = {
      'phone': 'bi-telephone', 'video': 'bi-camera-video',
      'onsite': 'bi-building', 'technical': 'bi-code-slash'
    };
    return map[type] || 'bi-calendar';
  }

  getStageBadgeColor(stage: string): string {
    const map: Record<string, string> = {
      'applied': 'bg-secondary', 'screening': 'bg-info text-dark',
      'interview': 'bg-primary', 'offer': 'bg-warning text-dark',
      'hired': 'bg-success', 'rejected': 'bg-danger'
    };
    return map[stage] || 'bg-secondary';
  }
}