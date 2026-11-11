import { TeamMagmasSecretBase } from './team-magmas-secret-base';
import { TeamAquasSealeo } from './team-aquas-sealeo';
import { Card } from '../../game/store/card/card';
import { TeamAquasGreatBall } from './team-aquas-great-ball';
import { TeamMagmasGreatBall } from './team-magmas-great-ball';

// Other prints
import { TeamAquasSecretBase } from './other-prints';

export const setDoubleCrisis: Card[] = [
  new TeamAquasGreatBall(),
  new TeamMagmasGreatBall(),

  // Other prints
  new TeamAquasSecretBase(),
  new TeamAquasSealeo(),
  new TeamMagmasSecretBase(),
];