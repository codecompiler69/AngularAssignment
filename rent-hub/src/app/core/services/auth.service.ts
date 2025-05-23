import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl; // JSON Server URL
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    // In a real app, you would encrypt the password and use proper authentication
    // For demo using JSON Server, we just search for matching user
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      map((users) => {
        // Find user with matching email and password
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Remove password before storing
        const { password: _, ...userWithoutPassword } = user;

        // Store user in localStorage
        localStorage.setItem(
          'currentUser',
          JSON.stringify(userWithoutPassword)
        );

        // Update current user subject
        this.currentUserSubject.next(userWithoutPassword as User);

        return userWithoutPassword as User;
      }),
      catchError((error) => {
        return throwError(() => new Error('Invalid email or password'));
      })
    );
  }

  register(user: any): Observable<User> {
    // In a real app, you would encrypt the password and use proper validation
    // For demo using JSON Server, we just create a new user
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      tap((createdUser) => {
        // Remove password before storing
        const { password: _, ...userWithoutPassword } = createdUser;

        // Store user in localStorage
        localStorage.setItem(
          'currentUser',
          JSON.stringify(userWithoutPassword)
        );

        // Update current user subject
        this.currentUserSubject.next(userWithoutPassword);
      }),
      catchError((error) => {
        return throwError(() => new Error('Registration failed'));
      })
    );
  }

  logout(): void {
    // Remove user from localStorage
    localStorage.removeItem('currentUser');

    // Reset current user subject
    this.currentUserSubject.next(null);
  }
}
