import { Component } from '@angular/core';
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
  constructor(private auth: AuthService, private router: Router) {}
  submit() {
    this.error = ''; this.loading = true;
    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => { this.success = 'Conta criada! Redirecionando...'; setTimeout(() => this.router.navigate(['/login']), 1500); },
      error: () => { this.error = 'Erro ao criar conta. Tente novamente.'; this.loading = false; }
    });
  }
}
