import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoriteService } from '../../../../core/services/favorite.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Listing } from '../../../../core/models/listing.model';
import { ListingCardComponent } from '../../../../shared/components/listing-card/listing-card.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ListingCardComponent],
})
export class FavoritesComponent implements OnInit {
  favorites: Listing[] = [];
  isLoading = true;
  error = '';

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'You must be logged in to view your favorites.';
      this.isLoading = false;
      return;
    }

    this.favoriteService.getFavoriteListings(currentUser.id).subscribe({
      next: (listings) => {
        this.favorites = listings;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load favorites: ' + error.message;
        this.isLoading = false;
      },
    });
  }

  removeFavorite(listingId: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.favoriteService.removeFavorite(currentUser.id, listingId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(
          (listing) => listing.id !== listingId
        );
      },
      error: (error) => {
        this.error = 'Failed to remove favorite: ' + error.message;
      },
    });
  }
}
