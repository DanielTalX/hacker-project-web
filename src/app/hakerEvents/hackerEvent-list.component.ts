import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HackerEvent } from './hackerEvent';
import { AppUserAuth } from '../security/app-user-auth';
import { HackerEventService } from './hackerEvent.service';
import { Router } from '@angular/router';
import { SecurityService } from '../security/security.service';
import { MatDialog } from '@angular/material/dialog';
import { SampleDeleteDialog } from '../shared/sample-delete-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-hackerEvent-list',
  templateUrl: './hackerEvent-list.component.html',
  styleUrls: ['./hackerEvent-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed, void',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class HackerEventListComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  // description: string;
  // group?: string;
  // votes: number;

  displayedColumns: string[] = ['title', 'subtitle', 'start', 'breachType'];
  allDisplayedColumns: string[] = ['title', 'subtitle', 'start', 'breachType', 'user-actions'];

  securityObject: AppUserAuth;

  dataSource: MatTableDataSource<HackerEvent> = new MatTableDataSource<HackerEvent>();
  hackerEvents: HackerEvent[] = [];
  expandedElement: HackerEvent | null = null;
  countItems = 0;

  rangeDate = {
    start: new Date(2007, 0, 1),
    end: new Date()
  }

  constructor(private hackerEventService: HackerEventService,
    private router: Router,
    private securityService: SecurityService,
    private dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private _snackBar: MatSnackBar
    ) {
    this.securityObject = securityService.securityObject;
  }

  ngOnInit() {
    this.getHackerEvents();
  }

  private getHackerEvents(): void {
    this.hackerEventService.getHackerEvents(this.rangeDate)
      .subscribe((items: any[]) => {
        this.dataSource.data = items;
        this.hackerEvents = items;
        this.countItems = items.length;
        this.dataSource.sort = this.sort;
      });
  }

  updateRangeStart(event: MatDatepickerInputEvent<Date>) {
    if (!!event.value && this.rangeDate.start.getTime() != event.value!.getTime()) {
      this.rangeDate.start = event.value;
      console.log('this.rangeDate.start = ', this.rangeDate.start);
      this.getHackerEvents();
    }
  }

  updateRangeEnd(event: MatDatepickerInputEvent<Date>) {
    if (!!event.value && this.rangeDate.end.getTime() != event.value!.getTime()) {
      this.rangeDate.end = event.value;
      console.log('this.rangeDate.end = ', this.rangeDate.end);
      this.getHackerEvents();
    }
  }

  addHackerEvent(): void {
    this.router.navigate(['/hackerEventDetail', 'addNew']);
  }


  deleteHackerEvent(id: string): void {
    const dialogRef = this.dialog.open(SampleDeleteDialog, {
      width: '500px',
      data: {id: id, title: "Delete this HackerEvent?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.hackerEventService.deleteHackerEvent(id)
          .subscribe((resp) => {
            if (resp) {
              this.hackerEvents = this.hackerEvents.filter(p => p.id != id);
              this.updateTabbleUI();
              this.openSnackBar("HackerEvent deleted", "ok", true);
            }else{
              this.openSnackBar("failed delete HackerEvent", "ok", false);
            }
          },
          () => { // error
            this.openSnackBar("failed delete HackerEvent", "ok", false);
          });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private updateTabbleUI() {
    this.dataSource.data = [];
    this.dataSource.data = this.hackerEvents;
    this.table.renderRows();
    this.countItems = this.dataSource.data.length;
    this.changeDetectorRefs.detectChanges();
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
