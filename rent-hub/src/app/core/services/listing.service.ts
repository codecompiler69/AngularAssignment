import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Listing } from '../models/listing.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.apiUrl}/listings`).pipe(
      catchError((error) => {
        return throwError(
          () => new Error('Error fetching listings: ' + error.message)
        );
      })
    );
  }

  getListingById(id: string): Observable<Listing> {
    return this.http.get<Listing>(`${this.apiUrl}/listings/${id}`).pipe(
      catchError((error) => {
        return throwError(
          () => new Error('Error fetching listing: ' + error.message)
        );
      })
    );
  }

  getListingsByUserId(userId: string): Observable<Listing[]> {
    return this.http
      .get<Listing[]>(`${this.apiUrl}/listings?userId=${userId}`)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Error fetching user listings: ' + error.message)
          );
        })
      );
  }

  createListing(listing: Listing): Observable<Listing> {
    return this.http.post<Listing>(`${this.apiUrl}/listings`, listing).pipe(
      catchError((error) => {
        return throwError(
          () => new Error('Error creating listing: ' + error.message)
        );
      })
    );
  }

  // Add this method to your ListingService
  createListingWithImages(formData: FormData): Observable<Listing> {
    // Extract the files from FormData
    const files: File[] = [];
    if (formData.getAll('images')) {
      formData.getAll('images').forEach((item: any) => {
        if (item instanceof File) {
          files.push(item);
        }
      });
    }

    // Create listing object from the form data
    const listing: any = {};
    for (const [key, value] of formData.entries()) {
      // Skip files, we handle them separately
      if (key !== 'images') {
        listing[key] = value;
      }
    }

    // Handle amenities if it's a JSON string
    if (
      formData.get('amenities') &&
      typeof formData.get('amenities') === 'string'
    ) {
      try {
        listing.amenities = JSON.parse(formData.get('amenities') as string);
      } catch (e) {
        listing.amenities = [];
      }
    }

    // Convert files to base64 strings
    const filePromises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    return from(Promise.all(filePromises)).pipe(
      switchMap((base64Files) => {
        const listingData = {
          ...listing,
          images: base64Files,
          createdAt: new Date().toISOString(),
        };

        return this.http.post<Listing>(`${this.apiUrl}/listings`, listingData);
      }),
      catchError((error) => {
        return throwError(
          () => new Error('Error creating listing: ' + error.message)
        );
      })
    );
  }

  updateListing(id: string, listing: Partial<Listing>): Observable<Listing> {
    return this.http
      .patch<Listing>(`${this.apiUrl}/listings/${id}`, listing)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Error updating listing: ' + error.message)
          );
        })
      );
  }

  deleteListing(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/listings/${id}`).pipe(
      catchError((error) => {
        return throwError(
          () => new Error('Error deleting listing: ' + error.message)
        );
      })
    );
  }
}
