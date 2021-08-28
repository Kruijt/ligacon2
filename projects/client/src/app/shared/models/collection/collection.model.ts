import { BaseModel } from '../base.model';

export interface Collection extends BaseModel {
  name?: string;
  iconCount?: number;
}
