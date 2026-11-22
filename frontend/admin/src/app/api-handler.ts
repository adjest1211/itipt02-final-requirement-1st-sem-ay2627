import { HttpClient } from '@angular/common/http';
import {  inject, Service } from '@angular/core';
import type { Observable } from 'rxjs';

@Service()
export class ApiHandler {
    private api = 'http://127.0.0.1:8000';
    private http = inject(HttpClient);

    allEvents(): Observable<any>{
        return this.http.get(`${this.api}/events`);
    }

    oneEvent(id: number): Observable<any>{
        return this.http.get(`${this.api}/events/${id}`);
    }

    addEvent(event: any): Observable<any>{
        return this.http.post(`${this.api}/admin/event`, event);
    }

    editEvent(id: number, event: any): Observable<any>{
        return this.http.put(`${this.api}/admin/event/${id}`, event);
    }

    deleteEvent(id: number): Observable<any>{
        return this.http.delete(`${this.api}/admin/events/${id}`);
    }

    getDashboard(): Observable<any>{
        return this.http.get(`${this.api}/admin/dashboard`);
    }

    //booking service
    allBookings(): Observable<any>{
        return this.http.get(`${this.api}/admin/bookings`);
    }

    oneBooking(id: number): Observable<any>{
        return this.http.get(`${this.api}/admin/${id}`);
    }

    showUserBookings(userID: number): Observable<any>{
        return this.http.get(`${this.api}/customer/bookings/${userID}`);
    }

    addBooking(booking: any): Observable<any>{
        return this.http.get(`${this.api}/bookings`, booking);
    }

    editBooking(id: number, booking: any): Observable<any>{
        return this.http.put(`${this.api}/bookings/${id}`, booking);
    }

    updateStatus(
        id: number,
        bookStatus: string,
        quantity: number
    ): Observable<any>{
        return this.http.put(`${this.api}/admin/bookings/${id}/status`, {bookStatus, quantity});
    }


    deleteBooking(id: number): Observable<any>{
        return this.http.delete(`${this.api}/admin/bookings/${id}`);
    }

    //login
    adminLogin(item: any): Observable<any>{
        return this.http.post(`${this.api}/admin/login`, item);
    }

    logout(): void{
        localStorage.removeItem('admin');
    }

    saveAdmin(admin: any): void{
        localStorage.setItem('admin', JSON.stringify(admin));
    }

    getAdmin(): any {
        const admin = localStorage.getItem('admin');
        return admin ? JSON.parse(admin): null;
    }

    isLoggedIn(): boolean{
        return !!this.getAdmin();
    }

}
