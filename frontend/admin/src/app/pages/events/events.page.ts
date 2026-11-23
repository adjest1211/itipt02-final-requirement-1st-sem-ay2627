import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader,  IonToolbar, IonButton, IonIcon, IonSearchbar, IonBadge, AlertController, ToastController } from '@ionic/angular';
import { ApiHandler } from '../../api-handler';
import { addIcons } from 'ionicons';
import {  Router } from '@angular/router';
import { addOutline, arrowBackOutline, calendarOutline, createOutline, locationOutline, logOutOutline, ticket, ticketOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  imports: [ IonContent, IonHeader,  IonToolbar, CommonModule, FormsModule,IonButton, IonIcon, IonSearchbar, IonBadge],
})
export class EventsPage implements OnInit {
  private apiHandler = inject(ApiHandler);
  private router = inject(Router);
  private alertController = inject (AlertController);
  private toastcontroller = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  events: any[] = [];
  filteredEvents: any[] = [];

  searchText = '';
  selectedStatus = 'All';
  loading = false;

  statuses = [
    'All',
    'Upcoming',
    'Ongoing',
    'Ended',
    'Cancelled'
  ];


  constructor() {
    addIcons({trashOutline ,ticketOutline, createOutline, ticket, locationOutline, logOutOutline, addOutline, calendarOutline, arrowBackOutline});
  }

  ngOnInit(): void {
    if(!this.apiHandler.isLoggedIn()){
      this.router.navigate(['/login']);
      return;
    }

    this.loadEvents();
  }

  ionViewWillEnter(): void{
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;

    this.apiHandler.allEvents().subscribe({
      next: (item: any[]) => {
        this.events = item;
        this.filterEvents();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error(error);
        this.loading = false;
        this.showToast('Unable to load events.');
      }
    });
  }

  onSearch(event: any): void{
    this.searchText = event.detail.value ?? '';
    this.filterEvents();
  }

  selectStatus(status: string): void{
    this.selectedStatus = status;
    this.filterEvents();
  }

  filterEvents(): void {
    const search = this.searchText.toLowerCase().trim();

    this.filteredEvents = this.events.filter((event: any) => {
      const matchesSearch = 
      String(event.eventName ?? '').toLowerCase().includes(search) ||
      String(event.venue ?? '').toLowerCase().includes(search);

      const matchesStatus =
      this.selectedStatus === 'All' ||
      event.currentStatus === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  addEvent(): void {
    this.router.navigate(['/event-form']);
  }

  editEvent(event: any): void {
    this.router.navigate(['/event-form', event.eventID]);
  }

  async deleteEvent(event: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete Event',
      message: `Are you sure you want to delete ${event.eventName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () =>  {
            this.apiHandler.deleteEvent(event.eventID).subscribe({
              next: () => {
                this.showToast('Event deleted successfully.');
                this.loadEvents();
              },
              error: (error: any) => {
                this.showToast(
                  error?.error?.detail ?? 'Unable to delete event.'
                );
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  getStatusColor(status: string): string{
    switch(status){
      case 'Upcoming':
        return 'tertiary';
      case 'Ongoing':
        return 'success';
      case 'Ended':
        return 'medium';
      case 'Cancelled':
        return 'danger';
      default:
        return 'medium';
    }
  }

  async showToast(message: string): Promise<void>{
    const toast = await this.toastcontroller.create({
      message,
      duration: 2200,
      position: 'bottom'
    });

    await toast.present();
  }

  goDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.apiHandler.adminLogout();
    this.router.navigate(['/login']);
  }


}
