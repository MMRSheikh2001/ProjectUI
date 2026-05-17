import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  isLoggedIn = false;
  isAdmin = false;
  isCompany = false;
  isUser = false;
  userName = '';

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'admin';
      this.isCompany = user?.role === 'company';
      this.isUser = user?.role === 'user';
      this.userName = user?.name || '';
    });
  }

  logout(): void {
    this.auth.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.userName = '';
    this.router.navigate(['/login']);
  }
}