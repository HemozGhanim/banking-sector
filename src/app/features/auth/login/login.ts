import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputPasswordModule } from 'primeng/inputpassword';
import { Eye } from '@primeicons/angular/eye';
import { EyeSlash } from '@primeicons/angular/eye-slash';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  imports: [
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputPasswordModule,
    ReactiveFormsModule,
    FloatLabelModule,
    Eye,
    EyeSlash,
    MessageModule,
    ButtonModule,
    ToastModule,
  ],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  providers: [MessageService],
})
export class Login {
  messageService = inject(MessageService);
  router = inject(Router);
  mask: boolean = true;
  formSubmitted: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    console.log(this.loginForm.value);
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', this.loginForm.value.email || '');
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Form is submitted',
        life: 3000,
      });
      this.router.navigate(['/dashboard']);
    }
  }

  isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
