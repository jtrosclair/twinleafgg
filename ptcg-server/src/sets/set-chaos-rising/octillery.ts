import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { OctilleryBatch172 } from './octillery-batch16';

export class Octillery extends OctilleryBatch172 {
  public set = 'M4';
  public usSetNumber = 'CRI 17';
  public fullName = 'Octillery M4';

  // Preserve markers exposed to existing puzzle builders.
  public readonly CORNER_STOP_MARKER = MarkerConstants.LEGACY_OCTILLERY_CORNER_STOP;
  public readonly CLEAR_MARKER = 'OCTILLERY_M4_CLEAR_MARKER';
  public readonly USED_MARKER = 'OCTILLERY_M4_USED_MARKER';

  constructor() {
    super();
    // Retain the attack name used by existing M4 puzzle clients.
    this.attacks[0].name = 'Corner Stop';
  }
}
