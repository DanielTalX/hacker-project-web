import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppUserAuth } from '../security/app-user-auth';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../security/security.service';
import { MatDialog } from '@angular/material/dialog';
import { SampleDeleteDialog } from '../shared/sample-delete-dialog';
import { ClientUser } from './client-user';
import { ClientUserService } from './client-user.service';
import { AppUserClaim } from '../security/app-user-claim';
import { SampleAddDialog } from '../shared/sample-add-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-claims',
  templateUrl: './user-claims.component.html',
  styleUrls: ['./user-list.component.css'],
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
export class UserDetailsComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  displayedColumns: string[] = ['claimType', 'claimValue'];
  allDisplayedColumns: string[] = ['claimType', 'claimValue', 'user-actions'];

  securityObject: AppUserAuth;

  dataSource: MatTableDataSource<AppUserClaim> = new MatTableDataSource<AppUserClaim>();
  claims: AppUserClaim[] = [];
  clientUser: ClientUser | null = null;
  countItems = 0;

  constructor(private clientUserService: ClientUserService,
    private route: ActivatedRoute,
    private router: Router,
    private securityService: SecurityService,
    private dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private _snackBar: MatSnackBar
  ) {
    this.securityObject = securityService.securityObject;
    if (!!this.router.getCurrentNavigation()) {
      console.log("s = ", this.router.getCurrentNavigation()!!.extras.state);
      let state = this.router.getCurrentNavigation()!!.extras.state;
      if (!!state) {
        console.log("state = ", state);
        this.clientUser = (state) as ClientUser;
        console.log("clientUser = ", this.clientUser);
        this.dataSource.data = this.clientUser.claims;
        this.claims = this.clientUser.claims;
        this.countItems = this.clientUser.claims.length;
      }
    }
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  deleteUserClaim(userClaim: AppUserClaim): void {
    const dialogRef = this.dialog.open(SampleDeleteDialog, {
      width: '500px',
      data: { id: userClaim.claimId, title: "Delete this user claim?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        userClaim.userId = this.clientUser!!.id;
        this.clientUserService.deleteAppUserCliam(userClaim)
          .subscribe((resp) => {
            if(resp){
              this.claims = this.claims.filter(p => p.claimId != userClaim.claimId);
              this.updateTabbleUI();
              this.openSnackBar("user claim deleted", "ok", true);
            }
          },
          () => { // error
            this.openSnackBar("faild delete user claim", "ok", false);
          });
      }
    });
  }

  addUserClaim(): void {
    const dialogRef = this.dialog.open(SampleAddDialog, {
      width: '500px',
      data: { title: "Add New User Claim", value: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) {
        let userClaim = new AppUserClaim();
        userClaim.userId = this.clientUser!!.id;
        userClaim.claimType = result;
        userClaim.claimValue = "true";
        console.log('userClaim', userClaim);
        this.clientUserService.addAppUserCliam(userClaim)
          .subscribe((resp) => {
            this.claims.push(resp);
            this.updateTabbleUI();
            this.openSnackBar("user claim added", "ok", true);
          },
          () => { // error
            this.openSnackBar("failed add user claim", "ok", false);
          });
      }
    });
  }

  private updateTabbleUI() {
    this.dataSource.data = [];
    this.dataSource.data = this.claims;
    this.table.renderRows();
    this.countItems = this.dataSource.data.length;
    this.changeDetectorRefs.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openSnackBar(message: string, action: string, isSuccess?: boolean) {
    let color = isSuccess?('blue-snackbar'):('red-snackbar');
    let durationInSeconds = 3;
    this._snackBar.open(message, action, {
      duration: durationInSeconds*1000,
      panelClass: [color]
    });
  }

}
