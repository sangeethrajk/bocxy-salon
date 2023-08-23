export class MerchantService {
  merchantStoreServiceId: number;
  name: string;
}

export class Stylist {
  professionistAccountId: number;
  firstName: string;
}

export class AppointmentBooking {
  customerName: string;
  customerMobile: string;
  customerMobileCode: string;
  customerMobileCountry: string;
  type: string;
  bookingDate: string;
  stylistAccountId: number;
  slotStartTime: string;
  slotEndTime: string;
  merchantStoreServiceId: number;
  manualPrice: number;
}

export class TimeSlot {
  slotId: number;
  slotName: string;
  isDisabled?: boolean = true;
}
