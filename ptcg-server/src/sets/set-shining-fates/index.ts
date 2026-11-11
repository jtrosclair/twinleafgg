import { SnomSV } from './full-art';
import { Card } from '../../game/store/card/card';
import { Arrokuda } from './arrokuda';
import { Buizel } from './buizel';
import { Cacnea } from './cacnea';
import { Carkol } from './carkol';
import { Celebi } from './celebi';
import { Chewtle2 } from './chewtle-2';
import { Cinccino } from './cinccino';
import { Cramorant2 } from './cramorant-2';
import { CramorantVmax } from './cramorant-vmax';
import { CrobatVmax } from './crobat-vmax';
import { Cufant } from './cufant';
import { Dartrix } from './dartrix';
import { DhelmiseVmax } from './dhelmise-vmax';
import { DittoV } from './ditto-v';
import { DittoVmax } from './ditto-vmax';
import { Drednaw2 } from './drednaw-2';
import { Ducklett } from './ducklett';
import { Eevee } from './eevee';
import { Eldegoss2 } from './eldegoss-2';
import { Falinks } from './falinks';
import { Floatzel } from './floatzel';
import { ApplinSV } from './full-art';
import { GalarianMrMime } from './galarian-mr-mime';
import { GalarianWeezing } from './galarian-weezing';
import { Gossifleur } from './gossifleur';
import { Gossifleur2 } from './gossifleur-2';
import { GreedentV } from './greedent-v';
import { Horsea } from './horsea';
import { Impidimp } from './impidimp';
import { Indeedee2 } from './indeedee-2';
import { IndeedeeV } from './indeedee-v';
import { Koffing } from './koffing';
import { Kyogre } from './kyogre';
import { Manaphy } from './manaphy';
import { Morpeko2 } from './morpeko-2';
import { Raboot } from './raboot';
import { Reshiram } from './reshiram';
import { Rolycoly } from './rolycoly';
import { Rookidee } from './rookidee';
import { Rotom } from './rotom';
import { Sinistea } from './sinistea';
import { Sizzlipede } from './sizzlipede';
import { Skwovet } from './skwovet';
import { Snom } from './snom';
import { Spinarak } from './spinarak';
import { Thievul2 } from './thievul-2';
import { Thwackey } from './thwackey';
import { Toxel } from './toxel';
import { Tropius } from './tropius';
import { Volcanion } from './volcanion';
import { Yanma } from './yanma';
import { Yanmega } from './yanmega';
import { Yveltal } from './yveltal';
import { Zarude } from './zarude';
import { BallGuy } from './ball-guy';
import { GymTrainer } from './gym-trainer';
import { RustedShield } from './rusted-shield';
import { RustedSword } from './rusted-sword';
import { TeamYellTowel } from './team-yell-towel';

