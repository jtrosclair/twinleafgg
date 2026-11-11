import { Card } from '../../game/store/card/card';
import { Annihilape } from './annihilape';
import { AntiqueShieldFossil } from './antique-shield-fossil';
import { AntiqueSkullFossil } from './antique-skull-fossil';
import { Armarouge } from './armarouge';
import { Banette } from './banette';
import { Bastiodon } from './bastiodon';
import { BoltyLightningEnergy } from './bolty-lightning-energy';
import { Bombirdier } from './bombirdier';
import { Brionne } from './brionne';
import { Bronzong } from './bronzong';
import { Bronzor } from './bronzor';
import { Centiskorch } from './centiskorch';
import { Charcadet } from './charcadet';
import { Charjabug } from './charjabug';
import { ChiYu } from './chi-yu';
import { Cranidos } from './cranidos';
import { DarkBell } from './dark-bell';
import { Dhelmise } from './dhelmise';
import { Drilbur } from './drilbur';
import { Electrike } from './electrike';
import { Finizen } from './finizen';
import { Fomantis } from './fomantis';
import { FossilQuarry as FossilExcavationSite } from './fossil-quarry';
import { GladionsFinalBattle } from './gladions-final-battle';
import { Goldeen } from './goldeen';
import { Grubbin } from './grubbin';
import { Gwynn } from './gwynn';
import { Heatran } from './heatran';
import { TremendousBomb } from './tremendous-bomb';
import { Inkay } from './inkay';
import { Jynx } from './jynx';
import { Koraidon } from './koraidon';
import { Lampent } from './lampent';
import { Litwick } from './litwick';
import { Lurantisex } from './lurantis-ex';
import { Malamar } from './malamar';
import { Manectric } from './manectric';
import { Mankey } from './mankey';
import { Maschiff } from './maschiff';
import { Marshadow } from './marshadow';
import { Mandibuzz } from './mandibuzz';
import { MegaChandelureex } from './mega-chandelure-ex';
import { MegaDarkraiex } from './mega-darkrai-ex';
import { MegaDelphoxex } from './mega-delphox-ex';
import { MegaExcadrillex } from './mega-excadrill-ex';
import { MegaZeraoraex } from './mega-zeraora-ex';
import { MistysVitality } from './mistys-vitality';
import { Miraidon } from './miraidon';
import { Morpekoex } from './morpeko-ex';
import { Mabosstiff } from './mabosstiff';
import { Nickit } from './nickit';
import { Palafin } from './palafin';
import { Pikipek } from './pikipek';
import { Poltchageist } from './poltchageist';
import { Popplio } from './popplio';
import { Primarina } from './primarina';
import { Primeape } from './primeape';
import { Rampardosex } from './rampardos-ex';
import { Relicanth } from './relicanth';
import { RetryBadge } from './retry-badge';
import { RustSyndicateGrunt } from './rust-syndicate-grunt';
import { ShadowDarknessEnergy } from './shadow-darkness-energy';
import { Seaking } from './seaking';
import { Shieldon } from './shieldon';
import { Shuppet } from './shuppet';
import { Sinistcha } from './sinistcha';
import { Silvally } from './silvally';
import { Sizzlipede } from './sizzlipede';
import { Skarmory } from './skarmory';
import { Slowbro } from './slowbro';
import { Slowpoke } from './slowpoke';
import { Spiritomb } from './spiritomb';
import { Thievul } from './thievul';
import { Toucannon } from './toucannon';
import { Trumbeak } from './trumbeak';
import { Tropius } from './tropius';
import { TypeNull } from './type-null';
import { Vikavolt } from './vikavolt';
import { Vullaby } from './vullaby';
import { Wailmer } from './wailmer';
import { Wailordex } from './wailord-ex';
import { Zarude } from './zarude';
import {
  FomantisIR, ArmarougeIR, GoldeenIR, PrimarinaIR, ManectricIR, SlowbroIR, DhelmiseIR,
  ThievulIR, BastiodonIR, ToucannonIR, SilvallyIR, LurantisexFA, WailordexFA,
  MegaZeraoraexFA, MegaChandelureexFA, RampardosexFA, MegaDarkraiexFA, MorpekoexFA,
  MegaExcadrillexFA, BraveBangleFAPBL, CrushingHammerFAPBL, DarkBellFA, EnergySwitchFAPBL,
  GladionsFinalBattleFA, GwynnFA, IronDefenderFAPBL, MistysVitalityFA, RustSyndicateGruntFA,
  TremendousBombFA, MegaZeraoraexSIR, MegaChandelureexSIR, MegaDarkraiexSIR, MorpekoexSIR,
  GladionsFinalBattleSIR, GwynnSIR, MegaDarkraiexHR,
} from './upstream-prints';

