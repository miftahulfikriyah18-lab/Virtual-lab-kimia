import { GradeLevel, StudentUser } from '../platform/types';

const STORAGE_KEY_CURRENT_USER = 'vlab_current_user';
const STORAGE_KEY_REGISTERED_USERS = 'vlab_registered_users';
const STORAGE_KEY_SPLASH_SEEN = 'vlab_splash_seen';

export class AuthService {
  static getCurrentUser(): StudentUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to parse current user', e);
    }
    return null;
  }

  static setCurrentUser(user: StudentUser | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    }
  }

  static async login(email: string, pass: string): Promise<StudentUser> {
    const trimmedEmail = email.trim().toLowerCase();
    const registered = this.getRegisteredUsers();
    const existing = registered.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (existing) {
      const updated: StudentUser = {
        ...existing,
        lastLogin: new Date().toISOString()
      };
      this.updateRegisteredUser(updated);
      this.setCurrentUser(updated);
      return updated;
    }

    // Auto-authenticate as new user if not registered yet in local mock
    const derivedName = trimmedEmail.split('@')[0].replace(/[._-]/g, ' ') || 'Praktikan';
    const formattedName = derivedName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const newUser: StudentUser = {
      userId: `user-${Date.now()}`,
      name: formattedName,
      email: trimmedEmail,
      school: 'SMA Negeri 1',
      grade: 'Kelas XI',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isDemo: false
    };

    this.saveRegisteredUser(newUser);
    this.setCurrentUser(newUser);
    return newUser;
  }

  static async register(
    name: string,
    email: string,
    pass: string,
    school: string,
    grade: GradeLevel
  ): Promise<StudentUser> {
    const trimmedEmail = email.trim().toLowerCase();
    const newUser: StudentUser = {
      userId: `user-${Date.now()}`,
      name: name.trim() || 'Praktikan Kimia',
      email: trimmedEmail,
      school: school.trim() || 'SMA Negeri',
      grade: grade || 'Kelas XI',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isDemo: false
    };

    this.saveRegisteredUser(newUser);
    this.setCurrentUser(newUser);
    return newUser;
  }

  static loginDemo(name?: string, school?: string, grade?: GradeLevel): StudentUser {
    const demoUser: StudentUser = {
      userId: 'demo-student-01',
      name: name?.trim() || 'Praktikan Kimia',
      email: 'demo@vlab-kimia.id',
      school: school?.trim() || 'SMA Negeri',
      grade: grade || 'Kelas XI',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isDemo: true
    };
    this.setCurrentUser(demoUser);
    return demoUser;
  }

  static logout(): void {
    this.setCurrentUser(null);
  }

  static updateProfile(updates: Partial<StudentUser>): StudentUser {
    const current = this.getCurrentUser();
    if (!current) {
      throw new Error('No user logged in');
    }
    const updated: StudentUser = {
      ...current,
      ...updates
    };
    this.setCurrentUser(updated);
    if (!updated.isDemo) {
      this.updateRegisteredUser(updated);
    }
    return updated;
  }

  static hasSeenSplash(): boolean {
    return localStorage.getItem(STORAGE_KEY_SPLASH_SEEN) === 'true';
  }

  static setSeenSplash(seen: boolean): void {
    localStorage.setItem(STORAGE_KEY_SPLASH_SEEN, seen ? 'true' : 'false');
  }

  // Helpers
  private static getRegisteredUsers(): StudentUser[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private static saveRegisteredUser(user: StudentUser): void {
    const users = this.getRegisteredUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(users));
  }

  private static updateRegisteredUser(user: StudentUser): void {
    const users = this.getRegisteredUsers();
    const idx = users.findIndex((u) => u.userId === user.userId);
    if (idx !== -1) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(users));
  }
}
