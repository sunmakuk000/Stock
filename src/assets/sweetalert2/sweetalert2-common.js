/// <reference path="../jquery.js" />
/// <reference path="sweetalert2.min.js" />

var BoxMsg = {
  Title_Confirm: 'Confirmation',
  Title_Warning: 'Warning',
  Title_Success: 'Action Completed',
  Title_Error: 'Some thing went wrong',
  Title_info: 'Information',
  Title_Hint: 'Hint',
  Title_Delete: 'Data is deleted.',

  ConfirmSaveDraft: 'Do you want to save draft data?',

  Desc_SaveComplete: "Data is already saved.",

  Desc_Confirm_Delete: 'Do you want to delete data?',
  Desc_Success_Delete: 'Data is already deleted.',
  Desc_Warning_Delete: 'Please select <i class="far fa-check-square"></i> data to delete.',

  Desc_Confirm_Cancel: 'Do you want to cancel data?',
  Desc_Confirm_Back: 'Do you want to leave this page ?',

  Desc_Confirm_Save: 'Do you want to save data?',
  Desc_Confirm_Submit: 'Do you want to submit data?',
  Desc_Warning_Save: 'Please fill in required fields.',
  Desc_Success_Save: 'Data is already saved.',


  Desc_Error: 'Some thing went wrong.',

  Desc_Warning_Duplicate: 'Data is Duplicate',
  Desc_Confirm_Logout: 'Are you sure you want to logout?',

};

function SwAlert_Title(sTitle) {
  return '' + sTitle + '';
}

var SwAlert = {
  Common: function (sTitle, sMessage, fnOK) {
    Swal({
      title: SwAlert_Title(sTitle == undefined ? '' : sTitle + ''),
      html: sMessage,
      confirmButtonText: 'Close',
      allowOutsideClick: false,
      allowEscapeKey: false
    }, fnOK);
  },
  Info: function (sTitle, sMessage, fnOK) {
    Swal({
      title: SwAlert_Title(sTitle == undefined ? 'Success' : sTitle + ''),
      html: sMessage,
      type: 'info',
      confirmButtonText: 'Close',
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
  Success: function (sTitle, sMessage, fnOK) {
    Swal({
      title: SwAlert_Title(sTitle == undefined ? 'Success' : sTitle + ''),
      html: sMessage,
      type: 'success',
      confirmButtonText: 'Close',
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
    Swal({
      type: 'error',
      title: SwAlert_Title(sTitle == undefined ? 'Error' : sTitle + ''),
      html: sMessage,
      confirmButtonText: 'Close',
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
    Swal({
      type: 'warning',
      title: SwAlert_Title(sTitle == undefined ? 'Error' : sTitle + ''),
      html: sMessage,
      confirmButtonText: 'Close',
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
    Swal({
      title: sTitle,
      text: sMessage,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      preConfirm: function () {
        return new Promise(function (resolve, reject) {
          Swal.disableButtons();

          if (fnYes != undefined) {
            fnYes();
          }
          else {
            Swal.close();
          }
        });
      },
    }).then(function (d) {
      if (d.dismiss == "cancel") {
        if (fnNo != undefined) {
          fnNo();
        } else {
          Swal.close();
        }
      }
    });
  },
  ConfirmYN: function (sTitle, sMessage, fnYes, fnNo) {
    Swal({
      title: SwAlert_Title(sTitle == undefined ? 'Confirmation' : sTitle + ''),
      html: sMessage,
      type: 'warning',
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor: '#5cb85c', //"#2098D1",
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      closeOnCancel: false
    },
      function (isConfirmed) {
        if (isConfirmed) {
          if (fnYes != undefined) fnYes();
          else Swal.close();
        }
        else {
          if (fnNo != undefined) fnNo();
          else Swal.close();
        }
      });
  },
  Input: function (sTitle, sMessage, sPlaceHolder, sWarnMsg, fnYes, fnNo) {
    Swal({
      title: SwAlert_Title(sTitle == undefined ? 'Input' : sTitle + ''),
      html: sMessage,
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor: '#5cb85c', //"#2098D1",
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      closeOnCancel: true,
      showLoaderOnConfirm: true,
      inputPlaceholder: sPlaceHolder == undefined ? 'Please specify...' : sPlaceHolder + ''
    },
      function (inputValue) {
        if (inputValue === false) {
          if (fnNo != undefined) fnNo();
          else Swal.close();
        }
        else {
          if (inputValue === "") { Swal.showInputError(sWarnMsg == undefined ? 'Please specify...' : sWarnMsg + ''); return false }

          if (fnYes != undefined) fnYes(inputValue);
          else Swal.close();
        }
      });
  },
  CustomIcon: function (sTitle, sMessage, sImageIconUrl, fnOK) {
    if (sImageIconUrl != undefined) {
      Swal({
        title: SwAlert_Title(sTitle == undefined ? '' : sTitle + ''),
        html: sMessage,
        confirmButtonText: 'Yes',
        allowOutsideClick: false,
        allowEscapeKey: false,
        imageUrl: sImageIconUrl
      }, fnOK);
    }
    else SwAlert.Common(sTitle, sMessage, fnOK);
  },
  DisableButton: false,
  //Close: Swal.close
};

