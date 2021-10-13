import { Component, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { fromEvent, Observable, Subscription } from 'rxjs';

import { AreaRouteService } from 'src/app/services/area-route.service';
import { FieldStatusService } from 'src/app/services/field-status.service';
import { BasinArea } from 'src/app/models/basin-area.model';
import { FieldStatus } from '../models/field-status.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AreaRouteService, FieldStatusService]
})
export class HomeComponent implements AfterViewInit, OnInit {

  name:string  = ""
  
  allRoutes: string[] = [];
  myForm: FormGroup;
  dropdownSettings: IDropdownSettings = {};
  selectedItems: Array<any> = [];
  userAreaString: string = "";
  userRouteString: string = "";
  allAreas: string[] = [];
  isAreaMessageVisible: boolean = false;
  isStatusFetchFailed: boolean = false;
  isStatusSaveFailed: boolean = false;
  isFetchingRoutes: boolean = false;
  isFetchingStatus: boolean = false;
  isCheckedIn: boolean = false;
  isSavingToDb: boolean = false;

  isOnline: boolean = true;

  userEmail: string = "";
  // The name of the logged in user.
  userName: string = "";

  inOutState = HomeComponent.checkedOutStateString

  private roamerDropdownItem: string = 'ROAMER';
  private lastAreaForRoutes: string = "";
  // The subscription for detecting offline events.
  private offlineSubscription: Subscription
  // The subscription for detecting online events.
  private onlineSubscription: Subscription
  // The status string to use for the checked in state.
  private static checkedInStateString = 'IN'
  // The status string to use for the check out state.
  private static checkedOutStateString = 'OUT'
  
  private isUpdatingFromDb: boolean = false
  

  get isLoggedIn(): boolean {
    return this.userEmail != undefined
  }

  private get isAreaSelected(): boolean {
    let isSelected = (this.userAreaString != undefined )
    return isSelected
  }

  // The separator to place between basins and areas.
  private basinAreaSeparator: string = ' - '

  constructor(private areaRouteService: AreaRouteService,
    private dataService: FieldStatusService,
    private authService: MsAdalAngular6Service,
    private fb: FormBuilder) { 
    this.myForm = fb.group({})
  }
  
  

  ngOnInit(): void {
    this.setupOnlineMonitor()
    this.getUserInfo()
    this.dropdownSettings = {
       singleSelection: false,
       itemsShowLimit: 3,
       limitSelection: 3    
     };
    this.myForm = this.fb.group({
      userRoutes: [this.selectedItems]
     });

  }

  onItemSelect(item: any) {
    this.clearMessages
  }

  onItemDeSelect(item: any) {
     this.clearMessages
  }

  handleReset() {
    this.myForm.get('userRoutes').setValue([]);
  }

  handleSelection() {
    this.myForm.get('userRoutes').setValue(this.selectedItems);
  }

  // Component is about to be destroyed.
  ngOnDestroy(): void {
    this.offlineSubscription.unsubscribe()
    this.onlineSubscription.unsubscribe()
  }

  ngAfterViewInit(): void {
    if (!this.isLoggedIn) {
      // this.login()
    }
    setTimeout(this.fetchBasinAreas.bind(this), 100)

    let fetchFieldStatusForUser = this.fetchFieldStatusForUser.bind(this)
    setTimeout(fetchFieldStatusForUser, 100)
  }

  // Set up the online/offline monitor.
  private setupOnlineMonitor(): void {
    // set initial state
    this.isOnline = navigator.onLine

    let onlineEvent = fromEvent(window, 'online')
    this.onlineSubscription = onlineEvent.subscribe(event => {
      console.log('====>>> Online', event)
      this.isOnline = true
    })

    let offlineEvent = fromEvent(window, 'offline')
    this.offlineSubscription = offlineEvent.subscribe(event => {
      console.log('====>>> Offline', event)
      this.isOnline = false
    })
  }

