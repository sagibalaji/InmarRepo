import { Component, AfterViewInit, OnDestroy, OnInit, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { setTheme } from 'ngx-bootstrap/utils';
import { DatePipe } from '@angular/common';
import { DashBoardService } from '../services/dash-board.service'
import { map, catchError } from 'rxjs/operators';
import { DashBoardView } from '../models/dashboard-view.model'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6'
import { Router } from '@angular/router';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { Pipe, PipeTransform } from '@angular/core';
import { TableFilterPipe } from './table-filter.pipe';
import { FieldStatus } from '../models/field-status.model'
import 'moment';
// import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };
export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: string;
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
  providers: [DashBoardService, DatePipe]
})

export class DashboardComponent implements AfterViewInit, OnInit, OnDestroy {

  public dashboardView: DashBoardView[];
  dbSortedView: DashBoardView[];

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  managers: string[];
  areas: string[];
  userName: string;
  manager: string;
  area: string;
  refreshSubscription: Subscription;
  sortablecolumn: string;
  sortabledirection: SortDirection;

  daylightDiffernt : string ;

  bsValue = this.datepipe.transform(new Date(), 'EEE MMM dd, yyyy HH:mm', this.isDSTObserved(new Date()));

  bsConfig = Object.assign({}, {
    dateInputFormat: 'ddd MMMM D, YYYY HH:mm'
  });

  constructor(
    private authService: MsAdalAngular6Service,
    private dashboardService: DashBoardService,
    public datepipe: DatePipe,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router

  ) {
    this.changeDate(null);
  }

  changeDate(event: Event) {
    if (this.authService.isAuthenticated) {


      if (!this.isToday()) {
        let bsDate = new Date(this.bsValue);
        bsDate.setHours(bsDate.getHours() + (24 - bsDate.getHours() - 1));
        bsDate.setMinutes(bsDate.getMinutes() + (60 - bsDate.getMinutes() - 1));
        this.bsValue = this.datepipe.transform(bsDate, 'EEE MMM dd, yyyy HH:mm');
      } else {
        this.bsValue = this.datepipe.transform(new Date(), 'EEE MMM dd, yyyy HH:mm', this.isDSTObserved(new Date()));
      }
      let bsDate = new Date(this.bsValue);
      bsDate.setHours(bsDate.getHours() + 7);
      bsDate.setMinutes(bsDate.getMinutes() + (60 - bsDate.getMinutes() - 1));
      bsDate.setSeconds(bsDate.getSeconds() + (60 - bsDate.getSeconds() - 1));
      let gmt_date = this.datepipe.transform(bsDate, 'MM-dd-yyyy HH:mm:ss');
      this.dashboardService.getDashboardData(gmt_date, this.userName).subscribe(result => {
        this.dashboardView = result;
        this.dbSortedView = result;
        this.managers = result.map(a => a.manager).filter((v, i, a) => a.indexOf(v) === i).sort();
        this.areas = result.map(a => a.area).filter((v, i, a) => a.indexOf(v) === i).sort();
        this.onSort({ column: this.sortablecolumn, direction: this.sortabledirection });
      }, (error) => {
        console.log('checkSupervisorAccount error: ', error)
      });
    } else {
      alert('Session Timedout - Redirecting to Home page')
      this.router.navigate(['']);

    }

  }

  clickEvent(email, manager, area, route, status) {
    if (this.authService.isAuthenticated) {
      this.confirmationDialogService.confirm('Change Status for ' + email + ' to: ' + status, 'Check ' + status)
        .then((comment) => this.changeStatus(comment, email, manager, area, route, status))
        .catch(() => console.log('user cancelled the operations'));
    } else {
      alert('Session Timedout - Redirecting to Home page')
      this.router.navigate(['']);

    }
  }

  changeStatus(comment, email, manager, area, route, status) {

    let fieldStatus = new FieldStatus()
    if (area) {
      fieldStatus.area = area;
    }
    if (route) {
      fieldStatus.route = route;
    }
    fieldStatus.changedBy = this.userName;
    fieldStatus.email = email;
    fieldStatus.comment = comment;
    if (manager) {
      fieldStatus.manager = manager;
    }
    fieldStatus.status = status;
    this.dashboardService.changeStatus(fieldStatus).subscribe(result => {
      this.changeDate(null);
    },
      (error) => {
        console.log('changeStatus error: ', error)
      });

  }


  ngAfterViewInit(): void {
    if (!this.isSupervisor) {
      alert('Redirecting to home page');
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.refreshSubscription = interval(300000)
      .subscribe((val) => {  });
  }

  ngOnDestroy(): void {
    this.refreshSubscription.unsubscribe();
  }

 
  get isSupervisor(): boolean {
    let account = this.authService.userInfo
    let resultType = false
    if (account) {
      this.userName = account.profile.name;
      if (account.profile.roles && account.profile.roles.length > 0) {
        if (account.profile.roles[0] == 'Dashboard.Read')
        resultType = true;
      }
    }
    return resultType
  }

 
  isToday(): boolean {
    return this.datepipe.transform(this.bsValue, 'yMMdd') === this.datepipe.transform(new Date(), 'yMMdd', this.isDSTObserved(new Date()));
  }

  
  isDSTObserved(d):string {
    d = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
    // if (moment.tz(d,'America/Chicago').isDST())
    //       return 'UTC-5'
    // else
    return 'UTC-6'
  }

 

  onSort({ column, direction }: SortEvent) {

    this.sortablecolumn = column;
    this.sortabledirection = direction;
    

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '') {
      this.dbSortedView = this.dashboardView;
    } else {
      this.dbSortedView = [...this.dashboardView].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }



}



