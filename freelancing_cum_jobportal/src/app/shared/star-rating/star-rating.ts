import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="text-warning">
      <i *ngFor="let s of stars()" class="bi" [ngClass]="s"></i>
    </span>
    <span class="text-muted ms-1 small">{{ rating }}</span>
  `
})
export class StarRating {
  @Input() rating: number = 0;

  stars(): string[] {
    return Array.from({ length: 5 }, (_, i) => {
      if (i < Math.floor(this.rating)) return 'bi-star-fill';
      if (i < this.rating) return 'bi-star-half';
      return 'bi-star';
    });
  }
}