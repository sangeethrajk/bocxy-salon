export class AppointmentList {
  private _status: string;
  appointmentId: number;
  type: string;
  customerName: string;
  bookingDate: string;
  createdAt: string;
  bookedServices: any[];
  slotName: string;
  stylistName: string;
  totalPriceExpected: number;
  status: string;
  bookedServicesList?: string = 'serice list';
  isCheckedIn?: boolean;

}