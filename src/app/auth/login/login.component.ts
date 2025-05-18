import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

  constructor(private authService: AuthService) {}

  async onSubmit() {
    try {
      const response = await this.authService.login(this.login, this.password);
      console.log('Token JWT:', response.content.token);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }
}