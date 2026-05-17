import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { AuthService } from '../../../services/auth';
import { GigService } from '../../../services/gig';
import { GigPackageService } from '../../../services/gig-package';
import { CategoryService } from '../../../services/category';
import { OrderService } from '../../../services/order';
import { Gig } from '../../../models/gig';
import { GigPackage } from '../../../models/gig-package';
import { Category } from '../../../models/category';
import { Order } from '../../../models/order';

@Component({
  selector: 'app-gigs-management',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, Sidebar],
  templateUrl: './gigs-management.html',
  styleUrl: './gigs-management.css'
})
export class GigsManagement implements OnInit {

  activeTab = 'my-gigs';
  loading = true;
  saving = false;
  saveSuccess = false;

  myGigs: Gig[] = [];
  categories: Category[] = [];
  myOrders: Order[] = [];

  gigForm: FormGroup;
  userId: string | number = '';

  constructor(
    private auth: AuthService,
    private gigService: GigService,
    private gigPackageService: GigPackageService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.gigForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50)]],
      coverImage: [''],
      tags: [''],
      // Basic package
      basicPrice: [50, Validators.min(5)],
      basicDeliveryDays: [3, Validators.min(1)],
      basicRevisions: [2],
      basicFeatures: ['1 page, responsive design'],
      // Standard package
      standardPrice: [100, Validators.min(5)],
      standardDeliveryDays: [7, Validators.min(1)],
      standardRevisions: [5],
      standardFeatures: ['Up to 5 pages, API integration'],
      // Premium package
      premiumPrice: [250, Validators.min(5)],
      premiumDeliveryDays: [14, Validators.min(1)],
      premiumRevisions: [999],
      premiumFeatures: ['Unlimited pages, deployment, 30-day support'],
    });
  }

  ngOnInit(): void {
    const userId = this.auth.getCurrentUserId();
    if (!userId) {
      this.loading = false;
      return;
    }
    this.userId = userId;
    this.loadData();
  }

  loadData(): void {
    const t = setTimeout(() => { this.loading = false; }, 5000);
    this.gigService.findByFreelancerId(this.userId).subscribe({
      next: (gigs) => { clearTimeout(t); this.myGigs = gigs; this.loading = false; 
        this.cdr.markForCheck();
      },
      error: () => { clearTimeout(t); this.loading = false; }
    });
    this.categoryService.findAll().subscribe({
      next: (cats) => this.categories = cats,
      error: () => { }
    });
    this.orderService.findByFreelancerId(this.userId).subscribe({
      next: (orders) => this.myOrders = orders,
      error: () => { }
    });
  }

  getCategoryName(id?: string | number): string {
    if (!id) return 'General';
    return this.categories.find(c => c.id == id)?.name || 'General';
  }

  toggleGigStatus(gig: Gig): void {
    if (!gig.id) return;
    const newStatus = gig.status === 'active' ? 'paused' : 'active';
    this.gigService.update(gig.id, { ...gig, status: newStatus }).subscribe({
      next: () => gig.status = newStatus
    });
  }

  submitGig(): void {
    if (this.gigForm.invalid) return;
    this.saving = true;
    const v = this.gigForm.value;

    const newGig: Gig = {
      freelancerId: this.userId,
      categoryId: v.categoryId,
      title: v.title,
      description: v.description,
      startingPrice: v.basicPrice,
      status: 'active',
      isDeleted: false,
      coverImage: v.coverImage || 'https://picsum.photos/seed/gig/600/400',
      rating: 0,
      totalOrders: 0,
      images: [],
      videoUrl: '',
      tags: v.tags ? v.tags.split(',').map((t: string) => t.trim()) : [],
      technologies: [],
      whatYouGet: [],
      faqs: [],
      reviews: [],
      queueCount: 0,
      responseTime: 'Under 1 hour',
      languages: ['Bangla', 'English'],
      isFeatured: false,
      totalRevenue: 0,
      repeatClientPercent: 0,
      communicationRating: 0,
      deliveryRating: 0,
      valueRating: 0,
      viewCount: 0,
      savedCount: 0,
      publishedDate: new Date().toISOString(),
    };

    this.gigService.save(newGig).subscribe({
      next: (saved) => {
        // Save 3 packages
        const packages: GigPackage[] = [
          {
            gigId: saved.id!, name: 'basic',
            price: v.basicPrice, deliveryDays: v.basicDeliveryDays,
            revisions: v.basicRevisions, features: v.basicFeatures,
            description: v.basicFeatures, popular: false,
            includesSourceCode: false, includesCommercialUse: false,
            featureList: []
          },
          {
            gigId: saved.id!, name: 'standard',
            price: v.standardPrice, deliveryDays: v.standardDeliveryDays,
            revisions: v.standardRevisions, features: v.standardFeatures,
            description: v.standardFeatures, popular: true,
            includesSourceCode: true, includesCommercialUse: true,
            featureList: []
          },
          {
            gigId: saved.id!, name: 'premium',
            price: v.premiumPrice, deliveryDays: v.premiumDeliveryDays,
            revisions: v.premiumRevisions, features: v.premiumFeatures,
            description: v.premiumFeatures, popular: false,
            includesSourceCode: true, includesCommercialUse: true,
            featureList: []
          },
        ];

        // Sequential save for simplicity and reliability in demo
        this.savePackagesSequentially(packages, 0, saved);
      },
      error: () => { this.saving = false; }
    });
  }

  private savePackagesSequentially(pkgs: GigPackage[], index: number, savedGig: Gig): void {
    if (index >= pkgs.length) {
      this.myGigs.unshift(savedGig);
      this.saving = false;
      this.saveSuccess = true;
      this.activeTab = 'my-gigs';
      this.gigForm.reset({
        basicPrice: 50, basicDeliveryDays: 3, basicRevisions: 2,
        standardPrice: 100, standardDeliveryDays: 7, standardRevisions: 5,
        premiumPrice: 250, premiumDeliveryDays: 14, premiumRevisions: 999,
      });
      setTimeout(() => this.saveSuccess = false, 3000);
      return;
    }

    this.gigPackageService.save(pkgs[index]).subscribe({
      next: () => this.savePackagesSequentially(pkgs, index + 1, savedGig),
      error: () => this.savePackagesSequentially(pkgs, index + 1, savedGig) // Continue even if one fails
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'active': 'bg-success', 'paused': 'bg-warning text-dark',
      'deleted': 'bg-danger', 'pending': 'bg-warning text-dark',
      'completed': 'bg-success', 'revision': 'bg-info text-dark',
      'delivered': 'bg-info text-dark', 'disputed': 'bg-danger',
      'cancelled': 'bg-secondary'
    };
    return map[status] || 'bg-secondary';
  }

  getTotalEarnings(): number {
    return this.myOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.totalAmount - o.commissionAmount), 0);
  }
  get activeGigsCount(): number {
    return this.myGigs.filter(g => g.status === 'active').length;
  }
}