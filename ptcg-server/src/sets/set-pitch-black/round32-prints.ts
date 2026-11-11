import { CrushingHammer } from '../set-scarlet-and-violet/crushing-hammer';
import { EnergySwitch } from '../set-scarlet-and-violet/energy-switch';

/** Pitch Black full-art variants; inherit the existing gameplay implementations. */
export class CrushingHammerFAPBL extends CrushingHammer {
  public set = 'PBL'; public setNumber = '105'; public fullName = 'Crushing Hammer FA PBL'; public regulationMark = 'J';
}
export class EnergySwitchFAPBL extends EnergySwitch {
  public set = 'PBL'; public setNumber = '107'; public fullName = 'Energy Switch FA PBL'; public regulationMark = 'I';
}
