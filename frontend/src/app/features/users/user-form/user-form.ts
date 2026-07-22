import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ApiError } from '../../../core/interceptors/http-error.interceptor';
import { NotificationService } from '../../../core/notifications/notification.service';
import { UsersApiService } from '../../../core/api/users-api.service';
import { UserPayload } from '../../../shared/models/user';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly usersApi = inject(UsersApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  private readonly userId = signal<number | null>(null);
  readonly isEditMode = computed(() => this.userId() !== null);

  readonly loadingUser = signal(false);
  readonly submitting = signal(false);

  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam === null) {
      return;
    }

    const id = Number(idParam);
    this.userId.set(id);
    this.loadingUser.set(true);

    this.usersApi.get(id).subscribe({
      next: (user) => {
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
        this.loadingUser.set(false);
      },
      error: (err: ApiError) => {
        this.loadingUser.set(false);
        this.notifications.error(err.message);
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const payload: UserPayload = this.form.getRawValue();
    const id = this.userId();
    const request$ =
      id === null ? this.usersApi.create(payload) : this.usersApi.update(id, payload);

    request$.subscribe({
      next: () => {
        this.notifications.success(id === null ? 'User created' : 'User updated');
        this.router.navigateByUrl('/');
      },
      error: (err: ApiError) => {
        this.submitting.set(false);
        this.notifications.error(err.message);
      },
    });
  }
}
