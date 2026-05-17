import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { GigService } from '../../services/gig';
import { CategoryService } from '../../services/category';
import { Gig } from '../../models/gig';
import { Category } from '../../models/category';

@Component({
  selector: 'app-gigs-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Navbar, Footer],
  templateUrl: './gigs-list.html',
  styleUrl: './gigs-list.css'
})
export class GigsList implements OnInit {

  allGigs: Gig[] = [];
  filteredGigs: Gig[] = [];
  categories: Category[] = [];
  loading = true;
  error = '';

  // Filters
  searchKeyword = '';
  selectedCategory = '';
  selectedRating = 0;
  selectedPrice = '';
  sortBy = 'popular';

  currentPage = 1;
  itemsPerPage = 6;

  priceRanges = [
    { label: 'Under $50', value: 'under50' },
    { label: '$50 - $100', value: '50to100' },
    { label: '$100 - $200', value: '100to200' },
    { label: '$200+', value: 'over200' }
  ];

  constructor(
    private gigService: GigService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) this.searchKeyword = params['q'];
    });
    this.loadData();
  }

  loadData() {
    this.categoryService.findAll().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.cdr.markForCheck();
      }
    });

    this.gigService.findActiveGigs().subscribe({
      next: (gigs) => {
        this.allGigs = gigs;
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load gigs. Make sure JSON Server is running.';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let result = [...this.allGigs];

    if (this.searchKeyword) {
      const kw = this.searchKeyword.toLowerCase();
      result = result.filter(g =>
        g.title.toLowerCase().includes(kw) ||
        g.description.toLowerCase().includes(kw)
      );
    }

    if (this.selectedCategory) {
      result = result.filter(g => g.categoryId == this.selectedCategory);
    }

    if (this.selectedRating > 0) {
      result = result.filter(g => (g.rating || 0) >= this.selectedRating);
    }
    if (this.selectedPrice) {
      result = result.filter(g => {
        // price here is the gig's starting price — use packages if available,
        // or fall back to a default. Adjust field name to match your data.
        const p = g.startingPrice ?? 0;
        if (this.selectedPrice === 'under50') return p < 50;
        if (this.selectedPrice === '50to100') return p >= 50 && p <= 100;
        if (this.selectedPrice === '100to200') return p >= 100 && p <= 200;
        if (this.selectedPrice === 'over200') return p > 200;
        return true;
      });
    }

    if (this.sortBy === 'popular') {
      result.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
    } else if (this.sortBy === 'top-rated') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    this.filteredGigs = result;
    this.currentPage = 1;
  }

  clearFilters() {
    this.searchKeyword = '';
    this.selectedCategory = '';
    this.selectedRating = 0;
    this.selectedPrice = '';

    this.sortBy = 'popular';
    this.applyFilters();
  }

  getCategoryName(id?: string | number): string {
    if (!id) return 'General';
    return this.categories.find(c => c.id == id)?.name || 'General';
  }

  get pagedGigs(): Gig[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredGigs.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredGigs.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => {
      if (i < Math.floor(rating)) return 'bi-star-fill';
      if (i < rating) return 'bi-star-half';
      return 'bi-star';
    });
  }
}