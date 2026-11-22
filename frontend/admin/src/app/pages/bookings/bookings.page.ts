
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonSearchbar,
  IonBadge,
  IonIcon,
  AlertController,
  ToastController
} from '@ionic/angular';
import { ApiHandler } from '../../api-handler';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  checkmarkCircleOutline,
  checkmarkOutline,
  closeCircleOutline,
  closeOutline,
  eyeOutline,
  timeOutline,
  trashOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    CommonModule,
    FormsModule,
    IonSearchbar,
    IonIcon,
    IonBadge
  ]
})
export class BookingsPage implements OnInit {

  private apiHandler = inject(ApiHandler);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  bookings: any[] = [];
  filteredBookings: any[] = [];

  searchText = '';
  selectedStatus = 'All';
  loading = false;

  statuses = [
  'All',
  'Pending',
  'Confirmed',
  'Cancelled'
];

  selectedBooking: any = null;

  constructor() {
    addIcons({
      eyeOutline,
      checkmarkOutline,
      closeOutline,
      trashOutline,
      arrowBackOutline,
      timeOutline,
      checkmarkCircleOutline,
      closeCircleOutline
    });
  }

  ngOnInit(): void {
    if (!this.apiHandler.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadBookings();
  }

  ionViewWillEnter(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;

    this.apiHandler.allBookings().subscribe({
      next: (item: any[]) => {
        this.bookings = item;
        this.filterBookings();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error(error);
        this.loading = false;
        this.cdr.detectChanges();
        this.showToast('Unable to load customer bookings.');
      }
    });
  }

  onSearch(event: any): void {
    this.searchText = event.detail.value ?? '';
    this.filterBookings();
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.filterBookings();
  }

  filterBookings(): void {
    const search = this.searchText.toLowerCase().trim();

    this.filteredBookings = this.bookings.filter((booking: any) => {

      const matchesSearch =
        String(booking.bookID ?? '').includes(search) ||
        String(booking.name ?? '').toLowerCase().includes(search) ||
        String(booking.email ?? '').toLowerCase().includes(search) ||
        String(booking.eventName ?? '').toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        booking.bookStatus === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  get pendingCount(): number {
    return this.bookings.filter(
      b => b.bookStatus === 'Pending'
    ).length;
  }

  get confirmedCount(): number {
  return this.bookings.filter(
    b => b.bookStatus === 'Confirmed'
  ).length;
}

  get cancelledCount(): number {
    return this.bookings.filter(
      b => b.bookStatus === 'Cancelled'
    ).length;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending':
        return 'warning';

      case 'Confirmed':
        return 'success';

      case 'Cancelled':
        return 'danger';

      default:
        return 'medium';
    }
  }

  viewBooking(booking: any): void {
    this.apiHandler.oneBooking(booking.bookID).subscribe({
      next: (item: any) => {
        this.selectedBooking = item;
        this.showBookingDetails(item);
      },
      error: () => {
        this.showToast('Unable to load booking details.');
      }
    });
  }

  async showBookingDetails(booking: any): Promise<void> {
    const alert = await this.alertController.create({
      header: `Booking #${booking.bookID}`,
      message: `
        Customer: ${booking.name ?? 'N/A'}
        Email: ${booking.email ?? 'N/A'}
        Event: ${booking.eventName ?? 'N/A'}
        Quantity: ${booking.quantity ?? 0}
        Total: ₱${booking.totalAmount ?? 0}
        Status: ${booking.bookStatus ?? 'N/A'}
      `,
      buttons: ['Close']
    });

    await alert.present();
  }

  async changeStatus(booking: any, status: string): Promise<void> {
  const alert = await this.alertController.create({
    header: 'Update Booking Status',
    message: `Change booking #${booking.bookID} to ${status}?`,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Confirm',
        handler: () => {
          this.apiHandler.updateStatus(
            booking.bookID,
            status
          ).subscribe({
            next: () => {
              this.showToast('Booking status updated.');
              this.loadBookings();
            },
            error: (error: any) => {
              console.error('Update status error:', error);

              this.showToast(
                error?.error?.detail?.[0]?.msg ??
                error?.error?.detail ??
                'Unable to update booking status.'
              );
            }
          });
        }
      }
    ]
  });

  await alert.present();
}

  async deleteBooking(booking: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete Booking',
      message: `Delete booking #${booking.bookID}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.apiHandler.deleteBooking(booking.bookID).subscribe({
              next: () => {
                this.showToast('Booking deleted successfully.');
                this.loadBookings();
                this.cdr.detectChanges();

              },
              error: (error: any) => {
                this.showToast(
                  error?.error?.detail ??
                  'Unable to delete booking.'
                );
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  goDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.apiHandler.adminLogout();
    this.router.navigate(['/login']);
  }

  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2300,
      position: 'bottom'
    });

    await toast.present();
  }
}
