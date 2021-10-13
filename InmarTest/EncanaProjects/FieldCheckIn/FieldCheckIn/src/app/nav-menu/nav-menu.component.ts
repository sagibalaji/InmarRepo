import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { PersonDataService } from '../services/person-data.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements AfterViewInit, OnInit {
  isExpanded = false;

  userEmail: string;
  // The name of the logged in user.
  userName: string;
  isSupervisorUser: boolean = false;

  get isLoggedIn(): boolean {
    return this.userEmail != undefined
  }

  constructor(private authService: MsAdalAngular6Service) {

  }
  ngOnInit(): void {
    this.getUserInfo();
  }

  ngAfterViewInit(): void {
    if (!this.isLoggedIn) {
      this.login()
    }
  }

  private getUserInfo(): void {
    let account = this.authService.userInfo
    if (account) {
      this.userEmail = account.userName
      this.userName = account.profile.name
      if (account.profile.roles && account.profile.roles.length>0) {
        if (account.profile.roles[0] == 'Dashboard.Read')
           this.isSupervisorUser = true;

      }
    } else {
      this.userEmail = undefined
      this.userName = undefined
    }

  }

  // The logout button has been clicked.
  onLogout(): void {
    this.authService.logout()
  }

  // The login button has been clicked.
  onLogin(): void {
    this.login()
  }

  // Log the user in.
  private login(): void {
    this.authService.login()
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
