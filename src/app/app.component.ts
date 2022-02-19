import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUserAuth } from './security/app-user-auth';
import { SecurityService } from './security/security.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hacker-project';
  securityObject: AppUserAuth;

  constructor(private securityService: SecurityService,
    private router: Router) {
    this.securityObject = securityService.securityObject;
  }

  ngOnInit(): void {
    this.securityService.check().toPromise().then(() => {
      console.log("AppComponent - ngOnInit");
    });
  }

  logout(): void {
    this.securityService.logout().subscribe(
      (resp: any) => {
        console.log("logout2");
        this.router.navigateByUrl('/dashboard');
      },
      () => { //error
        console.log("logout3");
        this.router.navigateByUrl('/dashboard');
      }
    );
  }

}
