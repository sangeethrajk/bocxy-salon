export class MerchantServiceDetails {
  merchantStoreServiceId: number;
  merchantStoreId: number;
  serviceId: number;
  serviceGroupId: number;
  serviceCategoryId: number;
  serviceCategoryName: string;
  price: number;
  offer: string;
  disable: string;
  duration: number;
  durationmin: string;
  durationHour: string;
  defaultSlotDuration: string;
  defaultSlot: string;
  offerPrice: number;
  offerStart: string;
  offerEnd: string;
  active: string;
  createdAt: string;
  updatedAt: string;
  professionistGrades: number[];
  serviceGenderCategories: number[];
  pictureUrl: string;
}
export class ServiceList {
  serviceId: number;
  name: string;
}
export class ServiceCategoryList {
  serviceCategoryId: number;
  name: string;
}

export class ServiceGenderCategory {
  serviceGenderCategoryId: number;
  name: string;
  isSelected?: boolean;
}

export class serviceGroupList {
  serviceGroupId: number;
  icon: string;
  sequence: string;
  description: string;
  active: string;
  name: string;
}