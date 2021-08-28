import { BaseModel } from '../base.model';

export interface Icon extends BaseModel {
  name?: string;
  ligature?: string;
  keywords?: string[];
  svg?: string;
}
