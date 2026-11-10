import { Aarune } from './aarune';
import { AdventuringLantern } from './adventuring-lantern';
import { CustomVest } from './custom-vest';
import { EmceesHype } from '../set-destined-rivals/mcs-hype-up';
import { TateAndLizasTraining } from './tate-and-lizas-training';
import { ZinniasTrust } from './zinnias-trust';
export class AaruneUR extends Aarune { public setNumber = '125'; public fullName = 'Aarune UR M6'; }
export class AaruneSIR extends Aarune { public setNumber = '139'; public fullName = 'Aarune SIR M6'; }
export class AdventuringLanternUR extends AdventuringLantern { public setNumber = '126'; public fullName = 'Adventure Lantern UR M6'; }
export class CustomVestUR extends CustomVest { public setNumber = '127'; public fullName = 'Custom Vest UR M6'; }
export class EmceesHypeM6 extends EmceesHype { public set='DLR'; public setNumber='92'; public regulationMark='J'; public fullName="Emcee's Hype M6"; }
export class EmceesHypeUR extends EmceesHypeM6 { public setNumber='128'; public fullName="Emcee's Hype UR M6"; }
export class TateAndLizasTrainingUR extends TateAndLizasTraining { public setNumber='130'; public fullName="Tate & Liza's Training UR M6"; }
export class ZinniasTrustUR extends ZinniasTrust { public setNumber='131'; public fullName="Zinnia's Trust UR M6"; }
export class ZinniasTrustSIR extends ZinniasTrust { public setNumber='140'; public fullName="Zinnia's Trust SIR M6"; }