export const setPitchBlack: Card[] = [
  new Annihilape(),
  new AntiqueShieldFossil(),
  new AntiqueSkullFossil(),
  new Armarouge(),
  new Banette(),
  new Bastiodon(),
  new BoltyLightningEnergy(),
  new Bombirdier(),
  new Brionne(),
  new Bronzong(),
  new Bronzor(),
  new Centiskorch(),
  new Charcadet(),
  new Charjabug(),
  new ChiYu(),
  new Cranidos(),
  new DarkBell(),
  new Dhelmise(),
  new Drilbur(),
  new Electrike(),
  new Finizen(),
  new Fomantis(),
  new FossilExcavationSite(),
  new GladionsFinalBattle(),
  new Goldeen(),
  new Grubbin(),
  new Gwynn(),
  new Heatran(),
  new TremendousBomb(),
  new Inkay(),
  new Jynx(),
  new Koraidon(),
  new Lampent(),
  new Litwick(),
  new Lurantisex(),
  new Malamar(),
  new Manectric(),
  new Mankey(),
  new Maschiff(),
  new Marshadow(),
  new Mandibuzz(),
  new MegaChandelureex(),
  new MegaDarkraiex(),
  new MegaDelphoxex(),
  new MegaExcadrillex(),
  new MegaZeraoraex(),
  new MistysVitality(),
  new Miraidon(),
  new Morpekoex(),
  new Mabosstiff(),
  new Nickit(),
  new Palafin(),
  new Pikipek(),
  new Poltchageist(),
  new Popplio(),
  new Primarina(),
  new Primeape(),
  new Rampardosex(),
  new Relicanth(),
  new RetryBadge(),
  new RustSyndicateGrunt(),
  new ShadowDarknessEnergy(),
  new Seaking(),
  new Shieldon(),
  new Shuppet(),
  new Sinistcha(),
  new Silvally(),
  new Sizzlipede(),
  new Skarmory(),
  new Slowbro(),
  new Slowpoke(),
  new Spiritomb(),
  new Thievul(),
  new Toucannon(),
  new Trumbeak(),
  new Tropius(),
  new TypeNull(),
  new Vikavolt(),
  new Vullaby(),
  new Wailmer(),
  new Wailordex(),
  new Zarude(),
  new FomantisIR(),
  new ArmarougeIR(),
  new GoldeenIR(),
  new PrimarinaIR(),
  new ManectricIR(),
  new SlowbroIR(),
  new DhelmiseIR(),
  new ThievulIR(),
  new BastiodonIR(),
  new ToucannonIR(),
  new SilvallyIR(),
  new LurantisexFA(),
  new WailordexFA(),
  new MegaZeraoraexFA(),
  new MegaChandelureexFA(),
  new RampardosexFA(),
  new MegaDarkraiexFA(),
  new MorpekoexFA(),
  new MegaExcadrillexFA(),
  new BraveBangleFAPBL(),
  new CrushingHammerFAPBL(),
  new DarkBellFA(),
  new EnergySwitchFAPBL(),
  new GladionsFinalBattleFA(),
  new GwynnFA(),
  new IronDefenderFAPBL(),
  new MistysVitalityFA(),
  new RustSyndicateGruntFA(),
  new TremendousBombFA(),
  new MegaZeraoraexSIR(),
  new MegaChandelureexSIR(),
  new MegaDarkraiexSIR(),
  new MorpekoexSIR(),
  new GladionsFinalBattleSIR(),
  new GwynnSIR(),
  new MegaDarkraiexHR(),
];
