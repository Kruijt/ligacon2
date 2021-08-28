import { assertArray } from '../../../shared/utilities/array.utilities';
import { getActionTypeFromInstance } from '@ngxs/store';

export function actionsToType(action: any | any[]): string[] {
  return assertArray(action)
    .map(getActionTypeFromInstance)
    .filter((type): type is string => !!type);
}
