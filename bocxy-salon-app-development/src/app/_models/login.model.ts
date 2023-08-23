export class Token {
  accessToken: string;
}
export class Account {
  mobileNo: string;
  mobileNoDialCode: string;
  // roleCode: string;
  roleCodes: string[];
  active: string;
  location: Location;
}

class Location {
  latitude: string;
  longitude: string;
  country: string;
  adminAreaLevel1: string;
  adminAreaLevel2: string;
  locality: string;
}