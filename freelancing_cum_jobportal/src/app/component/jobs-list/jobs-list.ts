import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { JobService } from '../../services/job';
import { Job } from '../../models/job';

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Navbar, Footer],
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.css'
})
export class JobsList implements OnInit {

  allJobs: Job[] = [];
  filteredJobs: Job[] = [];
  loading = true;
  error = '';
  viewMode: 'list' | 'grid' = 'list';

  // ── Basic Filters ──
  searchKeyword = '';
  selectedCity = '';
  selectedType = '';
  salaryMin = 0;
  salaryMax = 0;
  sortBy = 'latest';

  // ── Extended Filters ──
  selectedIndustry = '';
  selectedWorkplace = '';
  showUrgent = false;
  showFeatured = false;
  showVerified = false;

  // ── Dropdown Options ──
  cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'];
  jobTypes = ['full-time', 'part-time', 'remote', 'contract'];
  industries = [
    'Software & Technology', 'Banking & Finance', 'Healthcare',
    'Education', 'E-commerce', 'Telecom', 'Manufacturing', 'NGO'
  ];
  workplaceTypes = ['onsite', 'remote', 'hybrid'];

  // ── Pagination ──
  currentPage = 1;
  itemsPerPage = 8;

  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) this.searchKeyword = params['q'];
    });
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.findOpenJobs().subscribe({
      next: (jobs) => {
        this.allJobs = jobs;
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load jobs. Make sure JSON Server is running on port 3000.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.allJobs];

    // Keyword search
    if (this.searchKeyword) {
      const kw = this.searchKeyword.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(kw) ||
        j.companyName.toLowerCase().includes(kw) ||
        j.description.toLowerCase().includes(kw) ||
        (j.requiredSkills || []).some(s => s.toLowerCase().includes(kw))
      );
    }

    // City
    if (this.selectedCity) {
      result = result.filter(j => j.city === this.selectedCity);
    }

    // Job Type
    if (this.selectedType) {
      result = result.filter(j => j.jobType === this.selectedType);
    }

    // Salary
    if (this.salaryMin > 0) {
      result = result.filter(j => j.salaryMin >= this.salaryMin);
    }
    if (this.salaryMax > 0) {
      result = result.filter(j => j.salaryMax <= this.salaryMax);
    }

    // Industry
    if (this.selectedIndustry) {
      result = result.filter(j => j.industry === this.selectedIndustry);
    }

    // Workplace
    if (this.selectedWorkplace) {
      result = result.filter(j => j.workplaceType === this.selectedWorkplace);
    }

    // Quick filters
    if (this.showUrgent) result = result.filter(j => j.isUrgent);
    if (this.showFeatured) result = result.filter(j => j.isFeatured);
    if (this.showVerified) result = result.filter(j => j.companyInfo?.isVerified);

    // Sort
    if (this.sortBy === 'latest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (this.sortBy === 'salary-high') {
      result.sort((a, b) => b.salaryMax - a.salaryMax);
    } else if (this.sortBy === 'salary-low') {
      result.sort((a, b) => a.salaryMin - b.salaryMin);
    } else if (this.sortBy === 'deadline') {
      result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    }

    this.filteredJobs = result;
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchKeyword = '';
    this.selectedCity = '';
    this.selectedType = '';
    this.salaryMin = 0;
    this.salaryMax = 0;
    this.selectedIndustry = '';
    this.selectedWorkplace = '';
    this.showUrgent = false;
    this.showFeatured = false;
    this.showVerified = false;
    this.sortBy = 'latest';
    this.applyFilters();
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.searchKeyword) count++;
    if (this.selectedCity) count++;
    if (this.selectedType) count++;
    if (this.salaryMin > 0) count++;
    if (this.salaryMax > 0) count++;
    if (this.selectedIndustry) count++;
    if (this.selectedWorkplace) count++;
    if (this.showUrgent) count++;
    if (this.showFeatured) count++;
    if (this.showVerified) count++;
    return count;
  }

  get pagedJobs(): Job[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredJobs.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredJobs.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getDaysLeft(deadline: string): number {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  getDeadlineClass(deadline: string): string {
    const days = this.getDaysLeft(deadline);
    if (days <= 3) return 'text-danger';
    if (days <= 7) return 'text-warning';
    return 'text-muted';
  }

  getWorkplaceBadge(type: string): string {
    const map: Record<string, string> = {
      'remote': 'bg-success',
      'hybrid': 'bg-info text-dark',
      'onsite': 'bg-secondary'
    };
    return map[type] || 'bg-secondary';
  }

  getJobTypeBadge(type: string): string {
    const map: Record<string, string> = {
      'full-time': 'bg-primary',
      'part-time': 'bg-purple',
      'remote': 'bg-success',
      'contract': 'bg-warning text-dark'
    };
    return map[type] || 'bg-secondary';
  }
}