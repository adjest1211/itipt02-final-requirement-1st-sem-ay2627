import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardContent, IonBadge, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/angular';
import { ApiHandler } from '../../api-handler';
import { addIcons } from 'ionicons';
import { bookOutline, ticketOutline } from 'ionicons/icons';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.page.html',
  styleUrls: ['./my-bookings.page.scss'],
  imports: [ IonButton, IonCard, IonCardContent, IonBadge, IonIcon, IonRefresher, IonRefresherContent, RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class MyBookingsPage implements OnInit {
  private apiHandler = inject(ApiHandler);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  bookings: any[] = [];
  loading = true;

  constructor() {
    addIcons({bookOutline, ticketOutline});
  }

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings(){
    const currentUser = this.apiHandler.getUser();

    if(!currentUser){
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.apiHandler.myBooking(currentUser.userID).subscribe({
      next: (item: any) =>{
        this.bookings = item;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error(error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  refresh(event: any){
    const currentUser = this.apiHandler.getUser();

    if(!currentUser){
      event.target.complete();
      return;
    }

    this.apiHandler.myBooking(currentUser.userID).subscribe({
      next: item => {
        this.bookings = item;
        event.target.complete();
      },
      error: () => event.target.complete()
    });
  }

  getStatusColor(status: string): string{
    if(status === 'Confirmed') return 'success';
    if(status === 'Cancelled') return 'danger';
    return 'warning';
  }
}
