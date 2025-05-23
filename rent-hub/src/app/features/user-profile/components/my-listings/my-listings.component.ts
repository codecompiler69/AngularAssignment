import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListingService } from '../../../../core/services/listing.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Listing } from '../../../../core/models/listing.model';
import { ListingCardComponent } from '../../../../shared/components/listing-card/listing-card.component';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.component.html',
  styleUrls: ['./my-listings.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ListingCardComponent],
})
export class MyListingsComponent implements OnInit {
  listings: Listing[] = [];
  isLoading = true;
  error = '';

  constructor(
    private listingService: ListingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMyListings();
  }

  loadMyListings(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'You must be logged in to view your listings.';
      this.isLoading = false;
      return;
    }

    this.listingService.getListingsByUserId(currentUser.id).subscribe({
      next: (listings) => {
        this.listings = listings;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load listings: ' + error.message;
        this.isLoading = false;
      },
    });
  }

  deleteListing(id: string): void {
    if (confirm('Are you sure you want to delete this listing?')) {
      this.listingService.deleteListing(id).subscribe({
        next: () => {
          this.listings = this.listings.filter((listing) => listing.id !== id);
        },
        error: (error) => {
          this.error = 'Failed to delete listing: ' + error.message;
        },
      });
    }
  }
}
