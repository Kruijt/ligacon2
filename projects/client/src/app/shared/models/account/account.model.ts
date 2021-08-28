import { User } from './user.model';
import { Team } from './team.model';

export interface Account {
  user?: User;
  team?: Team;
}
