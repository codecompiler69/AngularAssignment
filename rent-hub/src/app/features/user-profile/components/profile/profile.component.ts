import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { MyListingsComponent } from '../my-listings/my-listings.component';
import { FavoritesComponent } from '../favorites/favorites.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MyListingsComponent,
    FavoritesComponent,
  ],
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  activeTab = 'listings'; // 'profile', 'listings', 'favorites'
  loading = false;
  updateSuccess = false;
  errorMessage = '';

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
