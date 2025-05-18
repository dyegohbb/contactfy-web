import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  async onSubmit() {
    try {
      const result = await this.authService.register(this.username, this.email, this.password);
      console.log('Cadastro realizado:', result);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  }
}