  // Get user information.
  private getUserInfo(): void {
    let account = this.authService.userInfo
    console.log("this.authService.userInfo", this.authService.userInfo)
    if (account) {
      this.userEmail = account.userName
      this.userName = account.profile.name
    } else {
      this.userEmail = undefined
      this.userName = undefined
    }
  }

  areaChanged(newValue: any): void {
    // new value, need to clear the existing route
    this.userRouteString = ""
    this.clearMessages()
    this.fetchRoutesIfNeeded()
    this.handleReset()
  }

  get isAreaDisabled(): boolean {
    let isDisabled = !this.isOnline || this.isCheckedIn
    return  isDisabled
  }

  get isRouteDisabled(): boolean {
    let isDisabled = !this.isAreaSelected || !this.isOnline || this.isCheckedIn
    return  isDisabled
  }

  get statusAreaClass(): string {
    return this.isCheckedIn ? 'status-label--in' : 'status-label--out'
  }


  private clearMessages(): void {
    this.isAreaMessageVisible = false
    this.isStatusFetchFailed = false
    this.isStatusSaveFailed = false
  }

  private fetchRoutesIfNeeded(): void {
    if (!this.isAreaSelected) {
      this.allRoutes = []
      this.lastAreaForRoutes = ""
    } else if (this.lastAreaForRoutes != this.userAreaString) {
      this.allRoutes = []
      this.fetchBasinAreaRoutes(this.userAreaString)
    }
  }

  private fetchBasinAreas(): void {
    this.areaRouteService.getBasinAreas().subscribe(basinAreas => {
      console.log('fetchBasinAreas success: ', basinAreas)
      this.setAreasFromBasinAreas(basinAreas)
    },
    (error) => {
      console.log('fetchBasinAreas error: ', error)
    })
  }

    // Set the areas list given a list of basins and areas.
  private setAreasFromBasinAreas(basinAreas: BasinArea[]): void {
    if (!basinAreas || basinAreas.length == 0) {
        return
    }
  
    let areas: string[] = basinAreas.map(basinArea => {
        return basinArea.basin + this.basinAreaSeparator + basinArea.area
      })
    let sortedAreas = areas.sort((a, b) => {
        return a.localeCompare(b)
      })
  
    this.allAreas = sortedAreas
  }


  // Set the routes given a list of routes.
  private setRoutes(routes: string[], area: string): void {
    if (!routes || routes.length == 0) {
      return
    }

    let sortedRoutes = routes.sort((a, b) => {
      return a.localeCompare(b)
    })
    sortedRoutes.unshift(this.roamerDropdownItem)
    this.allRoutes = sortedRoutes
    console.debug('this.allRoutes (SET)  ' + sortedRoutes);
    // save for next time
    this.lastAreaForRoutes = area
  }

  private fetchBasinAreaRoutes(area: string): void {
    if (area === undefined || area === null) {
      return
    }
    let parts = area.split(this.basinAreaSeparator)
    if (parts.length == 2) {
      let basinArea = new BasinArea()
      basinArea.basin = parts[0]
      basinArea.area = parts[1]

      this.isFetchingRoutes = true
      this.areaRouteService.getRoutesForBasinArea(basinArea).subscribe(routes => {
        console.log('fetchBasinAreaRoutes success')
        this.isFetchingRoutes = false
        this.setRoutes(routes, area)
      },
      (error) => {
        console.log('fetchBasinAreaRoutes error: ', error)
        this.isFetchingRoutes = false
      })
    }
  }


  private saveCheckinStatus(isCheckingIn: boolean): void {
    console.log('Save checkin status')
    if (!this.isLoggedIn) {
      return
    }
    
    this.isSavingToDb = true
    this.clearMessages()
    let fieldStatus = this.makeFieldStatus(isCheckingIn)
    this.dataService.add(fieldStatus).subscribe(result => {
      console.log('saveCheckinStatus success')
      this.isCheckedIn = isCheckingIn
      this.isSavingToDb = false
    },
    (error) => {
      console.log('saveCheckinStatus failed.', error)
      this.isSavingToDb = false
      this.isStatusSaveFailed = true
    })
  }

