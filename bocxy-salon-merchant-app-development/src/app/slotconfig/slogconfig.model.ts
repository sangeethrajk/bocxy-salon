export class ProfessionList {
  accountId: number;
  name: string;
}

export class MerchantSlot {
  merchantSlotId: number;
  name: string;
}

export class MerchantSlotDetails {
  slotId: number;
  slotName: string;
  startDate: string;
  endDate: string;
  openingTime: string;
  closingTime: string;
  weekdayFlag: string;
  weekdays: any[];
}

export class MerchantSpecialSlot {
  merchantSpecialSlotId: number;
  name: string;
}

export class MerchantSpecialSlotDetails {
  merchantSpecialSlotId: number;
  name: string;
  startDate: string;
  endDate: string;
  openingTime: string;
  closingTime: string;
}