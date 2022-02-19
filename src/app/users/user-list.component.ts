import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppUserAuth } from '../security/app-user-auth';
import { Router } from '@angular/router';
import { SecurityService } from '../security/security.service';
import { MatDialog } from '@angular/material/dialog';
import { SampleDeleteDialog } from '../shared/sample-delete-dialog';
import { ClientUser } from './client-user';
import { ClientUserService } from './client-user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SampleAddDialog } from '../shared/sample-add-dialog';
import { SampleSelectDialog } from '../shared/sample-select-dialog';
import { RoleTypes } from '../security/ClaimsTypes';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
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
export class UserListComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;


  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role'];
  allDisplayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'user-actions'];

  securityObject: AppUserAuth;

  dataSource: MatTableDataSource<ClientUser> = new MatTableDataSource<ClientUser>();
  users: ClientUser[] = [];
  expandedElement: ClientUser | null = null;
  countItems = 0;

  constructor(private clientUserService: ClientUserService,
    private router: Router,
    private securityService: SecurityService,
    private dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private _snackBar: MatSnackBar
  ) {
    this.securityObject = securityService.securityObject;
  }

  ngOnInit() {
    this.getUsers();
  }

  private getUsers(): void {
    this.clientUserService.getUsers()
      .subscribe((users: any[]) => {
        console.log("users = ", users);
        this.dataSource.data = users;
        this.users = users;
        this.countItems = users.length;
        this.dataSource.sort = this.sort;
      });
  }

  deleteUser(userId: string): void {
    console.log('deleteUser - userId = ', userId);
    const dialogRef = this.dialog.open(SampleDeleteDialog, {
      width: '500px',
      data: { id: userId, title: "Delete this user?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.clientUserService.deleteUser(userId)
          .subscribe((resp) => {
            if (resp) {
              this.users = this.users.filter(p => p.id != userId);
              this.updateTabbleUI();
              this.openSnackBar("user deleted", "ok", true);
            } else {
              this.openSnackBar("failed delete user", "ok", false);
            }
          },
            () => { // error
              this.openSnackBar("failed delete user", "ok", false);
            });
      }
    });
  }

  // editUser(clientUser: ClientUser) {
  //   this.router.navigateByUrl('/user-details', { state: clientUser });
  // }

  editUserRole(clientUser: ClientUser): void {
    console.log('editUserRole - userId = ', clientUser.id);
    const dialogRef = this.dialog.open(SampleSelectDialog, {
      width: '500px',
      data: { id: clientUser.id,
        title: "Change user role?",
        labels: [RoleTypes.User, RoleTypes.Supervisor, RoleTypes.Admin],
        values: [RoleTypes.User, RoleTypes.Supervisor, RoleTypes.Admin],
        value: clientUser.role }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) {
        const orginalRole = clientUser.role;
        clientUser.role = result;
        console.log('clientUser', clientUser);
        this.clientUserService.updateUserRole(clientUser)
          .subscribe((resp) => {
            this.updateTabbleUI();
            this.openSnackBar("user role updated", "ok", true);
          },
            () => { // error
              this.openSnackBar("failed update user role", "ok", false);
              clientUser.role = orginalRole;
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
    this.dataSource.data = this.users;
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