  // Make a FieldStatus object from our internal state.
  private makeFieldStatus(isCheckingIn: boolean): FieldStatus {
    console.log("UserEmail is:" + this.userEmail)
    if (!this.userEmail) {
      return undefined
    }

    let fieldStatus = new FieldStatus()
    if (this.isAreaSelected) {
      fieldStatus.area = this.userAreaString
    }

    if (this.myForm.get('userRoutes').value.length > 0){
      fieldStatus.route = this.myForm.get('userRoutes').value.toString(); 
    }

    console.log("userEmail: "+this.userEmail)
    fieldStatus.appNameVersion = 'FieldCheckinApp 0.0.1'
    fieldStatus.changedBy = 'FieldCheckinApp'
    let currentDate = new Date(Date.now())
    fieldStatus.createdAt = currentDate // .toUTCString() as any
    fieldStatus.email = this.userEmail
    //fieldStatus.comment = ''
    //fieldStatus.manager = ''
    fieldStatus.statusDate = currentDate //.toISOString()
    fieldStatus.status = isCheckingIn ? HomeComponent.checkedInStateString : HomeComponent.checkedOutStateString
    fieldStatus.version = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01]
  
    console.log("makefield status:" + fieldStatus)
    return fieldStatus
  }

  // Fetch the field status for the current user.
  private fetchFieldStatusForUser(): void {
    if (!this.userEmail) {
      return
    }

    this.isFetchingStatus = true
    this.clearMessages()
    this.dataService.getCurrentFieldStatusForEmail(this.userEmail).subscribe(fieldStatus => {
      console.log('fetchFieldStatusForUser success: ', fieldStatus)
      this.isFetchingStatus = false
      this.updateFromFieldStatus(fieldStatus)
    },
    (error) => {
      console.log('fetchFieldStatusForUser error: ', error)
      this.isFetchingStatus = false
      this.isStatusFetchFailed = true
    })
  }

    // Update the component from a field status.
  private updateFromFieldStatus(fieldStatus: FieldStatus): void {
    let isCheckedInNew: boolean
    if (!fieldStatus) {
      isCheckedInNew = false
    } else {
      isCheckedInNew = fieldStatus.status == HomeComponent.checkedInStateString ? true : false
    }

    if (isCheckedInNew != this.isCheckedIn) {
      this.isUpdatingFromDb = true
      this.isCheckedIn = isCheckedInNew
      this.inOutState = this.isCheckedIn ? HomeComponent.checkedInStateString : HomeComponent.checkedOutStateString
    }
    this.userAreaString = fieldStatus.area
    this.userRouteString = fieldStatus.route

    if (fieldStatus.route != undefined && fieldStatus.route != null) {
      this.selectedItems = fieldStatus.route.split(",");
      console.debug(' this.selectedItems  ' + this.selectedItems);  
      this.handleSelection();
    }
    // get the routes if necessary
    this.fetchRoutesIfNeeded()
  }

  // Check in button has been clicked.
  onCheckIn(): void {
    if (!this.isOnline) {
      return
    }

    if (this.isAreaSelected) {
      console.log(`onCheckIn ${this.isCheckedIn}`)
      this.saveCheckinStatus(true)
    } else {
      this.clearMessages()
      this.isAreaMessageVisible = true;
      this.isCheckedIn = false;
      setTimeout(function() {
        // need the timer or it doesn't get set properly
        this.inOutState = HomeComponent.checkedOutStateString
      }.bind(this), 100)
    }
  }

  // Check out button has been clicked.
  onCheckOut(): void {
    if (!this.isOnline) {
      return
    }

    console.log(`onCheckOut ${this.isCheckedIn}`)
    this.saveCheckinStatus(false)
  }

  get statusText(): string {
    return this.isCheckedIn ? 'IN' : 'OUT'
  }

  onLogout(): void {
    this.authService.logout()
  }

  // The login button has been clicked.
  onLogin(): void {
    this.login()
  }

  private login(): void {
    this.authService.login()
  }

}
