import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';

import { AuthenticationService } from '../services/authentication.service';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent implements OnInit {
  @Input('trip') trip: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private tripDataService: TripDataService
  ) {}

  public editTrip(trip: Trip): void {
    localStorage.setItem('tripCode', trip.code);
      this.router.navigate(['edit-trip']);
    }

  public isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  ngOnInit(): void {
  }

  public deleteTrip(trip: Trip): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${trip.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.tripDataService.deleteTrip(trip.code).subscribe({
      next: () => {
        window.alert(`"${trip.name}" was deleted successfully.`);
          window.location.reload();
      },
      error: (error) => {
        console.error('Error deleting trip:', error);
          window.alert('The trip could not be deleted. Please try again.');
      }
    });
  }
}