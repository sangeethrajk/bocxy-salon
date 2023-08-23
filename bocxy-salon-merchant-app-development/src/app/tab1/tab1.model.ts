export class OnGoingAppointment {
  appointmentId: number;
  services: string;
  bookingDate: string;
  stylistName: string;
  color: string;
  slotStartTime: string;
  slotEndTime: string;
}

export class Stylist {
  firstName: string;
  accountId: number
}