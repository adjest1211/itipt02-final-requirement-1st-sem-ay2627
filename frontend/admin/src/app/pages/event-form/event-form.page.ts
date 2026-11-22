import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButtons, IonIcon, ToastController} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ApiHandler } from '../../api-handler';
import { ActivatedRoute, Router } from '@angular/router';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.page.html',
  styleUrls: ['./event-form.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonTextarea, IonSelect, IonSelectOption, IonButtons, IonIcon],
})
export class EventFormPage implements OnInit {
  private apiHandler = inject(ApiHandler);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  eventID: number | null = null;
  loading = false;

  event: any = {
    eventName: '',
    description: '',
    venue: '',
    eventImage: '',
    startTime: '',
    endTime: '',
    price: 0,
    totalTickets: 1,
    availableTickets: 1,
    currentStatus: 'Upcoming'
  };


  constructor() {
    addIcons({arrowBackOutline});
  }

  ngOnInit(): void {
    if(!this.apiHandler.isLoggedIn()){
      this.router.navigate(['/login']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');

    if(id){
      this.eventID = Number(id);
      this.loadEvent(this.eventID);
    }
  }

  loadEvent(id: number): void {
    this.loading = true;

    this.apiHandler.oneEvent(id).subscribe({
      next: (item: any) => {
        this.event = {
          ...item,
          startTime: this.toLocalDateTime(item.startTime),
          endTime: this.toLocalDateTime(item.endTime)
        };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: async(error: any) => {
        this.loading = false;
        await this.showToast(
          error?.error?.detail ?? 'Unable to load event.'
        );
      }
    });
  }

  async saveEvent(): Promise<void>{
    if(
      !this.event.eventName.trim() ||
      !this.event.venue.trim() ||
      !this.event.startTime ||
      !this.event.endTime
    ){
      await this.showToast('Please complete all required fields.');
      return;
    }

    const start = new Date(this.event.startTime);
    const end = new Date(this.event.endTime);

    if(
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      await this.showToast('Please enter valid event dates and times.');
      return;
    }

    if(
      Number(this.event.price) < 0 ||
      Number(this.event.totalTickets) < 1
    ) {
      await this.showToast('Please enter a valid price and ticket quantity.');
      return;
    }

    const payload = {
      eventName: this.event.eventName.trim(),
      description: this.event.description || '',
      venue: this.event.venue.trim(),
      eventImage: this.event.eventImage || '',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      price: Number(this.event.price),
      totalTickets: Number(this.event.totalTickets),
      availableTickets: Number(this.event.availableTickets),
      currentStatus: this.event.currentStatus || 'Upcoming'
    };

    this.loading = true;

    const request = this.eventID ? this.apiHandler.editEvent(this.eventID, payload) : this.apiHandler.addEvent(payload);

    request.subscribe({
      next: async () => {
        this.loading = false;

        await this.showToast(
          this.eventID ? 'Event updated successfully.'
          : 'Event created successfully.'
        );
        this.cdr.detectChanges();
        await this.router.navigate(['/events']);
      },
      error: async (error: any) => {
        this.loading = false;
        await this.showToast(
          error?.error?.detail ?? 'Unable to save event.'
        );
      }
    });
  }

  private toLocalDateTime(value: string): string{
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - offset).toISOString().slice(0, 16); 
  }

  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message, duration: 2500, position: 'bottom'
    });
    await toast.present();
  }

  cancel(): void{
    this.router.navigate(['/events']);
  }
}
