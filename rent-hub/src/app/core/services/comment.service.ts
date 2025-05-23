import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Comment } from '../models/comment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCommentsByListingId(listingId: string): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`${this.apiUrl}/comments?listingId=${listingId}`)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Error fetching comments: ' + error.message)
          );
        })
      );
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments`, comment).pipe(
      catchError((error) => {
        return throwError(
          () => new Error('Error adding comment: ' + error.message)
        );
      })
    );
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${id}`).pipe(
      catchError((error) => {
        return throwError(
          () => new Error('Error deleting comment: ' + error.message)
        );
      })
    );
  }
}
