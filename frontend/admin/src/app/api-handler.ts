import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class ApiHandler {
    private api = 'http://127.0.0.1:8000';
    private http = inject(HttpClient);

    //loginFeature
    adminLogin(item: any): Observable<any>{
        return this.http.post(`${this.api}/admin/login`, item);
    }

    adminLogout(): void {
        localStorage.removeItem('admin');
    }

    saveAdmin(admin: any): void{
        localStorage.setItem('admin', JSON.stringify(admin));
    }

    currentAdmin(): any {
        const admin = localStorage.getItem('admin');
        return admin ? JSON.parse(admin) : null;
    }

    isLoggedIn(): boolean{
        return !!this.currentAdmin();
    }

    //myEvents
    allEvents(): Observable<any>{
        return this.http.get(`${this.api}/events`);
    }

    oneEvent(id: number): Observable<any>{
        return this.http.get(`${this.api}/events/${id}`);
    }

    addEvent(item: any): Observable<any>{
        return this.http.post(`${this.api}/admin/event`, item);
    }

    editEvent(id: number, item: any): Observable<any>{
        return this.http.put(`${this.api}/admin/event/${id}`, item);
    }

    deleteEvent(id: number): Observable<any>{
        return this.http.delete(`${this.api}/admin/events/${id}`);
    }

    getDashboard(): Observable<any>{
        return this.http.get(`${this.api}/admin/dashboard`);
    }

    
allBookings(): Observable<any> {
    return this.http.get(`${this.api}/admin/bookings`);
}

oneBooking(id: number): Observable<any> {
    return this.http.get(`${this.api}/admin/bookings/${id}`);
}

updateStatus(id: number, bookStatus: string): Observable<any> {
  return this.http.put(`${this.api}/admin/bookings/${id}/status`, {
    bookStatus
  });
}

deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.api}/admin/bookings/${id}`);
}
}
