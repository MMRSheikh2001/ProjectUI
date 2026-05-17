import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { AuthService } from '../../../services/auth';
import { JobApplicationService } from '../../../services/job-application';
import { OrderService } from '../../../services/order';
import { WalletService } from '../../../services/wallet';
import { NotificationService } from '../../../services/notification';
import { JobApplication } from '../../../models/job-application';
import { Order } from '../../../models/order';
import { JobseekerDashboardStats, EmployerDashboardStats } from '../../../models/dashboard-stats';
import { FreelancerStats } from '../../../models/freelancer-stats';
import { DashboardStatsService } from '../../../services/dashboard-stats.services';
import { FreelancerStatsService } from '../../../services/freelancer-stats.services';
import { AppNotification } from '../../../models/notification';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink, Sidebar],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css'
})
export class DashboardHome implements OnInit {

  loading = true;
  jsStats: JobseekerDashboardStats | null = null;
  empStats: EmployerDashboardStats | null = null;
  freelancerStats: FreelancerStats | null = null;
  weeklyBarMax = 0;
  isCompany = false;
  isUser = false;

  currentUser: any;
  userId: string | number = '';

  applications: JobApplication[] = [];
  orders: Order[] = [];
  walletBalance = 0;
  notifications: AppNotification[] = [];

  stats = { applied: 0, activeOrders: 0, balance: 0, unread: 0 };

  // Counter: ALL 4 core loaders must complete before loading = false
  private loadCount = 0;
  private totalLoaders = 4; // Default to 4 for User/Company

  quickActions = [
    { label: 'Post a Job', icon: 'bi-plus-circle', route: '/dashboard/jobs', color: 'btn-primary' },
    { label: 'Create a Gig', icon: 'bi-grid-plus', route: '/dashboard/gigs', color: 'btn-success' },
    { label: 'Browse Jobs', icon: 'bi-search', route: '/jobs', color: 'btn-outline-primary' },
    { label: 'Browse Gigs', icon: 'bi-shop', route: '/gigs', color: 'btn-outline-success' },
    { label: 'Admin Panel', icon: 'bi-shield-lock', route: '/admin', color: 'btn-danger' },
  ];

  constructor(
    public auth: AuthService,
    private jobAppService: JobApplicationService,
    private orderService: OrderService,
    private walletService: WalletService,
    private notificationService: NotificationService,
    private dashboardStatsService: DashboardStatsService,
    private freelancerStatsService: FreelancerStatsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    if (!this.currentUser) {
      this.loading = false;
      return;
    }
    this.userId = this.currentUser.id;
    this.isCompany = this.auth.isCompany();
    this.isUser = this.auth.isUser();

    // Absolute safety net — always stop spinner within 5s
    setTimeout(() => { this.loading = false; }, 5000);

    if (this.isUser) {
      this.loadApplications(this.userId);
      this.loadFreelancerStats(this.userId);
      this.loadDashboardStats(this.userId);
    } else if (this.isCompany) {
      this.loadPostedJobs(this.userId);
      this.loadEmployerStats(this.userId);
    } else if (this.auth.isAdmin()) {
      this.totalLoaders = 3; // Orders, Wallet, Notifications
    }

    this.loadOrders(this.userId);
    this.loadWallet(this.userId);
    this.loadNotifications(this.userId);
    this.cdr.markForCheck();
  }

  get filteredQuickActions() {
    return this.quickActions.filter(action => {
      if (this.isUser) {
        return action.label !== 'Post a Job';
      }
      if (this.isCompany) {
        return action.label !== 'Create a Gig' && action.label !== 'Browse Jobs' && action.label !== 'Admin Panel';
      }
      if (this.auth.isAdmin()) {
        return action.label === 'Admin Panel' || action.label === 'Browse Jobs' || action.label === 'Browse Gigs';
      }
      return true;
    });
  }

  private checkLoading() {
    this.loadCount++;
    if (this.loadCount >= this.totalLoaders) {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  loadApplications(userId: string | number) {
    this.jobAppService.findByApplicantId(userId).subscribe({
      next: (apps) => {
        this.applications = apps.slice(0, 5);
        this.stats.applied = apps.length;
        this.checkLoading();
        this.cdr.markForCheck();
      },
      error: () => this.checkLoading()
    });
  }

  loadOrders(userId: string | number) {
    const obs = this.isUser ? this.orderService.findByFreelancerId(userId) : this.orderService.findByClientId(userId);
    obs.subscribe({
      next: (orders) => {
        this.orders = orders.slice(0, 5);
        this.stats.activeOrders = orders.filter(o => o.status === 'active').length;
        this.checkLoading();
        this.cdr.markForCheck();
      },
      error: () => this.checkLoading()
    });
  }

  private loadPostedJobs(userId: string | number) {
    this.jobAppService.findAll().subscribe({ // This is just for stats in mock, ideally findByEmployerId
      next: (apps) => {
        // Mocking stats for company
        this.checkLoading();
      },
      error: () => this.checkLoading()
    });
  }

  private loadEmployerStats(userId: string | number) {
    this.dashboardStatsService.getEmployerStats(userId).subscribe({
      next: (stats) => { if (stats.length > 0) this.empStats = stats[0]; this.cdr.markForCheck(); },
      error: () => { }
    });
  }

  loadWallet(userId: string | number) {
    this.walletService.findByUserId(userId).subscribe({
      next: (wallets) => {
        this.walletBalance = wallets[0]?.balance || 0;
        this.stats.balance = this.walletBalance;
        this.checkLoading();
        this.cdr.markForCheck();
      },
      error: () => this.checkLoading()
    });
  }

  loadNotifications(userId: string | number) {
    this.notificationService.findByUserId(userId).subscribe({
      next: (notifs) => {
        this.notifications = notifs.slice(0, 5);
        this.stats.unread = notifs.filter(n => !n.isRead).length;
        this.checkLoading();
      },
      error: () => this.checkLoading()
    });
  }

  loadDashboardStats(userId: string | number) {
    this.dashboardStatsService.getJobseekerStats(userId).subscribe({
      next: (stats) => { if (stats.length > 0) this.jsStats = stats[0]; this.cdr.markForCheck(); },
      error: () => { }
    });
  }

  loadFreelancerStats(userId: string | number) {
    this.freelancerStatsService.findByUserId(userId).subscribe({
      next: (stats) => {
        if (stats.length > 0) {
          this.freelancerStats = stats[0];
          this.cdr.markForCheck();
          this.weeklyBarMax = Math.max(...(stats[0].weeklyEarnings || [1]));
        }
      },
      error: () => { }
    });
  }

  getStatusClass(status: string): string {
    const map: any = {
      'pending': 'bg-warning text-dark', 'shortlisted': 'bg-info text-dark',
      'hired': 'bg-success', 'rejected': 'bg-danger', 'active': 'bg-primary',
      'completed': 'bg-success', 'delivered': 'bg-info text-dark',
      'revision': 'bg-warning text-dark', 'disputed': 'bg-danger'
    };
    return map[status] || 'bg-secondary';
  }

  getNotifIcon(type: string): string {
    const map: any = {
      'job_alert': 'bi-briefcase text-primary', 'order_update': 'bi-box text-success',
      'message': 'bi-chat text-info', 'payment': 'bi-wallet2 text-warning',
      'system': 'bi-bell text-secondary'
    };
    return map[type] || 'bi-bell text-secondary';
  }

  getBarHeight(value: number): string {
    const pct = this.weeklyBarMax ? (value / this.weeklyBarMax) * 100 : 0;
    return pct + '%';
  }
}