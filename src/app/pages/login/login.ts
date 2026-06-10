import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ← adiciona isso
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink], // ← adiciona CommonModule aqui
  templateUrl: './login.html'
})
export class LoginComponent {
  email = ''; password = ''; error = ''; loading = false;
  constructor(private auth: AuthService, private router: Router) {}
  submit() {
  this.error = ''; this.loading = true;
  this.auth.login({ email: this.email, password: this.password }).subscribe({
    next: () => {
      this.router.navigate(['/dashboard']); // ← adiciona isso
    },
    error: () => { this.error = 'Email ou senha inválidos.'; this.loading = false; }
  });
}
}
