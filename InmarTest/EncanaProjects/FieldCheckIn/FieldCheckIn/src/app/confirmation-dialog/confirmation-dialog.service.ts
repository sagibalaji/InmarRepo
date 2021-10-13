import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable()
export class ConfirmationDialogService {


  constructor(private modalService: NgbModal) {
  }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = message,
    btnCancelText: string = 'Close',
    dialogSize: 'sm' | 'lg' | 'xl' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.test = 'test';
    return modalRef.result
   }

}
