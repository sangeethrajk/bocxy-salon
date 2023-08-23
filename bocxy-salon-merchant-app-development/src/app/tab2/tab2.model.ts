export class MerchantService {
  serviceId: number;
  service: string;
  serviceIcon: string;
  serviceIconLocal: string;
  categories: {
    merchantStoreServiceId: number;
    serviceCategoryId: number;
    serviceCategoryName: string;
    price: number;
  }[];
}
export class MerchantServiceGroups {
  serviceGroupId: number;
  serviceGroupName: string;
  icon: string;
  iconLocal: string;
  services: {
    serviceId: number;
    service: string;
    serviceIcon: string;
    serviceIconLocal: string;
    categories: {
      merchantStoreServiceId: number;
      serviceCategoryId: number;
      serviceCategoryName: string;
      price: number;
    }[];
  }[];
}
