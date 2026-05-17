import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user';
import { ReportService } from '../../../services/report';
import { DisputeService } from '../../../services/dispute';
import { OrderService } from '../../../services/order';
import { AuthService } from '../../../services/auth';
import { User } from '../../../models/user';
import { Report } from '../../../models/report';
import { Dispute } from '../../../models/dispute';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-management.html',
  styleUrl: './admin-management.css'
})
export class AdminManagement implements OnInit {

  activeTab = 'users';
  loading = true;

  users: User[] = [];
  filteredUsers: User[] = [];
  searchUser = '';
  filterStatus = '';

  reports: Report[] = [];
  disputes: Dispute[] = [];

  confirmAction: { type: string; userId: string | number; userName: string } | null = null;

  constructor(
    private userService: UserService,
    private reportService: ReportService,
    private disputeService: DisputeService,
    private orderService: OrderService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.userService.findAll().subscribe({
      next: (u) => {
        this.users = u;
        this.filteredUsers = u;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; }
    });

    this.reportService.findAll().subscribe({
      next: (r) => this.reports = r
    });

    this.disputeService.findAll().subscribe({
      next: (d) => this.disputes = d
    });
  }

  filterUsers(): void {
    let result = [...this.users];
    if (this.searchUser) {
      const kw = this.searchUser.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(kw) ||
        u.email.toLowerCase().includes(kw)
      );
    }
    if (this.filterStatus) {
      result = result.filter(u => u.status === this.filterStatus);
    }
    this.filteredUsers = result;
  }

  confirmUserAction(type: string, user: User): void {
    this.confirmAction = { type, userId: user.id!, userName: user.name };
  }

  executeAction(): void {
    if (!this.confirmAction) return;
    const { type, userId } = this.confirmAction;
    const user = this.users.find(u => u.id == userId);
    if (!user) return;

    const newStatus = type === 'ban' ? 'banned' :
      type === 'suspend' ? 'suspended' : 'active';

    this.userService.update(userId, { ...user, status: newStatus }).subscribe({
      next: () => {
        user.status = newStatus;
        this.confirmAction = null;
        this.filterUsers();
      }
    });
  }

  updateReportStatus(report: Report, status: string): void {
    if (!report.id) return;
    this.reportService.update(report.id, { ...report, status: status as any }).subscribe({
      next: () => report.status = status as any
    });
  }

  resolveDispute(dispute: Dispute, action: string): void {
    if (!dispute.id) return;
    this.disputeService.update(dispute.id, {
      ...dispute,
      status: 'resolved',
      adminAction: action
    }).subscribe({
      next: () => {
        dispute.status = 'resolved';
        dispute.adminAction = action;
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'active': 'bg-success', 'suspended': 'bg-warning text-dark',
      'banned': 'bg-danger', 'pending': 'bg-warning text-dark',
      'reviewed': 'bg-info text-dark', 'actioned': 'bg-success',
      'dismissed': 'bg-secondary', 'open': 'bg-danger',
      'under-review': 'bg-warning text-dark', 'resolved': 'bg-success',
      'closed': 'bg-secondary'
    };
    return map[status] || 'bg-secondary';
  }

  isCurrentAdmin(user: User): boolean {
    return user.id == this.auth.getCurrentUserId();
  }
}