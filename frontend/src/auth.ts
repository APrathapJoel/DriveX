import { api } from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  isVerified: boolean;
  verificationStatus: 'NOT_SUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  avatar?: string;
  createdAt: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

type AuthChangeCallback = (user: User | null) => void;

class AuthStore {
  private user: User | null = null;
  private listeners: AuthChangeCallback[] = [];

  constructor() {
    // Restore from localStorage
    const stored = localStorage.getItem('driver_user') || localStorage.getItem('drivex_user');
    const token = localStorage.getItem('driver_token') || localStorage.getItem('drivex_token');
    if (stored && token) {
      try {
        this.user = JSON.parse(stored);
        api.setToken(token);
      } catch {
        this.clearStorage();
      }
    }
  }

  getUser(): User | null {
    return this.user;
  }

  isLoggedIn(): boolean {
    return this.user !== null;
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  subscribe(cb: AuthChangeCallback): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.user));
  }

  private setUser(user: User, token: string) {
    this.user = user;
    api.setToken(token);
    localStorage.setItem('driver_user', JSON.stringify(user));
    localStorage.setItem('driver_token', token);
    localStorage.removeItem('drivex_user');
    localStorage.removeItem('drivex_token');
    this.notify();
  }

  private clearStorage() {
    localStorage.removeItem('driver_user');
    localStorage.removeItem('driver_token');
    localStorage.removeItem('drivex_user');
    localStorage.removeItem('drivex_token');
    api.setToken(null);
  }

  async login(email: string, password: string): Promise<User> {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    this.setUser(res.data.user, res.data.token);
    return res.data.user;
  }

  async register(name: string, email: string, password: string, phone?: string): Promise<User> {
    const res = await api.post<AuthResponse>('/auth/register', { name, email, password, phone });
    this.setUser(res.data.user, res.data.token);
    return res.data.user;
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    this.user = null;
    this.clearStorage();
    this.notify();
  }

  async refreshUser() {
    try {
      const res = await api.get<{ success: boolean; data: { user: User } }>('/auth/me');
      const token = localStorage.getItem('driver_token') || localStorage.getItem('drivex_token');
      if (token) {
        this.setUser(res.data.user, token);
      }
    } catch {
      this.user = null;
      this.clearStorage();
      this.notify();
    }
  }
}

export const auth = new AuthStore();
