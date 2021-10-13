import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { getStoredPath, clearStoredPath } from '../helpers/local-redirect-url-storage';

@Component({
  selector: 'app-aad-callback',
  template: '<div></div>',
  styles: ['']
})
export class AadCallbackComponent implements OnInit {

  constructor(
    private router: Router,
    private adalService: MsAdalAngular6Service) {
  }

  ngOnInit(): void {

    
    // if the user is not authenciated then navigate to the root to force a login
    if (!this.adalService.isAuthenticated) {
      console.log("Redirrecting to Root of App");
      this.router.navigate(['/']);
    }

    let localUrl = getStoredPath();
    console.log("Redirrect to: " + localUrl);
    clearStoredPath();
    this.router.navigateByUrl(localUrl);
  }


}
