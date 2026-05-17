import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { JobService } from '../../services/job';
import { GigService } from '../../services/gig';
import { CategoryService } from '../../services/category';
import { Job } from '../../models/job';
import { Gig } from '../../models/gig';
import { Category } from '../../models/category';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  jobs: Job[] = [];
  gigs: Gig[] = [];
  categories: Category[] = [];
  loading = true;
  searchTerm = '';
  searchType = 'jobs';

  stats = {
    jobs: 0,
    gigs: 0,
    users: 200
  };

  howItWorksJobSeeker = [
    { icon: 'bi-search', title: 'Search Jobs', desc: 'Browse hundreds of job listings filtered by location, salary and skills.' },
    { icon: 'bi-file-earmark-text', title: 'Apply Easily', desc: 'Submit your application with a cover letter in just one click.' },
    { icon: 'bi-trophy', title: 'Get Hired', desc: 'Track your application status and get hired by top companies.' }
  ];

  howItWorksFreelancer = [
    { icon: 'bi-grid-3x3-gap', title: 'Create a Gig', desc: 'Showcase your skills with Basic, Standard and Premium packages.' },
    { icon: 'bi-bag-check', title: 'Receive Orders', desc: 'Clients find you and place orders directly on your gig.' },
    { icon: 'bi-wallet2', title: 'Earn Money', desc: 'Deliver great work, get 5-star reviews and grow your income.' }
  ];

  categoryIcons: { [key: string]: string } = {
    'Web Development': 'bi-code-slash',
    'Graphic Design': 'bi-palette',
    'Digital Marketing': 'bi-megaphone',
    'Writing & Translation': 'bi-pen',
    'Video & Animation': 'bi-camera-video',
    'Mobile Development': 'bi-phone'
  };

  constructor(
    private jobService: JobService,
    private gigService: GigService,
    private categoryService: CategoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadJobs();
    this.loadGigs();
    this.loadCategories();
  }

  loadJobs() {
    this.jobService.findOpenJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs.slice(0, 6);
        this.stats.jobs = jobs.length;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; }
    });
  }

  loadGigs() {
    this.gigService.findActiveGigs().subscribe({
      next: (gigs) => {
        this.gigs = gigs.slice(0, 6);
        this.stats.gigs = gigs.length;
        this.cdr.markForCheck();
      }
    });
  }

  loadCategories() {
    this.categoryService.findAll().subscribe({
      next: (cats) => this.categories = cats
    });
  }

  onSearch() {
    if (!this.searchTerm.trim()) return;
    if (this.searchType === 'jobs') {
      this.router.navigate(['/jobs'], { queryParams: { q: this.searchTerm } });
    } else {
      this.router.navigate(['/gigs'], { queryParams: { q: this.searchTerm } });
    }
  }

  getCategoryIcon(name: string): string {
    return this.categoryIcons[name] || 'bi-grid';
  }

  getStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => {
      if (i < Math.floor(rating)) return 'bi-star-fill';
      if (i < rating) return 'bi-star-half';
      return 'bi-star';
    });
  }
}