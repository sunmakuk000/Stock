import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SWAlertService {

  constructor() { }

  BoxMsg = {
    Title_Confirm: 'การยืนยัน',
    Title_Warning: 'คำเตือน',
    Title_Success: 'สำเร็จ',
    Title_Error: 'Error, Checking Alert',
    Title_info: 'Information',
    Title_Hint: 'Hint',
    Title_Delete: 'ลบข้อมูลเรียบร้อยแล้ว',
    Title_Session: 'เซสชันหมดอายุ',

    Dec_want_save: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่?',
    Dec_want_Delete: 'คุณต้องการลบข้อมูลนี้จริงๆใช่หรือไม่?',
    Dec_Save_Success: 'บันทึกข้อมูลสำเร็จแล้ว',
    Dec_Data_Dup: 'ข้อมูลซ้ำ'
  };

  SwAlert = {
    info: function (sTitle: any, message: any, fnOK: any) {
      Swal.fire({
        title: sTitle == undefined ? 'Success' : sTitle + '',
        html: message,
        icon: 'info',
        confirmButtonText: '<em class="fas fa-check"></em> close',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.value) {
          if (fnOK != undefined) {
            fnOK();
          }
          else {
            Swal.close();
          }
        }
      });
    },
    Success: function (sTitle, sMessage, fnOK) {
      Swal.fire({
        title: sTitle == undefined ? 'Success' : sTitle + '',
        html: sMessage,
        icon: 'success',
        confirmButtonText: '<em class="fas fa-check"></em> Close',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(function (result) {
        if (result.value) {
          if (fnOK != undefined) {
            fnOK();
          }
          else {
            Swal.close();
          }
        }
      });
    },
    Error: function (sTitle, sMessage, fnOK) {
      Swal.fire({
        icon: 'error',
        title: sTitle == undefined ? 'Success' : sTitle + '',
        html: sMessage,
        confirmButtonText: '<em class="fas fa-check"></em> Close',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(function (result) {
        if (result.value) {
          if (fnOK) {
            fnOK();
          }
          else {
            Swal.close();
          }
        }
      });
    },
    Warning: function (sTitle, sMessage, fnOK) {
      Swal.fire({
        icon: 'warning',

        title: sTitle == undefined ? 'Success' : sTitle + '',
        html: sMessage,
        confirmButtonText: '<em class="fas fa-check"></em> Close',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(function (result) {
        if (result.value) {
          if (fnOK) {
            fnOK();
          }
          else {
            Swal.close();
          }
        }
      });
    },
    Confirm: function (sTitle, sMessage, fnYes, fnNo) {
      Swal.fire({
        title: sTitle,
        text: sMessage,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '<em class="fas fa-check"></em> Yes',
        cancelButtonText: '<em class="fas fa-times"></em> No',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        timerProgressBar: true,
        preConfirm: function () {
          return new Promise(function (resolve, reject) {
            Swal.disableButtons();
            if (fnYes != undefined) {
              fnYes();
            }
            Swal.close();
          });
        },
      }).then(function (d) {
        if (d.dismiss === Swal.DismissReason.cancel) {
          if (fnNo != undefined) {
            fnNo();
          }
          Swal.close();
        }
      });
    },
    ConfirmSession: function (sTitle, sMessage, fnYes, fnNo) {
      Swal.fire({
        title: sTitle,
        html: sMessage,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '<em class="fas fa-check"></em> Yes',
        cancelButtonText: '<em class="fas fa-times"></em> No',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        timerProgressBar: true,
        preConfirm: function () {
          return new Promise(function (resolve, reject) {
            Swal.disableButtons();
            if (fnYes != undefined) {
              fnYes();
            }
            Swal.close();
          });
        },
      }).then(function (d) {
        if (d.dismiss === Swal.DismissReason.cancel) {
          if (fnNo != undefined) {
            fnNo();
          }
          Swal.close();
        }
      });
    },
    DisableButton: Swal.disableButtons,
    Close: Swal.close
  }
}
