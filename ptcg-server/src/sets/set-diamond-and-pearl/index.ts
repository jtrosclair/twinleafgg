import { Wobbuffet } from './wobbuffet';
import { Weavile } from './weavile';
import { Vespiquen } from './vespiquen';
import { UnownD } from './unown-d';
import { UnownC } from './unown-c';
import { UnownB } from './unown-b';
import { UnownA } from './unown-a';
import { TorterraLVX } from './torterra-lvx';
import { Staraptor } from './staraptor';
import { Snorlax } from './snorlax';
import { Sneasel } from './sneasel';
import { Skuntank } from './skuntank';
import { Silcoon } from './silcoon';
import { Shiftry } from './shiftry';
import { Seedot } from './seedot';
import { Roserade } from './roserade';
import { Roselia } from './roselia';
import { Rival } from './rival';
import { Rhyperior } from './rhyperior';
import { Rhydon } from './rhydon';
import { Rapidash } from './rapidash';
import { Purugly } from './purugly';
import { Palkia } from './palkia';
import { Pachirisu } from './pachirisu';
import { Onix } from './onix';
import { Nuzleaf } from './nuzleaf';
import { Noctowl } from './noctowl';
import { Munchlax } from './munchlax';
import { Monferno } from './monferno';
import { Mismagius } from './mismagius';
import { Misdreavus } from './misdreavus';
import { MimeJr } from './mime-jr';
import { Medicham } from './medicham';
import { Marill } from './marill';
import { Mantyke } from './mantyke';
import { Magnezone } from './magnezone';
import { Magneton } from './magneton';
import { Luxray } from './luxray';
import { Lopunny } from './lopunny';
import { InfernapeLVX } from './infernape-lvx';
import { Hippowdon } from './hippowdon';
import { Hippopotas } from './hippopotas';
import { Glameow } from './glameow';
import { Gengar } from './gengar';
import { Gastly } from './gastly';
import { Floatzel } from './floatzel';
import { EmpoleonLVX } from './empoleon-lvx';
import { Elekid } from './elekid';
import { Electivire } from './electivire';
import { Electabuzz } from './electabuzz';
import { Dustox } from './dustox';
import { Duskull } from './duskull';
import { Dusclops } from './dusclops';
import { Drifloon } from './drifloon';
import { Drifblim } from './drifblim';
import { Dialga } from './dialga';
import { Combee } from './combee';
import { Clefable } from './clefable';
import { Cherubi } from './cherubi';
import { Cascoon } from './cascoon';
import { Carnivine } from './carnivine';
import { Buizel } from './buizel';
import { Budew } from './budew';
import { Bonsly } from './bonsly';
import { Bidoof } from './bidoof';
import { Beautifly } from './beautifly';
import { Azurill } from './azurill';
import { Azumarill } from './azumarill';
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
import { DoubleFullHealDP } from './double-full-heal';
import { EnergyRestoreDP } from './energy-restore';
import { NightPokemonCenterDP } from './night-pokemon-center';
import { ProfessorRowanDP } from './professor-rowan';

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
  new DoubleFullHealDP(),
  new EnergyRestoreDP(),
  new NightPokemonCenterDP(),
  new ProfessorRowanDP(),

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
  new Azumarill(),
  new Azurill(),
  new Beautifly(),
  new Bidoof(),
  new Bonsly(),
  new Budew(),
  new Buizel(),
  new Carnivine(),
  new Cascoon(),
  new Cherubi(),
  new Clefable(),
  new Combee(),
  new Dialga(),
  new Drifblim(),
  new Drifloon(),
  new Dusclops(),
  new Duskull(),
  new Dustox(),
  new Electabuzz(),
  new Electivire(),
  new Elekid(),
  new EmpoleonLVX(),
  new Floatzel(),
  new Gastly(),
  new Gengar(),
  new Glameow(),
  new Hippopotas(),
  new Hippowdon(),
  new InfernapeLVX(),
  new Lopunny(),
  new Luxray(),
  new Magneton(),
  new Magnezone(),
  new Mantyke(),
  new Marill(),
  new Medicham(),
  new MimeJr(),
  new Misdreavus(),
  new Mismagius(),
  new Monferno(),
  new Munchlax(),
  new Noctowl(),
  new Nuzleaf(),
  new Onix(),
  new Pachirisu(),
  new Palkia(),
  new Purugly(),
  new Rapidash(),
  new Rhydon(),
  new Rhyperior(),
  new Rival(),
  new Roselia(),
  new Roserade(),
  new Seedot(),
  new Shiftry(),
  new Silcoon(),
  new Skuntank(),
  new Sneasel(),
  new Snorlax(),
  new Staraptor(),
  new TorterraLVX(),
  new UnownA(),
  new UnownB(),
  new UnownC(),
  new UnownD(),
  new Vespiquen(),
  new Weavile(),
  new Wobbuffet(),
];
