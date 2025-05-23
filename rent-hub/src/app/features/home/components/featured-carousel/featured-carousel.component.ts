import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Listing } from '../../../../core/models/listing.model';

@Component({
  selector: 'app-featured-carousel',
  templateUrl: './featured-carousel.component.html',
  styleUrls: ['./featured-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class FeaturedCarouselComponent implements OnInit {
  @Input() featuredListings: Listing[] = [];
  @Output() viewListing = new EventEmitter<string>();

  currentSlide = 0;
  slideInterval: any = null;

  ngOnInit(): void {
    this.startSlideshow();
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  startSlideshow(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopSlideshow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  prevSlide(): void {
    this.stopSlideshow(); // Stop auto-sliding when manually changing slides
    this.currentSlide =
      (this.currentSlide - 1 + this.featuredListings.length) %
      this.featuredListings.length;
    this.startSlideshow(); // Restart auto-sliding
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.featuredListings.length;
  }

  goToSlide(index: number): void {
    this.stopSlideshow();
    this.currentSlide = index;
    this.startSlideshow();
  }

  onViewListing(id: string): void {
    this.viewListing.emit(id);
  }
}
