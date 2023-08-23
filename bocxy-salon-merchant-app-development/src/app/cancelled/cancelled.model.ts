export class CancelledAppointment{
    appointmentId:number;
    type:string;
    customerName:string;
    bookingDate:string;
    createdAt:string;
    canceledAt:string;
    canceledServices:any[];
    slotName:string;
    totalPriceExpected:number;
    cancelledServiceList?:string;
}