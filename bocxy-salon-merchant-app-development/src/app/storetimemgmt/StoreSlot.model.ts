export class StoreSlot {
  merchantSlotId: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  closingTime: string;
  openingTime: string;
  weekdayFlag: string;
  weekdays: any[];
}

export class StoreSpecialSlot {
  merchantSpecialSlotId: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  closingTime: string;
  openingTime: string;
  weekdayFlag: string;
  weekdays: any[];
}
