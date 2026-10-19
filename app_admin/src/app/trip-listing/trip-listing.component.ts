import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';
import { TripCardComponent } from '../trip-card/trip-card.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrl: './trip-listing.component.css',
  providers: [TripDataService]
})
export class TripListingComponent implements OnInit {
  trips: Trip[] = [];
  allTrips: Trip[] = [];
  message: string = '';
  searchTerm: string = '';

  constructor(
    private tripDataService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    console.log('trip-listing constructor');
  }

  private getStuff(): void {
    this.tripDataService.getTrips()
      .subscribe({
        next: (value: Trip[]) => {
          this.allTrips = value;
          this.trips = value;

          if (value.length > 0) {
            this.message = 'There are ' + value.length + ' trips available.';
          } else {
            this.message = 'There were no trips retrieved from the database';
          }

          console.log(this.message);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }

  public searchTrips(term: string): void {
    this.searchTerm = term.trim().toLowerCase();

    if (!this.searchTerm) {
      this.trips = this.allTrips;
      return;
    }

    this.trips = this.allTrips.filter((trip: Trip) => {
      return (
        trip.name.toLowerCase().includes(this.searchTerm) ||
        trip.code.toLowerCase().includes(this.searchTerm) ||
        trip.resort.toLowerCase().includes(this.searchTerm)
      );
    });
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  public isLoggedIn() {
  return this.authenticationService.isLoggedIn();
}

  ngOnInit(): void {
    console.log('ngOnInit');
    this.getStuff();
  }
}