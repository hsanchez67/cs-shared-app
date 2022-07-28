import numeral from 'numeral';

export const email = value => /^(([^<>()+#[\]/\\.,;:\s@"]+(\.[^<>()+#[\]/\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
export const date = value => /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(value);
export const ssn = value => /(^\d{3}-\d{2}-\d{4}$)/.test(value);
export const name = value => /^[a-zA-Z\-'`]{2,26}$/.test(value);
export const phone = value => /^[+]([0-9]{11})$/.test(value);
export const simplePhone = value => {
  if (!value) return false;
  let strippedPhone = value.replace('+1', '').replace(/\D/g, '');
  strippedPhone = strippedPhone.charAt(0) === '1' ? strippedPhone.substr(1) : strippedPhone;  
  return /^([0-9]{10})$/.test(strippedPhone);
}
export const verificationCode = value => /^[a-zA-Z0-9]*$/.test(value); // alphanumeric characters only
export const orgName = value => /^[a-zA-Z0-9][a-zA-Z0-9 ]{1,38}[a-zA-Z0-9]$/.test(value); // No white space in the begginning or end, just inbetween must be 3 - 40 characters
export const money = (value, min, max) =>
    /^(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/.test(value) &&
    (min !== undefined ? value >= min : true) &&
    (max !== undefined ? numeral(value).value() <= numeral(max).value() : true);
export const  fileTypeMap = {
    pdf: ['.pdf', 'application/pdf'],
    img: ['.jpg', '.png', 'image/jpeg', 'image/png'],
    spreadsheet: [
      '.csv',
      '.xls',
      '.xlsx',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]
  };
