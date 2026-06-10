import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../services/api.service';
import { User } from '../../models';

@Component({ selector: 'app-admin', imports: [CommonModule], templateUrl: './admin.html' })
export class AdminComponent implements OnInit {
  users: User[] = []; error = ''; success = '';
  isAdmin = false;

  constructor(private svc: AdminService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) { this.router.navigate(['/login']); return; }

    // Decodifica o token e verifica a role
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles: string[] = payload.roles || payload.authorities || [];
      const admin = roles.some((r: string) => r.includes('ADMIN'));
      if (!admin) { this.router.navigate(['/dashboard']); return; } // ← redireciona se não for admin
      this.isAdmin = true;
    } catch {
      this.router.navigate(['/login']); return;
    }

    this.load();
  }

  load() { 
    this.svc.getUsers().subscribe({ 
      next: u => { this.users = [...u]; this.cdr.detectChanges(); },
      error: err => { this.error = 'Erro: ' + err.status; this.cdr.detectChanges(); }
    }); 
  }

  promote(id: number) {
    if (!confirm('Promover usuário para ADMIN?')) return;
    this.svc.promoteToAdmin(id).subscribe({ 
      next: () => { this.load(); this.success = 'Usuário promovido!'; setTimeout(() => this.success = '', 3000); }, 
      error: () => this.error = 'Erro ao promover.'
    });
  }

  isAdminUser(u: User) { return u.roles.some(r => r.includes('ADMIN')); }
}