export class StylistDetails {
  accountId: number;
  firstName: string;
  mobileNo: number;
  mobileNoDialCode: string;
  mobileNoCountryCode: string;
  roleId: number;
  roleCode: string;
  professionId: number;
  professionistGradeId:number;
  email: string;
  address: string;
  roleCodes:[ "ST" ,  "MG"];  
  active:string;
}
export class ProfessionList {
  professionId: number;
  name: string;
}
export class ProfessionGrade{
  professionistGradeId:number;
  name:string;
}
export class RoleList {
  roleId: number;
  name: string;
}
