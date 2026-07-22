import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { User, UserPayload } from '../../shared/models/user';
import { UsersApiService } from './users-api.service';

const sampleUser: User = {
  id: 1,
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('UsersApiService', () => {
  let service: UsersApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UsersApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists users via GET /api/users', () => {
    let result: User[] | undefined;

    service.list().subscribe((users) => (result = users));

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush([sampleUser]);

    expect(result).toEqual([sampleUser]);
  });

  it('creates a user via POST /api/users', () => {
    const payload: UserPayload = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    };
    let result: User | undefined;

    service.create(payload).subscribe((user) => (result = user));

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(sampleUser);

    expect(result).toEqual(sampleUser);
  });
});
