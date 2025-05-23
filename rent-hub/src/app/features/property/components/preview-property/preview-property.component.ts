import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListingService } from '../../../../core/services/listing.service';
import { Listing } from '../../../../core/models/listing.model';

@Component({
  selector: 'app-preview-property',
  templateUrl: './preview-property.component.html',
  styleUrls: ['./preview-property.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class PreviewPropertyComponent implements OnInit {
  listing: Listing | null = null;
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listingService: ListingService
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
      },
      error: (error) => {
        this.error = 'Failed to load listing: ' + error.message;
        this.isLoading = false;
      },
    });
  }

  viewListing(): void {
    if (this.listing) {
      this.router.navigate(['/listings', this.listing.id]);
    }
  }

  editListing(): void {
    // In a real application, we would navigate to an edit page.
    // For now, we'll just redirect to the create page as we haven't implemented editing.
    this.router.navigate(['/property/create']);
  }
}
