import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgMultiSelectDropDownModule } from  'ng-multiselect-dropdown';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MsAdalAngular6Service, AuthenticationGuard, MsAdalAngular6Module} from 'microsoft-adal-angular6';


import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { AadCallbackComponent } from './aad-callback/aad-callback.component';
import { DashboardComponent, NgbdSortableHeader } from './dash-board/dash-board.component'
import { TableFilterPipe } from './dash-board/table-filter.pipe';

export const protectedResourceMap: [string, string[]][] = [
  ['https://graph.microsoft.com/v1.0/me', ['user.read']]
]

export function getAdalConfig() {
  return {
      tenant: 'encana.onmicrosoft.com',
      clientId: '0d1772b4-a73f-404a-845b-4ba0e358ce33',
      redirectUri: window.location.origin,
      endpoints: { 
        'https://graph.microsoft.com': '00000003-0000-0000-c000-000000000000',
        webApiUri: "/api/",
      },
      navigateToLoginRequestUrl: false,
      cacheLocation: 'localStorage',
    };
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    DashboardComponent,
    NgbdSortableHeader,
    TableFilterPipe,
    AadCallbackComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    DxLoadIndicatorModule,
    NgbModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'aad-callback', component: AadCallbackComponent },
      { path: 'dash-board', component: DashboardComponent },
    ]),
    MsAdalAngular6Module.forRoot(getAdalConfig)
  ],
  providers: [
    MsAdalAngular6Service,
    ConfirmationDialogService,
    AuthenticationGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