import { BirdKeeperSHF, FrosmothSHF, RowletSHF, GrookeySHF, DottlerSHF, EldegossSHF, ScorbunnySHF, SuicuneSHF, GalarianDarumakaSHF, GalarianDarmanitanSHF, DrednawSHF, CramorantSHF, ArctovishSHF, YamperSHF, BoltundSHF, ToxtricitySHF, PincurchinSHF, MorpekoSHF, DracozoltSHF, GalarianPonytaSHF, GalarianCorsolaSHF, DedenneSHF, PolteageistSHF, HatennaSHF, HattremSHF, MilcerySHF, AlcremieSHF, IndeedeeSHF, DreepySHF, DrakloakSHF, GalarianFarfetchdSHF, GalarianSirfetchdSHF, GalarianYamaskSHF, GalarianRunerigusSHF, SilicobraSHF, SandacondaSHF, ClobbopusSHF, GrapploctSHF, StonjournerSHF, GalarianLinooneSHF, NickitSHF, ThievulSHF, MorgremSHF, CorviknightSHF, DuraludonSHF, MinccinoSHF, SwannaSHF, BunnelbySHF, CorvisquireSHF, WoolooSHF, DubwoolSHF, RillaboomVSHF, RillaboomVmaxSHF, CharizardVmaxSHF, CentiskorchVSHF, CentiskorchVmaxSHF, LaprasVSHF, LaprasVmaxSHF, ToxtricityVSHF, ToxtricityVmaxSHF, GrimmsnarlVSHF, GrimmsnarlVmaxSHF, Rowlet2, Dartrix2, Decidueye2, DhelmiseVSHF, Grookey2, Thwackey2, Rillaboom2, CinderaceVmaxSHF, Snom2, ShinxSHF, LuxraySHF, Rotom2, Morpeko3, MorpekoVSHF, MorpekoVmaxSHF, IndeedeeV2, TrapinchSHF, Koffing2, GalarianWeezing2, Nickit2, Cufant2, DittoV2, DittoVmax2, CramorantVSHF, BosssOrdersSHF, ProfessorsResearchSHF, AlcremieVSHF, BallGuy2, CaraLissSHF, GymTrainer2, PiersSHF, PokeKidSHF, RoseSHF, SkylaSHF, AlcremieVmaxSHF, OrbeetleSHF, GreedentSHF, HattereneSHF, GrimmsnarlSHF, OranguruSHF, GalarianStunfiskSHF, InteleonSHF, LuxioSHF, EternatusVSHF, EternatusVmaxSHF, CrobatVSHF, CoalossalSHF, CinderaceVSHF, CinderaceSHF, FrosmothSHF2, GalarianObstagoonSHF, AppletunSHF, GalarianZigzagoonSHF, GalarianMeowthSHF, GalarianRapidashSHF, FlappleSHF, DecidueyeSHF, DracovishSHF, ArctozoltSHF, GalarianCursolaSHF, GalarianPerrserkerSHF, GalarianMrRimeSHF, CentiskorchSHF, BarraskewdaSHF, FalinksVSHF, DragapultSHF, EiscueSHF, DubwoolVSHF, CopperajahSHF, BlipbugSHF, ChewtleSHF, DrizzileSHF, SobbleSHF, RillaboomSHF, RowletSHFBatch152, DartrixSHFSV, DecidueyeSHFBatch152, GrookeySHFBatch152, Thwackey2Batch152, BlipbugSHFBatch152, DottlerSHFBatch152, OrbeetleSHFBatch152, GossifleurSHF, EldegossSHFBatch152, FlappleSHFBatch152, AppletunSHFBatch152, ScorbunnySHFBatch152, RabootSHF, CinderaceSHFBatch152, SizzlipedeSHF, CentiskorchSHFBatch152, GalarianMrMimeSHF, GalarianMrRimeSHFBatch152, SuicuneSHFBatch152, GalarianDarumakaSHFBatch152, GalarianDarmanitanSHFBatch152, SobbleSHFBatch152, DrizzileSHFBatch152, InteleonSHFBatch152, ChewtleSHFBatch152, DrednawSHFBatch152, CramorantSHFBatch152, ArrokudaSHF, BarraskewdaSHFBatch152, FrosmothSHF2Batch152, EiscueSHFBatch152, DracovishSHFBatch152, ArctovishSHFBatch152, Rotom2Batch152, YamperSHFBatch152, BoltundSHFBatch152, ToxelSHF, ToxtricitySHFBatch152, PincurchinSHFBatch152, MorpekoSHFBatch152, DracozoltSHFBatch152, ArctozoltSHFBatch152, GalarianPonytaSHFBatch152, GalarianRapidashSHFBatch152, GalarianCorsolaSHFBatch152, GalarianCursolaSHFBatch152, DedenneSHFBatch152, SinisteaSHF, PolteageistSHFBatch152, HatennaSHFBatch152, HattremSHFBatch152, Koffing2Batch162, GalarianWeezing2Batch162 } from './other-prints';

