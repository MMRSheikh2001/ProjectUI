import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { AuthService } from '../../../services/auth';
import { OrderService } from '../../../services/order';
import { GigService } from '../../../services/gig';
import { OrderDeliveryService } from '../../../services/order-delivery';
import { OrderRevisionService } from '../../../services/order-revision';
import { DisputeService } from '../../../services/dispute';
import { Order } from '../../../models/order';
import { OrderDelivery } from '../../../models/order-delivery';
import { OrderRevision } from '../../../models/order-revision';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {

  loading = true;
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  deliveries: OrderDelivery[] = [];
  revisions: OrderRevision[] = [];
  filterStatus = '';
  activeTab = 'list';
  userId: string | number = '';

  statusOptions = ['', 'pending', 'active', 'delivered', 'revision', 'completed', 'cancelled', 'disputed'];

  constructor(
    private auth: AuthService,
    private orderService: OrderService,
    private deliveryService: OrderDeliveryService,
    private revisionService: OrderRevisionService,
    private disputeService: DisputeService,
    private cdr:ChangeDetectorRef
  ) { }

  ngOnInit() {
    const userId = this.auth.getCurrentUserId();
    if (!userId) {
      this.loading = false;
      return;
    }
    this.userId = userId;

    // Safety timeout — always stop spinner after 3s
    const loadingTimeout = setTimeout(() => { this.loading = false; }, 3000);

    const obs = this.auth.isUser() 
      ? this.orderService.findByFreelancerId(userId) 
      : this.orderService.findByClientId(userId);

    obs.subscribe({
      next: (orders) => {
        clearTimeout(loadingTimeout);
        this.orders = orders;
        this.filteredOrders = orders;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        clearTimeout(loadingTimeout);
        this.loading = false;
      }
    });
     this.cdr.markForCheck();
  }

  applyFilter() {
    this.filteredOrders = this.filterStatus
      ? this.orders.filter(o => o.status === this.filterStatus)
      : [...this.orders];
  }

  viewDetails(order: Order) {
    this.selectedOrder = order;
    this.activeTab = 'detail';
    this.loadOrderDetails(order.id!);
     this.cdr.markForCheck();
  }

  loadOrderDetails(orderId: string | number) {
    this.deliveryService.findByOrderId(orderId).subscribe({
      next: (d) => this.deliveries = d
    });
    this.revisionService.findByOrderId(orderId).subscribe({
      next: (r) => this.revisions = r
    });
  }

  approveDelivery() {
    if (!this.selectedOrder?.id) return;
    this.orderService.update(this.selectedOrder.id, {
      ...this.selectedOrder, status: 'completed'
    }).subscribe({
      next: () => {
        this.selectedOrder!.status = 'completed';
        const o = this.orders.find(o => o.id == this.selectedOrder!.id);
        if (o) o.status = 'completed';
      }
    });
  }

  raiseDispute() {
    if (!this.selectedOrder?.id) return;
    const dispute = {
      orderId: this.selectedOrder.id,
      raisedBy: this.userId,
      reason: 'Work not delivered as described.',
      status: 'open' as const,
      adminAction: ''
    };
    this.disputeService.save(dispute).subscribe({
      next: () => {
        this.selectedOrder!.status = 'disputed';
        alert('Dispute raised. Admin will review shortly.');
      }
    });
  }

  getStatusClass(status: string): string {
    const map: any = {
      'pending': 'bg-warning text-dark', 'active': 'bg-primary',
      'delivered': 'bg-info text-dark', 'completed': 'bg-success',
      'revision': 'bg-warning text-dark', 'cancelled': 'bg-secondary',
      'disputed': 'bg-danger'
    };
    return map[status] || 'bg-secondary';
  }

  getTimelineStep(status: string): number {
    const steps = ['pending', 'active', 'delivered', 'completed'];
    return steps.indexOf(status);
  }
}