import { Injectable } from '@angular/core';

@Injectable()
export class DateService {
  constructor() { }

  dateFormat(date): string {
    // Split timestamp into [ Y, M, D, h, m, s ]
    if (date) {
      const t = date.split(/[- :]/);

      const d = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
      function pad(s) { return (s < 10) ? '0' + s : s; }
      const dateRes = [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');

      let hours = d.getHours();
      const minutes = d.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const strTime = dateRes + ' ' + pad(hours) + ':' + pad(minutes) + ' ' + ampm;
      return strTime;
    }
    else {
      return 'NA';
    }

  }

  dateToObject(date): Date {
    // Split timestamp into [ Y, M, D, h, m, s ]
    const t = date.split(/[- :]/);
    return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
  }

  priceDecimalCheck(price: string) {
    const priceSplit = price.split('.');
    if (priceSplit[1] === '00') {
      return priceSplit[0];
    }
    return price;
  }


  removeTimeInDate(dateTime: string) {
    const dateSplit = dateTime.split(' ');
    if (dateSplit[1] === '11:59') {
      return dateSplit[0];
    }
    return dateTime;
  }

  Date_toYMD(date?: Date): string {
    let d; if (date === undefined) { d = new Date(); } else { d = date; }
    let year, month, day;
    year = String(d.getFullYear());
    month = String(d.getMonth() + 1);
    if (month.length === 1) {
      month = '0' + month;
    }
    day = String(d.getDate());
    if (day.length === 1) {
      day = '0' + day;
    }
    console.log(year + '-' + month + '-' + day);
    return year + '-' + month + '-' + day;
  }

  validFromToDate(): string {
    const dateObj: Date = this.addYearToDate(new Date(), 10);
    return this.Date_toYMD(dateObj);
  }

  plusToDate(currentDate, unit, howMuch): Date {

    const config = {
      second: 1000, // 1000 miliseconds
      minute: 60000,
      hour: 3600000,
      day: 86400000,
      week: 604800000,
      month: 2592000000, // Assuming 30 days in a month
      year: 31536000000 // Assuming 365 days in year
    };

    const now: any = new Date(currentDate);

    console.log('final', new Date(now + config[unit] * howMuch));
    return new Date(now + config[unit] * howMuch);
  }

  addYearToDate(date: Date, years: number): Date {
    date.setFullYear(date.getFullYear() + years);
    return date;
  }

  timeConvert(time) {
    if (time) {
      let hour = (time.split(':'))[0];
      let min = (time.split(':'))[1];
      const part = hour > 11 ? 'pm' : 'am';

      min = (min + '').length == 1 ? `0${min}` : min;
      hour = hour > 12 ? hour - 12 : hour;
      hour = (hour + '').length == 1 ? `0${hour}` : hour;

      return (`${hour}:${min} ${part}`);
    }
    else {
      return 'NA';
    }
  }
  secondsToTimeFormat(duration) {
    // Hours, minutes and seconds
    const hrs = Math.floor(duration / 3600);
    const mins = Math.floor((duration % 3600) / 60);
    const secs = Math.floor(duration) % 60;

    // Output like "01:01" or "4:03:59" or "123:03:59"
    let ret = '';
    if (hrs > 0) {
      ret += '' + hrs + ':';
    }
    ret += (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
  }
  dbDateTimeToDate(s: string) {
    return (s.split(' '))[0];
  }
  dbDateTimeToTime(s: string) {
    return ((s.split(' '))[1]).slice(0, 5);
  }
}
