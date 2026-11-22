import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,Observable, tap } from 'rxjs';

@Service()
export class ApiHandler {
    currentUser$ = new BehaviorSubject<any>(this.getUser());
    private api = 'http://127.0.0.1:8000';
    private http = inject(HttpClient);

    // LOGIN AND REGISTER
    userRegister(item: any): Observable<any> {
        return this.http.post<any>(`${this.api}/register`, item);
    }

    userLogin(item: any): Observable<any> {
        return this.http.post<any>(`${this.api}/login`, item).pipe(
            tap(response => {
                sessionStorage.setItem('currentUser', JSON.stringify(response.user));
                this.currentUser$.next(response.user);
            })
        );
    }

    getUser(): any {
        const item = sessionStorage.getItem('currentUser');
        return item ? JSON.parse(item) : null;
    }

    userLoggedIn(): boolean {
        return this.getUser() !== null;
    }

    userLogout(): void {
        sessionStorage.removeItem('currentUser');
        this.currentUser$.next(null);
    }

    // EVENTS
    allEvents(): Observable<any> {
        return this.http.get<any>(`${this.api}/events`);
    }

    oneEvent(id: number): Observable<any> {
        return this.http.get<any>(`${this.api}/events/${id}`);
    }

    // BOOKINGS
    addBooking(item: any): Observable<any> {
        return this.http.post(`${this.api}/bookings`, item);
    }

    myBooking(userID: number): Observable<any> {
        return this.http.get(`${this.api}/bookings/${userID}`);
    }

    editBooking(bookID: number, item: any): Observable<any> {
        return this.http.put(`${this.api}/bookings/${bookID}`, item);
    }
}