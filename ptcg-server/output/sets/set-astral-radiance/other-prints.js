"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZacianVASR = exports.GalarianMoltresVASR = exports.GalarianZapdosVASR = exports.ShadowRiderCalyrexVMAXASR = exports.ShadowRiderCalyrexVASR = exports.GalarianArticunoVASR = exports.IceRiderCalyrexVMAXASR = exports.IceRiderCalyrexVASR = exports.StarmieV3ASR = exports.Mightyena2ASR = exports.FalinksASR = exports.GardevoirASR = exports.FrosmothASR = exports.FlappleASR = exports.DoubleTurboEnergyASR = exports.TrekkingShoes2ASR = exports.TempleofSinnoh2ASR = exports.PathToThePeakASR = exports.JubilifeVillage2ASR = exports.ChoiceBeltASR = exports.OriginFormeDialgaVSTAR3ASR = exports.HisuianSamurottVSTAR3ASR = exports.OriginFormePalkiaVSTAR3ASR = exports.Roxanne3ASR = exports.Irida3ASR = exports.Grant3ASR = exports.GardeniasVigor3ASR = exports.Cyllene3ASR = exports.Adaman3ASR = exports.OriginFormeDialgaVSTAR2ASR = exports.HisuianSamurottVSTAR2ASR = exports.HisuianDecidueyeVSTAR2ASR = exports.OriginFormePalkiaVSTAR2ASR = exports.Roxanne2ASR = exports.Irida2ASR = exports.Grant2ASR = exports.GardeniasVigor2ASR = exports.Cyllene2ASR = exports.Adaman2ASR = exports.WyrdeerV2ASR = exports.OranguruV2ASR = exports.GarchompV2ASR = exports.OriginFormeDialgaV2ASR = exports.HisuianSamurottV2ASR = exports.HisuianDecidueyeV2ASR = exports.LuxrayV2ASR = exports.OriginFormePalkiaV2ASR = exports.StarmieV2ASR = exports.UnidentifiedFossilASR = exports.BronzongASR = void 0;
exports.Zisu3 = exports.Kamado3 = exports.Choy3 = exports.MachampVmax2 = exports.HisuianTyphlosionVstar2 = exports.HeatranVmax2 = exports.HisuianLilligantVstar2 = exports.Zisu2 = exports.Kamado2 = exports.Choy2 = exports.HisuianSneaslerV3 = exports.HisuianSneaslerV2 = exports.MachampV3 = exports.MachampV2 = exports.HisuianTyphlosionV2 = exports.HeatranV2 = exports.HisuianLilligantV3 = exports.HisuianLilligantV2 = exports.BeedrillV3 = exports.BeedrillV2 = exports.DewottASR = exports.BarboachASR = exports.ShadowRiderCalyrexVMAX2ASR = exports.IceRiderCalyrexVMAX2ASR = exports.PiersASR = exports.MelonyASR = exports.GarchompV3ASR = void 0;
const unidentified_fossil_1 = require("../set-silver-tempest/unidentified-fossil");
const starmie_v_1 = require("../set-astral-radiance/starmie-v");
const origin_forme_palkia_v_1 = require("../set-astral-radiance/origin-forme-palkia-v");
const luxray_v_1 = require("../set-astral-radiance/luxray-v");
const hisuian_decidueye_v_1 = require("../set-astral-radiance/hisuian-decidueye-v");
const hisuian_samurott_v_1 = require("../set-astral-radiance/hisuian-samurott-v");
const origin_forme_dialga_v_1 = require("../set-astral-radiance/origin-forme-dialga-v");
const garchomp_v_1 = require("../set-astral-radiance/garchomp-v");
const oranguru_v_1 = require("../set-astral-radiance/oranguru-v");
const wyrdeer_v_1 = require("../set-astral-radiance/wyrdeer-v");
const adaman_1 = require("../set-astral-radiance/adaman");
const cyllene_1 = require("../set-astral-radiance/cyllene");
const gardenias_vigor_1 = require("../set-astral-radiance/gardenias-vigor");
const grant_1 = require("../set-astral-radiance/grant");
const irida_1 = require("../set-astral-radiance/irida");
const roxanne_1 = require("../set-astral-radiance/roxanne");
const origin_forme_palkia_vstar_1 = require("../set-astral-radiance/origin-forme-palkia-vstar");
const hisuian_decidueye_vstar_1 = require("../set-astral-radiance/hisuian-decidueye-vstar");
const hisuian_samurott_vstar_1 = require("../set-astral-radiance/hisuian-samurott-vstar");
const origin_forme_dialga_vstar_1 = require("../set-astral-radiance/origin-forme-dialga-vstar");
const choice_belt_1 = require("../set-paldea-evolved/choice-belt");
const jubilife_village_1 = require("../set-astral-radiance/jubilife-village");
const path_to_the_peak_1 = require("../set-chilling-reign/path-to-the-peak");
const temple_of_sinnoh_1 = require("../set-astral-radiance/temple-of-sinnoh");
const trekking_shoes_1 = require("../set-astral-radiance/trekking-shoes");
const double_turbo_energy_1 = require("../set-brilliant-stars/double-turbo-energy");
const flapple_1 = require("../set-rebel-clash/flapple");
const frosmoth_1 = require("../set-sword-and-shield/frosmoth");
const gardevoir_1 = require("../set-chilling-reign/gardevoir");
const falinks_1 = require("../set-battle-styles/falinks");
const mightyena_1 = require("../set-astral-radiance/mightyena");
const ice_rider_calyrex_v_1 = require("../set-chilling-reign/ice-rider-calyrex-v");
const ice_rider_calyrex_vmax_1 = require("../set-chilling-reign/ice-rider-calyrex-vmax");
const galarian_articuno_v_1 = require("../set-chilling-reign/galarian-articuno-v");
const shadow_rider_calyrex_v_1 = require("../set-chilling-reign/shadow-rider-calyrex-v");
const shadow_rider_calyrex_vmax_1 = require("../set-chilling-reign/shadow-rider-calyrex-vmax");
const galarian_zapdos_v_1 = require("../set-chilling-reign/galarian-zapdos-v");
const galarian_moltres_v_1 = require("../set-chilling-reign/galarian-moltres-v");
const zacian_v_1 = require("../set-sword-and-shield/zacian-v");
const melony_1 = require("../set-chilling-reign/melony");
const piers_1 = require("../set-champions-path/piers");
const ice_rider_calyrex_vmax_2 = require("../set-chilling-reign/ice-rider-calyrex-vmax");
const shadow_rider_calyrex_vmax_2 = require("../set-chilling-reign/shadow-rider-calyrex-vmax");
const bronzong_1 = require("../set-battle-styles/bronzong");
const barboach_1 = require("../set-rebel-clash/barboach");
const dewott_1 = require("../set-vivid-voltage/dewott");
const beedrill_v_1 = require("./beedrill-v");
const hisuian_lilligant_v_1 = require("./hisuian-lilligant-v");
const heatran_v_1 = require("./heatran-v");
const hisuian_typhlosion_v_1 = require("./hisuian-typhlosion-v");
const machamp_v_1 = require("./machamp-v");
const hisuian_sneasler_v_1 = require("./hisuian-sneasler-v");
const choy_1 = require("./choy");
const kamado_1 = require("./kamado");
const zisu_1 = require("./zisu");
const hisuian_lilligant_vstar_1 = require("./hisuian-lilligant-vstar");
const heatran_vmax_1 = require("./heatran-vmax");
const hisuian_typhlosion_vstar_1 = require("./hisuian-typhlosion-vstar");
const machamp_vmax_1 = require("./machamp-vmax");
class BronzongASR extends bronzong_1.Bronzong {
    constructor() {
        super(...arguments);
        this.fullName = 'Bronzong ASR TG11';
        this.set = 'ASR';
        this.setNumber = 'TG11';
    }
}
exports.BronzongASR = BronzongASR;
class UnidentifiedFossilASR extends unidentified_fossil_1.UnidentifiedFossil {
    constructor() {
        super(...arguments);
        this.setNumber = '157';
        this.fullName = 'Unidentified Fossil ASR';
        this.set = 'ASR';
    }
}
exports.UnidentifiedFossilASR = UnidentifiedFossilASR;
class StarmieV2ASR extends starmie_v_1.StarmieV {
    constructor() {
        super(...arguments);
        this.setNumber = '166';
        this.fullName = 'Starmie V2 ASR';
        this.set = 'ASR';
    }
}
exports.StarmieV2ASR = StarmieV2ASR;
class OriginFormePalkiaV2ASR extends origin_forme_palkia_v_1.OriginFormePalkiaV {
    constructor() {
        super(...arguments);
        this.setNumber = '167';
        this.fullName = 'Origin Forme Palkia V2 ASR';
        this.set = 'ASR';
    }
}
exports.OriginFormePalkiaV2ASR = OriginFormePalkiaV2ASR;
class LuxrayV2ASR extends luxray_v_1.LuxrayV {
    constructor() {
        super(...arguments);
        this.setNumber = '168';
        this.fullName = 'Luxray V2 ASR';
        this.set = 'ASR';
    }
}
exports.LuxrayV2ASR = LuxrayV2ASR;
class HisuianDecidueyeV2ASR extends hisuian_decidueye_v_1.HisuianDecidueyeV {
    constructor() {
        super(...arguments);
        this.setNumber = '173';
        this.fullName = 'Hisuian Decidueye V2 ASR';
        this.set = 'ASR';
    }
}
exports.HisuianDecidueyeV2ASR = HisuianDecidueyeV2ASR;
class HisuianSamurottV2ASR extends hisuian_samurott_v_1.HisuianSamurottV {
    constructor() {
        super(...arguments);
        this.setNumber = '176';
        this.fullName = 'Hisuian Samurott V2 ASR';
        this.set = 'ASR';
    }
}
exports.HisuianSamurottV2ASR = HisuianSamurottV2ASR;
class OriginFormeDialgaV2ASR extends origin_forme_dialga_v_1.OriginFormeDialgaV {
    constructor() {
        super(...arguments);
        this.setNumber = '177';
        this.fullName = 'Origin Forme Dialga V2 ASR';
        this.set = 'ASR';
    }
}
exports.OriginFormeDialgaV2ASR = OriginFormeDialgaV2ASR;
class GarchompV2ASR extends garchomp_v_1.GarchompV {
    constructor() {
        super(...arguments);
        this.setNumber = '178';
        this.fullName = 'Garchomp V2 ASR';
        this.set = 'ASR';
    }
}
exports.GarchompV2ASR = GarchompV2ASR;
class OranguruV2ASR extends oranguru_v_1.OranguruV {
    constructor() {
        super(...arguments);
        this.setNumber = '179';
        this.fullName = 'Oranguru V2 ASR';
        this.set = 'ASR';
    }
}
exports.OranguruV2ASR = OranguruV2ASR;
class WyrdeerV2ASR extends wyrdeer_v_1.WyrdeerV {
    constructor() {
        super(...arguments);
        this.setNumber = '180';
        this.fullName = 'Wyrdeer V2 ASR';
        this.set = 'ASR';
    }
}
exports.WyrdeerV2ASR = WyrdeerV2ASR;
class Adaman2ASR extends adaman_1.Adaman {
    constructor() {
        super(...arguments);
        this.setNumber = '181';
        this.fullName = 'Adaman2 ASR';
        this.set = 'ASR';
    }
}
exports.Adaman2ASR = Adaman2ASR;
class Cyllene2ASR extends cyllene_1.Cyllene {
    constructor() {
        super(...arguments);
        this.setNumber = '183';
        this.fullName = 'Cyllene2 ASR';
        this.set = 'ASR';
    }
}
exports.Cyllene2ASR = Cyllene2ASR;
class GardeniasVigor2ASR extends gardenias_vigor_1.GardeniasVigor {
    constructor() {
        super(...arguments);
        this.setNumber = '184';
        this.fullName = 'Gardenia\'s Vigor2 ASR';
        this.set = 'ASR';
    }
}
exports.GardeniasVigor2ASR = GardeniasVigor2ASR;
class Grant2ASR extends grant_1.Grant {
    constructor() {
        super(...arguments);
        this.setNumber = '185';
        this.fullName = 'Grant2 ASR';
        this.set = 'ASR';
    }
}
exports.Grant2ASR = Grant2ASR;
class Irida2ASR extends irida_1.Irida {
    constructor() {
        super(...arguments);
        this.setNumber = '186';
        this.fullName = 'Irida2 ASR';
        this.set = 'ASR';
    }
}
exports.Irida2ASR = Irida2ASR;
class Roxanne2ASR extends roxanne_1.Roxanne {
    constructor() {
        super(...arguments);
        this.setNumber = '188';
        this.fullName = 'Roxanne2 ASR';
        this.set = 'ASR';
    }
}
exports.Roxanne2ASR = Roxanne2ASR;
class OriginFormePalkiaVSTAR2ASR extends origin_forme_palkia_vstar_1.OriginFormePalkiaVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = '192';
        this.fullName = 'Origin Forme Palkia VSTAR2 ASR';
        this.set = 'ASR';
    }
}
exports.OriginFormePalkiaVSTAR2ASR = OriginFormePalkiaVSTAR2ASR;
class HisuianDecidueyeVSTAR2ASR extends hisuian_decidueye_vstar_1.HisuianDecidueyeVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = '195';
        this.fullName = 'Hisuian Decidueye VSTAR2 ASR';
        this.set = 'ASR';
    }
}
exports.HisuianDecidueyeVSTAR2ASR = HisuianDecidueyeVSTAR2ASR;
class HisuianSamurottVSTAR2ASR extends hisuian_samurott_vstar_1.HisuianSamurottVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = '197';
        this.fullName = 'Hisuian Samurott VSTAR2 ASR';
        this.set = 'ASR';
    }
}
exports.HisuianSamurottVSTAR2ASR = HisuianSamurottVSTAR2ASR;
class OriginFormeDialgaVSTAR2ASR extends origin_forme_dialga_vstar_1.OriginFormeDialgaVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = '198';
        this.fullName = 'Origin Forme Dialga VSTAR2 ASR';
        this.set = 'ASR';
    }
}
exports.OriginFormeDialgaVSTAR2ASR = OriginFormeDialgaVSTAR2ASR;
class Adaman3ASR extends adaman_1.Adaman {
    constructor() {
        super(...arguments);
        this.setNumber = '199';
        this.fullName = 'Adaman3 ASR';
        this.set = 'ASR';
    }
}
exports.Adaman3ASR = Adaman3ASR;
class Cyllene3ASR extends cyllene_1.Cyllene {
    constructor() {
        super(...arguments);
        this.setNumber = '201';
        this.fullName = 'Cyllene3 ASR';
        this.set = 'ASR';
    }
}
exports.Cyllene3ASR = Cyllene3ASR;
class GardeniasVigor3ASR extends gardenias_vigor_1.GardeniasVigor {
    constructor() {
        super(...arguments);
        this.setNumber = '202';
        this.fullName = 'Gardenia\'s Vigor3 ASR';
        this.set = 'ASR';
    }
}
exports.GardeniasVigor3ASR = GardeniasVigor3ASR;
class Grant3ASR extends grant_1.Grant {
    constructor() {
        super(...arguments);
        this.setNumber = '203';
        this.fullName = 'Grant3 ASR';
        this.set = 'ASR';
    }
}
exports.Grant3ASR = Grant3ASR;
class Irida3ASR extends irida_1.Irida {
    constructor() {
        super(...arguments);
        this.setNumber = '204';
        this.fullName = 'Irida3 ASR';
        this.set = 'ASR';
    }
}
exports.Irida3ASR = Irida3ASR;
class Roxanne3ASR extends roxanne_1.Roxanne {
    constructor() {
        super(...arguments);
        this.setNumber = '206';
        this.fullName = 'Roxanne3 ASR';
        this.set = 'ASR';
    }
}
exports.Roxanne3ASR = Roxanne3ASR;
class OriginFormePalkiaVSTAR3ASR extends origin_forme_palkia_vstar_1.OriginFormePalkiaVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = '208';
        this.fullName = 'Origin Forme Palkia VSTAR3 ASR';
        this.set = 'ASR';
    }
}
exports.OriginFormePalkiaVSTAR3ASR = OriginFormePalkiaVSTAR3ASR;
class HisuianSamurottVSTAR3ASR extends hisuian_samurott_vstar_1.HisuianSamurottVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = '209';
        this.fullName = 'Hisuian Samurott VSTAR3 ASR';
        this.set = 'ASR';
    }
}
exports.HisuianSamurottVSTAR3ASR = HisuianSamurottVSTAR3ASR;
class OriginFormeDialgaVSTAR3ASR extends origin_forme_dialga_vstar_1.OriginFormeDialgaVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = '210';
        this.fullName = 'Origin Forme Dialga VSTAR3 ASR';
        this.set = 'ASR';
    }
}
exports.OriginFormeDialgaVSTAR3ASR = OriginFormeDialgaVSTAR3ASR;
class ChoiceBeltASR extends choice_belt_1.ChoiceBelt {
    constructor() {
        super(...arguments);
        this.setNumber = '211';
        this.fullName = 'Choice Belt ASR';
        this.set = 'ASR';
    }
}
exports.ChoiceBeltASR = ChoiceBeltASR;
class JubilifeVillage2ASR extends jubilife_village_1.JubilifeVillage {
    constructor() {
        super(...arguments);
        this.setNumber = '212';
        this.fullName = 'Jubilife Village2 ASR';
        this.set = 'ASR';
    }
}
exports.JubilifeVillage2ASR = JubilifeVillage2ASR;
class PathToThePeakASR extends path_to_the_peak_1.PathToThePeak {
    constructor() {
        super(...arguments);
        this.setNumber = '213';
        this.fullName = 'Path to the Peak ASR';
        this.set = 'ASR';
    }
}
exports.PathToThePeakASR = PathToThePeakASR;
class TempleofSinnoh2ASR extends temple_of_sinnoh_1.TempleofSinnoh {
    constructor() {
        super(...arguments);
        this.setNumber = '214';
        this.fullName = 'Temple of Sinnoh2 ASR';
        this.set = 'ASR';
    }
}
exports.TempleofSinnoh2ASR = TempleofSinnoh2ASR;
class TrekkingShoes2ASR extends trekking_shoes_1.TrekkingShoes {
    constructor() {
        super(...arguments);
        this.setNumber = '215';
        this.fullName = 'Trekking Shoes2 ASR';
        this.set = 'ASR';
    }
}
exports.TrekkingShoes2ASR = TrekkingShoes2ASR;
class DoubleTurboEnergyASR extends double_turbo_energy_1.DoubleTurboEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '216';
        this.fullName = 'Double Turbo Energy ASR';
        this.set = 'ASR';
    }
}
exports.DoubleTurboEnergyASR = DoubleTurboEnergyASR;
class FlappleASR extends flapple_1.Flapple {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG2';
        this.fullName = 'Flapple ASR';
        this.set = 'ASR';
    }
}
exports.FlappleASR = FlappleASR;
class FrosmothASR extends frosmoth_1.Frosmoth {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG4';
        this.fullName = 'Frosmoth ASR';
        this.set = 'ASR';
    }
}
exports.FrosmothASR = FrosmothASR;
class GardevoirASR extends gardevoir_1.Gardevoir {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG5';
        this.fullName = 'Gardevoir ASR';
        this.set = 'ASR';
    }
}
exports.GardevoirASR = GardevoirASR;
class FalinksASR extends falinks_1.Falinks {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG7';
        this.fullName = 'Falinks ASR';
        this.set = 'ASR';
    }
}
exports.FalinksASR = FalinksASR;
class Mightyena2ASR extends mightyena_1.Mightyena {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG9';
        this.fullName = 'Mightyena2 ASR';
        this.set = 'ASR';
    }
}
exports.Mightyena2ASR = Mightyena2ASR;
class StarmieV3ASR extends starmie_v_1.StarmieV {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG13';
        this.fullName = 'Starmie V3 ASR';
        this.set = 'ASR';
    }
}
exports.StarmieV3ASR = StarmieV3ASR;
class IceRiderCalyrexVASR extends ice_rider_calyrex_v_1.IceRiderCalyrexV {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG14';
        this.fullName = 'Ice Rider Calyrex V ASR';
        this.set = 'ASR';
    }
}
exports.IceRiderCalyrexVASR = IceRiderCalyrexVASR;
class IceRiderCalyrexVMAXASR extends ice_rider_calyrex_vmax_1.IceRiderCalyrexVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG15';
        this.fullName = 'Ice Rider Calyrex VMAX ASR';
        this.set = 'ASR';
    }
}
exports.IceRiderCalyrexVMAXASR = IceRiderCalyrexVMAXASR;
class GalarianArticunoVASR extends galarian_articuno_v_1.GalarianArticunoV {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG16';
        this.fullName = 'Galarian Articuno V ASR';
        this.set = 'ASR';
    }
}
exports.GalarianArticunoVASR = GalarianArticunoVASR;
class ShadowRiderCalyrexVASR extends shadow_rider_calyrex_v_1.ShadowRiderCalyrexV {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG17';
        this.fullName = 'Shadow Rider Calyrex V ASR';
        this.set = 'ASR';
    }
}
exports.ShadowRiderCalyrexVASR = ShadowRiderCalyrexVASR;
class ShadowRiderCalyrexVMAXASR extends shadow_rider_calyrex_vmax_1.ShadowRiderCalyrexVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG18';
        this.fullName = 'Shadow Rider Calyrex VMAX ASR';
        this.set = 'ASR';
    }
}
exports.ShadowRiderCalyrexVMAXASR = ShadowRiderCalyrexVMAXASR;
class GalarianZapdosVASR extends galarian_zapdos_v_1.GalarianZapdosV {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG19';
        this.fullName = 'Galarian Zapdos V ASR';
        this.set = 'ASR';
    }
}
exports.GalarianZapdosVASR = GalarianZapdosVASR;
class GalarianMoltresVASR extends galarian_moltres_v_1.GalarianMoltresV {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG20';
        this.fullName = 'Galarian Moltres V ASR';
        this.set = 'ASR';
    }
}
exports.GalarianMoltresVASR = GalarianMoltresVASR;
class ZacianVASR extends zacian_v_1.ZacianV {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG21';
        this.fullName = 'Zacian V ASR';
        this.set = 'ASR';
    }
}
exports.ZacianVASR = ZacianVASR;
class GarchompV3ASR extends garchomp_v_1.GarchompV {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG23';
        this.fullName = 'Garchomp V3 ASR';
        this.set = 'ASR';
    }
}
exports.GarchompV3ASR = GarchompV3ASR;
class MelonyASR extends melony_1.Melony {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG26';
        this.fullName = 'Melony ASR';
        this.set = 'ASR';
    }
}
exports.MelonyASR = MelonyASR;
class PiersASR extends piers_1.Piers {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG28';
        this.fullName = 'Piers ASR';
        this.set = 'ASR';
    }
}
exports.PiersASR = PiersASR;
class IceRiderCalyrexVMAX2ASR extends ice_rider_calyrex_vmax_2.IceRiderCalyrexVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG29';
        this.fullName = 'Ice Rider Calyrex VMAX2 ASR';
        this.set = 'ASR';
    }
}
exports.IceRiderCalyrexVMAX2ASR = IceRiderCalyrexVMAX2ASR;
class ShadowRiderCalyrexVMAX2ASR extends shadow_rider_calyrex_vmax_2.ShadowRiderCalyrexVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG30';
        this.fullName = 'Shadow Rider Calyrex VMAX2 ASR';
        this.set = 'ASR';
    }
}
exports.ShadowRiderCalyrexVMAX2ASR = ShadowRiderCalyrexVMAX2ASR;
// Reprints from other sets
class BarboachASR extends barboach_1.Barboach {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '35';
        this.fullName = 'Barboach ASR 35';
    }
}
exports.BarboachASR = BarboachASR;
class DewottASR extends dewott_1.Dewott {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '42';
        this.fullName = 'Dewott ASR 42';
    }
}
exports.DewottASR = DewottASR;
// Alt-art V cards
class BeedrillV2 extends beedrill_v_1.BeedrillV {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '160';
        this.fullName = 'Beedrill V ASR 160';
    }
}
exports.BeedrillV2 = BeedrillV2;
class BeedrillV3 extends beedrill_v_1.BeedrillV {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '161';
        this.fullName = 'Beedrill V ASR 161';
    }
}
exports.BeedrillV3 = BeedrillV3;
class HisuianLilligantV2 extends hisuian_lilligant_v_1.HisuianLilligantV {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '162';
        this.fullName = 'Hisuian Lilligant V ASR 162';
    }
}
exports.HisuianLilligantV2 = HisuianLilligantV2;
class HisuianLilligantV3 extends hisuian_lilligant_v_1.HisuianLilligantV {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '163';
        this.fullName = 'Hisuian Lilligant V ASR 163';
    }
}
exports.HisuianLilligantV3 = HisuianLilligantV3;
class HeatranV2 extends heatran_v_1.HeatranV {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '165';
        this.fullName = 'Heatran V ASR 165';
    }
}
exports.HeatranV2 = HeatranV2;
class HisuianTyphlosionV2 extends hisuian_typhlosion_v_1.HisuianTyphlosionV {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '169';
        this.fullName = 'Hisuian Typhlosion V ASR 169';
    }
}
exports.HisuianTyphlosionV2 = HisuianTyphlosionV2;
class MachampV2 extends machamp_v_1.MachampV {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '171';
        this.fullName = 'Machamp V ASR 171';
    }
}
exports.MachampV2 = MachampV2;
class MachampV3 extends machamp_v_1.MachampV {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '172';
        this.fullName = 'Machamp V ASR 172';
    }
}
exports.MachampV3 = MachampV3;
class HisuianSneaslerV2 extends hisuian_sneasler_v_1.HisuianSneaslerV {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '174';
        this.fullName = 'Hisuian Sneasler V ASR 174';
    }
}
exports.HisuianSneaslerV2 = HisuianSneaslerV2;
class HisuianSneaslerV3 extends hisuian_sneasler_v_1.HisuianSneaslerV {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '175';
        this.fullName = 'Hisuian Sneasler V ASR 175';
    }
}
exports.HisuianSneaslerV3 = HisuianSneaslerV3;
// Alt-art Trainer cards
class Choy2 extends choy_1.Choy {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '182';
        this.fullName = 'Choy ASR 182';
    }
}
exports.Choy2 = Choy2;
class Kamado2 extends kamado_1.Kamado {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '187';
        this.fullName = 'Kamado ASR 187';
    }
}
exports.Kamado2 = Kamado2;
class Zisu2 extends zisu_1.Zisu {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '189';
        this.fullName = 'Zisu ASR 189';
    }
}
exports.Zisu2 = Zisu2;
// Rainbow rare VSTAR/VMAX cards
class HisuianLilligantVstar2 extends hisuian_lilligant_vstar_1.HisuianLilligantVstar {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '190';
        this.fullName = 'Hisuian Lilligant VSTAR ASR 190';
    }
}
exports.HisuianLilligantVstar2 = HisuianLilligantVstar2;
class HeatranVmax2 extends heatran_vmax_1.HeatranVmax {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '191';
        this.fullName = 'Heatran VMAX ASR 191';
    }
}
exports.HeatranVmax2 = HeatranVmax2;
class HisuianTyphlosionVstar2 extends hisuian_typhlosion_vstar_1.HisuianTyphlosionVstar {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '193';
        this.fullName = 'Hisuian Typhlosion VSTAR ASR 193';
    }
}
exports.HisuianTyphlosionVstar2 = HisuianTyphlosionVstar2;
class MachampVmax2 extends machamp_vmax_1.MachampVmax {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '194';
        this.fullName = 'Machamp VMAX ASR 194';
    }
}
exports.MachampVmax2 = MachampVmax2;
// Rainbow rare Trainer cards
class Choy3 extends choy_1.Choy {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '200';
        this.fullName = 'Choy ASR 200';
    }
}
exports.Choy3 = Choy3;
class Kamado3 extends kamado_1.Kamado {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '205';
        this.fullName = 'Kamado ASR 205';
    }
}
exports.Kamado3 = Kamado3;
class Zisu3 extends zisu_1.Zisu {
    constructor() {
        super(...arguments);
        this.set = 'ASR';
        this.setNumber = '207';
        this.fullName = 'Zisu ASR 207';
    }
}
exports.Zisu3 = Zisu3;
