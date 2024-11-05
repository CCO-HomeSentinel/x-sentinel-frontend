import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Auth } from '../../interfaces/auth';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CardModule, DialogModule, InputOtpModule, ButtonModule, InputTextModule, DividerModule, CommonModule, FormsModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  auth!: Auth;
  code!: string;
  dialogVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.auth = { email: '', password: '' };
  }

  onSubmit() {
    this.authService.login(this.auth).then(success => {
      if (success) {
        console.log('Login realizado com sucesso');
        this.dialogVisible = true;
      } else {
        console.log('Credenciais inválidas');
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Credenciais inválidas' });
      }
    }).catch(err => {
      console.log('Erro ao fazer login:', err);
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao fazer login, tente novamente' });
    });
  }

  verifyCode() {
    this.authService.verifyCode(this.code).then(success => {
      if (success) {
        console.log('Código verificado com sucesso');
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Login realizado com sucesso' });
        this.dialogVisible = false
        this.router.navigate(['/dashboard']);
      } else {
        console.log('Código inválido');
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Código inválido' });
      }
    })
  }

}
