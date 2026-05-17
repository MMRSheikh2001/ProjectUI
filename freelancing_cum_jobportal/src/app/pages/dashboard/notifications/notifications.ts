import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { AuthService } from '../../../services/auth';
import { NotificationService } from '../../../services/notification';
import { AppNotification } from '../../../models/notification';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {

  loading = true;
  allNotifications: AppNotification[] = [];
  filtered: AppNotification[] = [];
  activeTab = 'all';

  tabs = [
    { key: 'all', label: 'All' },
    { key: 'job_alert', label: 'Job Alerts' },
    { key: 'order_update', label: 'Orders' },
    { key: 'message', label: 'Messages' },
    { key: 'payment', label: 'Payments' },
    { key: 'system', label: 'System' },
  ];

  constructor(
    private auth: AuthService,
    private notifService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const userId = this.auth.getCurrentUserId();
    if (!userId) {
      this.loading = false;
      return;
    }
    const loadingTimeout = setTimeout(() => { this.loading = false; }, 3000);
    this.notifService.findByUserId(userId).subscribe({
      next: (notifs) => {
        clearTimeout(loadingTimeout);
        this.allNotifications = notifs;
        this.filtered = notifs;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        clearTimeout(loadingTimeout);
        this.loading = false;
      }
    });
  }

  filterByTab(tab: string) {
    this.activeTab = tab;
    this.filtered = tab === 'all'
      ? [...this.allNotifications]
      : this.allNotifications.filter(n => n.type === tab);
  }

  markAsRead(notif: AppNotification) {
    if (notif.isRead || !notif.id) return;
    this.notifService.update(notif.id, { ...notif, isRead: true }).subscribe({
      next: () => { notif.isRead = true; }
    });
  }

  markAllRead() {
    this.allNotifications
      .filter(n => !n.isRead)
      .forEach(n => this.markAsRead(n));
  }

  get unreadCount(): number {
    return this.allNotifications.filter(n => !n.isRead).length;
  }

  getIcon(type: string): string {
    const map: any = {
      'job_alert': 'bi-briefcase-fill text-primary',
      'order_update': 'bi-box-fill text-success',
      'message': 'bi-chat-fill text-info',
      'payment': 'bi-wallet-fill text-warning',
      'system': 'bi-bell-fill text-secondary',
      'dispute': 'bi-shield-fill text-danger'
    };
    return map[type] || 'bi-bell-fill text-secondary';
  }

  getBgColor(type: string): string {
    const map: any = {
      'job_alert': '#e7f1ff',
      'order_update': '#d1f0e0',
      'message': '#d0f4fc',
      'payment': '#fff8e1',
      'system': '#f0f0f0',
      'dispute': '#fce4e4'
    };
    return map[type] || '#f0f0f0';
  }
}