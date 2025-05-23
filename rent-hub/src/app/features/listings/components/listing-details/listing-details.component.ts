import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../../../core/services/listing.service';
import { FavoriteService } from '../../../../core/services/favorite.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Listing } from '../../../../core/models/listing.model';
import { CommentSectionComponent } from '../comment-section/comment-section.component';

@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.scss'],
  standalone: true,
  imports: [CommonModule, CommentSectionComponent],
})
export class ListingDetailsComponent implements OnInit {
  listing: Listing | null = null;
  isLoading = true;
  error = '';
  isFavorited = false;
  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private favoriteService: FavoriteService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadListing(id);
    } else {
      this.error = 'Invalid listing ID';
      this.isLoading = false;
    }
  }

  loadListing(id: string): void {
    this.listingService.getListingById(id).subscribe({
      next: (listing) => {
        this.listing = listing;
        this.isLoading = false;
        this.checkFavoriteStatus();
      },
      error: (error) => {
        this.error = 'Failed to load listing: ' + error.message;
        this.isLoading = false;
      },
    });
  }

  checkFavoriteStatus(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && this.listing) {
      this.favoriteService
        .isFavorite(currentUser.id, this.listing.id)
        .subscribe((isFavorited) => {
          this.isFavorited = isFavorited;
        });
    }
  }

  toggleFavorite(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !this.listing) {
      return;
    }

    if (this.isFavorited) {
      this.favoriteService
        .removeFavorite(currentUser.id, this.listing.id)
        .subscribe({
          next: () => {
            this.isFavorited = false;
          },
          error: (error) => {
            console.error('Error removing from favorites:', error);
          },
        });
    } else {
      this.favoriteService
        .addFavorite(currentUser.id, this.listing.id)
        .subscribe({
          next: () => {
            this.isFavorited = true;
          },
          error: (error) => {
            console.error('Error adding to favorites:', error);
          },
        });
    }
  }

  nextImage(): void {
    if (this.listing && this.listing.images.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.listing.images.length;
    }
  }

  prevImage(): void {
    if (this.listing && this.listing.images.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.listing.images.length) %
        this.listing.images.length;
    }
  }

  getCurrentImage(): string {
    if (this.listing && this.listing.images.length > 0) {
      return 'assets/images/' + this.listing.images[this.currentImageIndex];
    }
    return 'assets/images/placeholder.jpg';
  }
}
