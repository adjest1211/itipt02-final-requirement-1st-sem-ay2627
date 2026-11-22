import { Component, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonContent, IonHeader,  IonToolbar,
  IonButton, IonCard, IonCardContent, IonSearchbar, IonIcon,IonBadge,IonRefresher,
  IonRefresherContent 
 } from '@ionic/angular';
import { ApiHandler } from '../../api-handler';
import { addIcons } from 'ionicons';
import {arrowForwardOutline, calendarOutline, locationOutline, sparklesOutline, ticket, ticketOutline} from 'ionicons/icons';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  imports: [IonContent, IonHeader, IonToolbar, CommonModule, FormsModule,
    IonButton, IonCard, IonCardContent, IonSearchbar, IonIcon, IonBadge,IonRefresher,
  IonRefresherContent, RouterLink
  ],
})
export class EventsPage implements OnInit, OnDestroy {
  ngOnDestroy() {
  if (this.userSubscription) {
    this.userSubscription.unsubscribe();
  }
}
private userSubscription!: Subscription;
  private apiHandler = inject(ApiHandler);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  events: any[] = [];
  filteredEvents: any[] = [];
  searchText = '';
  selectedCategory = 'All';
  user: any = null;
  loading = true;

  categories = ['All', 'Upcoming', 'Ongoing', 'Ended', 'Cancelled'];

  constructor() {
    addIcons({ticket, sparklesOutline, arrowForwardOutline, ticketOutline, calendarOutline, locationOutline});
  }

  ngOnInit() {
  this.userSubscription = this.apiHandler.currentUser$.subscribe(user => {
    this.user = user;
    this.cdr.detectChanges();
  });

  this.loadEvents();
}

  IonViewWillEnter(){
    this.user = this.apiHandler.getUser();
     console.log('CURRENT USER:', this.user);
  console.log('LOGGED IN:', this.apiHandler.userLoggedIn());
    this.loadEvents();
  }

  loadEvents(){
    this.loading = true;

    this.apiHandler.allEvents().subscribe({
      next:(item: any) => {
        this.events = item || [];
        this.filterEvents();
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

  filterEvents() {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = event.eventName.toLowerCase().includes(
        this.searchText.toLowerCase()
      ) || 
      event.venue.toLowerCase().includes(
        this.searchText.toLowerCase()
      );

      const matchesCategory = this.selectedCategory === 'All' ||
      event.currentStatus === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }


  onSearch( value: any){
    this.searchText = value.detail.value || '';
    this.filterEvents();
  }

  selectCategory(category: string){
    this.selectedCategory = category;
    this.filterEvents();
  }

  openEvent(id: number){
    this.router.navigate(['/event-details', id]);
  }

  logout(){
    this.apiHandler.userLogout();
    this.user = null;
    this.router.navigate(['/events']);
  }

  handleRefresh(event: any){
    this.apiHandler.allEvents().subscribe({
      next: (item: any) => {
        this.events = item;
        this.filterEvents();
        event.target.complete();
      },
      error: () => event.target.complete()
    });
  }
}