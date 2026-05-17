import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnalyticsDailyService } from '../../../services/analytics-daily';
import { UserService } from '../../../services/user';
import { OrderService } from '../../../services/order';
import { GigService } from '../../../services/gig';
import { AnalyticsDaily } from '../../../models/analytics-daily';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class Analytics implements OnInit {

  loading = true;
  allAnalytics: AnalyticsDaily[] = [];
  filteredAnalytics: AnalyticsDaily[] = [];
  dateRange = '7';

  totalRevenue = 0;
  totalCommission = 0;
  totalNewUsers = 0;
  totalOrders = 0;

  constructor(
    private analyticsService: AnalyticsDailyService,
    private userService: UserService,
    private orderService: OrderService,
    private gigService: GigService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.analyticsService.findAll().subscribe({
      next: (data) => {
        this.allAnalytics = data.sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        this.applyRange();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; }
    });
  }

  applyRange(): void {
    const days = parseInt(this.dateRange);
    this.filteredAnalytics = this.allAnalytics.slice(-days);
    this.totalRevenue = this.filteredAnalytics.reduce((s, a) => s + a.revenue, 0);
    this.totalCommission = this.filteredAnalytics.reduce((s, a) => s + a.commission, 0);
    this.totalNewUsers = this.filteredAnalytics.reduce((s, a) => s + a.totalUsers, 0);
    this.totalOrders = this.filteredAnalytics.reduce((s, a) => s + a.totalOrders, 0);
  }

  getBarHeight(value: number, field: 'revenue' | 'users' | 'orders'): string {
    const vals = this.filteredAnalytics.map(a =>
      field === 'revenue' ? a.revenue :
        field === 'users' ? a.totalUsers : a.totalOrders
    );
    const max = Math.max(...vals, 1);
    return Math.round((value / max) * 100) + '%';
  }

  getCommissionRate(): number {
    if (!this.totalRevenue) return 0;
    return Math.round((this.totalCommission / this.totalRevenue) * 100);
  }

  getGrowthRate(): number {
    if (this.filteredAnalytics.length < 2) return 0;
    const first = this.filteredAnalytics[0].revenue;
    const last = this.filteredAnalytics[this.filteredAnalytics.length - 1].revenue;
    if (!first) return 0;
    return Math.round(((last - first) / first) * 100);
  }
}