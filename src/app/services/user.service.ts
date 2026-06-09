import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: string;
  password: string;
  status: string;
}

export interface UpdateUserDto {
  name: string;
  email: string;
  role: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  success: boolean;
  message: string;
  user: UserDto;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {
  private endpoint = `${this.apiUrl}/User`;

  /**
   * Get all users
   */
  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<unknown>(this.endpoint).pipe(map((payload) => this.extractUserArray(payload)));
  }

  /**
   * Get a user by ID
   */
  getUserById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new user
   */
  createUser(user: CreateUserDto): Observable<UserDto> {
    return this.http.post<UserDto>(this.endpoint, user);
  }

  /**
   * Update an existing user
   */
  updateUser(id: number, user: UpdateUserDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.endpoint}/${id}`, user);
  }

  /**
   * Delete a user
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * User login
   */
  login(credentials: LoginDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.endpoint}/login`, credentials);
  }

  private extractUserArray(payload: unknown): UserDto[] {
    if (typeof payload === 'string') {
      try {
        const parsed = JSON.parse(payload);
        return this.extractUserArray(parsed);
      } catch {
        return [];
      }
    }

    if (Array.isArray(payload)) {
      return payload as UserDto[];
    }

    if (payload && typeof payload === 'object') {
      const wrapped = payload as {
        $values?: unknown;
        items?: unknown;
        data?: unknown;
        value?: unknown;
        result?: unknown;
        results?: unknown;
      };

      if (Array.isArray(wrapped.$values)) {
        return wrapped.$values as UserDto[];
      }

      if (Array.isArray(wrapped.items)) {
        return wrapped.items as UserDto[];
      }

      if (wrapped.data !== undefined) {
        return this.extractUserArray(wrapped.data);
      }

      if (wrapped.value !== undefined) {
        return this.extractUserArray(wrapped.value);
      }

      if (wrapped.result !== undefined) {
        return this.extractUserArray(wrapped.result);
      }

      if (wrapped.results !== undefined) {
        return this.extractUserArray(wrapped.results);
      }
    }

    return [];
  }
}
