import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import the standalone components
import { HeaderComponent } from './components/header/header.component';
import { ListingCardComponent } from './components/listing-card/listing-card.component';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    ListingCardComponent,
    CommentCardComponent,
    FilterPipe,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    ListingCardComponent,
    CommentCardComponent,
    FilterPipe,
  ],
})
export class SharedModule {}
