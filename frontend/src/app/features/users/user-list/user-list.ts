import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { ApiError } from '../../../core/interceptors/http-error.interceptor';
import { UsersApiService } from '../../../core/api/users-api.service';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-user-list',
  imports: [RouterLink, DatePipe, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList implements OnInit {
  private readonly usersApi = inject(UsersApiService);

  readonly displayedColumns = ['name', 'email', 'created', 'actions'];

  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.usersApi.list().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (err: ApiError) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  deleteUser(user: User): void {
    const confirmed = confirm(`Delete ${user.firstName} ${user.lastName}?`);
    if (!confirmed) {
      return;
    }

    this.usersApi.remove(user.id).subscribe({
      next: () => this.loadUsers(),
      error: (err: ApiError) => this.error.set(err.message),
    });
  }
}
