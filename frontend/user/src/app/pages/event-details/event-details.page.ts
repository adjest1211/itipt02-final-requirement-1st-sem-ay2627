import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonButton, IonIcon,IonBadge, ToastController } from '@ionic/angular';
import { ApiHandler } from '../../api-handler';
import { addIcons } from 'ionicons';
import { calendarOutline, locationOutline, ticketOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
  imports: [IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, RouterLink, IonButton, IonIcon, IonBadge],
})
export class EventDetailsPage implements OnInit {
  event: any = null;
  quantity = 1;
  loading = false;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiHandler = inject(ApiHandler);
  private toast = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    addIcons({ ticketOutline, locationOutline, calendarOutline, timeOutline});
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent(id);
  }

  loadEvent(id: number){
    this.apiHandler.oneEvent(id).subscribe({
      next: item => {
        this.event = item || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Event not found', 'danger');
        this.router.navigate(['/events']);
        this.cdr.detectChanges();

      }
    });
  }

  get totalAmount(): number {
    return Number(this.event?.price || 0) * Number(this.quantity || 0);
  }

  changeQuantity(amount: number){
    const maximum = Number(this.event?.availableTickets || 0);

    this.quantity = Math.min(maximum, Math.max(1, this.quantity + amount));
  }

  bookTicket() {
    const user = this.apiHandler.getUser();

    if(!user){
      this.router.navigate(['/login']);
      return;
    }

    if(!Number.isInteger(Number(this.quantity)) || this.quantity < 1){
      this.showToast('Enter a valid ticket quantity', 'warning');
    }

    if(this.quantity > this.event.availableTickets){
      this.showToast('Not enough available tickets', 'danger');
      return;
    }

    this.loading = true;

    this.apiHandler.addBooking({
      userID: user.userID,
      eventID: this.event.eventID,
      quantity: this.quantity
    }).subscribe({
      next: async (response: any) => {
        this.loading = false;

        await this.showToast(
          `Booking #${response.bookID} submitted successfully!`, 'success'
        );

        this.router.navigate([`/my-bookings`]);
      },
      error: err => {
        this.loading = false;

        this.showToast(
          err.error?.detail || 'Unable to book tickets', 'danger'
        );
      }
    });
  }

  async showToast(message: string, color: string){
    const toast = await this.toast.create({
      message, duration: 2500, color, position: 'top'
    });
    await toast.present();
  }
}
