import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ListingService } from '../../../../core/services/listing.service';
import { Listing } from '../../../../core/models/listing.model';
import { FeaturedCarouselComponent } from '../featured-carousel/featured-carousel.component';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { ListingCardComponent } from '../../../../shared/components/listing-card/listing-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FeaturedCarouselComponent,
    SearchFilterComponent,
    ListingCardComponent,
  ],
})
export class HomeComponent implements OnInit {
  listings: Listing[] = [];
  filteredListings: Listing[] = [];
  featuredListings: Listing[] = [];
  isLoading = true;
  error = '';
  searchQuery = '';

  constructor(private listingService: ListingService, private router: Router) {}

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.isLoading = true;
    this.listingService.getAllListings().subscribe({
      next: (listings) => {
        this.listings = listings;
        this.filteredListings = [...listings];

        // Get featured listings (newest 5 listings)
        this.featuredListings = [...listings]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load listings: ' + error.message;
        this.isLoading = false;
      },
    });
  }

  applyFilters(filters: any): void {
    // Start with all listings
    let filtered = [...this.listings];

    // Apply filters one by one
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.apartmentBuilding.toLowerCase().includes(query) ||
          listing.location.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query)
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter((listing) => listing.rent >= filters.minPrice);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((listing) => listing.rent <= filters.maxPrice);
    }

    if (filters.propertyType !== 'all') {
      const isShared = filters.propertyType === 'shared';
      filtered = filtered.filter((listing) => listing.isShared === isShared);
    }

    if (filters.leaseType !== 'all') {
      filtered = filtered.filter(
        (listing) =>
          listing.leaseType === filters.leaseType ||
          listing.leaseType === 'both'
      );
    }

    if (filters.isFurnished !== 'all') {
      const furnished = filters.isFurnished === 'furnished';
      filtered = filtered.filter(
        (listing) => listing.isFurnished === furnished
      );
    }

    // Update filtered listings
    this.filteredListings = filtered;
  }

  viewListing(listingId: string): void {
    this.router.navigate(['/listings', listingId]);
  }
}
