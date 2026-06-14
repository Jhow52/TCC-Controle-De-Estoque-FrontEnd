import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class RegisterComponent {
  name = ''; email = ''; password = ''; error = ''; success = ''; loading = false;

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  submit() {
    this.error = ''; this.loading = true;
    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Conta criada! Redirecionando...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        const body = err.error;
        if (body?.message) { this.error = body.message; }
        else if (typeof body === 'object') { this.error = Object.values(body).join(' | '); }
        else { this.error = 'Erro ao criar conta. Tente novamente.'; }
        this.cdr.detectChanges();
      }
    });
  }
}