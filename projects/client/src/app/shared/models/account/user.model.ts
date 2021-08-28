import { BaseModel } from '../base.model';

export interface User extends BaseModel {
  displayName: string | null;
  email: string | null;
  photoUrl: string | null;
}
