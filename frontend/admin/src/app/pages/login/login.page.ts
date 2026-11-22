import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonIcon, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { shieldCheckmarkOutline} from 'ionicons/icons';
import { ApiHandler } from '../../api-handler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonContent, CommonModule, FormsModule, IonInput, IonButton, IonIcon],
})
export class LoginPage implements OnInit {
  private apiHandler = inject(ApiHandler);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  username = '';
  password = '';
  loading = false;

  async login(){
    if(!this.username.trim() || !this.password) {
      await this.showToast('Please enter your username and password.');
      return
    }
    this.loading = true;

    this.apiHandler.adminLogin({
      username: this.username.trim(), password: this.password
    }).subscribe({
      next: async(response: any) => {
        this.loading = false;
        this.apiHandler.saveAdmin(response.admin ?? response);

        this.username ='';
        this.password ='';
        await this.router.navigate(['/dashboard']);
        this.cdr.detectChanges();
      },
      error: async(error: any) => {
        this.loading = false;

        await this.showToast(
          error?.error.detail ?? 'Invalid admin credentials.'
        );
      }
    });

  }

  private async showToast(message: string){
    const toast= await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom'
    });
    await toast.present();
  }
  constructor() {
    addIcons({shieldCheckmarkOutline});
  }

  ngOnInit() {}
}
