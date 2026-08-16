import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name = '';
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

    this.http.post('http://localhost:8000/api/register', {
      name: this.name,
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (response: any) => {
        this.successMessage = 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول';
        this.isLoading = false;
        this.name = '';
        this.email = '';
        this.password = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        if (error.error?.errors?.email) {
          this.errorMessage = 'هذا البريد الإلكتروني مستعمل من قبل';
        } else if (error.error?.errors?.password) {
          this.errorMessage = 'كلمة السر يجب أن تكون 6 أحرف على الأقل';
        } else {
          this.errorMessage = 'وقع خطأ، تأكد من المعلومات';
        }
        this.cdr.detectChanges();
      },
    });
  }
}