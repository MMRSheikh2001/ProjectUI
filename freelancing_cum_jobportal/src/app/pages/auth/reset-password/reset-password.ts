import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {

  form: FormGroup;
  submitted = false;
  loading = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  passwordsMatch(): boolean {
    return this.form.get('newPassword')?.value ===
      this.form.get('confirmPassword')?.value;
  }

  onSubmit() {
    if (this.form.invalid || !this.passwordsMatch()) return;
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.submitted = true;
    }, 1000);
  }
}