import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit() {
    if (this.isLoading) return;

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.http.post('http://localhost:8000/api/login', {
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (response: any) => {
        this.successMessage = 'تم تسجيل الدخول بنجاح!';
        this.isLoading = false;
        localStorage.setItem('token', response.token);
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'البريد الإلكتروني أو كلمة السر غير صحيحة';
        this.cdr.detectChanges();
      },
    });
  }
}