"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorvisquireSHF = exports.BunnelbySHF = exports.SwannaSHF = exports.MinccinoSHF = exports.DuraludonSHF = exports.CorviknightSHF = exports.MorgremSHF = exports.ThievulSHF = exports.NickitSHF = exports.GalarianLinooneSHF = exports.StonjournerSHF = exports.GrapploctSHF = exports.ClobbopusSHF = exports.SandacondaSHF = exports.SilicobraSHF = exports.GalarianRunerigusSHF = exports.GalarianYamaskSHF = exports.GalarianSirfetchdSHF = exports.GalarianFarfetchdSHF = exports.DrakloakSHF = exports.DreepySHF = exports.IndeedeeSHF = exports.AlcremieSHF = exports.MilcerySHF = exports.HattremSHF = exports.HatennaSHF = exports.PolteageistSHF = exports.DedenneSHF = exports.GalarianCorsolaSHF = exports.GalarianPonytaSHF = exports.DracozoltSHF = exports.MorpekoSHF = exports.PincurchinSHF = exports.ToxtricitySHF = exports.BoltundSHF = exports.YamperSHF = exports.ArctovishSHF = exports.CramorantSHF = exports.DrednawSHF = exports.GalarianDarmanitanSHF = exports.GalarianDarumakaSHF = exports.SuicuneSHF = exports.ScorbunnySHF = exports.EldegossSHF = exports.DottlerSHF = exports.RillaboomSHF = exports.GrookeySHF = exports.RowletSHF = exports.FrosmothSHF = exports.BirdKeeperSHF = void 0;
exports.GreedentSHF = exports.OrbeetleSHF = exports.AlcremieVmaxSHF = exports.SkylaSHF = exports.RoseSHF = exports.PokeKidSHF = exports.PiersSHF = exports.GymTrainer2 = exports.CaraLissSHF = exports.BallGuy2 = exports.AlcremieVSHF = exports.ProfessorsResearchSHF = exports.BosssOrdersSHF = exports.CramorantVSHF = exports.DittoVmax2 = exports.DittoV2 = exports.Cufant2 = exports.Nickit2 = exports.GalarianWeezing2 = exports.Koffing2 = exports.TrapinchSHF = exports.IndeedeeV2 = exports.MorpekoVmaxSHF = exports.MorpekoVSHF = exports.Morpeko3 = exports.Rotom2 = exports.LuxraySHF = exports.ShinxSHF = exports.Snom2 = exports.CinderaceVmaxSHF = exports.Rillaboom2 = exports.Thwackey2 = exports.Grookey2 = exports.DhelmiseVSHF = exports.Decidueye2 = exports.Dartrix2 = exports.Rowlet2 = exports.GrimmsnarlVmaxSHF = exports.GrimmsnarlVSHF = exports.ToxtricityVmaxSHF = exports.ToxtricityVSHF = exports.LaprasVmaxSHF = exports.LaprasVSHF = exports.CentiskorchVmaxSHF = exports.CentiskorchVSHF = exports.CharizardVmaxSHF = exports.RillaboomVmaxSHF = exports.RillaboomVSHF = exports.DubwoolSHF = exports.WoolooSHF = void 0;
exports.SobbleSHF = exports.DrizzileSHF = exports.ChewtleSHF = exports.BlipbugSHF = exports.CopperajahSHF = exports.DubwoolVSHF = exports.EiscueSHF = exports.DragapultSHF = exports.FalinksVSHF = exports.BarraskewdaSHF = exports.CentiskorchSHF = exports.GalarianMrRimeSHF = exports.GalarianPerrserkerSHF = exports.GalarianCursolaSHF = exports.ArctozoltSHF = exports.DracovishSHF = exports.DecidueyeSHF = exports.FlappleSHF = exports.GalarianRapidashSHF = exports.GalarianMeowthSHF = exports.GalarianZigzagoonSHF = exports.AppletunSHF = exports.GalarianObstagoonSHF = exports.FrosmothSHF2 = exports.CinderaceSHF = exports.CinderaceVSHF = exports.CoalossalSHF = exports.CrobatVSHF = exports.EternatusVmaxSHF = exports.EternatusVSHF = exports.LuxioSHF = exports.InteleonSHF = exports.GalarianStunfiskSHF = exports.OranguruSHF = exports.GrimmsnarlSHF = exports.HattereneSHF = void 0;
const bird_keeper_1 = require("../set-darkness-ablaze/bird-keeper");
const frosmoth_1 = require("../set-sword-and-shield/frosmoth");
const rowlet_1 = require("../set-darkness-ablaze/rowlet");
const grookey_1 = require("../set-sword-and-shield/grookey");
const dottler_1 = require("../set-sword-and-shield/dottler");
const eldegoss_1 = require("../set-sword-and-shield/eldegoss");
const scorbunny_1 = require("../set-sword-and-shield/scorbunny");
const suicune_1 = require("../set-darkness-ablaze/suicune");
const galarian_darumaka_1 = require("../set-rebel-clash/galarian-darumaka");
const galarian_darmanitan_1 = require("../set-rebel-clash/galarian-darmanitan");
const drednaw_1 = require("../set-sword-and-shield/drednaw");
const cramorant_1 = require("../set-rebel-clash/cramorant");
const arctovish_1 = require("../set-darkness-ablaze/arctovish");
const yamper_1 = require("../set-sword-and-shield/yamper");
const boltund_1 = require("../set-sword-and-shield/boltund");
const toxtricity_1 = require("../set-darkness-ablaze/toxtricity");
const pincurchin_1 = require("../set-sword-and-shield/pincurchin");
const morpeko_1 = require("../set-rebel-clash/morpeko");
const dracozolt_1 = require("../set-darkness-ablaze/dracozolt");
const galarian_ponyta_1 = require("../set-sword-and-shield/galarian-ponyta");
const galarian_corsola_1 = require("../set-rebel-clash/galarian-corsola");
const dedenne_1 = require("../set-darkness-ablaze/dedenne");
const polteageist_1 = require("../set-darkness-ablaze/polteageist");
const hatenna_1 = require("../set-rebel-clash/hatenna");
const hattrem_1 = require("../set-rebel-clash/hattrem");
const milcery_1 = require("../set-rebel-clash/milcery");
const alcremie_1 = require("../set-rebel-clash/alcremie");
const indeedee_1 = require("../set-rebel-clash/indeedee");
const dreepy_1 = require("../set-rebel-clash/dreepy");
const drakloak_1 = require("../set-rebel-clash/drakloak");
const galarian_farfetchd_1 = require("../set-rebel-clash/galarian-farfetchd");
const galarian_sirfetchd_1 = require("../set-rebel-clash/galarian-sirfetchd");
const galarian_yamask_1 = require("../set-rebel-clash/galarian-yamask");
const galarian_runerigus_1 = require("../set-rebel-clash/galarian-runerigus");
const silicobra_1 = require("../set-sword-and-shield/silicobra");
const sandaconda_1 = require("../set-sword-and-shield/sandaconda");
const clobbopus_1 = require("../set-sword-and-shield/clobbopus");
const grapploct_1 = require("../set-sword-and-shield/grapploct");
const stonjourner_1 = require("../set-rebel-clash/stonjourner");
const galarian_linoone_1 = require("../set-sword-and-shield/galarian-linoone");
const nickit_1 = require("../set-sword-and-shield/nickit");
const thievul_1 = require("../set-sword-and-shield/thievul");
const morgrem_1 = require("../set-rebel-clash/morgrem");
const corviknight_1 = require("../set-sword-and-shield/corviknight");
const duraludon_1 = require("../set-rebel-clash/duraludon");
const minccino_1 = require("../set-sword-and-shield/minccino");
const swanna_1 = require("../set-darkness-ablaze/swanna");
const bunnelby_1 = require("../set-darkness-ablaze/bunnelby");
const corvisquire_1 = require("../set-sword-and-shield/corvisquire");
const wooloo_1 = require("../set-sword-and-shield/wooloo");
const dubwool_1 = require("../set-sword-and-shield/dubwool");
const rillaboom_v_1 = require("../set-rebel-clash/rillaboom-v");
const rillaboom_vmax_1 = require("../set-rebel-clash/rillaboom-vmax");
const charizard_vmax_1 = require("../set-darkness-ablaze/charizard-vmax");
const centiskorch_v_1 = require("../set-darkness-ablaze/centiskorch-v");
const centiskorch_vmax_1 = require("../set-darkness-ablaze/centiskorch-vmax");
const lapras_v_1 = require("../set-sword-and-shield/lapras-v");
const lapras_vmax_1 = require("../set-sword-and-shield/lapras-vmax");
const toxtricity_v_1 = require("../set-rebel-clash/toxtricity-v");
const toxtricity_vmax_1 = require("../set-rebel-clash/toxtricity-vmax");
const grimmsnarl_v_1 = require("../set-darkness-ablaze/grimmsnarl-v");
const grimmsnarl_vmax_1 = require("../set-darkness-ablaze/grimmsnarl-vmax");
const dartrix_1 = require("./dartrix");
const decidueye_1 = require("../set-darkness-ablaze/decidueye");
const dhelmise_v_1 = require("../set-sword-and-shield/dhelmise-v");
const thwackey_1 = require("./thwackey");
const rillaboom_1 = require("../set-sword-and-shield/rillaboom");
const cinderace_vmax_1 = require("../set-rebel-clash/cinderace-vmax");
const snom_1 = require("./snom");
const shinx_1 = require("../set-rebel-clash/shinx");
const luxray_1 = require("../set-rebel-clash/luxray");
const rotom_1 = require("./rotom");
const morpeko_2_1 = require("./morpeko-2");
const morpeko_v_1 = require("../set-sword-and-shield/morpeko-v");
const morpeko_vmax_1 = require("../set-sword-and-shield/morpeko-vmax");
const indeedee_v_1 = require("./indeedee-v");
const trapinch_1 = require("../set-darkness-ablaze/trapinch");
const koffing_1 = require("./koffing");
const galarian_weezing_1 = require("./galarian-weezing");
const cufant_1 = require("./cufant");
const ditto_v_1 = require("./ditto-v");
const ditto_vmax_1 = require("./ditto-vmax");
const cramorant_v_1 = require("../set-sword-and-shield/cramorant-v");
const boss_orders_1 = require("../set-paldea-evolved/boss-orders");
const professors_research_1 = require("../set-scarlet-and-violet/professors-research");
const alcremie_v_1 = require("../set-champions-path/alcremie-v");
const ball_guy_1 = require("./ball-guy");
const cara_liss_1 = require("../set-vivid-voltage/cara-liss");
const gym_trainer_1 = require("./gym-trainer");
const piers_1 = require("../set-champions-path/piers");
const poke_kid_1 = require("../set-sword-and-shield/poke-kid");
const rose_1 = require("../set-darkness-ablaze/rose");
const skyla_1 = require("../set-boundaries-crossed/skyla");
const alcremie_vmax_1 = require("../set-champions-path/alcremie-vmax");
const orbeetle_1 = require("../set-sword-and-shield/orbeetle");
const greedent_1 = require("../set-rebel-clash/greedent");
const hatterene_1 = require("../set-rebel-clash/hatterene");
const grimmsnarl_1 = require("../set-rebel-clash/grimmsnarl");
const oranguru_1 = require("../set-vivid-voltage/oranguru");
const galarian_stunfisk_1 = require("../set-sword-and-shield/galarian-stunfisk");
const inteleon_1 = require("../set-sword-and-shield/inteleon");
const luxio_1 = require("../set-rebel-clash/luxio");
const eternatus_v_1 = require("../set-darkness-ablaze/eternatus-v");
const eternatus_vmax_1 = require("../set-darkness-ablaze/eternatus-vmax");
const crobat_v_1 = require("../set-darkness-ablaze/crobat-v");
const coalossal_1 = require("../set-rebel-clash/coalossal");
const cinderace_v_1 = require("../set-rebel-clash/cinderace-v");
const cinderace_1 = require("../set-sword-and-shield/cinderace");
const galarian_obstagoon_1 = require("../set-vivid-voltage/galarian-obstagoon");
const appletun_1 = require("../set-rebel-clash/appletun");
const galarian_zigzagoon_1 = require("../set-sword-and-shield/galarian-zigzagoon");
const galarian_meowth_1 = require("../set-rebel-clash/galarian-meowth");
const galarian_rapidash_1 = require("../set-sword-and-shield/galarian-rapidash");
const flapple_1 = require("../set-rebel-clash/flapple");
const dracovish_1 = require("../set-darkness-ablaze/dracovish");
const arctozolt_1 = require("../set-darkness-ablaze/arctozolt");
const galarian_cursola_1 = require("../set-rebel-clash/galarian-cursola");
const galarian_perrserker_1 = require("../set-sword-and-shield/galarian-perrserker");
const galarian_mr_rime_1 = require("../set-darkness-ablaze/galarian-mr-rime");
const centiskorch_1 = require("../set-sword-and-shield/centiskorch");
const barraskewda_1 = require("../set-rebel-clash/barraskewda");
const falinks_v_1 = require("../set-rebel-clash/falinks-v");
const dragapult_1 = require("../set-rebel-clash/dragapult");
const eiscue_1 = require("../set-rebel-clash/eiscue");
const dubwool_v_1 = require("../set-rebel-clash/dubwool-v");
const copperajah_1 = require("../set-darkness-ablaze/copperajah");
const blipbug_1 = require("../set-sword-and-shield/blipbug");
const chewtle_1 = require("../set-sword-and-shield/chewtle");
const drizzile_1 = require("../set-sword-and-shield/drizzile");
const sobble_3_1 = require("../set-sword-and-shield/sobble-3");
class BirdKeeperSHF extends bird_keeper_1.BirdKeeper {
    constructor() {
        super(...arguments);
        this.fullName = 'Bird Keeper SHF';
        this.set = 'SHF';
        this.setNumber = '66';
    }
}
exports.BirdKeeperSHF = BirdKeeperSHF;
class FrosmothSHF extends frosmoth_1.Frosmoth {
    constructor() {
        super(...arguments);
        this.fullName = 'Frosmoth SHF';
        this.set = 'SHF';
        this.setNumber = '30';
    }
}
exports.FrosmothSHF = FrosmothSHF;
class RowletSHF extends rowlet_1.Rowlet {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV001';
        this.fullName = 'Rowlet SHF';
    }
}
exports.RowletSHF = RowletSHF;
class GrookeySHF extends grookey_1.Grookey {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV004';
        this.fullName = 'Grookey SHF';
    }
}
exports.GrookeySHF = GrookeySHF;
class RillaboomSHF extends rillaboom_1.Rillaboom {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV6';
        this.fullName = 'Rillaboom SHF SV6';
    }
}
exports.RillaboomSHF = RillaboomSHF;
class DottlerSHF extends dottler_1.Dottler {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV008';
        this.fullName = 'Dottler SHF';
    }
}
exports.DottlerSHF = DottlerSHF;
class EldegossSHF extends eldegoss_1.Eldegoss {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV011';
        this.fullName = 'Eldegoss SHF';
    }
}
exports.EldegossSHF = EldegossSHF;
// export class ApplinSHF extends Applin2 {
//   public set: string = 'SHF';
//   public setNumber: string = 'SV012';
//   public fullName: string = 'Applin SHF';
// }
class ScorbunnySHF extends scorbunny_1.Scorbunny {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV015';
        this.fullName = 'Scorbunny SHF';
    }
}
exports.ScorbunnySHF = ScorbunnySHF;
class SuicuneSHF extends suicune_1.Suicune {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV022';
        this.fullName = 'Suicune SHF';
    }
}
exports.SuicuneSHF = SuicuneSHF;
class GalarianDarumakaSHF extends galarian_darumaka_1.GalarianDarumaka {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV023';
        this.fullName = 'Galarian Darumaka SHF';
    }
}
exports.GalarianDarumakaSHF = GalarianDarumakaSHF;
class GalarianDarmanitanSHF extends galarian_darmanitan_1.GalarianDarmanitan {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV024';
        this.fullName = 'Galarian Darmanitan SHF';
    }
}
exports.GalarianDarmanitanSHF = GalarianDarmanitanSHF;
class DrednawSHF extends drednaw_1.Drednaw {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV029';
        this.fullName = 'Drednaw SHF';
    }
}
exports.DrednawSHF = DrednawSHF;
class CramorantSHF extends cramorant_1.Cramorant {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV030';
        this.fullName = 'Cramorant SHF';
    }
}
exports.CramorantSHF = CramorantSHF;
class ArctovishSHF extends arctovish_1.Arctovish {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV037';
        this.fullName = 'Arctovish SHF';
    }
}
exports.ArctovishSHF = ArctovishSHF;
class YamperSHF extends yamper_1.Yamper {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV039';
        this.fullName = 'Yamper SHF';
    }
}
exports.YamperSHF = YamperSHF;
class BoltundSHF extends boltund_1.Boltund {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV040';
        this.fullName = 'Boltund SHF';
    }
}
exports.BoltundSHF = BoltundSHF;
class ToxtricitySHF extends toxtricity_1.Toxtricity {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV042';
        this.fullName = 'Toxtricity SHF';
    }
}
exports.ToxtricitySHF = ToxtricitySHF;
class PincurchinSHF extends pincurchin_1.Pincurchin {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV043';
        this.fullName = 'Pincurchin SHF';
    }
}
exports.PincurchinSHF = PincurchinSHF;
class MorpekoSHF extends morpeko_1.Morpeko {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV044';
        this.fullName = 'Morpeko SHF';
    }
}
exports.MorpekoSHF = MorpekoSHF;
class DracozoltSHF extends dracozolt_1.Dracozolt {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV045';
        this.fullName = 'Dracozolt SHF';
    }
}
exports.DracozoltSHF = DracozoltSHF;
class GalarianPonytaSHF extends galarian_ponyta_1.GalarianPonyta {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV047';
        this.fullName = 'Galarian Ponyta SHF';
    }
}
exports.GalarianPonytaSHF = GalarianPonytaSHF;
class GalarianCorsolaSHF extends galarian_corsola_1.GalarianCorsola {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV049';
        this.fullName = 'Galarian Corsola SHF';
    }
}
exports.GalarianCorsolaSHF = GalarianCorsolaSHF;
class DedenneSHF extends dedenne_1.Dedenne {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV051';
        this.fullName = 'Dedenne SHF';
    }
}
exports.DedenneSHF = DedenneSHF;
class PolteageistSHF extends polteageist_1.Polteageist {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV053';
        this.fullName = 'Polteageist SHF';
    }
}
exports.PolteageistSHF = PolteageistSHF;
class HatennaSHF extends hatenna_1.Hatenna {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV054';
        this.fullName = 'Hatenna SHF';
    }
}
exports.HatennaSHF = HatennaSHF;
class HattremSHF extends hattrem_1.Hattrem {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV055';
        this.fullName = 'Hattrem SHF';
    }
}
exports.HattremSHF = HattremSHF;
class MilcerySHF extends milcery_1.Milcery {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV057';
        this.fullName = 'Milcery SHF';
    }
}
exports.MilcerySHF = MilcerySHF;
class AlcremieSHF extends alcremie_1.Alcremie {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV058';
        this.fullName = 'Alcremie SHF';
    }
}
exports.AlcremieSHF = AlcremieSHF;
class IndeedeeSHF extends indeedee_1.Indeedee {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV059';
        this.fullName = 'Indeedee SHF';
    }
}
exports.IndeedeeSHF = IndeedeeSHF;
class DreepySHF extends dreepy_1.Dreepy {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV060';
        this.fullName = 'Dreepy SHF';
    }
}
exports.DreepySHF = DreepySHF;
class DrakloakSHF extends drakloak_1.Drakloak {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV061';
        this.fullName = 'Drakloak SHF';
    }
}
exports.DrakloakSHF = DrakloakSHF;
class GalarianFarfetchdSHF extends galarian_farfetchd_1.GalarianFarfetchd {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV063';
        this.fullName = 'Galarian Farfetch\'d SHF';
    }
}
exports.GalarianFarfetchdSHF = GalarianFarfetchdSHF;
class GalarianSirfetchdSHF extends galarian_sirfetchd_1.GalarianSirfetchd {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV064';
        this.fullName = 'Galarian Sirfetch\'d SHF';
    }
}
exports.GalarianSirfetchdSHF = GalarianSirfetchdSHF;
class GalarianYamaskSHF extends galarian_yamask_1.GalarianYamask {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV065';
        this.fullName = 'Galarian Yamask SHF';
    }
}
exports.GalarianYamaskSHF = GalarianYamaskSHF;
class GalarianRunerigusSHF extends galarian_runerigus_1.GalarianRunerigus {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV066';
        this.fullName = 'Galarian Runerigus SHF';
    }
}
exports.GalarianRunerigusSHF = GalarianRunerigusSHF;
class SilicobraSHF extends silicobra_1.Silicobra {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV070';
        this.fullName = 'Silicobra SHF';
    }
}
exports.SilicobraSHF = SilicobraSHF;
class SandacondaSHF extends sandaconda_1.Sandaconda {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV071';
        this.fullName = 'Sandaconda SHF';
    }
}
exports.SandacondaSHF = SandacondaSHF;
class ClobbopusSHF extends clobbopus_1.Clobbopus {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV072';
        this.fullName = 'Clobbopus SHF';
    }
}
exports.ClobbopusSHF = ClobbopusSHF;
class GrapploctSHF extends grapploct_1.Grapploct {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV073';
        this.fullName = 'Grapploct SHF';
    }
}
exports.GrapploctSHF = GrapploctSHF;
class StonjournerSHF extends stonjourner_1.Stonjourner {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV075';
        this.fullName = 'Stonjourner SHF';
    }
}
exports.StonjournerSHF = StonjournerSHF;
class GalarianLinooneSHF extends galarian_linoone_1.GalarianLinoone {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV079';
        this.fullName = 'Galarian Linoone SHF';
    }
}
exports.GalarianLinooneSHF = GalarianLinooneSHF;
class NickitSHF extends nickit_1.Nickit {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV081';
        this.fullName = 'Nickit SHF';
    }
}
exports.NickitSHF = NickitSHF;
class ThievulSHF extends thievul_1.Thievul {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV082';
        this.fullName = 'Thievul SHF';
    }
}
exports.ThievulSHF = ThievulSHF;
class MorgremSHF extends morgrem_1.Morgrem {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV084';
        this.fullName = 'Morgrem SHF';
    }
}
exports.MorgremSHF = MorgremSHF;
class CorviknightSHF extends corviknight_1.Corviknight {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV089';
        this.fullName = 'Corviknight SHF';
    }
}
exports.CorviknightSHF = CorviknightSHF;
class DuraludonSHF extends duraludon_1.Duraludon {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV092';
        this.fullName = 'Duraludon SHF';
    }
}
exports.DuraludonSHF = DuraludonSHF;
class MinccinoSHF extends minccino_1.Minccino {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV093';
        this.fullName = 'Minccino SHF';
    }
}
exports.MinccinoSHF = MinccinoSHF;
class SwannaSHF extends swanna_1.Swanna {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV096';
        this.fullName = 'Swanna SHF';
    }
}
exports.SwannaSHF = SwannaSHF;
class BunnelbySHF extends bunnelby_1.Bunnelby {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV097';
        this.fullName = 'Bunnelby SHF';
    }
}
exports.BunnelbySHF = BunnelbySHF;
class CorvisquireSHF extends corvisquire_1.Corvisquire {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV102';
        this.fullName = 'Corvisquire SHF';
    }
}
exports.CorvisquireSHF = CorvisquireSHF;
class WoolooSHF extends wooloo_1.Wooloo {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV103';
        this.fullName = 'Wooloo SHF';
    }
}
exports.WoolooSHF = WoolooSHF;
class DubwoolSHF extends dubwool_1.Dubwool {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV104';
        this.fullName = 'Dubwool SHF';
    }
}
exports.DubwoolSHF = DubwoolSHF;
class RillaboomVSHF extends rillaboom_v_1.RillaboomV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV105';
        this.fullName = 'Rillaboom V SHF';
    }
}
exports.RillaboomVSHF = RillaboomVSHF;
class RillaboomVmaxSHF extends rillaboom_vmax_1.RillaboomVmax {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV106';
        this.fullName = 'Rillaboom VMAX SHF';
    }
}
exports.RillaboomVmaxSHF = RillaboomVmaxSHF;
class CharizardVmaxSHF extends charizard_vmax_1.CharizardVmax {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV107';
        this.fullName = 'Charizard VMAX SHF';
    }
}
exports.CharizardVmaxSHF = CharizardVmaxSHF;
class CentiskorchVSHF extends centiskorch_v_1.CentiskorchV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV108';
        this.fullName = 'Centiskorch V SHF';
    }
}
exports.CentiskorchVSHF = CentiskorchVSHF;
class CentiskorchVmaxSHF extends centiskorch_vmax_1.CentiskorchVmax {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV109';
        this.fullName = 'Centiskorch VMAX SHF';
    }
}
exports.CentiskorchVmaxSHF = CentiskorchVmaxSHF;
class LaprasVSHF extends lapras_v_1.LaprasV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV110';
        this.fullName = 'Lapras V SHF';
    }
}
exports.LaprasVSHF = LaprasVSHF;
class LaprasVmaxSHF extends lapras_vmax_1.LaprasVmax {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV111';
        this.fullName = 'Lapras VMAX SHF';
    }
}
exports.LaprasVmaxSHF = LaprasVmaxSHF;
class ToxtricityVSHF extends toxtricity_v_1.ToxtricityV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV112';
        this.fullName = 'Toxtricity V SHF';
    }
}
exports.ToxtricityVSHF = ToxtricityVSHF;
class ToxtricityVmaxSHF extends toxtricity_vmax_1.ToxtricityVmax {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV113';
        this.fullName = 'Toxtricity VMAX SHF';
    }
}
exports.ToxtricityVmaxSHF = ToxtricityVmaxSHF;
class GrimmsnarlVSHF extends grimmsnarl_v_1.GrimmsnarlV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV116';
        this.fullName = 'Grimmsnarl V SHF';
    }
}
exports.GrimmsnarlVSHF = GrimmsnarlVSHF;
class GrimmsnarlVmaxSHF extends grimmsnarl_vmax_1.GrimmsnarlVmax {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV117';
        this.fullName = 'Grimmsnarl VMAX SHF';
    }
}
exports.GrimmsnarlVmaxSHF = GrimmsnarlVmaxSHF;
class Rowlet2 extends rowlet_1.Rowlet {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '6';
        this.fullName = 'Rowlet SHF 6';
    }
}
exports.Rowlet2 = Rowlet2;
class Dartrix2 extends dartrix_1.Dartrix {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '7';
        this.fullName = 'Dartrix SHF 7';
    }
}
exports.Dartrix2 = Dartrix2;
class Decidueye2 extends decidueye_1.Decidueye {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '8';
        this.fullName = 'Decidueye SHF 8';
    }
}
exports.Decidueye2 = Decidueye2;
class DhelmiseVSHF extends dhelmise_v_1.DhelmiseV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '9';
        this.fullName = 'Dhelmise V SHF';
    }
}
exports.DhelmiseVSHF = DhelmiseVSHF;
class Grookey2 extends grookey_1.Grookey {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '11';
        this.fullName = 'Grookey SHF 11';
    }
}
exports.Grookey2 = Grookey2;
class Thwackey2 extends thwackey_1.Thwackey {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '12';
        this.fullName = 'Thwackey SHF 12';
    }
}
exports.Thwackey2 = Thwackey2;
class Rillaboom2 extends rillaboom_1.Rillaboom {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '13';
        this.fullName = 'Rillaboom SHF 13';
    }
}
exports.Rillaboom2 = Rillaboom2;
class CinderaceVmaxSHF extends cinderace_vmax_1.CinderaceVmax {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '19';
        this.fullName = 'Cinderace VMAX SHF';
    }
}
exports.CinderaceVmaxSHF = CinderaceVmaxSHF;
class Snom2 extends snom_1.Snom {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '29';
        this.fullName = 'Snom SHF 29';
    }
}
exports.Snom2 = Snom2;
class ShinxSHF extends shinx_1.Shinx {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '31';
        this.fullName = 'Shinx SHF';
    }
}
exports.ShinxSHF = ShinxSHF;
class LuxraySHF extends luxray_1.Luxray {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '33';
        this.fullName = 'Luxray SHF';
    }
}
exports.LuxraySHF = LuxraySHF;
class Rotom2 extends rotom_1.Rotom {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '34';
        this.fullName = 'Rotom SHF 34';
    }
}
exports.Rotom2 = Rotom2;
class Morpeko3 extends morpeko_2_1.Morpeko2 {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '36';
        this.fullName = 'Morpeko SHF 36';
    }
}
exports.Morpeko3 = Morpeko3;
class MorpekoVSHF extends morpeko_v_1.MorpekoV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '37';
        this.fullName = 'Morpeko V SHF';
    }
}
exports.MorpekoVSHF = MorpekoVSHF;
class MorpekoVmaxSHF extends morpeko_vmax_1.MorpekoVmax {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '38';
        this.fullName = 'Morpeko VMAX SHF';
    }
}
exports.MorpekoVmaxSHF = MorpekoVmaxSHF;
class IndeedeeV2 extends indeedee_v_1.IndeedeeV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '39';
        this.fullName = 'Indeedee V SHF 39';
    }
}
exports.IndeedeeV2 = IndeedeeV2;
class TrapinchSHF extends trapinch_1.Trapinch {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '40';
        this.fullName = 'Trapinch SHF';
    }
}
exports.TrapinchSHF = TrapinchSHF;
class Koffing2 extends koffing_1.Koffing {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '41';
        this.fullName = 'Koffing SHF 41';
    }
}
exports.Koffing2 = Koffing2;
class GalarianWeezing2 extends galarian_weezing_1.GalarianWeezing {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '42';
        this.fullName = 'Galarian Weezing SHF 42';
    }
}
exports.GalarianWeezing2 = GalarianWeezing2;
class Nickit2 extends nickit_1.Nickit {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '47';
        this.fullName = 'Nickit SHF 47';
    }
}
exports.Nickit2 = Nickit2;
class Cufant2 extends cufant_1.Cufant {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '49';
        this.fullName = 'Cufant SHF 49';
    }
}
exports.Cufant2 = Cufant2;
class DittoV2 extends ditto_v_1.DittoV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '50';
        this.fullName = 'Ditto V SHF 50';
    }
}
exports.DittoV2 = DittoV2;
class DittoVmax2 extends ditto_vmax_1.DittoVmax {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '51';
        this.fullName = 'Ditto VMAX SHF 51';
    }
}
exports.DittoVmax2 = DittoVmax2;
class CramorantVSHF extends cramorant_v_1.CramorantV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '54';
        this.fullName = 'Cramorant V SHF';
    }
}
exports.CramorantVSHF = CramorantVSHF;
class BosssOrdersSHF extends boss_orders_1.BossOrders {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '58';
        this.fullName = 'Boss\'s Orders SHF';
    }
}
exports.BosssOrdersSHF = BosssOrdersSHF;
class ProfessorsResearchSHF extends professors_research_1.ProfessorsResearch {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '60';
        this.fullName = 'Professor\'s Research SHF';
    }
}
exports.ProfessorsResearchSHF = ProfessorsResearchSHF;
class AlcremieVSHF extends alcremie_v_1.AlcremieV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '64';
        this.fullName = 'Alcremie V SHF';
    }
}
exports.AlcremieVSHF = AlcremieVSHF;
class BallGuy2 extends ball_guy_1.BallGuy {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '65';
        this.fullName = 'Ball Guy SHF 65';
    }
}
exports.BallGuy2 = BallGuy2;
class CaraLissSHF extends cara_liss_1.CaraLiss {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '67';
        this.fullName = 'Cara Liss SHF';
    }
}
exports.CaraLissSHF = CaraLissSHF;
class GymTrainer2 extends gym_trainer_1.GymTrainer {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '68';
        this.fullName = 'Gym Trainer SHF 68';
    }
}
exports.GymTrainer2 = GymTrainer2;
class PiersSHF extends piers_1.Piers {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '69';
        this.fullName = 'Piers SHF';
    }
}
exports.PiersSHF = PiersSHF;
class PokeKidSHF extends poke_kid_1.PokeKid {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '70';
        this.fullName = 'Poké Kid SHF';
    }
}
exports.PokeKidSHF = PokeKidSHF;
class RoseSHF extends rose_1.Rose {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '71';
        this.fullName = 'Rose SHF';
    }
}
exports.RoseSHF = RoseSHF;
class SkylaSHF extends skyla_1.Skyla {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '72';
        this.fullName = 'Skyla SHF';
    }
}
exports.SkylaSHF = SkylaSHF;
class AlcremieVmaxSHF extends alcremie_vmax_1.AlcremieVmax {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '73';
        this.fullName = 'Alcremie VMAX SHF';
    }
}
exports.AlcremieVmaxSHF = AlcremieVmaxSHF;
class OrbeetleSHF extends orbeetle_1.Orbeetle {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV009';
        this.fullName = 'Orbeetle SHF';
    }
}
exports.OrbeetleSHF = OrbeetleSHF;
class GreedentSHF extends greedent_1.Greedent {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV100';
        this.fullName = 'Greedent SHF';
    }
}
exports.GreedentSHF = GreedentSHF;
class HattereneSHF extends hatterene_1.Hatterene {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV056';
        this.fullName = 'Hatterene SHF';
    }
}
exports.HattereneSHF = HattereneSHF;
class GrimmsnarlSHF extends grimmsnarl_1.Grimmsnarl {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV085';
        this.fullName = 'Grimmsnarl SHF';
    }
}
exports.GrimmsnarlSHF = GrimmsnarlSHF;
class OranguruSHF extends oranguru_1.Oranguru {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV098';
        this.fullName = 'Oranguru SHF';
    }
}
exports.OranguruSHF = OranguruSHF;
class GalarianStunfiskSHF extends galarian_stunfisk_1.GalarianStunfisk {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV088';
        this.fullName = 'Galarian Stunfisk SHF';
    }
}
exports.GalarianStunfiskSHF = GalarianStunfiskSHF;
class InteleonSHF extends inteleon_1.Inteleon {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV027';
        this.fullName = 'Inteleon SHF';
    }
}
exports.InteleonSHF = InteleonSHF;
class LuxioSHF extends luxio_1.Luxio {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '32';
        this.fullName = 'Luxio SHF';
    }
}
exports.LuxioSHF = LuxioSHF;
class EternatusVSHF extends eternatus_v_1.EternatusV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV121';
        this.fullName = 'Eternatus V SHF';
    }
}
exports.EternatusVSHF = EternatusVSHF;
class EternatusVmaxSHF extends eternatus_vmax_1.EternatusVMAX {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV122';
        this.fullName = 'Eternatus VMAX SHF';
    }
}
exports.EternatusVmaxSHF = EternatusVmaxSHF;
class CrobatVSHF extends crobat_v_1.CrobatV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '44';
        this.fullName = 'Crobat V SHF';
    }
}
exports.CrobatVSHF = CrobatVSHF;
class CoalossalSHF extends coalossal_1.Coalossal {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV069';
        this.fullName = 'Coalossal SHF';
    }
}
exports.CoalossalSHF = CoalossalSHF;
class CinderaceVSHF extends cinderace_v_1.CinderaceV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = '18';
        this.fullName = 'Cinderace V SHF';
    }
}
exports.CinderaceVSHF = CinderaceVSHF;
class CinderaceSHF extends cinderace_1.Cinderace {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV017';
        this.fullName = 'Cinderace SHF';
    }
}
exports.CinderaceSHF = CinderaceSHF;
class FrosmothSHF2 extends frosmoth_1.Frosmoth {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV034';
        this.fullName = 'Frosmoth SHF SV034';
    }
}
exports.FrosmothSHF2 = FrosmothSHF2;
class GalarianObstagoonSHF extends galarian_obstagoon_1.GalarianObstagoon {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV080';
        this.fullName = 'Galarian Obstagoon SHF';
    }
}
exports.GalarianObstagoonSHF = GalarianObstagoonSHF;
class AppletunSHF extends appletun_1.Appletun {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV014';
        this.fullName = 'Appletun SHF';
    }
}
exports.AppletunSHF = AppletunSHF;
class GalarianZigzagoonSHF extends galarian_zigzagoon_1.GalarianZigzagoon {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV078';
        this.fullName = 'Galarian Zigzagoon SHF';
    }
}
exports.GalarianZigzagoonSHF = GalarianZigzagoonSHF;
class GalarianMeowthSHF extends galarian_meowth_1.GalarianMeowth {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV086';
        this.fullName = 'Galarian Meowth SHF';
    }
}
exports.GalarianMeowthSHF = GalarianMeowthSHF;
class GalarianRapidashSHF extends galarian_rapidash_1.GalarianRapidash {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV048';
        this.fullName = 'Galarian Rapidash SHF';
    }
}
exports.GalarianRapidashSHF = GalarianRapidashSHF;
class FlappleSHF extends flapple_1.Flapple {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV013';
        this.fullName = 'Flapple SHF';
    }
}
exports.FlappleSHF = FlappleSHF;
class DecidueyeSHF extends decidueye_1.Decidueye {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV003';
        this.fullName = 'Decidueye SHF';
    }
}
exports.DecidueyeSHF = DecidueyeSHF;
class DracovishSHF extends dracovish_1.Dracovish {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV036';
        this.fullName = 'Dracovish SHF';
    }
}
exports.DracovishSHF = DracovishSHF;
class ArctozoltSHF extends arctozolt_1.Arctozolt {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV046';
        this.fullName = 'Arctozolt SHF';
    }
}
exports.ArctozoltSHF = ArctozoltSHF;
class GalarianCursolaSHF extends galarian_cursola_1.GalarianCursola {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV050';
        this.fullName = 'Galarian Cursola SHF';
    }
}
exports.GalarianCursolaSHF = GalarianCursolaSHF;
class GalarianPerrserkerSHF extends galarian_perrserker_1.GalarianPerrserker {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV087';
        this.fullName = 'Galarian Perrserker SHF';
    }
}
exports.GalarianPerrserkerSHF = GalarianPerrserkerSHF;
class GalarianMrRimeSHF extends galarian_mr_rime_1.GalarianMrRime {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV021';
        this.fullName = 'Galarian Mr. Rime SHF';
    }
}
exports.GalarianMrRimeSHF = GalarianMrRimeSHF;
class CentiskorchSHF extends centiskorch_1.Centiskorch {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV019';
        this.fullName = 'Centiskorch SHF';
    }
}
exports.CentiskorchSHF = CentiskorchSHF;
class BarraskewdaSHF extends barraskewda_1.Barraskewda {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV032';
        this.fullName = 'Barraskewda SHF';
    }
}
exports.BarraskewdaSHF = BarraskewdaSHF;
class FalinksVSHF extends falinks_v_1.FalinksV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV115';
        this.fullName = 'Falinks V SHF';
    }
}
exports.FalinksVSHF = FalinksVSHF;
class DragapultSHF extends dragapult_1.Dragapult {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV062';
        this.fullName = 'Dragapult SHF';
    }
}
exports.DragapultSHF = DragapultSHF;
class EiscueSHF extends eiscue_1.Eiscue {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV035';
        this.fullName = 'Eiscue SHF';
    }
}
exports.EiscueSHF = EiscueSHF;
class DubwoolVSHF extends dubwool_v_1.DubwoolV {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV120';
        this.fullName = 'Dubwool V SHF';
    }
}
exports.DubwoolVSHF = DubwoolVSHF;
class CopperajahSHF extends copperajah_1.Copperajah {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV091';
        this.fullName = 'Copperajah SHF';
    }
}
exports.CopperajahSHF = CopperajahSHF;
class BlipbugSHF extends blipbug_1.Blipbug {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV007';
        this.fullName = 'Blipbug SHF';
    }
}
exports.BlipbugSHF = BlipbugSHF;
class ChewtleSHF extends chewtle_1.Chewtle {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV028';
        this.fullName = 'Chewtle SHF';
    }
}
exports.ChewtleSHF = ChewtleSHF;
class DrizzileSHF extends drizzile_1.Drizzile {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV026';
        this.fullName = 'Drizzile SHF';
    }
}
exports.DrizzileSHF = DrizzileSHF;
class SobbleSHF extends sobble_3_1.Sobble3 {
    constructor() {
        super(...arguments);
        this.set = 'SHF';
        this.setNumber = 'SV025';
        this.fullName = 'Sobble SHF';
    }
}
exports.SobbleSHF = SobbleSHF;
