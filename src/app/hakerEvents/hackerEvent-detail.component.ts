import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { HackerEventService } from "./hackerEvent.service";
import { HackerEvent } from './hackerEvent';
import { AppUserAuth } from '../security/app-user-auth';
import { SecurityService } from '../security/security.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hackerEvent-list',
  templateUrl: './hackerEvent-detail.component.html',
  styleUrls: ['./hackerEvent-detail.component.css']
})
export class HackerEventDetailComponent implements OnInit {
  hackerEvent: HackerEvent;
  originalHackerEvent: HackerEvent;
  securityObject: AppUserAuth;
  showSpinner = false;

  constructor(private hackerEventService: HackerEventService,
    private route: ActivatedRoute,
    private location: Location,
    private securityService: SecurityService,
    private _snackBar: MatSnackBar) {
    this.securityObject = securityService.securityObject;
  }

  ngOnInit() {
    // Get the passed in product id
    let id = this.route.snapshot.paramMap.get('id');
    // Create or load a product
    this.createOrLoadHackerEvent(id);
  }

  private createOrLoadHackerEvent(id: string | null) {
    if (!id || id == "addNew") {
      // Create new product object
      this.initHackerEvent();
    }
    else {
      // Get a product from product service
      this.hackerEventService.getHackerEvent(id)
        .subscribe((hackerEvent: any) => {
          this.hackerEvent = hackerEvent;
          this.originalHackerEvent = Object.assign({}, this.hackerEvent)
        });
    }
  }

  private initHackerEvent(): void {
    // Add a new product
    this.hackerEvent = new HackerEvent({
      id: "",
      title: "",
      subtitle: "",
      description: "",
      start: new Date(),
      breachType: "",
      url: "",
    });
    this.originalHackerEvent = Object.assign({}, this.hackerEvent);
  }

  saveData(): void {
    // console.log("this.hackerEvent = ", this.hackerEvent);
    this.showSpinner = true;
    if (this.hackerEvent.id) {
      // Update hackerEvent
      this.hackerEventService.updateHackerEvent(this.hackerEvent)
        .subscribe(
          hackerEvent => {
            this.hackerEvent = hackerEvent;
            this.openSnackBar("HackerEvent updated", "ok", true);
            this.dataSaved();
          },
          () => {
            this.showSpinner = false;
            this.openSnackBar("failed update HackerEvent", "ok", false);
          }
        );
    }
    else {
      // Add a hackerEvent
      this.hackerEventService.addHackerEvent(this.hackerEvent)
        .subscribe(
          hackerEvent => { this.hackerEvent = hackerEvent },
          () => this.showSpinner = false,
          () => this.dataSaved());
    }
  }

  private dataSaved(): void {
    this.showSpinner = false;
    // Redirect back to list
    this.goBack();
  }

  goBack(): void {
    this.location.back();
  }

  cancel(): void {
    this.goBack();
  }

  private openSnackBar(message: string, action: string, isSuccess?: boolean) {
    let color = isSuccess ? ('blue-snackbar') : ('red-snackbar');
    let durationInSeconds = 3;
    this._snackBar.open(message, action, {
      duration: durationInSeconds * 1000,
      panelClass: [color]
    });
  }
}