export const setShiningFates: Card[] = [
  // Pokemon
  new AppletunSHF(),
  new ArctozoltSHF(),
  new Arrokuda(),
  new BarraskewdaSHF(),
  new BlipbugSHF(),
  new Buizel(),
  new Cacnea(),
  new Carkol(),
  new Celebi(),
  new CentiskorchSHF(),
  new ChewtleSHF(),
  new Chewtle2(),
  new Cinccino(),
  new CinderaceSHF(),
  new CinderaceVSHF(),
  new CoalossalSHF(),
  new CopperajahSHF(),
  new Cramorant2(),
  new CramorantVmax(),
  new CrobatVSHF(),
  new CrobatVmax(),
  new Cufant(),
  new Dartrix(),
  new DecidueyeSHF(),
  new DhelmiseVmax(),
  new DittoV(),
  new DittoVmax(),
  new DracovishSHF(),
  new DragapultSHF(),
  new Drednaw2(),
  new DrizzileSHF(),
  new DubwoolVSHF(),
  new Ducklett(),
  new Eevee(),
  new EiscueSHF(),
  new Eldegoss2(),
  new EternatusVSHF(),
  new EternatusVmaxSHF(),
  new Falinks(),
  new FalinksVSHF(),
  new FlappleSHF(),
  new Floatzel(),
  new FrosmothSHF2(),
  new ApplinSV(),
  new GalarianCursolaSHF(),
  new GalarianMeowthSHF(),
  new GalarianMrMime(),
  new GalarianMrRimeSHF(),
  new GalarianObstagoonSHF(),
  new GalarianPerrserkerSHF(),
  new GalarianRapidashSHF(),
  new GalarianStunfiskSHF(),
  new GalarianWeezing(),
  new GalarianZigzagoonSHF(),
  new Gossifleur(),
  new Gossifleur2(),
  new GreedentSHF(),
  new GreedentV(),
  new GrimmsnarlSHF(),
  new HattereneSHF(),
  new Horsea(),
  new Impidimp(),
  new Indeedee2(),
  new IndeedeeV(),
  new InteleonSHF(),
  new Koffing(),
  new Kyogre(),
  new LuxioSHF(),
  new Manaphy(),
  new Morpeko2(),
  new OranguruSHF(),
  new OrbeetleSHF(),
  new Raboot(),
  new Reshiram(),
  new RillaboomSHF(),
  new Rolycoly(),
  new Rookidee(),
  new Rotom(),
  new Sinistea(),
  new Sizzlipede(),
  new Skwovet(),
  new Snom(),
  new SobbleSHF(),
  new Spinarak(),
  new Thievul2(),
  new Thwackey(),
  new Toxel(),
  new Tropius(),
  new Volcanion(),
  new Yanma(),
  new Yanmega(),
  new Yveltal(),
  new Zarude(),

  // Trainers
  new BallGuy(),
  new GymTrainer(),
  new RustedShield(),
  new RustedSword(),
  new TeamYellTowel(),

  // Other Prints (Reprints & Alt Arts)
  new BirdKeeperSHF(),
  new FrosmothSHF(),
  new RowletSHF(),
  new GrookeySHF(),
  new DottlerSHF(),
  new EldegossSHF(),
  new ScorbunnySHF(),
  new SuicuneSHF(),
  new GalarianDarumakaSHF(),
  new GalarianDarmanitanSHF(),
  new DrednawSHF(),
  new CramorantSHF(),
  new ArctovishSHF(),
  new YamperSHF(),
  new BoltundSHF(),
  new ToxtricitySHF(),
  new PincurchinSHF(),
  new MorpekoSHF(),
  new DracozoltSHF(),
  new GalarianPonytaSHF(),
  new GalarianCorsolaSHF(),
  new DedenneSHF(),
  new PolteageistSHF(),
  new HatennaSHF(),
  new HattremSHF(),
  new MilcerySHF(),
  new AlcremieSHF(),
  new IndeedeeSHF(),
  new DreepySHF(),
  new DrakloakSHF(),
  new GalarianFarfetchdSHF(),
  new GalarianSirfetchdSHF(),
  new GalarianYamaskSHF(),
  new GalarianRunerigusSHF(),
  new SilicobraSHF(),
  new SandacondaSHF(),
  new ClobbopusSHF(),
  new GrapploctSHF(),
  new StonjournerSHF(),
  new GalarianLinooneSHF(),
  new NickitSHF(),
  new ThievulSHF(),
  new MorgremSHF(),
  new CorviknightSHF(),
  new DuraludonSHF(),
  new MinccinoSHF(),
  new SwannaSHF(),
  new BunnelbySHF(),
  new CorvisquireSHF(),
  new WoolooSHF(),
  new DubwoolSHF(),
  new RillaboomVSHF(),
  new RillaboomVmaxSHF(),
  new CharizardVmaxSHF(),
  new CentiskorchVSHF(),
  new CentiskorchVmaxSHF(),
  new LaprasVSHF(),
  new LaprasVmaxSHF(),
  new ToxtricityVSHF(),
  new ToxtricityVmaxSHF(),
  new GrimmsnarlVSHF(),
  new GrimmsnarlVmaxSHF(),
  new Rowlet2(),
  new Dartrix2(),
  new Decidueye2(),
  new DhelmiseVSHF(),
  new Grookey2(),
  new Thwackey2(),
  new Rillaboom2(),
  new CinderaceVmaxSHF(),
  new Snom2(),
  new ShinxSHF(),
  new LuxraySHF(),
  new Rotom2(),
  new Morpeko3(),
  new MorpekoVSHF(),
  new MorpekoVmaxSHF(),
  new IndeedeeV2(),
  new TrapinchSHF(),
  new Koffing2(),
  new GalarianWeezing2(),
  new Nickit2(),
  new Cufant2(),
  new DittoV2(),
  new DittoVmax2(),
  new CramorantVSHF(),
  new BosssOrdersSHF(),
  new ProfessorsResearchSHF(),
  new AlcremieVSHF(),
  new BallGuy2(),
  new CaraLissSHF(),
  new GymTrainer2(),
  new PiersSHF(),
  new PokeKidSHF(),
  new RoseSHF(),
  new SkylaSHF(),
  new AlcremieVmaxSHF(),
  new RowletSHFBatch152(),
  new DartrixSHFSV(),
  new DecidueyeSHFBatch152(),
  new GrookeySHFBatch152(),
  new Thwackey2Batch152(),
  new BlipbugSHFBatch152(),
  new DottlerSHFBatch152(),
  new OrbeetleSHFBatch152(),
  new GossifleurSHF(),
  new EldegossSHFBatch152(),
  new FlappleSHFBatch152(),
  new AppletunSHFBatch152(),
  new ScorbunnySHFBatch152(),
  new RabootSHF(),
  new CinderaceSHFBatch152(),
  new SizzlipedeSHF(),
  new CentiskorchSHFBatch152(),
  new GalarianMrMimeSHF(),
  new GalarianMrRimeSHFBatch152(),
  new SuicuneSHFBatch152(),
  new GalarianDarumakaSHFBatch152(),
  new GalarianDarmanitanSHFBatch152(),
  new SobbleSHFBatch152(),
  new DrizzileSHFBatch152(),
  new InteleonSHFBatch152(),
  new ChewtleSHFBatch152(),
  new DrednawSHFBatch152(),
  new CramorantSHFBatch152(),
  new ArrokudaSHF(),
  new BarraskewdaSHFBatch152(),
  new FrosmothSHF2Batch152(),
  new EiscueSHFBatch152(),
  new DracovishSHFBatch152(),
  new ArctovishSHFBatch152(),
  new Rotom2Batch152(),
  new YamperSHFBatch152(),
  new BoltundSHFBatch152(),
  new ToxelSHF(),
  new ToxtricitySHFBatch152(),
  new PincurchinSHFBatch152(),
  new MorpekoSHFBatch152(),
  new DracozoltSHFBatch152(),
  new ArctozoltSHFBatch152(),
  new GalarianPonytaSHFBatch152(),
  new GalarianRapidashSHFBatch152(),
  new GalarianCorsolaSHFBatch152(),
  new GalarianCursolaSHFBatch152(),
  new DedenneSHFBatch152(),
  new SinisteaSHF(),
  new PolteageistSHFBatch152(),
  new HatennaSHFBatch152(),
  new HattremSHFBatch152(),
  new Koffing2Batch162(),
  new GalarianWeezing2Batch162(),
  new SnomSV(),
];
