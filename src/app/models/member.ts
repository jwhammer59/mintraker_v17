import { Ministry } from './ministry';

export interface Member {
  id: string;
  firstName: string;
  middleInit: string;
  lastName: string;
  familyId: string;
  phone: string;
  email: string;
  add1: string;
  add2: string;
  city: string;
  state: string;
  zip: string;
  ministries: Ministry[];
  memberIsActive: boolean;
}