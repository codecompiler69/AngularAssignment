import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Favorite } from '../models/favorite.model';
import { Listing } from '../models/listing.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserFavorites(userId: string): Observable<Favorite[]> {
    return this.http
      .get<Favorite[]>(`${this.apiUrl}/favorites?userId=${userId}`)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Error fetching favorites: ' + error.message)
          );
        })
      );
  }

  getFavoriteListings(userId: string): Observable<Listing[]> {
    return this.getUserFavorites(userId).pipe(
      switchMap((favorites) => {
        if (favorites.length === 0) {
          return new Observable<Listing[]>((observer) => {
            observer.next([]);
            observer.complete();
          });
        }

        const listingRequests = favorites.map((fav) =>
          this.http.get<Listing>(`${this.apiUrl}/listings/${fav.listingId}`)
        );

        return forkJoin(listingRequests);
      }),
      catchError((error) => {
        return throwError(
          () => new Error('Error fetching favorite listings: ' + error.message)
        );
      })
    );
  }

  addFavorite(userId: string, listingId: string): Observable<Favorite> {
    const favorite: Favorite = {
      id: '', // Will be assigned by JSON server
      userId,
      listingId,
    };

    return this.http.post<Favorite>(`${this.apiUrl}/favorites`, favorite).pipe(
      catchError((error) => {
        return throwError(
          () => new Error('Error adding favorite: ' + error.message)
        );
      })
    );
  }

  removeFavorite(userId: string, listingId: string): Observable<void> {
    return this.http
      .get<Favorite[]>(
        `${this.apiUrl}/favorites?userId=${userId}&listingId=${listingId}`
      )
      .pipe(
        switchMap((favorites) => {
          if (favorites.length === 0) {
            return throwError(() => new Error('Favorite not found'));
          }

          return this.http.delete<void>(
            `${this.apiUrl}/favorites/${favorites[0].id}`
          );
        }),
        catchError((error) => {
          return throwError(
            () => new Error('Error removing favorite: ' + error.message)
          );
        })
      );
  }

  isFavorite(userId: string, listingId: string): Observable<boolean> {
    return this.http
      .get<Favorite[]>(
        `${this.apiUrl}/favorites?userId=${userId}&listingId=${listingId}`
      )
      .pipe(
        map((favorites) => favorites.length > 0),
        catchError((error) => {
          return throwError(
            () => new Error('Error checking favorite status: ' + error.message)
          );
        })
      );
  }
}
