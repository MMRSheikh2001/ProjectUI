import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { UserVerificationService } from '../../../services/user-verification';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css'
})
export class VerifyEmail {

  otp: string[] = ['', '', '', '', '', ''];
  loading = false;
  verified = false;
  error = '';
  countdown = 0;
  countdownInterval: any;

  constructor(
    private auth: AuthService,
    private verificationService: UserVerificationService,
    private router: Router
  ) { }

  onInput(event: any, index: number) {
    const value = event.target.value;
    this.otp[index] = value;
    // Auto focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  }

  onKeydown(event: KeyboardEvent, index: number) {
    // Go back on backspace
    if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  }

  get otpComplete(): boolean {
    return this.otp.every(d => d !== '');
  }

  verify() {
    if (!this.otpComplete) return;
    this.loading = true;
    // Simulate verification (JSON Server has no real OTP)
    setTimeout(() => {
      this.loading = false;
      this.verified = true;
      // Update user isVerified in db
      const user = this.auth.getCurrentUser();
      if (user?.id) {
        this.auth.update(user.id, { ...user, isVerified: true }).subscribe();
        this.auth.storeUser({ ...user, isVerified: true });
      }
      setTimeout(() => this.router.navigate(['/dashboard']), 2000);
    }, 1000);
  }

  resendOtp() {
    this.countdown = 60;
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) clearInterval(this.countdownInterval);
    }, 1000);
  }
}