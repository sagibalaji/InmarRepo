import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core'
import { MsAdalAngular6Service } from 'microsoft-adal-angular6'
import { environment } from "../environments/environment";
import { Router, NavigationEnd } from '@angular/router';
import { storeCurrentPath } from './helpers/local-redirect-url-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CheckIn';

  get isLoggedInNotAuthenticated(): boolean {
    return this.adalService.LoggedInUserName && !this.adalService.isAuthenticated
  }

  get isAdalIframeRefresh(): boolean {
    let thisWindow = self.window
    let parentWindow = thisWindow.parent
    let isRefresh = (thisWindow && parentWindow && thisWindow !== parentWindow)
    return isRefresh
  }

  constructor(
    private router: Router,
    private adalService: MsAdalAngular6Service) {
    // adalService.init(environment.config)
  }

  // Has the app been authenticated.
  get isAuthenticated(): boolean {
    return this.adalService.isAuthenticated
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    let isRefresh = this.isAdalIframeRefresh

    //this.adalService.handleWindowCallback()
    this.adalService.handleCallback()
    
    if (!this.isAuthenticated && !isRefresh) {
      storeCurrentPath();
      this.adalService.login()
    }
  }

  // Component is being destroyed.
  ngOnDestroy() {
    // clear the cache when we leave the app
    // not really sure if this should be done or not
    // this.adalService.clearCache()
  }

  // Perform a manual login into Azure AD.
  onLogin(): void {
    this.adalService.login()
  }


}
