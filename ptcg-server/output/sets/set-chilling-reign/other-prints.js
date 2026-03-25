"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenipedeCRE = exports.KoffingCRE = exports.FightingEnergyCRE = exports.PsychicEnergyCRE = exports.WaterEnergyCRE = exports.UrnOfVitalityCRE = exports.FogCrystal2CRE = exports.FanOfWavesCRE = exports.EchoingHorn2CRE = exports.SnorlaxCRE = exports.Peony3CRE = exports.Peonia3CRE = exports.Melony3CRE = exports.Klara3CRE = exports.KarensConviction3CRE = exports.Flannery3CRE = exports.Caitlin3CRE = exports.Brawly3CRE = exports.Avery3CRE = exports.Agatha3CRE = exports.ShadowRiderCalyrexVMAX3CRE = exports.ShadowRiderCalyrexVMAX2CRE = exports.IceRiderCalyrexVMAX3CRE = exports.IceRiderCalyrexVMAX2CRE = exports.BlazikenVMAX3CRE = exports.BlazikenVMAX2CRE = exports.Peony2CRE = exports.Peonia2CRE = exports.Melony2CRE = exports.Klara2CRE = exports.KarensConviction2CRE = exports.Flannery2CRE = exports.Caitlin2CRE = exports.Brawly2CRE = exports.Avery2CRE = exports.Agatha2CRE = exports.BlisseyV3CRE = exports.BlisseyV2CRE = exports.GalarianMoltresV3CRE = exports.GalarianMoltresV2CRE = exports.GalarianZapdosV3CRE = exports.GalarianZapdosV2CRE = exports.ShadowRiderCalyrexV3CRE = exports.ShadowRiderCalyrexV2CRE = exports.GalarianArticunoV3CRE = exports.GalarianArticunoV2CRE = exports.IceRiderCalyrexV3CRE = exports.IceRiderCalyrexV2CRE = exports.BlazikenV2CRE = exports.BronzongCRE = void 0;
exports.WelcomingLantern2 = exports.RuggedHelmet2 = exports.Siebold3 = exports.Doctor3 = exports.TornadusVmax2 = exports.MetagrossVmax2 = exports.GalarianSlowkingVmax2 = exports.SandacondaVmax2 = exports.CelebiVmax2 = exports.Siebold2 = exports.Honey2 = exports.Doctor2 = exports.TornadusV3 = exports.TornadusV2 = exports.MetagrossV2 = exports.LiepardV2 = exports.GalarianSlowkingV3 = exports.GalarianSlowkingV2 = exports.SandacondaV2 = exports.GalarianRapidashV2 = exports.ZeraoraV3 = exports.ZeraoraV2 = exports.VolcanionV2 = exports.CelebiV2 = void 0;
const blaziken_v_1 = require("../set-chilling-reign/blaziken-v");
const ice_rider_calyrex_v_1 = require("../set-chilling-reign/ice-rider-calyrex-v");
const galarian_articuno_v_1 = require("../set-chilling-reign/galarian-articuno-v");
const shadow_rider_calyrex_v_1 = require("../set-chilling-reign/shadow-rider-calyrex-v");
const galarian_zapdos_v_1 = require("../set-chilling-reign/galarian-zapdos-v");
const galarian_moltres_v_1 = require("../set-chilling-reign/galarian-moltres-v");
const blissey_v_1 = require("../set-chilling-reign/blissey-v");
const agatha_1 = require("../set-chilling-reign/agatha");
const avery_1 = require("../set-chilling-reign/avery");
const brawly_1 = require("../set-chilling-reign/brawly");
const caitlin_1 = require("../set-chilling-reign/caitlin");
const flannery_1 = require("../set-chilling-reign/flannery");
const karens_conviction_1 = require("../set-chilling-reign/karens-conviction");
const klara_1 = require("../set-chilling-reign/klara");
const melony_1 = require("../set-chilling-reign/melony");
const peonia_1 = require("../set-chilling-reign/peonia");
const peony_1 = require("../set-chilling-reign/peony");
const blaziken_vmax_1 = require("../set-chilling-reign/blaziken-vmax");
const ice_rider_calyrex_vmax_1 = require("../set-chilling-reign/ice-rider-calyrex-vmax");
const shadow_rider_calyrex_vmax_1 = require("../set-chilling-reign/shadow-rider-calyrex-vmax");
const snorlax_1 = require("../set-vivid-voltage/snorlax");
const echoing_horn_1 = require("../set-chilling-reign/echoing-horn");
const fan_of_waves_1 = require("../set-battle-styles/fan-of-waves");
const fog_crystal_1 = require("../set-chilling-reign/fog-crystal");
const urn_of_vitality_1 = require("../set-battle-styles/urn-of-vitality");
const water_energy_1 = require("../set-base-set-energy/water-energy");
const psychic_energy_1 = require("../set-base-set-energy/psychic-energy");
const fighting_energy_1 = require("../set-base-set-energy/fighting-energy");
const bronzong_1 = require("../set-battle-styles/bronzong");
const koffing_1 = require("../set-ex-deoxys/koffing");
const venipede_1 = require("../set-black-and-white/venipede");
const celebi_v_1 = require("./celebi-v");
const volcanion_v_1 = require("./volcanion-v");
const zeraora_v_1 = require("./zeraora-v");
const galarian_rapidash_v_1 = require("./galarian-rapidash-v");
const sandaconda_v_1 = require("./sandaconda-v");
const galarian_slowking_v_1 = require("./galarian-slowking-v");
const liepard_v_1 = require("./liepard-v");
const metagross_v_1 = require("./metagross-v");
const tornadus_v_1 = require("./tornadus-v");
const doctor_1 = require("./doctor");
const honey_1 = require("./honey");
const siebold_1 = require("./siebold");
const celebi_vmax_1 = require("./celebi-vmax");
const sandaconda_vmax_1 = require("./sandaconda-vmax");
const galarian_slowking_vmax_1 = require("./galarian-slowking-vmax");
const metagross_vmax_1 = require("./metagross-vmax");
const tornadus_vmax_1 = require("./tornadus-vmax");
const rugged_helmet_1 = require("./rugged-helmet");
const welcoming_lantern_1 = require("./welcoming-lantern");
class BronzongCRE extends bronzong_1.Bronzong {
    constructor() {
        super(...arguments);
        this.fullName = 'Bronzong CRE 223';
        this.set = 'CRE';
        this.setNumber = '223';
    }
}
exports.BronzongCRE = BronzongCRE;
class BlazikenV2CRE extends blaziken_v_1.BlazikenV {
    constructor() {
        super(...arguments);
        this.setNumber = '161';
        this.fullName = 'Blaziken V2 CRE';
        this.set = 'CRE';
    }
}
exports.BlazikenV2CRE = BlazikenV2CRE;
class IceRiderCalyrexV2CRE extends ice_rider_calyrex_v_1.IceRiderCalyrexV {
    constructor() {
        super(...arguments);
        this.setNumber = '163';
        this.fullName = 'Ice Rider Calyrex V2 CRE';
        this.set = 'CRE';
    }
}
exports.IceRiderCalyrexV2CRE = IceRiderCalyrexV2CRE;
class IceRiderCalyrexV3CRE extends ice_rider_calyrex_v_1.IceRiderCalyrexV {
    constructor() {
        super(...arguments);
        this.setNumber = '164';
        this.fullName = 'Ice Rider Calyrex V3 CRE';
        this.set = 'CRE';
    }
}
exports.IceRiderCalyrexV3CRE = IceRiderCalyrexV3CRE;
class GalarianArticunoV2CRE extends galarian_articuno_v_1.GalarianArticunoV {
    constructor() {
        super(...arguments);
        this.setNumber = '169';
        this.fullName = 'Galarian Articuno V2 CRE';
        this.set = 'CRE';
    }
}
exports.GalarianArticunoV2CRE = GalarianArticunoV2CRE;
class GalarianArticunoV3CRE extends galarian_articuno_v_1.GalarianArticunoV {
    constructor() {
        super(...arguments);
        this.setNumber = '170';
        this.fullName = 'Galarian Articuno V3 CRE';
        this.set = 'CRE';
    }
}
exports.GalarianArticunoV3CRE = GalarianArticunoV3CRE;
class ShadowRiderCalyrexV2CRE extends shadow_rider_calyrex_v_1.ShadowRiderCalyrexV {
    constructor() {
        super(...arguments);
        this.setNumber = '171';
        this.fullName = 'Shadow Rider Calyrex V2 CRE';
        this.set = 'CRE';
    }
}
exports.ShadowRiderCalyrexV2CRE = ShadowRiderCalyrexV2CRE;
class ShadowRiderCalyrexV3CRE extends shadow_rider_calyrex_v_1.ShadowRiderCalyrexV {
    constructor() {
        super(...arguments);
        this.setNumber = '172';
        this.fullName = 'Shadow Rider Calyrex V3 CRE';
        this.set = 'CRE';
    }
}
exports.ShadowRiderCalyrexV3CRE = ShadowRiderCalyrexV3CRE;
class GalarianZapdosV2CRE extends galarian_zapdos_v_1.GalarianZapdosV {
    constructor() {
        super(...arguments);
        this.setNumber = '173';
        this.fullName = 'Galarian Zapdos V2 CRE';
        this.set = 'CRE';
    }
}
exports.GalarianZapdosV2CRE = GalarianZapdosV2CRE;
class GalarianZapdosV3CRE extends galarian_zapdos_v_1.GalarianZapdosV {
    constructor() {
        super(...arguments);
        this.setNumber = '174';
        this.fullName = 'Galarian Zapdos V3 CRE';
        this.set = 'CRE';
    }
}
exports.GalarianZapdosV3CRE = GalarianZapdosV3CRE;
class GalarianMoltresV2CRE extends galarian_moltres_v_1.GalarianMoltresV {
    constructor() {
        super(...arguments);
        this.setNumber = '176';
        this.fullName = 'Galarian Moltres V2 CRE';
        this.set = 'CRE';
    }
}
exports.GalarianMoltresV2CRE = GalarianMoltresV2CRE;
class GalarianMoltresV3CRE extends galarian_moltres_v_1.GalarianMoltresV {
    constructor() {
        super(...arguments);
        this.setNumber = '177';
        this.fullName = 'Galarian Moltres V3 CRE';
        this.set = 'CRE';
    }
}
exports.GalarianMoltresV3CRE = GalarianMoltresV3CRE;
class BlisseyV2CRE extends blissey_v_1.BlisseyV {
    constructor() {
        super(...arguments);
        this.setNumber = '182';
        this.fullName = 'Blissey V2 CRE';
        this.set = 'CRE';
    }
}
exports.BlisseyV2CRE = BlisseyV2CRE;
class BlisseyV3CRE extends blissey_v_1.BlisseyV {
    constructor() {
        super(...arguments);
        this.setNumber = '183';
        this.fullName = 'Blissey V3 CRE';
        this.set = 'CRE';
    }
}
exports.BlisseyV3CRE = BlisseyV3CRE;
class Agatha2CRE extends agatha_1.Agatha {
    constructor() {
        super(...arguments);
        this.setNumber = '186';
        this.fullName = 'Agatha2 CRE';
        this.set = 'CRE';
    }
}
exports.Agatha2CRE = Agatha2CRE;
class Avery2CRE extends avery_1.Avery {
    constructor() {
        super(...arguments);
        this.setNumber = '187';
        this.fullName = 'Avery2 CRE';
        this.set = 'CRE';
    }
}
exports.Avery2CRE = Avery2CRE;
class Brawly2CRE extends brawly_1.Brawly {
    constructor() {
        super(...arguments);
        this.setNumber = '188';
        this.fullName = 'Brawly2 CRE';
        this.set = 'CRE';
    }
}
exports.Brawly2CRE = Brawly2CRE;
class Caitlin2CRE extends caitlin_1.Caitlin {
    constructor() {
        super(...arguments);
        this.setNumber = '189';
        this.fullName = 'Caitlin2 CRE';
        this.set = 'CRE';
    }
}
exports.Caitlin2CRE = Caitlin2CRE;
class Flannery2CRE extends flannery_1.Flannery {
    constructor() {
        super(...arguments);
        this.setNumber = '191';
        this.fullName = 'Flannery2 CRE';
        this.set = 'CRE';
    }
}
exports.Flannery2CRE = Flannery2CRE;
class KarensConviction2CRE extends karens_conviction_1.KarensConviction {
    constructor() {
        super(...arguments);
        this.setNumber = '193';
        this.fullName = 'Karen\'s Conviction2 CRE';
        this.set = 'CRE';
    }
}
exports.KarensConviction2CRE = KarensConviction2CRE;
class Klara2CRE extends klara_1.Klara {
    constructor() {
        super(...arguments);
        this.setNumber = '194';
        this.fullName = 'Klara2 CRE';
        this.set = 'CRE';
    }
}
exports.Klara2CRE = Klara2CRE;
class Melony2CRE extends melony_1.Melony {
    constructor() {
        super(...arguments);
        this.setNumber = '195';
        this.fullName = 'Melony2 CRE';
        this.set = 'CRE';
    }
}
exports.Melony2CRE = Melony2CRE;
class Peonia2CRE extends peonia_1.Peonia {
    constructor() {
        super(...arguments);
        this.setNumber = '196';
        this.fullName = 'Peonia2 CRE';
        this.set = 'CRE';
    }
}
exports.Peonia2CRE = Peonia2CRE;
class Peony2CRE extends peony_1.Peony {
    constructor() {
        super(...arguments);
        this.setNumber = '197';
        this.fullName = 'Peony2 CRE';
        this.set = 'CRE';
    }
}
exports.Peony2CRE = Peony2CRE;
class BlazikenVMAX2CRE extends blaziken_vmax_1.BlazikenVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = '200';
        this.fullName = 'Blaziken VMAX2 CRE';
        this.set = 'CRE';
    }
}
exports.BlazikenVMAX2CRE = BlazikenVMAX2CRE;
class BlazikenVMAX3CRE extends blaziken_vmax_1.BlazikenVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = '201';
        this.fullName = 'Blaziken VMAX3 CRE';
        this.set = 'CRE';
    }
}
exports.BlazikenVMAX3CRE = BlazikenVMAX3CRE;
class IceRiderCalyrexVMAX2CRE extends ice_rider_calyrex_vmax_1.IceRiderCalyrexVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = '202';
        this.fullName = 'Ice Rider Calyrex VMAX2 CRE';
        this.set = 'CRE';
    }
}
exports.IceRiderCalyrexVMAX2CRE = IceRiderCalyrexVMAX2CRE;
class IceRiderCalyrexVMAX3CRE extends ice_rider_calyrex_vmax_1.IceRiderCalyrexVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = '203';
        this.fullName = 'Ice Rider Calyrex VMAX3 CRE';
        this.set = 'CRE';
    }
}
exports.IceRiderCalyrexVMAX3CRE = IceRiderCalyrexVMAX3CRE;
class ShadowRiderCalyrexVMAX2CRE extends shadow_rider_calyrex_vmax_1.ShadowRiderCalyrexVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = '204';
        this.fullName = 'Shadow Rider Calyrex VMAX2 CRE';
        this.set = 'CRE';
    }
}
exports.ShadowRiderCalyrexVMAX2CRE = ShadowRiderCalyrexVMAX2CRE;
class ShadowRiderCalyrexVMAX3CRE extends shadow_rider_calyrex_vmax_1.ShadowRiderCalyrexVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = '205';
        this.fullName = 'Shadow Rider Calyrex VMAX3 CRE';
        this.set = 'CRE';
    }
}
exports.ShadowRiderCalyrexVMAX3CRE = ShadowRiderCalyrexVMAX3CRE;
class Agatha3CRE extends agatha_1.Agatha {
    constructor() {
        super(...arguments);
        this.setNumber = '210';
        this.fullName = 'Agatha3 CRE';
        this.set = 'CRE';
    }
}
exports.Agatha3CRE = Agatha3CRE;
class Avery3CRE extends avery_1.Avery {
    constructor() {
        super(...arguments);
        this.setNumber = '211';
        this.fullName = 'Avery3 CRE';
        this.set = 'CRE';
    }
}
exports.Avery3CRE = Avery3CRE;
class Brawly3CRE extends brawly_1.Brawly {
    constructor() {
        super(...arguments);
        this.setNumber = '212';
        this.fullName = 'Brawly3 CRE';
        this.set = 'CRE';
    }
}
exports.Brawly3CRE = Brawly3CRE;
class Caitlin3CRE extends caitlin_1.Caitlin {
    constructor() {
        super(...arguments);
        this.setNumber = '213';
        this.fullName = 'Caitlin3 CRE';
        this.set = 'CRE';
    }
}
exports.Caitlin3CRE = Caitlin3CRE;
class Flannery3CRE extends flannery_1.Flannery {
    constructor() {
        super(...arguments);
        this.setNumber = '215';
        this.fullName = 'Flannery3 CRE';
        this.set = 'CRE';
    }
}
exports.Flannery3CRE = Flannery3CRE;
class KarensConviction3CRE extends karens_conviction_1.KarensConviction {
    constructor() {
        super(...arguments);
        this.setNumber = '216';
        this.fullName = 'Karen\'s Conviction3 CRE';
        this.set = 'CRE';
    }
}
exports.KarensConviction3CRE = KarensConviction3CRE;
class Klara3CRE extends klara_1.Klara {
    constructor() {
        super(...arguments);
        this.setNumber = '217';
        this.fullName = 'Klara3 CRE';
        this.set = 'CRE';
    }
}
exports.Klara3CRE = Klara3CRE;
class Melony3CRE extends melony_1.Melony {
    constructor() {
        super(...arguments);
        this.setNumber = '218';
        this.fullName = 'Melony3 CRE';
        this.set = 'CRE';
    }
}
exports.Melony3CRE = Melony3CRE;
class Peonia3CRE extends peonia_1.Peonia {
    constructor() {
        super(...arguments);
        this.setNumber = '219';
        this.fullName = 'Peonia3 CRE';
        this.set = 'CRE';
    }
}
exports.Peonia3CRE = Peonia3CRE;
class Peony3CRE extends peony_1.Peony {
    constructor() {
        super(...arguments);
        this.setNumber = '220';
        this.fullName = 'Peony3 CRE';
        this.set = 'CRE';
    }
}
exports.Peony3CRE = Peony3CRE;
class SnorlaxCRE extends snorlax_1.Snorlax {
    constructor() {
        super(...arguments);
        this.setNumber = '224';
        this.fullName = 'Snorlax CRE';
        this.set = 'CRE';
    }
}
exports.SnorlaxCRE = SnorlaxCRE;
class EchoingHorn2CRE extends echoing_horn_1.EchoingHorn {
    constructor() {
        super(...arguments);
        this.setNumber = '225';
        this.fullName = 'Echoing Horn2 CRE';
        this.set = 'CRE';
    }
}
exports.EchoingHorn2CRE = EchoingHorn2CRE;
class FanOfWavesCRE extends fan_of_waves_1.FanOfWaves {
    constructor() {
        super(...arguments);
        this.setNumber = '226';
        this.fullName = 'Fan of Waves CRE';
        this.set = 'CRE';
    }
}
exports.FanOfWavesCRE = FanOfWavesCRE;
class FogCrystal2CRE extends fog_crystal_1.FogCrystal {
    constructor() {
        super(...arguments);
        this.setNumber = '227';
        this.fullName = 'Fog Crystal2 CRE';
        this.set = 'CRE';
    }
}
exports.FogCrystal2CRE = FogCrystal2CRE;
class UrnOfVitalityCRE extends urn_of_vitality_1.UrnOfVitality {
    constructor() {
        super(...arguments);
        this.setNumber = '229';
        this.fullName = 'Urn of Vitality CRE';
        this.set = 'CRE';
    }
}
exports.UrnOfVitalityCRE = UrnOfVitalityCRE;
class WaterEnergyCRE extends water_energy_1.WaterEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '231';
        this.fullName = 'Water Energy CRE';
        this.set = 'CRE';
    }
}
exports.WaterEnergyCRE = WaterEnergyCRE;
class PsychicEnergyCRE extends psychic_energy_1.PsychicEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '232';
        this.fullName = 'Psychic Energy CRE';
        this.set = 'CRE';
    }
}
exports.PsychicEnergyCRE = PsychicEnergyCRE;
class FightingEnergyCRE extends fighting_energy_1.FightingEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '233';
        this.fullName = 'Fighting Energy CRE';
        this.set = 'CRE';
    }
}
exports.FightingEnergyCRE = FightingEnergyCRE;
class KoffingCRE extends koffing_1.Koffing {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '94';
        this.fullName = 'Koffing CRE';
    }
}
exports.KoffingCRE = KoffingCRE;
class VenipedeCRE extends venipede_1.Venipede {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '105';
        this.fullName = 'Venipede CRE';
    }
}
exports.VenipedeCRE = VenipedeCRE;
class CelebiV2 extends celebi_v_1.CelebiV {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '160';
        this.fullName = 'Celebi V CRE 160';
    }
}
exports.CelebiV2 = CelebiV2;
class VolcanionV2 extends volcanion_v_1.VolcanionV {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '162';
        this.fullName = 'Volcanion V CRE 162';
    }
}
exports.VolcanionV2 = VolcanionV2;
class ZeraoraV2 extends zeraora_v_1.ZeraoraV {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '165';
        this.fullName = 'Zeraora V CRE 165';
    }
}
exports.ZeraoraV2 = ZeraoraV2;
class ZeraoraV3 extends zeraora_v_1.ZeraoraV {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '166';
        this.fullName = 'Zeraora V CRE 166';
    }
}
exports.ZeraoraV3 = ZeraoraV3;
class GalarianRapidashV2 extends galarian_rapidash_v_1.GalarianRapidashV {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '168';
        this.fullName = 'Galarian Rapidash V CRE 168';
    }
}
exports.GalarianRapidashV2 = GalarianRapidashV2;
class SandacondaV2 extends sandaconda_v_1.SandacondaV {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '175';
        this.fullName = 'Sandaconda V CRE 175';
    }
}
exports.SandacondaV2 = SandacondaV2;
class GalarianSlowkingV2 extends galarian_slowking_v_1.GalarianSlowkingV {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '178';
        this.fullName = 'Galarian Slowking V CRE 178';
    }
}
exports.GalarianSlowkingV2 = GalarianSlowkingV2;
class GalarianSlowkingV3 extends galarian_slowking_v_1.GalarianSlowkingV {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '179';
        this.fullName = 'Galarian Slowking V CRE 179';
    }
}
exports.GalarianSlowkingV3 = GalarianSlowkingV3;
class LiepardV2 extends liepard_v_1.LiepardV {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '180';
        this.fullName = 'Liepard V CRE 180';
    }
}
exports.LiepardV2 = LiepardV2;
class MetagrossV2 extends metagross_v_1.MetagrossV {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '181';
        this.fullName = 'Metagross V CRE 181';
    }
}
exports.MetagrossV2 = MetagrossV2;
class TornadusV2 extends tornadus_v_1.TornadusV {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '184';
        this.fullName = 'Tornadus V CRE 184';
    }
}
exports.TornadusV2 = TornadusV2;
class TornadusV3 extends tornadus_v_1.TornadusV {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '185';
        this.fullName = 'Tornadus V CRE 185';
    }
}
exports.TornadusV3 = TornadusV3;
class Doctor2 extends doctor_1.Doctor {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '190';
        this.fullName = 'Doctor CRE 190';
    }
}
exports.Doctor2 = Doctor2;
class Honey2 extends honey_1.Honey {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '192';
        this.fullName = 'Honey CRE 192';
    }
}
exports.Honey2 = Honey2;
class Siebold2 extends siebold_1.Siebold {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '198';
        this.fullName = 'Siebold CRE 198';
    }
}
exports.Siebold2 = Siebold2;
class CelebiVmax2 extends celebi_vmax_1.CelebiVmax {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '199';
        this.fullName = 'Celebi VMAX CRE 199';
    }
}
exports.CelebiVmax2 = CelebiVmax2;
class SandacondaVmax2 extends sandaconda_vmax_1.SandacondaVmax {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '206';
        this.fullName = 'Sandaconda VMAX CRE 206';
    }
}
exports.SandacondaVmax2 = SandacondaVmax2;
class GalarianSlowkingVmax2 extends galarian_slowking_vmax_1.GalarianSlowkingVmax {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '207';
        this.fullName = 'Galarian Slowking VMAX CRE 207';
    }
}
exports.GalarianSlowkingVmax2 = GalarianSlowkingVmax2;
class MetagrossVmax2 extends metagross_vmax_1.MetagrossVmax {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '208';
        this.fullName = 'Metagross VMAX CRE 208';
    }
}
exports.MetagrossVmax2 = MetagrossVmax2;
class TornadusVmax2 extends tornadus_vmax_1.TornadusVmax {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '209';
        this.fullName = 'Tornadus VMAX CRE 209';
    }
}
exports.TornadusVmax2 = TornadusVmax2;
class Doctor3 extends doctor_1.Doctor {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '214';
        this.fullName = 'Doctor CRE 214';
    }
}
exports.Doctor3 = Doctor3;
class Siebold3 extends siebold_1.Siebold {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '221';
        this.fullName = 'Siebold CRE 221';
    }
}
exports.Siebold3 = Siebold3;
class RuggedHelmet2 extends rugged_helmet_1.RuggedHelmet {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '228';
        this.fullName = 'Rugged Helmet CRE 228';
    }
}
exports.RuggedHelmet2 = RuggedHelmet2;
class WelcomingLantern2 extends welcoming_lantern_1.WelcomingLantern {
    constructor() {
        super(...arguments);
        this.set = 'CRE';
        this.setNumber = '230';
        this.fullName = 'Welcoming Lantern CRE 230';
    }
}
exports.WelcomingLantern2 = WelcomingLantern2;
