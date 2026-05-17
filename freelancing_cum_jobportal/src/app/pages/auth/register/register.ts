import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { Navbar } from '../../../shared/navbar/navbar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Navbar],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;
  showConfirm = false;

  cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      city: ['', Validators.required],
      area: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['user', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  get passwordStrength(): 'weak' | 'medium' | 'strong' {
    const pwd = this.f['password'].value || '';
    if (pwd.length < 6) return 'weak';
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);
    const strong = hasUpper && hasNumber && hasSpecial;
    return strong ? 'strong' : (hasNumber || hasUpper ? 'medium' : 'weak');
  }

  passwordsMatch(): boolean {
    return this.f['password'].value === this.f['confirmPassword'].value;
  }

  onSubmit(): void {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.passwordsMatch()) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.auth.registerUser({
      name: this.f['name'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      phone: this.f['phone'].value,
      city: this.f['city'].value,
      area: this.f['area'].value,
      role: this.f['role'].value,
    }).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.success) {
          this.router.navigate(['/verify-email']);
        } else {
          this.error = result.message;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Unexpected error. Please try again.';
      }
    });
  }
}