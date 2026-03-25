"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleStrikeUrshifuVBRS = exports.MimikyuV2BRS = exports.SylveonVMAXBRS = exports.SylveonVBRS = exports.OranguruBRS = exports.HoundoomBRS = exports.Alcremie2BRS = exports.Dusknoir2BRS = exports.ZekromBRS = exports.OctilleryBRS = exports.MetalEnergyBRS = exports.DarknessEnergyBRS = exports.FightingEnergyBRS = exports.PsychicEnergyBRS = exports.LightningEnergyBRS = exports.WaterEnergyBRS = exports.FireEnergyBRS = exports.GrassEnergyBRS = exports.MagmaBasin2BRS = exports.ArceusVSTAR3BRS = exports.GalarianMoltresVBRS = exports.GalarianZapdosVBRS = exports.GalarianArticunoVBRS = exports.RoseannesBackup3BRS = exports.Kindler3BRS = exports.CynthiasAmbition3BRS = exports.CherensCare3BRS = exports.ArceusVSTAR2BRS = exports.ShayminVSTAR2BRS = exports.RoseannesBackup2BRS = exports.MarniesPride2BRS = exports.Kindler2BRS = exports.CynthiasAmbition2BRS = exports.CherensCare2BRS = exports.ArceusV3BRS = exports.ArceusV2BRS = exports.ZamazentaV2BRS = exports.RaichuV2BRS = exports.LumineonV3BRS = exports.LumineonV2BRS = exports.ShayminV2BRS = exports.UltraBallBRS = exports.ProfessorsResearchBRS = exports.ChoiceBeltBRS = exports.BossOrdersBRS = exports.ZamazentaVBRS = exports.MimikyuVBRS = exports.WhimsicottVSTARRR = exports.WhimsicottVFA = exports.UltraBallHR = void 0;
exports.CharizardVstar2 = exports.Barry2 = exports.FlygonV2 = exports.HonchkrowV3 = exports.HonchkrowV2 = exports.GranbullV2 = exports.CharizardV3 = exports.CharizardV2 = exports.FreshWaterSetBRS = exports.KarrablastBRS = exports.BurmyBRS = exports.RapidStrikeUrshifuVMAX2BRS = exports.SingleStrikeUrshifuVMAX2BRS = exports.SingleStrikeStyleMustardBRS = exports.Gloria2BRS = exports.CafeMaster2BRS = exports.AcerolasPremonition2BRS = exports.UmbreonVMAXBRS = exports.UmbreonVBRS = exports.RapidStrikeUrshifuVMAXBRS = exports.RapidStrikeUrshifuVBRS = exports.SingleStrikeUrshifuVMAXBRS = void 0;
const mimikyu_v_1 = require("../set-battle-styles/mimikyu-v");
const zamazenta_v_1 = require("../set-crown-zenith/zamazenta-v");
const boss_orders_1 = require("../set-paldea-evolved/boss-orders");
const choice_belt_1 = require("../set-paldea-evolved/choice-belt");
const professors_research_1 = require("../set-scarlet-and-violet/professors-research");
const shaymin_v_1 = require("../set-brilliant-stars/shaymin-v");
const lumineon_v_1 = require("../set-brilliant-stars/lumineon-v");
const raichu_v_1 = require("../set-brilliant-stars/raichu-v");
const zamazenta_v_2 = require("../set-crown-zenith/zamazenta-v");
const arceus_v_1 = require("../set-brilliant-stars/arceus-v");
const cherens_care_1 = require("../set-brilliant-stars/cherens-care");
const cynthias_ambition_1 = require("../set-brilliant-stars/cynthias-ambition");
const kindler_1 = require("../set-brilliant-stars/kindler");
const marnies_pride_1 = require("../set-brilliant-stars/marnies-pride");
const roseannes_backup_1 = require("../set-brilliant-stars/roseannes-backup");
const shaymin_vstar_1 = require("../set-brilliant-stars/shaymin-vstar");
const arceus_vstar_1 = require("../set-brilliant-stars/arceus-vstar");
const galarian_articuno_v_1 = require("../set-chilling-reign/galarian-articuno-v");
const galarian_zapdos_v_1 = require("../set-chilling-reign/galarian-zapdos-v");
const galarian_moltres_v_1 = require("../set-chilling-reign/galarian-moltres-v");
const magma_basin_1 = require("../set-brilliant-stars/magma-basin");
const grass_energy_1 = require("../set-base-set-energy/grass-energy");
const fire_energy_1 = require("../set-base-set-energy/fire-energy");
const water_energy_1 = require("../set-base-set-energy/water-energy");
const lightning_energy_1 = require("../set-base-set-energy/lightning-energy");
const psychic_energy_1 = require("../set-base-set-energy/psychic-energy");
const fighting_energy_1 = require("../set-base-set-energy/fighting-energy");
const basic_energies_1 = require("../set-diamond-and-pearl/basic-energies");
const basic_energies_2 = require("../set-diamond-and-pearl/basic-energies");
const octillery_1 = require("../set-battle-styles/octillery");
const zekrom_1 = require("../set-vivid-voltage/zekrom");
const dusknoir_1 = require("../set-vivid-voltage/dusknoir");
const alcremie_1 = require("../set-brilliant-stars/alcremie");
const houndoom_1 = require("../set-battle-styles/houndoom");
const oranguru_1 = require("../set-sword-and-shield/oranguru");
const sylveon_v_1 = require("../set-evolving-skies/sylveon-v");
const sylveon_vmax_1 = require("../set-evolving-skies/sylveon-vmax");
const mimikyu_v_2 = require("../set-battle-styles/mimikyu-v");
const single_strike_urshifu_v_1 = require("../set-battle-styles/single-strike-urshifu-v");
const single_strike_urshifu_vmax_1 = require("../set-battle-styles/single-strike-urshifu-vmax");
const rapid_strike_urshifu_v_1 = require("../set-battle-styles/rapid-strike-urshifu-v");
const rapid_strike_urshifu_vmax_1 = require("../set-battle-styles/rapid-strike-urshifu-vmax");
const umbreon_v_1 = require("../set-evolving-skies/umbreon-v");
const umbreon_vmax_1 = require("../set-evolving-skies/umbreon-vmax");
const acerolas_premonition_1 = require("../set-brilliant-stars/acerolas-premonition");
const cafe_master_1 = require("../set-brilliant-stars/cafe-master");
const gloria_1 = require("../set-brilliant-stars/gloria");
const single_strike_style_mustard_1 = require("../set-battle-styles/single-strike-style-mustard");
const single_strike_urshifu_vmax_2 = require("../set-battle-styles/single-strike-urshifu-vmax");
const rapid_strike_urshifu_vmax_2 = require("../set-battle-styles/rapid-strike-urshifu-vmax");
const ultra_ball_1 = require("../set-scarlet-and-violet/ultra-ball");
const whimsicott_v_1 = require("./whimsicott-v");
const whimsicott_vstar_1 = require("./whimsicott-vstar");
const burmy_1 = require("../set-fates-collide/burmy");
const karrablast_1 = require("../set-plasma-blast/karrablast");
const fresh_water_set_1 = require("../set-primal-clash/fresh-water-set");
const charizard_v_1 = require("./charizard-v");
const granbull_v_1 = require("./granbull-v");
const honchkrow_v_1 = require("./honchkrow-v");
const flygon_v_1 = require("./flygon-v");
const barry_1 = require("./barry");
const charizard_vstar_1 = require("./charizard-vstar");
class UltraBallHR extends ultra_ball_1.UltraBall {
    constructor() {
        super(...arguments);
        this.set = 'BRS';
        this.fullName = 'Ultra BallHR BRS';
        this.setNumber = '186';
        this.regulationMark = 'F';
    }
}
exports.UltraBallHR = UltraBallHR;
class WhimsicottVFA extends whimsicott_v_1.WhimsicottV {
    constructor() {
        super(...arguments);
        this.fullName = 'Whimsicott V BRS FA';
        this.setNumber = '160';
    }
}
exports.WhimsicottVFA = WhimsicottVFA;
class WhimsicottVSTARRR extends whimsicott_vstar_1.WhimsicottVSTAR {
    constructor() {
        super(...arguments);
        this.fullName = 'Whimsicott VSTAR BRS RR';
        this.setNumber = '175';
    }
}
exports.WhimsicottVSTARRR = WhimsicottVSTARRR;
class MimikyuVBRS extends mimikyu_v_1.MimikyuV {
    constructor() {
        super(...arguments);
        this.setNumber = '68';
        this.fullName = 'Mimikyu V BRS';
        this.set = 'BRS';
    }
}
exports.MimikyuVBRS = MimikyuVBRS;
class ZamazentaVBRS extends zamazenta_v_1.ZamazentaV {
    constructor() {
        super(...arguments);
        this.setNumber = '105';
        this.fullName = 'Zamazenta V BRS';
        this.set = 'BRS';
    }
}
exports.ZamazentaVBRS = ZamazentaVBRS;
class BossOrdersBRS extends boss_orders_1.BossOrders {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.setNumber = '132';
        this.fullName = 'Boss\'s Orders BRS';
        this.set = 'BRS';
    }
}
exports.BossOrdersBRS = BossOrdersBRS;
class ChoiceBeltBRS extends choice_belt_1.ChoiceBelt {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.setNumber = '135';
        this.fullName = 'Choice Belt BRS';
        this.set = 'BRS';
    }
}
exports.ChoiceBeltBRS = ChoiceBeltBRS;
class ProfessorsResearchBRS extends professors_research_1.ProfessorsResearch {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.setNumber = '147';
        this.fullName = 'Professor\'s Research BRS';
        this.set = 'BRS';
    }
}
exports.ProfessorsResearchBRS = ProfessorsResearchBRS;
class UltraBallBRS extends ultra_ball_1.UltraBall {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.setNumber = '150';
        this.fullName = 'Ultra Ball BRS';
        this.set = 'BRS';
    }
}
exports.UltraBallBRS = UltraBallBRS;
class ShayminV2BRS extends shaymin_v_1.ShayminV {
    constructor() {
        super(...arguments);
        this.setNumber = '152';
        this.fullName = 'Shaymin V2 BRS';
        this.set = 'BRS';
    }
}
exports.ShayminV2BRS = ShayminV2BRS;
class LumineonV2BRS extends lumineon_v_1.LumineonV {
    constructor() {
        super(...arguments);
        this.setNumber = '155';
        this.fullName = 'Lumineon V2 BRS';
        this.set = 'BRS';
    }
}
exports.LumineonV2BRS = LumineonV2BRS;
class LumineonV3BRS extends lumineon_v_1.LumineonV {
    constructor() {
        super(...arguments);
        this.setNumber = '156';
        this.fullName = 'Lumineon V3 BRS';
        this.set = 'BRS';
    }
}
exports.LumineonV3BRS = LumineonV3BRS;
class RaichuV2BRS extends raichu_v_1.RaichuV {
    constructor() {
        super(...arguments);
        this.setNumber = '158';
        this.fullName = 'Raichu V2 BRS';
        this.set = 'BRS';
    }
}
exports.RaichuV2BRS = RaichuV2BRS;
class ZamazentaV2BRS extends zamazenta_v_2.ZamazentaV {
    constructor() {
        super(...arguments);
        this.setNumber = '163';
        this.fullName = 'Zamazenta V2 BRS';
        this.set = 'BRS';
    }
}
exports.ZamazentaV2BRS = ZamazentaV2BRS;
class ArceusV2BRS extends arceus_v_1.ArceusV {
    constructor() {
        super(...arguments);
        this.setNumber = '165';
        this.fullName = 'Arceus V2 BRS';
        this.set = 'BRS';
    }
}
exports.ArceusV2BRS = ArceusV2BRS;
class ArceusV3BRS extends arceus_v_1.ArceusV {
    constructor() {
        super(...arguments);
        this.setNumber = '166';
        this.fullName = 'Arceus V3 BRS';
        this.set = 'BRS';
    }
}
exports.ArceusV3BRS = ArceusV3BRS;
class CherensCare2BRS extends cherens_care_1.CherensCare {
    constructor() {
        super(...arguments);
        this.setNumber = '168';
        this.fullName = 'Cheren\'s Care2 BRS';
        this.set = 'BRS';
    }
}
exports.CherensCare2BRS = CherensCare2BRS;
class CynthiasAmbition2BRS extends cynthias_ambition_1.CynthiasAmbition {
    constructor() {
        super(...arguments);
        this.setNumber = '169';
        this.fullName = 'Cynthia\'s Ambition2 BRS';
        this.set = 'BRS';
    }
}
exports.CynthiasAmbition2BRS = CynthiasAmbition2BRS;
class Kindler2BRS extends kindler_1.Kindler {
    constructor() {
        super(...arguments);
        this.setNumber = '170';
        this.fullName = 'Kindler2 BRS';
        this.set = 'BRS';
    }
}
exports.Kindler2BRS = Kindler2BRS;
class MarniesPride2BRS extends marnies_pride_1.MarniesPride {
    constructor() {
        super(...arguments);
        this.setNumber = '171';
        this.fullName = 'Marnie\'s Pride2 BRS';
        this.set = 'BRS';
    }
}
exports.MarniesPride2BRS = MarniesPride2BRS;
class RoseannesBackup2BRS extends roseannes_backup_1.RoseannesBackup {
    constructor() {
        super(...arguments);
        this.setNumber = '172';
        this.fullName = 'Roseanne\'s Backup2 BRS';
        this.set = 'BRS';
    }
}
exports.RoseannesBackup2BRS = RoseannesBackup2BRS;
class ShayminVSTAR2BRS extends shaymin_vstar_1.ShayminVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = '173';
        this.fullName = 'Shaymin VSTAR2 BRS';
        this.set = 'BRS';
    }
}
exports.ShayminVSTAR2BRS = ShayminVSTAR2BRS;
class ArceusVSTAR2BRS extends arceus_vstar_1.ArceusVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = '176';
        this.fullName = 'Arceus VSTAR2 BRS';
        this.set = 'BRS';
    }
}
exports.ArceusVSTAR2BRS = ArceusVSTAR2BRS;
class CherensCare3BRS extends cherens_care_1.CherensCare {
    constructor() {
        super(...arguments);
        this.setNumber = '177';
        this.fullName = 'Cheren\'s Care3 BRS';
        this.set = 'BRS';
    }
}
exports.CherensCare3BRS = CherensCare3BRS;
class CynthiasAmbition3BRS extends cynthias_ambition_1.CynthiasAmbition {
    constructor() {
        super(...arguments);
        this.setNumber = '178';
        this.fullName = 'Cynthia\'s Ambition3 BRS';
        this.set = 'BRS';
    }
}
exports.CynthiasAmbition3BRS = CynthiasAmbition3BRS;
class Kindler3BRS extends kindler_1.Kindler {
    constructor() {
        super(...arguments);
        this.setNumber = '179';
        this.fullName = 'Kindler3 BRS';
        this.set = 'BRS';
    }
}
exports.Kindler3BRS = Kindler3BRS;
class RoseannesBackup3BRS extends roseannes_backup_1.RoseannesBackup {
    constructor() {
        super(...arguments);
        this.setNumber = '180';
        this.fullName = 'Roseanne\'s Backup3 BRS';
        this.set = 'BRS';
    }
}
exports.RoseannesBackup3BRS = RoseannesBackup3BRS;
class GalarianArticunoVBRS extends galarian_articuno_v_1.GalarianArticunoV {
    constructor() {
        super(...arguments);
        this.setNumber = '181';
        this.fullName = 'Galarian Articuno V BRS';
        this.set = 'BRS';
    }
}
exports.GalarianArticunoVBRS = GalarianArticunoVBRS;
class GalarianZapdosVBRS extends galarian_zapdos_v_1.GalarianZapdosV {
    constructor() {
        super(...arguments);
        this.setNumber = '182';
        this.fullName = 'Galarian Zapdos V BRS';
        this.set = 'BRS';
    }
}
exports.GalarianZapdosVBRS = GalarianZapdosVBRS;
class GalarianMoltresVBRS extends galarian_moltres_v_1.GalarianMoltresV {
    constructor() {
        super(...arguments);
        this.setNumber = '183';
        this.fullName = 'Galarian Moltres V BRS';
        this.set = 'BRS';
    }
}
exports.GalarianMoltresVBRS = GalarianMoltresVBRS;
class ArceusVSTAR3BRS extends arceus_vstar_1.ArceusVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = '184';
        this.fullName = 'Arceus VSTAR3 BRS';
        this.set = 'BRS';
    }
}
exports.ArceusVSTAR3BRS = ArceusVSTAR3BRS;
class MagmaBasin2BRS extends magma_basin_1.MagmaBasin {
    constructor() {
        super(...arguments);
        this.setNumber = '185';
        this.fullName = 'Magma Basin2 BRS';
        this.set = 'BRS';
    }
}
exports.MagmaBasin2BRS = MagmaBasin2BRS;
class GrassEnergyBRS extends grass_energy_1.GrassEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = 'G';
        this.fullName = 'Grass Energy BRS';
        this.set = 'BRS';
    }
}
exports.GrassEnergyBRS = GrassEnergyBRS;
class FireEnergyBRS extends fire_energy_1.FireEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = 'R';
        this.fullName = 'Fire Energy BRS';
        this.set = 'BRS';
    }
}
exports.FireEnergyBRS = FireEnergyBRS;
class WaterEnergyBRS extends water_energy_1.WaterEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = 'W';
        this.fullName = 'Water Energy BRS';
        this.set = 'BRS';
    }
}
exports.WaterEnergyBRS = WaterEnergyBRS;
class LightningEnergyBRS extends lightning_energy_1.LightningEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = 'L';
        this.fullName = 'Lightning Energy BRS';
        this.set = 'BRS';
    }
}
exports.LightningEnergyBRS = LightningEnergyBRS;
class PsychicEnergyBRS extends psychic_energy_1.PsychicEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = 'P';
        this.fullName = 'Psychic Energy BRS';
        this.set = 'BRS';
    }
}
exports.PsychicEnergyBRS = PsychicEnergyBRS;
class FightingEnergyBRS extends fighting_energy_1.FightingEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = 'F';
        this.fullName = 'Fighting Energy BRS';
        this.set = 'BRS';
    }
}
exports.FightingEnergyBRS = FightingEnergyBRS;
class DarknessEnergyBRS extends basic_energies_1.DarknessEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = 'D';
        this.fullName = 'Darkness Energy BRS';
        this.set = 'BRS';
    }
}
exports.DarknessEnergyBRS = DarknessEnergyBRS;
class MetalEnergyBRS extends basic_energies_2.MetalEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = 'M';
        this.fullName = 'Metal Energy BRS';
        this.set = 'BRS';
    }
}
exports.MetalEnergyBRS = MetalEnergyBRS;
class OctilleryBRS extends octillery_1.Octillery {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG3';
        this.fullName = 'Octillery BRS';
        this.set = 'BRS';
    }
}
exports.OctilleryBRS = OctilleryBRS;
class ZekromBRS extends zekrom_1.Zekrom {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG5';
        this.fullName = 'Zekrom BRS';
        this.set = 'BRS';
    }
}
exports.ZekromBRS = ZekromBRS;
class Dusknoir2BRS extends dusknoir_1.Dusknoir {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG6';
        this.fullName = 'Dusknoir2 BRS';
        this.set = 'BRS';
    }
}
exports.Dusknoir2BRS = Dusknoir2BRS;
class Alcremie2BRS extends alcremie_1.Alcremie {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG8';
        this.fullName = 'Alcremie2 BRS';
        this.set = 'BRS';
    }
}
exports.Alcremie2BRS = Alcremie2BRS;
class HoundoomBRS extends houndoom_1.Houndoom {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG10';
        this.fullName = 'Houndoom BRS';
        this.set = 'BRS';
    }
}
exports.HoundoomBRS = HoundoomBRS;
class OranguruBRS extends oranguru_1.Oranguru {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG12';
        this.fullName = 'Oranguru BRS';
        this.set = 'BRS';
    }
}
exports.OranguruBRS = OranguruBRS;
class SylveonVBRS extends sylveon_v_1.SylveonV {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG14';
        this.fullName = 'Sylveon V BRS';
        this.set = 'BRS';
    }
}
exports.SylveonVBRS = SylveonVBRS;
class SylveonVMAXBRS extends sylveon_vmax_1.SylveonVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG15';
        this.fullName = 'Sylveon VMAX BRS';
        this.set = 'BRS';
    }
}
exports.SylveonVMAXBRS = SylveonVMAXBRS;
class MimikyuV2BRS extends mimikyu_v_2.MimikyuV {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG16';
        this.fullName = 'Mimikyu V2 BRS';
        this.set = 'BRS';
    }
}
exports.MimikyuV2BRS = MimikyuV2BRS;
class SingleStrikeUrshifuVBRS extends single_strike_urshifu_v_1.SingleStrikeUrshifuV {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG18';
        this.fullName = 'Single Strike Urshifu V BRS';
        this.set = 'BRS';
    }
}
exports.SingleStrikeUrshifuVBRS = SingleStrikeUrshifuVBRS;
class SingleStrikeUrshifuVMAXBRS extends single_strike_urshifu_vmax_1.SingleStrikeUrshifuVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG19';
        this.fullName = 'Single Strike Urshifu VMAX BRS';
        this.set = 'BRS';
    }
}
exports.SingleStrikeUrshifuVMAXBRS = SingleStrikeUrshifuVMAXBRS;
class RapidStrikeUrshifuVBRS extends rapid_strike_urshifu_v_1.RapidStrikeUrshifuV {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG20';
        this.fullName = 'Rapid Strike Urshifu V BRS';
        this.set = 'BRS';
    }
}
exports.RapidStrikeUrshifuVBRS = RapidStrikeUrshifuVBRS;
class RapidStrikeUrshifuVMAXBRS extends rapid_strike_urshifu_vmax_1.RapidStrikeUrshifuVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG21';
        this.fullName = 'Rapid Strike Urshifu VMAX BRS';
        this.set = 'BRS';
    }
}
exports.RapidStrikeUrshifuVMAXBRS = RapidStrikeUrshifuVMAXBRS;
class UmbreonVBRS extends umbreon_v_1.UmbreonV {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG22';
        this.fullName = 'Umbreon V BRS';
        this.set = 'BRS';
    }
}
exports.UmbreonVBRS = UmbreonVBRS;
class UmbreonVMAXBRS extends umbreon_vmax_1.UmbreonVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG23';
        this.fullName = 'Umbreon VMAX BRS';
        this.set = 'BRS';
    }
}
exports.UmbreonVMAXBRS = UmbreonVMAXBRS;
class AcerolasPremonition2BRS extends acerolas_premonition_1.AcerolasPremonition {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG24';
        this.fullName = 'Acerola\'s Premonition2 BRS';
        this.set = 'BRS';
    }
}
exports.AcerolasPremonition2BRS = AcerolasPremonition2BRS;
class CafeMaster2BRS extends cafe_master_1.CafeMaster {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG25';
        this.fullName = 'Café Master2 BRS';
        this.set = 'BRS';
    }
}
exports.CafeMaster2BRS = CafeMaster2BRS;
class Gloria2BRS extends gloria_1.Gloria {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG26';
        this.fullName = 'Gloria2 BRS';
        this.set = 'BRS';
    }
}
exports.Gloria2BRS = Gloria2BRS;
class SingleStrikeStyleMustardBRS extends single_strike_style_mustard_1.SingleStrikeStyleMustard {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG28';
        this.fullName = 'Single Strike Style Mustard BRS';
        this.set = 'BRS';
    }
}
exports.SingleStrikeStyleMustardBRS = SingleStrikeStyleMustardBRS;
class SingleStrikeUrshifuVMAX2BRS extends single_strike_urshifu_vmax_2.SingleStrikeUrshifuVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG29';
        this.fullName = 'Single Strike Urshifu VMAX2 BRS';
        this.set = 'BRS';
    }
}
exports.SingleStrikeUrshifuVMAX2BRS = SingleStrikeUrshifuVMAX2BRS;
class RapidStrikeUrshifuVMAX2BRS extends rapid_strike_urshifu_vmax_2.RapidStrikeUrshifuVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = 'TG30';
        this.fullName = 'Rapid Strike Urshifu VMAX2 BRS';
        this.set = 'BRS';
    }
}
exports.RapidStrikeUrshifuVMAX2BRS = RapidStrikeUrshifuVMAX2BRS;
class BurmyBRS extends burmy_1.Burmy {
    constructor() {
        super(...arguments);
        this.set = 'BRS';
        this.setNumber = '9';
        this.fullName = 'Burmy BRS 9';
    }
}
exports.BurmyBRS = BurmyBRS;
class KarrablastBRS extends karrablast_1.Karrablast {
    constructor() {
        super(...arguments);
        this.set = 'BRS';
        this.setNumber = '15';
        this.fullName = 'Karrablast BRS 15';
    }
}
exports.KarrablastBRS = KarrablastBRS;
class FreshWaterSetBRS extends fresh_water_set_1.FreshWaterSet {
    constructor() {
        super(...arguments);
        this.set = 'BRS';
        this.setNumber = '139';
        this.fullName = 'Fresh Water Set BRS 139';
    }
}
exports.FreshWaterSetBRS = FreshWaterSetBRS;
class CharizardV2 extends charizard_v_1.CharizardV {
    constructor() {
        super(...arguments);
        this.set = 'BRS';
        this.setNumber = '153';
        this.fullName = 'Charizard V BRS 153';
    }
}
exports.CharizardV2 = CharizardV2;
class CharizardV3 extends charizard_v_1.CharizardV {
    constructor() {
        super(...arguments);
        this.set = 'BRS';
        this.setNumber = '154';
        this.fullName = 'Charizard V BRS 154';
    }
}
exports.CharizardV3 = CharizardV3;
class GranbullV2 extends granbull_v_1.GranbullV {
    constructor() {
        super(...arguments);
        this.set = 'BRS';
        this.setNumber = '159';
        this.fullName = 'Granbull V BRS 159';
    }
}
exports.GranbullV2 = GranbullV2;
class HonchkrowV2 extends honchkrow_v_1.HonchkrowV {
    constructor() {
        super(...arguments);
        this.set = 'BRS';
        this.setNumber = '161';
        this.fullName = 'Honchkrow V BRS 161';
    }
}
exports.HonchkrowV2 = HonchkrowV2;
class HonchkrowV3 extends honchkrow_v_1.HonchkrowV {
    constructor() {
        super(...arguments);
        this.set = 'BRS';
        this.setNumber = '162';
        this.fullName = 'Honchkrow V BRS 162';
    }
}
exports.HonchkrowV3 = HonchkrowV3;
class FlygonV2 extends flygon_v_1.FlygonV {
    constructor() {
        super(...arguments);
        this.set = 'BRS';
        this.setNumber = '164';
        this.fullName = 'Flygon V BRS 164';
    }
}
exports.FlygonV2 = FlygonV2;
class Barry2 extends barry_1.Barry {
    constructor() {
        super(...arguments);
        this.set = 'BRS';
        this.setNumber = '167';
        this.fullName = 'Barry BRS 167';
    }
}
exports.Barry2 = Barry2;
class CharizardVstar2 extends charizard_vstar_1.CharizardVstar {
    constructor() {
        super(...arguments);
        this.set = 'BRS';
        this.setNumber = '174';
        this.fullName = 'Charizard VSTAR BRS 174';
    }
}
exports.CharizardVstar2 = CharizardVstar2;
