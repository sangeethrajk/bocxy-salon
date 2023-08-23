export class TimeSlot {
  slotName: string;
  isDisabled?: boolean = true;
}

export class Stylist {
  professionistAccountId: number;
  firstName: string;
}

export class Appointment {
  type: string;
  bookingDate: string;
  stylistAccountId: number;
  slotStartTime: string;
  slotEndTime: string;
  merchantStoreServiceId: number;
}

export class Time {
  constructor(time?: string) {
    if (time) {
      const splits = time.split(':');
      this.Hour = + splits[0];
      this.Minutes = + splits[1];
      if (splits.length === 3) {
        this.Seconds = + splits[2];
      }
      else {
        this.Seconds = 0;
      }

    }
    else {
      this.Hour = 0;
      this.Minutes = 0;
      this.Seconds = 0;
    }
  }


  Time: string;
  Hour: number;
  Minutes: number;
  Seconds: number;

  getTotalMinutes(): number {
    return (this.Hour * 60) + this.Minutes;
  }

  getTotalSeconds(): number {
    return (((this.Hour * 60) + this.Minutes) * 60) + this.Seconds;
  }

  addMinutes(minutes: number): Time {
    if (minutes !== 0 && minutes !== -0) {
      if (minutes < 0) {
        minutes = -minutes;
      }
      const tempMin = this.Minutes + minutes;
      if (tempMin >= 60) {
        minutes = tempMin;
      }
      const hours = Math.trunc(minutes / 60);
      const min = minutes % 60;
      this.Hour = this.Hour + hours;
      if (min !== 0 && tempMin < 60) {
        this.Minutes = this.Minutes + min;
      }
      else {
        this.Minutes = min;
      }

    }
    return this;
  }

  subtractMinutes(minutes: number): Time {
    if (minutes !== 0 && minutes !== -0) {
      if (minutes > 0) {
        minutes = -minutes;
      }
      const hours = Math.trunc(minutes / 60);
      const min = minutes % 60;
      this.Hour = this.Hour + hours;
      const tempMin = this.Minutes + min;
      if (tempMin >= 0) {
        this.Minutes = tempMin;
      }
      else if (tempMin < 0) {
        this.Hour = this.Hour - 1;
        this.Minutes = 60 + tempMin;
      }
    }

    return this;
  }

  addSeconds(seconds: number): Time {
    if (seconds !== 0 && seconds !== -0) {
      if (seconds < 0) {
        seconds = -seconds;
      }
      const tempSec = this.Seconds + seconds;
      if (tempSec >= 60) {
        seconds = tempSec;
      }
      const minutes = Math.trunc(seconds / 60);
      //console.log(minutes);
      const sec = seconds % 60;
      this.addMinutes(minutes);
      if (sec !== 0 && tempSec < 60) {
        this.Seconds = this.Seconds + sec;
      }
      else {
        this.Seconds = sec;
      }

    }
    return this;
  }

  subtractSeconds(seconds: number): Time {
    if (seconds !== 0 && seconds !== -0) {
      if (seconds > 0) {
        seconds = -seconds;
      }
      const minutes = Math.trunc(seconds / 60);
      //console.log(minutes);
      const sec = seconds % 60;
      this.subtractMinutes(minutes);
      const tempSec = this.Seconds + sec;
      if (tempSec >= 0) {
        this.Seconds = tempSec;
      }
      else if (tempSec < 0) {
        this.subtractMinutes(-1);
        this.Seconds = 60 + tempSec;
      }
    }
    return this;
  }

  toString(): string {
    return `${('0' + this.Hour).slice(-2)}:${('0' + this.Minutes).slice(-2)}:${('0' + this.Seconds).slice(-2)}`;
  }

  toShortTimeString(): string {
    return `${('0' + this.Hour).slice(-2)}:${('0' + this.Minutes).slice(-2)}`;
  }

  isLessThan(time: Time): boolean {
    if (this.Hour < time.Hour) {
      return true;
    }
    else if (this.Hour === time.Hour && this.Minutes < time.Minutes) {
      return true;
    }
    else if (this.Hour === time.Hour && this.Minutes === time.Minutes && this.Seconds < time.Seconds) {
      return true;
    }
    else {
      return false;
    }
  }

  isGreaterThan(time: Time): boolean {
    if (this.Hour > time.Hour) {
      return true;
    }
    else if (this.Hour === time.Hour && this.Minutes > time.Minutes) {
      return true;
    }
    else if (this.Hour === time.Hour && this.Minutes === time.Minutes && this.Seconds > time.Seconds) {
      return true;
    }
    else {
      return false;
    }
  }

  isEqual(time: Time): boolean {
    return (this.Hour === time.Hour && this.Minutes === time.Minutes)
  }
}


