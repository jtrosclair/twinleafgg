import { Steelix } from './steelix';
import { Manaphy } from './manaphy';
import { Cherrim } from './cherrim';
import { Magnemite } from './magnemite';
import { Wurmple } from './wurmple';
import { Staravia } from './staravia';
import { Stunky } from './stunky';
import { Chatot } from './chatot';
import { Clefairy } from './clefairy';
import { Heracross } from './heracross';
import { Bibarel } from './bibarel';
import { Drapion } from './drapion';
import { Rhyhorn } from './rhyhorn';
import { Goldeen } from './goldeen';
import { Seaking } from './seaking';
import { Hoothoot } from './hoothoot';
import { Skorupi } from './skorupi';
import { Machop } from './machop';
import { Machoke } from './machoke';
import { Machamp } from './machamp';
import { Riolu } from './riolu';
import { Lucario } from './lucario';
import { Ponyta } from './ponyta';
import { Grotle } from './grotle';
import { Torterra } from './torterra';
import { Luxio } from './luxio';
import { Shinx } from './shinx';
import { Starly } from './starly';
import { Turtwig } from './turtwig';
import { EnergySwitchPKDP, PokeBallDP, WarpPointG2DP, EnergySearchDP, PotionDP } from './other-prints';
import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy, DarknessEnergy, MetalEnergy } from './basic-energies';
import { Chimchar } from './chimchar';
import { Cleffa } from './cleffa';
import { Dusknoir } from './dusknoir';
import { Empoleon } from './empoleon';
import { Haunter } from './haunter';
import { Infernape } from './infernape';
import { Meditite } from './meditite';
import { Piplup } from './piplup';
import { PlusPower } from './pluspower';
import { PokedexHandy } from './pokedex-handy';
import { Prinplup } from './prinplup';
import { SpeedStadium } from './speed-stadium';
import { SuperScoopUp } from './super-scoop-up';
import { Wynaut } from './wynaut';

// Other prints
import { SwitchDP } from './other-prints';

export const setDiamondAndPearl: Card[] = [
  new Steelix(),
  new Manaphy(),
  new Cherrim(),
  new Magnemite(),

  new Staravia(),
  new Goldeen(),
  new Seaking(),
  new Hoothoot(),
  new Skorupi(),
  new Machop(),
  new Machoke(),
  new Machamp(),
  new Riolu(),
  new Lucario(),
  new Ponyta(),
  new Grotle(),
  new Torterra(),
  new Luxio(),
  new Shinx(),
  new Starly(),
  new Turtwig(),
  new Chimchar(),
  new Cleffa(),
  new Dusknoir(),
  new Empoleon(),
  new Haunter(),
  new Infernape(),
  new Meditite(),
  new Piplup(),
  new PlusPower(),
  new PokedexHandy(),
  new Prinplup(),
  new SpeedStadium(),
  new SuperScoopUp(),
  new Wynaut(),

  // Other prints
  new SwitchDP(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
  new DarknessEnergy(),
  new MetalEnergy(),
  new EnergySwitchPKDP(),
  new PokeBallDP(),
  new WarpPointG2DP(),
  new EnergySearchDP(),
  new PotionDP(),
  new Wurmple(),
  new Stunky(),
  new Chatot(),
  new Clefairy(),
  new Heracross(),
  new Bibarel(),
  new Drapion(),
  new Rhyhorn(),
];
