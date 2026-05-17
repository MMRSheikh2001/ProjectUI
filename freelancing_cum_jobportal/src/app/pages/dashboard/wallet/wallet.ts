import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { AuthService } from '../../../services/auth';
import { WalletService } from '../../../services/wallet';
import { TransactionService } from '../../../services/transaction';
import { WithdrawalService } from '../../../services/withdrawal';
import { PaymentMethodService } from '../../../services/payment-method';
import { Wallet } from '../../../models/wallet';
import { Transaction } from '../../../models/transaction';
import { Withdrawal } from '../../../models/withdrawal';
import { PaymentMethod } from '../../../models/payment-method';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './wallet.html',
  styleUrl: './wallet.css'
})
export class WalletComponent implements OnInit {

  loading = true;
  wallet: Wallet | null = null;
  transactions: Transaction[] = [];
  withdrawals: Withdrawal[] = [];
  paymentMethods: PaymentMethod[] = [];

  // Withdrawal modal
  showWithdrawModal = false;
  withdrawAmount = 0;
  withdrawMethod = 'bank';
  withdrawing = false;
  withdrawSuccess = false;

  activeTab = 'transactions';
  userId: string | number = '';

  constructor(
    private auth: AuthService,
    private walletService: WalletService,
    private transactionService: TransactionService,
    private withdrawalService: WithdrawalService,
    private paymentMethodService: PaymentMethodService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const userId = this.auth.getCurrentUserId();
    if (!userId) {
      this.loading = false;
      return;
    }
    this.userId = userId;

    const t = setTimeout(() => { this.loading = false; }, 5000);

    this.walletService.findByUserId(userId).subscribe({
      next: (wallets) => {
        clearTimeout(t);
        this.wallet = wallets[0] || null;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { clearTimeout(t); this.loading = false; }
    });

    this.loadTransactions(userId);
    this.loadWithdrawals(userId);
    this.loadPaymentMethods(userId);
  }

  loadWallet(userId: string | number) {
    this.walletService.findByUserId(userId).subscribe({
      next: (wallets) => {
        this.wallet = wallets[0] || null;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadTransactions(userId: string | number) {
    this.transactionService.findByUserId(userId).subscribe({
      next: (t) => this.transactions = t
    });
  }

  loadWithdrawals(userId: string | number) {
    this.withdrawalService.findByUserId(userId).subscribe({
      next: (w) => this.withdrawals = w
    });
  }

  loadPaymentMethods(userId: string | number) {
    this.paymentMethodService.findByUserId(userId).subscribe({
      next: (m) => this.paymentMethods = m
    });
  }

  submitWithdrawal() {
    if (!this.withdrawAmount || this.withdrawAmount <= 0) return;
    if (this.withdrawAmount > (this.wallet?.balance || 0)) {
      alert('Insufficient balance');
      return;
    }

    this.withdrawing = true;

    const withdrawal: Withdrawal = {
      userId: this.userId,
      amount: this.withdrawAmount,
      method: this.withdrawMethod as 'bank' | 'mobile',
      status: 'pending'
    };

    this.withdrawalService.save(withdrawal).subscribe({
      next: (saved) => {
        this.withdrawals.unshift(saved);
        // Update wallet balance
        if (this.wallet) {
          this.wallet.balance -= this.withdrawAmount;
          this.walletService.update(this.wallet.id!, this.wallet).subscribe();
        }
        this.withdrawing = false;
        this.withdrawSuccess = true;
        setTimeout(() => {
          this.showWithdrawModal = false;
          this.withdrawSuccess = false;
          this.withdrawAmount = 0;
        }, 2000);
      },
      error: () => {
        this.withdrawing = false;
      }
    });
  }

  getTotalEarned(): number {
    return this.transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalWithdrawn(): number {
    return this.withdrawals
      .filter(w => w.status === 'approved')
      .reduce((sum, w) => sum + w.amount, 0);
  }

  getWithdrawalStatusClass(status: string): string {
    const map: any = {
      'approved': 'bg-success',
      'pending': 'bg-warning text-dark',
      'rejected': 'bg-danger'
    };
    return map[status] || 'bg-secondary';
  }
}