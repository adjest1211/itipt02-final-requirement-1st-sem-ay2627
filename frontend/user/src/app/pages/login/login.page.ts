import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonInput, IonButton,IonIcon, ToastController } from '@ionic/angular';
import { ApiHandler } from '../../api-handler';
import { addIcons } from 'ionicons';
import { arrowBackOutline, ticketOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonContent, IonHeader, IonToolbar, CommonModule, FormsModule,IonInput, IonButton,IonIcon, RouterLink],
})
export class LoginPage implements OnInit {
  private apiHandler = inject(ApiHandler);
  private router = inject(Router);
  private toast = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  username = '';
  password = '';
  loading = false;

  constructor() {
    addIcons({ticketOutline, arrowBackOutline});
  }

  async login() {
    if(!this.username.trim() || !this.password) {
      this.showToast('Please enter your username and password', 'warning');
      return;
    }

    this.loading = true;

    this.apiHandler.userLogin({
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.username = '';
        this.password = '';
        this.router.navigate(['/events']);
        this.cdr.detectChanges();
      },
      error: err => {
        this.loading = false;
        this.showToast(
          err.error?.detail || 'Login failed', 'danger'
        );
      }
    });
  }

  async showToast(message: string, color: string){
    const toast = await this.toast.create({
      message,
      duration: 2500,
      color,
      position: 'top'
    });
    await toast.present();
  }

  ngOnInit() {}
}
