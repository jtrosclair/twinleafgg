import { Voltorb3 } from './voltorb3';
import { Voltorb } from './voltorb';
import { Vespiquen } from './vespiquen';
import { Tyranitar } from './tyranitar';
import { Torterra } from './torterra';
import { Tangrowth } from './tangrowth';
import { Tangela } from './tangela';
import { Steelix } from './steelix';
import { Starly } from './starly';
import { Staraptor } from './staraptor';
import { Skuntank } from './skuntank';
import { Skarmory } from './skarmory';
import { Scyther } from './scyther';
import { Scizor } from './scizor';
import { Sceptile } from './sceptile';
import { Salamence } from './salamence';
import { Roserade } from './roserade';
import { Roselia } from './roselia';
import { Regigigas } from './regigigas';
import { Rapidash } from './rapidash';
import { Raichu } from './raichu';
import { RaichuLVX } from './raichu-lvx';
import { Pupitar } from './pupitar';
import { PokeHealer } from './poke-healer';
import { Piloswine } from './piloswine';
import { Pikachu } from './pikachu';
import { Pichu } from './pichu';
import { Onix } from './onix';
import { Mismagius } from './mismagius';
import { Misdreavus } from './misdreavus';
import { Miltank } from './miltank';
import { Mamoswine } from './mamoswine';
import { Magnezone2 } from './magnezone2';
import { Magnezone } from './magnezone';
import { Magneton2 } from './magneton2';
import { Magneton } from './magneton';
import { Magnemite2 } from './magnemite2';
import { Magnemite } from './magnemite';
import { Lumineon } from './lumineon';
import { Larvitar } from './larvitar';
import { Infernape } from './infernape';
import { Finneon } from './finneon';
import { Farfetchd } from './farfetchd';
import { EnergyLink } from './energy-link';
import { Empoleon } from './empoleon';
import { Electrode2 } from './electrode2';
import { Electrode } from './electrode';
import { Duskull2 } from './duskull2';
import { Dusknoir2 } from './dusknoir2';
import { Dusknoir } from './dusknoir';
import { DusknoirLVXExactPrint } from './dusknoir-lv-x';
import { Drifloon2 } from './drifloon2';
import { Drifloon } from './drifloon';
import { Drifblim } from './drifblim';
import { Drapion } from './drapion';
import { ConductiveQuarry } from './conductive-quarry';
import { Cherrim } from './cherrim';
import { Budew } from './budew';
import { Bronzor } from './bronzor';
import { Bronzong } from './bronzong';
import { Bibarel } from './bibarel';
import { Bagon } from './bagon';
import { Abomasnow } from './abomasnow';
import { HeatranLVX } from './heatran-lvx';
import { Grovyle } from './grovyle';
import { Duskull3 } from './duskull3';
import { Cherubi } from './cherubi';
import { Shelgon } from './shelgon';
import { Stunky } from './stunky';
import { Treecko } from './treecko';
import { Voltorb2 } from './voltorb2';
import { Swinub } from './swinub';
import { Bidoof } from './bidoof';
import { Skorupi } from './skorupi';
import { EnergySwitchPKSF, GreatBallSF, PotionSF, SwitchSF, CharmanderSF, CharmeleonSF, CharizardSF } from './other-prints';
import { Card } from '../../game/store/card/card';
import { Combee } from './combee';
import { Dusclops } from './dusclops';
import { Dusclops2 } from './dusclops2';
import { Duskull } from './duskull';
import { Gastly } from './gastly';
import { Gengar } from './gengar';
import { Gyarados } from './gyarados';
import { Haunter } from './haunter';
import { LuxuryBall } from './luxury-ball';
import { Machoke } from './machoke';
import { Machamp } from './machamp';
import { MachampLVX } from './machamp-lv-x';
import { Machop } from './machop';
import { Magikarp } from './magikarp';
import { MarleysRequest } from './marleys-request';
import { PokeBlower } from './poke-blower';
import { PokeDrawer } from './poke-drawer';
import { RegigigasLVX } from './regigigas-lv-x';
import { Sableye } from './sableye';

// Other prints
import {
  CycloneEnergySF,
  PremierBallSF,
  WarpEnergySF
} from './other-prints';

export const setStormfront: Card[] = [
  new Combee(),
  new Dusclops(),
  new Dusclops2(),
  new Duskull(),
  new Gengar(),
  new Gyarados(),
  new Haunter(),
  new LuxuryBall(),
  new Machoke(),
  new Machamp(),
  new MachampLVX(),
  new Machop(),
  new Magikarp(),
  new MarleysRequest(),
  new PokeBlower(),
  new PokeDrawer(),
  new RegigigasLVX(),
  new Sableye(),
  new Gastly(),
  // Other prints
  new CycloneEnergySF(),
  new PremierBallSF(),
  new WarpEnergySF(),
  new EnergySwitchPKSF(),
  new GreatBallSF(),
  new PotionSF(),
  new SwitchSF(),
  new CharmanderSF(),
  new CharmeleonSF(),
  new CharizardSF(),
  new Grovyle(),
  new Duskull3(),
  new Cherubi(),
  new Shelgon(),
  new Stunky(),
  new Treecko(),
  new Voltorb2(),
  new Swinub(),
  new Bidoof(),
  new Skorupi(),
  new HeatranLVX(),
  new Abomasnow(),
  new Bagon(),
  new Bibarel(),
  new Bronzong(),
  new Bronzor(),
  new Budew(),
  new Cherrim(),
  new ConductiveQuarry(),
  new Drapion(),
  new Drifblim(),
  new Drifloon(),
  new Drifloon2(),
  new DusknoirLVXExactPrint(),
  new Dusknoir(),
  new Dusknoir2(),
  new Duskull2(),
  new Electrode(),
  new Electrode2(),
  new Empoleon(),
  new EnergyLink(),
  new Farfetchd(),
  new Finneon(),
  new Infernape(),
  new Larvitar(),
  new Lumineon(),
  new Magnemite(),
  new Magnemite2(),
  new Magneton(),
  new Magneton2(),
  new Magnezone(),
  new Magnezone2(),
  new Mamoswine(),
  new Miltank(),
  new Misdreavus(),
  new Mismagius(),
  new Onix(),
  new Pichu(),
  new Pikachu(),
  new Piloswine(),
  new PokeHealer(),
  new Pupitar(),
  new RaichuLVX(),
  new Raichu(),
  new Rapidash(),
  new Regigigas(),
  new Roselia(),
  new Roserade(),
  new Salamence(),
  new Sceptile(),
  new Scizor(),
  new Scyther(),
  new Skarmory(),
  new Skuntank(),
  new Staraptor(),
  new Starly(),
  new Steelix(),
  new Tangela(),
  new Tangrowth(),
  new Torterra(),
  new Tyranitar(),
  new Vespiquen(),
  new Voltorb(),
  new Voltorb3(),
];
