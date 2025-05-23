import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommentService } from '../../../../core/services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Comment } from '../../../../core/models/comment.model';
import { CommentCardComponent } from '../../../../shared/components/comment-card/comment-card.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommentCardComponent,
    RouterModule,
  ],
})
export class CommentSectionComponent implements OnInit {
  @Input() listingId!: string;

  comments: Comment[] = [];
  isLoading = true;
  error = '';
  commentForm: FormGroup;

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;
    this.commentService.getCommentsByListingId(this.listingId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load comments: ' + error.message;
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'You must be logged in to post a comment.';
      return;
    }

    const content = this.commentForm.get('content')?.value;
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substr(0, 19);

    const newComment: Comment = {
      id: '', // Will be assigned by JSON server
      listingId: this.listingId,
      userId: currentUser.id,
      username: currentUser.username,
      content,
      createdAt: formattedDate,
    };

    this.commentService.addComment(newComment).subscribe({
      next: () => {
        this.commentForm.reset();
        this.loadComments();
      },
      error: (error) => {
        this.error = 'Failed to post comment: ' + error.message;
      },
    });
  }

  onDeleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(
          (comment) => comment.id !== commentId
        );
      },
      error: (error) => {
        this.error = 'Failed to delete comment: ' + error.message;
      },
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
