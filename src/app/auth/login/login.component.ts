import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  login = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  async onSubmit() {
    try {
      const response = await this.authService.login(this.login, this.password);
      const token = response.content.token;
      this.authService.saveToken(token);

      this.router.navigate(['/contatos']);

    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }
}