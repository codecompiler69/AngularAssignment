import { Component, Input, OnInit } from '@angular/core';
import { Listing } from '../../../core/models/listing.model';
import { AuthService } from '../../../core/services/auth.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listing-card',
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.scss'],
  imports: [CommonModule],
})
export class ListingCardComponent implements OnInit {
  @Input() listing!: Listing;
  isFavorited = false;

  constructor(
    public authService: AuthService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.checkFavoriteStatus();
  }

  checkFavoriteStatus(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.favoriteService
        .isFavorite(currentUser.id, this.listing.id)
        .subscribe((isFavorited) => {
          this.isFavorited = isFavorited;
        });
    }
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return;
    }

    if (this.isFavorited) {
      this.favoriteService
        .removeFavorite(currentUser.id, this.listing.id)
        .subscribe(() => {
          this.isFavorited = false;
        });
    } else {
      this.favoriteService
        .addFavorite(currentUser.id, this.listing.id)
        .subscribe(() => {
          this.isFavorited = true;
        });
    }
  }
}
