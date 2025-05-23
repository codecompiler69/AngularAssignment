import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../../core/models/comment.model';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],

  imports: [CommonModule],
})
export class CommentCardComponent {
  @Input() comment!: Comment;
  @Output() delete = new EventEmitter<string>();

  constructor(private authService: AuthService) {}

  get isOwner(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return !!currentUser && currentUser.id === this.comment.userId;
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.delete.emit(this.comment.id);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}
