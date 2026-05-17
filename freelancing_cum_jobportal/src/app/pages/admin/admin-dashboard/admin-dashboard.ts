import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { UserService } from '../../../services/user';
import { JobService } from '../../../services/job';
import { GigService } from '../../../services/gig';
import { OrderService } from '../../../services/order';
import { ReportService } from '../../../services/report';
import { DisputeService } from '../../../services/dispute';
import { AnalyticsDailyService } from '../../../services/analytics-daily';
import { User } from '../../../models/user';
import { Report } from '../../../models/report';
import { Dispute } from '../../../models/dispute';
import { AnalyticsDaily } from '../../../models/analytics-daily';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  currentAdmin: any;
  loading = true;


  totalUsers = 0;
  totalJobs = 0;
  totalGigs = 0;
  totalOrders = 0;
  totalRevenue = 0;
  totalCommission = 0;

  recentReports: Report[] = [];
  recentDisputes: Dispute[] = [];
  recentUsers: User[] = [];
  analytics: AnalyticsDaily[] = [];

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private jobService: JobService,
    private gigService: GigService,
    private orderService: OrderService,
    private reportService: ReportService,
    private disputeService: DisputeService,
    private analyticsService: AnalyticsDailyService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentAdmin = this.auth.getCurrentUser();
    this.loadStats();
  }

  loadStats(): void {
    this.userService.findAll().subscribe({
      next: (u) => {
        this.totalUsers = u.length;
        this.recentUsers = u.slice(-5).reverse();
        this.checkDone();
        this.cdr.markForCheck();
      },
      error: () => this.checkDone()
    });

    this.jobService.findAll().subscribe({
      next: (j) => {
        this.totalJobs = j.length; this.checkDone();
        this.cdr.markForCheck();
      },
      error: () => this.checkDone()
    });

    this.gigService.findAll().subscribe({
      next: (g) => {
        this.totalGigs = g.length; this.checkDone();
        this.cdr.markForCheck();
      },
      error: () => this.checkDone()
    });

    this.orderService.findAll().subscribe({
      next: (o) => {
        this.totalOrders = o.length;
        this.totalRevenue = o.reduce((s, x) => s + (x.totalAmount || 0), 0);
        this.totalCommission = o.reduce((s, x) => s + (x.commissionAmount || 0), 0);
        this.checkDone();
        this.cdr.markForCheck();
      },
      error: () => this.checkDone()
    });

    this.reportService.findAll().subscribe({
      next: (r) => {
        this.recentReports = r.slice(0, 5); this.checkDone();
        this.cdr.markForCheck();
      },
      error: () => this.checkDone()
    });

    this.disputeService.findAll().subscribe({
      next: (d) => {
        this.recentDisputes = d.slice(0, 5); this.checkDone();
        this.cdr.markForCheck();
      },
      error: () => this.checkDone()
    });

    this.analyticsService.findAll().subscribe({
      next: (a) => {
        this.analytics = a.slice(-7); this.checkDone();
        this.cdr.markForCheck();
      },
      error: () => this.checkDone()
    });
  }

  private doneCount = 0;
  checkDone(): void {
    this.doneCount++;
    if (this.doneCount >= 7) this.loading = false;
  }

  getReportStatusClass(status: string): string {
    const map: Record<string, string> = {
      'pending': 'bg-warning text-dark',
      'reviewed': 'bg-info text-dark',
      'actioned': 'bg-success',
      'dismissed': 'bg-secondary'
    };
    return map[status] || 'bg-secondary';
  }

  getDisputeStatusClass(status: string): string {
    const map: Record<string, string> = {
      'open': 'bg-danger',
      'under-review': 'bg-warning text-dark',
      'resolved': 'bg-success',
      'closed': 'bg-secondary'
    };
    return map[status] || 'bg-secondary';
  }

  getBarWidth(value: number): string {
    const max = Math.max(...this.analytics.map(a => a.revenue), 1);
    return Math.round((value / max) * 100) + '%';
  }
}