import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="badgeClass">{{ status }}</span>
  `
})
export class StatusBadge {
  @Input() status: string = '';

  get badgeClass(): string {
    const map: any = {
      'active': 'bg-success',
      'open': 'bg-success',
      'completed': 'bg-success',
      'hired': 'bg-success',
      'approved': 'bg-success',
      'pending': 'bg-warning text-dark',
      'shortlisted': 'bg-warning text-dark',
      'under-review': 'bg-warning text-dark',
      'scheduled': 'bg-warning text-dark',
      'delivered': 'bg-info text-dark',
      'revision': 'bg-info text-dark',
      'rejected': 'bg-danger',
      'banned': 'bg-danger',
      'disputed': 'bg-danger',
      'closed': 'bg-secondary',
      'paused': 'bg-secondary',
      'cancelled': 'bg-secondary',
    };
    return map[this.status?.toLowerCase()] || 'bg-secondary';
  }
}