import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ListingService } from '../../../../core/services/listing.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-create-property',
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class CreatePropertyComponent implements OnInit {
  propertyForm!: FormGroup;
  amenitiesList: string[] = [
    'Gym/Fitness Center',
    'Swimming Pool',
    'Car Park',
    'Visitors Parking',
    'Power Backup',
    'Garbage Disposal',
    'Private Lawn',
    'Water Heater',
    'Plant Security System',
    'Laundry Service',
    'Elevator',
    'Club House',
  ];
  selectedAmenities: string[] = [];
  currentUser: User | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private listingService: ListingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    this.initForm();
  }

  initForm(): void {
    this.propertyForm = this.fb.group({
      apartmentBuilding: ['', Validators.required],
      isShared: ['false'],
      location: ['', Validators.required],
      squareFeet: ['', [Validators.required, Validators.min(1)]],
      leaseType: ['long-term'],
      rent: ['', [Validators.required, Validators.min(1)]],
      isNegotiable: [false],
      priceMode: ['per-month'],
      isFurnished: ['false'],
      description: ['', [Validators.required, Validators.minLength(10)]],
      contactDetails: this.fb.group({
        name: [this.currentUser?.username || '', Validators.required],
        email: [
          this.currentUser?.email || '',
          [Validators.required, Validators.email],
        ],
        phone: ['', Validators.required],
      }),
    });
  }

  onAmenityChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const amenity = checkbox.value;

    if (checkbox.checked) {
      this.selectedAmenities.push(amenity);
    } else {
      const index = this.selectedAmenities.indexOf(amenity);
      if (index > -1) {
        this.selectedAmenities.splice(index, 1);
      }
    }
  }

  get isFormInvalid(): boolean {
    return this.propertyForm.invalid;
  }

  // Add these properties to your class
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  // Add these methods
  triggerFileInput(): void {
    document.getElementById('images')?.click();
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.match('image.*')) {
          this.selectedFiles.push(file);

          // Create preview
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagePreviews.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  // Update your onSubmit method to handle file uploads
  // No changes needed in CreatePropertyComponent
  onSubmit(): void {
    if (this.propertyForm.valid) {
      this.loading = true;

      const formData = new FormData();

      // Add all form fields to FormData
      const formValue = this.propertyForm.value;
      Object.keys(formValue).forEach((key) => {
        formData.append(key, formValue[key]);
      });

      // Add amenities
      formData.append('amenities', JSON.stringify(this.selectedAmenities));

      // Add user ID
      if (this.currentUser) {
        formData.append('userId', this.currentUser.id);
      }

      // Add files
      this.selectedFiles.forEach((file, index) => {
        formData.append('images', file, file.name);
      });

      // Submit the form
      this.listingService.createListingWithImages(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/listings', response.id]);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to create listing: ' + error.message;
        },
      });
    }
  }
}
