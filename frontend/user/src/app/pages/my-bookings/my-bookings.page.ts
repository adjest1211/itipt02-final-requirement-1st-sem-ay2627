import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonSpinner } from '@ionic/angular';
import { IonContent, IonHeader, IonToolbar, IonButton, IonCard, IonCardContent, IonBadge, IonIcon, IonRefresher, IonRefresherContent} from '@ionic/angular';
import { ApiHandler } from '../../api-handler';
import { addIcons } from 'ionicons';
import { bookOutline, ticketOutline } from 'ionicons/icons';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.page.html',
  styleUrls: ['./my-bookings.page.scss'],
  imports: [ CommonModule, FormsModule, RouterLink, IonContent, IonHeader, IonToolbar, IonButton, IonCard, IonCardContent, IonBadge, IonIcon, IonSpinner, IonRefresher, IonRefresherContent
  ],
})
export class MyBookingsPage implements OnInit {

  private apiHandler = inject(ApiHandler);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  bookings: any[] = [];
  loading = true;

  constructor() {
    addIcons({
      bookOutline,
      ticketOutline
    });
  }

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {

    const currentUser = this.apiHandler.getUser();

    if (!currentUser || !currentUser.userID) {
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.apiHandler.myBooking(currentUser.userID).subscribe({

      next: (response: any) => {

        console.log('My Bookings API:', response);

        this.bookings = Array.isArray(response) ? response : [];

        this.loading = false;
        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Failed to load bookings:', error);

        this.bookings = [];
        this.loading = false;
        this.cdr.detectChanges();

      }

    });

  }

  refresh(event: any) {

    const currentUser = this.apiHandler.getUser();

    if (!currentUser || !currentUser.userID) {
      event.target.complete();
      this.router.navigate(['/login']);
      return;
    }

    this.apiHandler.myBooking(currentUser.userID).subscribe({

      next: (response: any) => {

        console.log('Refreshed bookings:', response);

        this.bookings = Array.isArray(response) ? response : [];

        this.cdr.detectChanges();
        event.target.complete();

      },

      error: (error) => {

        console.error('Refresh error:', error);

        event.target.complete();

      }

    });

  }

  getStatusColor(status: string): string {

    if (status === 'Confirmed') {
      return 'success';
    }

    if (status === 'Cancelled') {
      return 'danger';
    }

    return 'warning';

  }

}
