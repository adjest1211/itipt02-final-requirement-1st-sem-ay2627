import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/events/events.page').then((m) => m.EventsPage),
  },
  {
    path: 'event-form',
    loadComponent: () => import('./pages/event-form/event-form.page').then((m) => m.EventFormPage),
  },
  {
    path: 'event-form/:id',
    loadComponent: () => import('./pages/event-form/event-form.page').then((m) => m.EventFormPage),
  },
  {
    path: 'bookings',
    loadComponent: () => import('./pages/bookings/bookings.page').then((m) => m.BookingsPage),
  },
  
  {
    path: '**',
    redirectTo: 'login'
  }
];
