import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonSpinner} from '@ionic/angular';
import { ApiHandler } from '../../api-handler';
import { addIcons } from 'ionicons';
import { Router, RouterLink } from '@angular/router';
import { calendarOutline, cashOutline, logOutOutline, peopleOutline, ticket, ticketOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  
  imports: [RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonIcon, IonCard, IonCardContent,  IonSpinner],
})
export class DashboardPage implements OnInit {
  private apiHandler = inject(ApiHandler);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  loading = false;

  summary: any = {
    totalEvents: 0,
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0
  };

  recentEvents: any[] = [];

  constructor() {
    addIcons({timeOutline,cashOutline, ticket, logOutOutline, calendarOutline, peopleOutline, ticketOutline});
  }

  ngOnInit() {
    if (!this.apiHandler.isLoggedIn()){
      this.router.navigate(['/login']);
      return;
    }

    this.loadDashboard();
    this.cdr.detectChanges();
  }

  ionViewWillEnter(): void{
    if (!this.apiHandler.isLoggedIn()){
      this.router.navigate(['/login']);
      return;
    }

    this.loadDashboard();
    this.cdr.detectChanges();
  }

  loadDashboard(): void {
    this.loading = true;

    this.apiHandler.getDashboard().subscribe({
      next: (item: any) => {
        this.summary = {
          ...this.summary,
          ...item
        };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) =>{
        console.error('Dashoard error:', error);
        this.loading = false;
      }
    });

    this.apiHandler.allEvents().subscribe({
      next: (item: any[]) => {
        this.recentEvents = item.slice(0, 5);
      },
      error: (error: any) => {
        console.error('Events error:', error);
      }
    });
  }

  logout(): void {
    this.apiHandler.adminLogout();
    this.router.navigate(['/login']);
  }
}
