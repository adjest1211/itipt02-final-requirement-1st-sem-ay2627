import { Component,inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, ToastController, IonIcon} from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { ApiHandler } from '../../api-handler';
import { addIcons } from 'ionicons';
import { ticketOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [IonContent, CommonModule, FormsModule, RouterLink,IonIcon, IonInput, IonButton],
})
export class RegisterPage implements OnInit {

  private apiHandler = inject(ApiHandler);
  private router = inject(Router);
  private toast = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  firstName = "";
  lastName = "";
  username = "";
  email = "";
  password = "";
  contactNumber = "";
  loading = false;

  constructor() {
    addIcons({ticketOutline});
  }

  async register() {
    if(
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.username.trim() ||
      !this.email.trim() ||
      !this.password
    ){
      this.showToast('Please complete all required fields', 'warning');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.apiHandler.userRegister({
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      password: this.password,
      email: this.email,
      contactNumber: this.contactNumber
    }).subscribe({
      next: async response => {
        this.loading = false;
        this.cdr.detectChanges();

        await this.showToast(
          response.message,
          'success'
        );

        this.router.navigate(['/login']);
      },
      error: err => {
        this.loading = false;
        this.cdr.detectChanges();
        this.showToast(
          err.error?.detail || 'Registration failed',
          'danger'
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
