import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/api.service';
import { User } from '../../models';

@Component({ selector: 'app-admin', imports: [CommonModule, FormsModule], templateUrl: './admin.html' })
export class AdminComponent implements OnInit {
  users: User[] = []; error = ''; success = '';
  isAdmin = false; searchId = '';

  constructor(private svc: AdminService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) { this.router.navigate(['/login']); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles: string[] = payload.roles || [];
      if (!roles.some(r => r.includes('ADMIN'))) { this.router.navigate(['/dashboard']); return; }
      this.isAdmin = true;
    } catch { this.router.navigate(['/login']); return; }
    this.load();
  }

  load() {
    this.svc.getUsers().subscribe({
      next: u => { this.users = [...u]; this.cdr.detectChanges(); },
      error: err => { this.error = this.extractError(err); this.cdr.detectChanges(); }
    });
  }

  buscarPorId() {
    if (!this.searchId) { this.load(); return; }
    this.svc.getById(Number(this.searchId)).subscribe({
      next: u => { this.users = [u]; this.cdr.detectChanges(); },
      error: err => { this.error = this.extractError(err); this.users = []; this.cdr.detectChanges(); }
    });
  }

  promote(id: number) {
    if (!confirm('Promover usuário para ADMIN?')) return;
    this.svc.promoteToAdmin(id).subscribe({
      next: () => { this.load(); this.success = 'Usuário promovido!'; setTimeout(() => this.success = '', 3000); },
      error: err => { this.error = this.extractError(err); this.cdr.detectChanges(); }
    });
  }

  removeAdmin(id: number) {
    if (!confirm('Remover cargo de ADMIN deste usuário?')) return;
    this.svc.removeAdmin(id).subscribe({
      next: () => { this.load(); this.success = 'Admin removido!'; setTimeout(() => this.success = '', 3000); },
      error: err => { this.error = this.extractError(err); this.cdr.detectChanges(); }
    });
  }

  isAdminUser(u: User) { return u.roles.some(r => r.includes('ADMIN')); }

  extractError(err: any): string {
    if (err.error?.message) return err.error.message;
    if (err.error?.error) return err.error.error;
    if (typeof err.error === 'object') return Object.values(err.error).join(' | ');
    return 'Erro inesperado.';
  }
}