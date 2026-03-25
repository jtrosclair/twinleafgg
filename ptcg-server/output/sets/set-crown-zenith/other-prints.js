"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaprasCRZ = exports.OricorioCRZ = exports.MagmortarCRZ = exports.KricketuneCRZ = exports.MetalEnergyCRZ = exports.DarknessEnergyCRZ = exports.FightingEnergyCRZ = exports.PsychicEnergyCRZ = exports.LightningEnergyCRZ = exports.WaterEnergyCRZ = exports.FireEnergyCRZ = exports.GrassEnergyCRZ = exports.VoloCRZ = exports.ProfessorsResearchCRZ = exports.ElesasSparkleCRZ = exports.UltraBallCRZ = exports.TrekkingShoesCRZ = exports.SwitchCRZ = exports.RareCandyCRZ = exports.RaihanCRZ = exports.PotionCRZ = exports.PokemonCatcherCRZ = exports.PokeBallCRZ = exports.NessaCRZ = exports.LeonCRZ = exports.HopCRZ = exports.GreatBallCRZ = exports.EnergySwitchPKCRZ = exports.EnergySearchCRZ = exports.EnergyRetrievalCRZ = exports.CrushingHammerCRZ = exports.BedeCRZ = exports.GreedentVCRZ = exports.StoutlandVCRZ = exports.DittoCRZ = exports.DuraludonVMAXCRZ = exports.DuraludonVCRZ = exports.RayquazaVMAX2CRZ = exports.RayquazaVMAXCRZ = exports.RayquazaVCRZ = exports.RioluCRZ = exports.SolrockCRZ = exports.LunatoneCRZ = exports.MewVCRZ = exports.RotomVCRZ = exports.SnoruntCRZ = exports.CherubiCRZ = exports.KricketotCRZ = exports.RescueCarrierCRZ = exports.LostVacuumCRZ = void 0;
exports.ArceusVSTARCRZ = exports.GiratinaVSTARCRZ = exports.OriginFormeDialgaVSTARCRZ = exports.OriginFormePalkiaVSTARCRZ = exports.RoxanneCRZ = exports.Raihan2CRZ = exports.MelonyCRZ = exports.IridaCRZ = exports.GrantCRZ = exports.GardeniasVigorCRZ = exports.CynthiasAmbitionCRZ = exports.ColresssExperimentCRZ = exports.CherensCareCRZ = exports.AdamanCRZ = exports.HisuianZoroarkVSTARCRZ = exports.RegigigasVSTAR2CRZ = exports.ZamazentaV2CRZ = exports.HisuianSamurottVSTARCRZ = exports.HisuianSamurottVCRZ = exports.DarkraiVSTARCRZ = exports.DrapionVCRZ = exports.ZacianV2CRZ = exports.ZeraoraVSTAR2CRZ = exports.ZeraoraVMAX2CRZ = exports.RaikouVCRZ = exports.LumineonVCRZ = exports.SuicuneVCRZ = exports.EnteiVCRZ = exports.MareepCRZ = exports.Pikachu2CRZ = exports.Bidoof2CRZ = exports.DuskullCRZ = exports.SwabluCRZ = exports.Riolu2CRZ = exports.BibarelCRZ = exports.MiltankCRZ = exports.DunsparceCRZ = exports.Ditto2CRZ = exports.AltariaCRZ = exports.MagnezoneCRZ = exports.Absol2CRZ = exports.Solrock2CRZ = exports.ComfeyCRZ = exports.DiancieCRZ = exports.DeoxysCRZ = exports.Lunatone2CRZ = exports.MewCRZ = exports.ElectivireCRZ = exports.KeldeoCRZ = exports.ManaphyCRZ = void 0;
exports.FriendsInSinnoh2 = exports.FriendsInHisui2 = exports.BeaCRZ = exports.StarlyCRZ = exports.SnorlaxCRZ = exports.PawniardCRZ = exports.MetangCRZ = exports.KrokorokCRZ = exports.KoffingCRZ = exports.BaltoyCRZ = exports.GravelerCRZ = exports.DusclopsCRZ = exports.ZeraoraCRZ = exports.EmolgaCRZ = exports.LuxioCRZ = exports.ShinxCRZ = exports.CorphishCRZ = exports.GalarianMrMimeCRZ = exports.SeelCRZ = exports.SimisearVCRZ = exports.CharizardVstarCRZ = exports.CharizardVCRZ = exports.GrubbinCRZ = exports.SunkernCRZ = void 0;
const kricketot_1 = require("../set-astral-radiance/kricketot");
const cherubi_1 = require("../set-battle-styles/cherubi");
const snorunt_1 = require("../set-chilling-reign/snorunt");
const rotom_v_1 = require("../set-lost-origin/rotom-v");
const mew_v_1 = require("../set-fusion-strike/mew-v");
const lunatone_1 = require("../set-pokemon-go/lunatone");
const solrock_1 = require("../set-pokemon-go/solrock");
const riolu_1 = require("../set-brilliant-stars/riolu");
const rayquaza_v_1 = require("../set-evolving-skies/rayquaza-v");
const rayquaza_vmax_1 = require("../set-evolving-skies/rayquaza-vmax");
const rayquaza_vmax_2 = require("../set-evolving-skies/rayquaza-vmax");
const duraludon_v_1 = require("../set-evolving-skies/duraludon-v");
const duraludon_vmax_1 = require("../set-evolving-skies/duraludon-vmax");
const ditto_1 = require("../set-pokemon-go/ditto");
const stoutland_v_1 = require("../set-battle-styles/stoutland-v");
const greedent_v_1 = require("../set-fusion-strike/greedent-v");
const bede_1 = require("../set-sword-and-shield/bede");
const crushing_hammer_1 = require("../set-scarlet-and-violet/crushing-hammer");
const energy_retrieval_1 = require("../set-base-set/energy-retrieval");
const energy_search_1 = require("../set-fossil/energy-search");
const other_prints_1 = require("../set-ex-power-keepers/other-prints");
const great_ball_1 = require("../set-ex-firered-leafgreen/great-ball");
const hop_1 = require("../set-sword-and-shield/hop");
const leon_1 = require("../set-vivid-voltage/leon");
const nessa_1 = require("../set-vivid-voltage/nessa");
const pokeball_1 = require("../set-jungle/pokeball");
const pokemon_catcher_1 = require("../set-scarlet-and-violet/pokemon-catcher");
const potion_1 = require("../set-base-set/potion");
const raihan_1 = require("../set-evolving-skies/raihan");
const rare_candy_1 = require("../set-ex-holon-phantoms/rare-candy");
const switch_1 = require("../set-base-set/switch");
const trekking_shoes_1 = require("../set-astral-radiance/trekking-shoes");
const ultra_ball_1 = require("../set-scarlet-and-violet/ultra-ball");
const elesas_sparkle_1 = require("../set-fusion-strike/elesas-sparkle");
const professors_research_1 = require("../set-scarlet-and-violet/professors-research");
const volo_1 = require("../set-lost-origin/volo");
const grass_energy_1 = require("../set-base-set-energy/grass-energy");
const fire_energy_1 = require("../set-base-set-energy/fire-energy");
const water_energy_1 = require("../set-base-set-energy/water-energy");
const lightning_energy_1 = require("../set-base-set-energy/lightning-energy");
const psychic_energy_1 = require("../set-base-set-energy/psychic-energy");
const fighting_energy_1 = require("../set-base-set-energy/fighting-energy");
const basic_energies_1 = require("../set-diamond-and-pearl/basic-energies");
const basic_energies_2 = require("../set-diamond-and-pearl/basic-energies");
const kricketune_1 = require("../set-astral-radiance/kricketune");
const magmortar_1 = require("../set-brilliant-stars/magmortar");
const oricorio_1 = require("../set-fusion-strike/oricorio");
const lapras_1 = require("../set-brilliant-stars/lapras");
const manaphy_1 = require("../set-brilliant-stars/manaphy");
const keldeo_1 = require("../set-astral-radiance/keldeo");
const electivire_1 = require("../set-brilliant-stars/electivire");
const mew_1 = require("../set-celebrations/mew");
const lunatone_2 = require("../set-pokemon-go/lunatone");
const deoxys_1 = require("../set-fusion-strike/deoxys");
const diancie_1 = require("../set-astral-radiance/diancie");
const comfey_1 = require("../set-lost-origin/comfey");
const solrock_2 = require("../set-pokemon-go/solrock");
const absol_1 = require("../set-astral-radiance/absol");
const magnezone_1 = require("../set-astral-radiance/magnezone");
const altaria_1 = require("../set-evolving-skies/altaria");
const ditto_2 = require("../set-pokemon-go/ditto");
const dunsparce_1 = require("../set-fusion-strike/dunsparce");
const miltank_1 = require("../set-astral-radiance/miltank");
const bibarel_1 = require("../set-brilliant-stars/bibarel");
const riolu_2 = require("../set-brilliant-stars/riolu");
const swablu_1 = require("../set-evolving-skies/swablu");
const duskull_1 = require("../set-brilliant-stars/duskull");
const bidoof_1 = require("../set-crown-zenith/bidoof");
const pikachu_1 = require("../set-lost-origin/pikachu");
const mareep_1 = require("../set-evolving-skies/mareep");
const entei_v_1 = require("../set-brilliant-stars/entei-v");
const suicune_v_1 = require("../set-evolving-skies/suicune-v");
const lumineon_v_1 = require("../set-brilliant-stars/lumineon-v");
const raikou_v_1 = require("../set-brilliant-stars/raikou-v");
const zeraora_vmax_1 = require("../set-crown-zenith/zeraora-vmax");
const zeraora_vstar_1 = require("../set-crown-zenith/zeraora-vstar");
const zacian_v_1 = require("../set-celebrations/zacian-v");
const drapion_v_1 = require("../set-lost-origin/drapion-v");
const darkrai_vstar_1 = require("../set-astral-radiance/darkrai-vstar");
const hisuian_samurott_v_1 = require("../set-astral-radiance/hisuian-samurott-v");
const hisuian_samurott_vstar_1 = require("../set-astral-radiance/hisuian-samurott-vstar");
const zamazenta_v_1 = require("../set-crown-zenith/zamazenta-v");
const regigigas_vstar_1 = require("../set-crown-zenith/regigigas-vstar");
const hisuian_zoroark_vstar_1 = require("../set-lost-origin/hisuian-zoroark-vstar");
const adaman_1 = require("../set-astral-radiance/adaman");
const cherens_care_1 = require("../set-brilliant-stars/cherens-care");
const colress_s_experiment_1 = require("../set-lost-origin/colress's-experiment");
const cynthias_ambition_1 = require("../set-brilliant-stars/cynthias-ambition");
const gardenias_vigor_1 = require("../set-astral-radiance/gardenias-vigor");
const grant_1 = require("../set-astral-radiance/grant");
const irida_1 = require("../set-astral-radiance/irida");
const melony_1 = require("../set-chilling-reign/melony");
const raihan_2 = require("../set-evolving-skies/raihan");
const roxanne_1 = require("../set-astral-radiance/roxanne");
const origin_forme_palkia_vstar_1 = require("../set-astral-radiance/origin-forme-palkia-vstar");
const origin_forme_dialga_vstar_1 = require("../set-astral-radiance/origin-forme-dialga-vstar");
const giratina_vstar_1 = require("../set-lost-origin/giratina-vstar");
const arceus_vstar_1 = require("../set-brilliant-stars/arceus-vstar");
const lost_vacuum_1 = require("../set-lost-origin/lost-vacuum");
const rescue_carrier_1 = require("../set-evolving-skies/rescue-carrier");
const sunkern_1 = require("../set-silver-tempest/sunkern");
const grubbin_1 = require("../set-fusion-strike/grubbin");
const charizard_v_1 = require("../set-brilliant-stars/charizard-v");
const charizard_vstar_1 = require("../set-brilliant-stars/charizard-vstar");
const simisear_v_1 = require("../set-brilliant-stars/simisear-v");
const seel_1 = require("../set-lost-origin/seel");
const galarian_mr_mime_1 = require("../set-battle-styles/galarian-mr-mime");
const corphish_1 = require("../set-brilliant-stars/corphish");
const shinx_1 = require("../set-battle-styles/shinx");
const luxio_1 = require("../set-battle-styles/luxio");
const emolga_1 = require("../set-evolving-skies/emolga");
const zeraora_1 = require("../set-fusion-strike/zeraora");
const dusclops_1 = require("../set-brilliant-stars/dusclops");
const graveler_1 = require("../set-fusion-strike/graveler");
const baltoy_1 = require("../set-fusion-strike/baltoy");
const koffing_1 = require("../set-ex-deoxys/koffing");
const krokorok_1 = require("../set-vivid-voltage/krokorok");
const metang_1 = require("../set-celestial-storm/metang");
const pawniard_1 = require("../set-astral-radiance/pawniard");
const snorlax_1 = require("../set-fusion-strike/snorlax");
const starly_1 = require("../set-brilliant-stars/starly");
const bea_1 = require("../set-vivid-voltage/bea");
const friends_in_hisui_1 = require("./friends-in-hisui");
const friends_in_sinnoh_1 = require("./friends-in-sinnoh");
class LostVacuumCRZ extends lost_vacuum_1.LostVacuum {
    constructor() {
        super(...arguments);
        this.fullName = 'Lost Vacuum CRZ';
        this.set = 'CRZ';
        this.setNumber = '135';
    }
}
exports.LostVacuumCRZ = LostVacuumCRZ;
class RescueCarrierCRZ extends rescue_carrier_1.RescueCarrier {
    constructor() {
        super(...arguments);
        this.fullName = 'Rescue Carrier CRZ';
        this.set = 'CRZ';
        this.setNumber = '142';
    }
}
exports.RescueCarrierCRZ = RescueCarrierCRZ;
class KricketotCRZ extends kricketot_1.Kricketot {
    constructor() {
        super(...arguments);
        this.setNumber = '10';
        this.fullName = 'Kricketot CRZ';
        this.set = 'CRZ';
    }
}
exports.KricketotCRZ = KricketotCRZ;
class CherubiCRZ extends cherubi_1.Cherubi {
    constructor() {
        super(...arguments);
        this.setNumber = '11';
        this.fullName = 'Cherubi CRZ';
        this.set = 'CRZ';
    }
}
exports.CherubiCRZ = CherubiCRZ;
class SnoruntCRZ extends snorunt_1.Snorunt {
    constructor() {
        super(...arguments);
        this.setNumber = '34';
        this.fullName = 'Snorunt CRZ';
        this.set = 'CRZ';
    }
}
exports.SnoruntCRZ = SnoruntCRZ;
class RotomVCRZ extends rotom_v_1.RotomV {
    constructor() {
        super(...arguments);
        this.setNumber = '45';
        this.fullName = 'Rotom V CRZ';
        this.set = 'CRZ';
    }
}
exports.RotomVCRZ = RotomVCRZ;
class MewVCRZ extends mew_v_1.MewV {
    constructor() {
        super(...arguments);
        this.setNumber = '60';
        this.fullName = 'Mew V CRZ';
        this.set = 'CRZ';
    }
}
exports.MewVCRZ = MewVCRZ;
class LunatoneCRZ extends lunatone_1.Lunatone {
    constructor() {
        super(...arguments);
        this.setNumber = '62';
        this.fullName = 'Lunatone CRZ';
        this.set = 'CRZ';
    }
}
exports.LunatoneCRZ = LunatoneCRZ;
class SolrockCRZ extends solrock_1.Solrock {
    constructor() {
        super(...arguments);
        this.setNumber = '69';
        this.fullName = 'Solrock CRZ';
        this.set = 'CRZ';
    }
}
exports.SolrockCRZ = SolrockCRZ;
class RioluCRZ extends riolu_1.Riolu {
    constructor() {
        super(...arguments);
        this.setNumber = '71';
        this.fullName = 'Riolu CRZ';
        this.set = 'CRZ';
    }
}
exports.RioluCRZ = RioluCRZ;
class RayquazaVCRZ extends rayquaza_v_1.RayquazaV {
    constructor() {
        super(...arguments);
        this.setNumber = '100';
        this.fullName = 'Rayquaza V CRZ';
        this.set = 'CRZ';
    }
}
exports.RayquazaVCRZ = RayquazaVCRZ;
class RayquazaVMAXCRZ extends rayquaza_vmax_1.RayquazaVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = '101';
        this.fullName = 'Rayquaza VMAX CRZ';
        this.set = 'CRZ';
    }
}
exports.RayquazaVMAXCRZ = RayquazaVMAXCRZ;
class RayquazaVMAX2CRZ extends rayquaza_vmax_2.RayquazaVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = '102';
        this.fullName = 'Rayquaza VMAX2 CRZ';
        this.set = 'CRZ';
    }
}
exports.RayquazaVMAX2CRZ = RayquazaVMAX2CRZ;
class DuraludonVCRZ extends duraludon_v_1.DuraludonV {
    constructor() {
        super(...arguments);
        this.setNumber = '103';
        this.fullName = 'Duraludon V CRZ';
        this.set = 'CRZ';
    }
}
exports.DuraludonVCRZ = DuraludonVCRZ;
class DuraludonVMAXCRZ extends duraludon_vmax_1.DuraludonVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = '104';
        this.fullName = 'Duraludon VMAX CRZ';
        this.set = 'CRZ';
    }
}
exports.DuraludonVMAXCRZ = DuraludonVMAXCRZ;
class DittoCRZ extends ditto_1.Ditto {
    constructor() {
        super(...arguments);
        this.setNumber = '107';
        this.fullName = 'Ditto CRZ';
        this.set = 'CRZ';
    }
}
exports.DittoCRZ = DittoCRZ;
class StoutlandVCRZ extends stoutland_v_1.StoutlandV {
    constructor() {
        super(...arguments);
        this.setNumber = '116';
        this.fullName = 'Stoutland V CRZ';
        this.set = 'CRZ';
    }
}
exports.StoutlandVCRZ = StoutlandVCRZ;
class GreedentVCRZ extends greedent_v_1.GreedentV {
    constructor() {
        super(...arguments);
        this.setNumber = '120';
        this.fullName = 'Greedent V CRZ';
        this.set = 'CRZ';
    }
}
exports.GreedentVCRZ = GreedentVCRZ;
class BedeCRZ extends bede_1.Bede {
    constructor() {
        super(...arguments);
        this.setNumber = '124';
        this.fullName = 'Bede CRZ';
        this.set = 'CRZ';
    }
}
exports.BedeCRZ = BedeCRZ;
class CrushingHammerCRZ extends crushing_hammer_1.CrushingHammer {
    constructor() {
        super(...arguments);
        this.setNumber = '125';
        this.fullName = 'Crushing Hammer CRZ';
        this.set = 'CRZ';
    }
}
exports.CrushingHammerCRZ = CrushingHammerCRZ;
class EnergyRetrievalCRZ extends energy_retrieval_1.EnergyRetrieval {
    constructor() {
        super(...arguments);
        this.setNumber = '127';
        this.fullName = 'Energy Retrieval CRZ';
        this.set = 'CRZ';
    }
}
exports.EnergyRetrievalCRZ = EnergyRetrievalCRZ;
class EnergySearchCRZ extends energy_search_1.EnergySearch {
    constructor() {
        super(...arguments);
        this.setNumber = '128';
        this.fullName = 'Energy Search CRZ';
        this.set = 'CRZ';
    }
}
exports.EnergySearchCRZ = EnergySearchCRZ;
class EnergySwitchPKCRZ extends other_prints_1.EnergySwitchPK {
    constructor() {
        super(...arguments);
        this.setNumber = '129';
        this.fullName = 'Energy Switch CRZ';
        this.set = 'CRZ';
    }
}
exports.EnergySwitchPKCRZ = EnergySwitchPKCRZ;
class GreatBallCRZ extends great_ball_1.GreatBall {
    constructor() {
        super(...arguments);
        this.setNumber = '132';
        this.fullName = 'Great Ball CRZ';
        this.set = 'CRZ';
    }
}
exports.GreatBallCRZ = GreatBallCRZ;
class HopCRZ extends hop_1.Hop {
    constructor() {
        super(...arguments);
        this.setNumber = '133';
        this.fullName = 'Hop CRZ';
        this.set = 'CRZ';
    }
}
exports.HopCRZ = HopCRZ;
class LeonCRZ extends leon_1.Leon {
    constructor() {
        super(...arguments);
        this.setNumber = '134';
        this.fullName = 'Leon CRZ';
        this.set = 'CRZ';
    }
}
exports.LeonCRZ = LeonCRZ;
class NessaCRZ extends nessa_1.Nessa {
    constructor() {
        super(...arguments);
        this.setNumber = '136';
        this.fullName = 'Nessa CRZ';
        this.set = 'CRZ';
    }
}
exports.NessaCRZ = NessaCRZ;
class PokeBallCRZ extends pokeball_1.PokeBall {
    constructor() {
        super(...arguments);
        this.setNumber = '137';
        this.fullName = 'Poké Ball CRZ';
        this.set = 'CRZ';
    }
}
exports.PokeBallCRZ = PokeBallCRZ;
class PokemonCatcherCRZ extends pokemon_catcher_1.PokemonCatcher {
    constructor() {
        super(...arguments);
        this.setNumber = '138';
        this.fullName = 'Pokemon Catcher CRZ';
        this.set = 'CRZ';
    }
}
exports.PokemonCatcherCRZ = PokemonCatcherCRZ;
class PotionCRZ extends potion_1.Potion {
    constructor() {
        super(...arguments);
        this.setNumber = '139';
        this.fullName = 'Potion CRZ';
        this.set = 'CRZ';
    }
}
exports.PotionCRZ = PotionCRZ;
class RaihanCRZ extends raihan_1.Raihan {
    constructor() {
        super(...arguments);
        this.setNumber = '140';
        this.fullName = 'Raihan CRZ';
        this.set = 'CRZ';
    }
}
exports.RaihanCRZ = RaihanCRZ;
class RareCandyCRZ extends rare_candy_1.RareCandy {
    constructor() {
        super(...arguments);
        this.setNumber = '141';
        this.fullName = 'Rare Candy CRZ';
        this.set = 'CRZ';
    }
}
exports.RareCandyCRZ = RareCandyCRZ;
class SwitchCRZ extends switch_1.Switch {
    constructor() {
        super(...arguments);
        this.setNumber = '144';
        this.fullName = 'Switch CRZ';
        this.set = 'CRZ';
    }
}
exports.SwitchCRZ = SwitchCRZ;
class TrekkingShoesCRZ extends trekking_shoes_1.TrekkingShoes {
    constructor() {
        super(...arguments);
        this.setNumber = '145';
        this.fullName = 'Trekking Shoes CRZ';
        this.set = 'CRZ';
    }
}
exports.TrekkingShoesCRZ = TrekkingShoesCRZ;
class UltraBallCRZ extends ultra_ball_1.UltraBall {
    constructor() {
        super(...arguments);
        this.setNumber = '146';
        this.fullName = 'Ultra Ball CRZ';
        this.set = 'CRZ';
    }
}
exports.UltraBallCRZ = UltraBallCRZ;
class ElesasSparkleCRZ extends elesas_sparkle_1.ElesasSparkle {
    constructor() {
        super(...arguments);
        this.setNumber = '147';
        this.fullName = 'Elesa\'s Sparkle CRZ';
        this.set = 'CRZ';
    }
}
exports.ElesasSparkleCRZ = ElesasSparkleCRZ;
class ProfessorsResearchCRZ extends professors_research_1.ProfessorsResearch {
    constructor() {
        super(...arguments);
        this.setNumber = '150';
        this.fullName = 'Professor\'s Research CRZ';
        this.set = 'CRZ';
    }
}
exports.ProfessorsResearchCRZ = ProfessorsResearchCRZ;
class VoloCRZ extends volo_1.Volo {
    constructor() {
        super(...arguments);
        this.setNumber = '151';
        this.fullName = 'Volo CRZ';
        this.set = 'CRZ';
    }
}
exports.VoloCRZ = VoloCRZ;
class GrassEnergyCRZ extends grass_energy_1.GrassEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '152';
        this.fullName = 'Grass Energy CRZ';
        this.set = 'CRZ';
    }
}
exports.GrassEnergyCRZ = GrassEnergyCRZ;
class FireEnergyCRZ extends fire_energy_1.FireEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '153';
        this.fullName = 'Fire Energy CRZ';
        this.set = 'CRZ';
    }
}
exports.FireEnergyCRZ = FireEnergyCRZ;
class WaterEnergyCRZ extends water_energy_1.WaterEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '154';
        this.fullName = 'Water Energy CRZ';
        this.set = 'CRZ';
    }
}
exports.WaterEnergyCRZ = WaterEnergyCRZ;
class LightningEnergyCRZ extends lightning_energy_1.LightningEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '155';
        this.fullName = 'Lightning Energy CRZ';
        this.set = 'CRZ';
    }
}
exports.LightningEnergyCRZ = LightningEnergyCRZ;
class PsychicEnergyCRZ extends psychic_energy_1.PsychicEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '156';
        this.fullName = 'Psychic Energy CRZ';
        this.set = 'CRZ';
    }
}
exports.PsychicEnergyCRZ = PsychicEnergyCRZ;
class FightingEnergyCRZ extends fighting_energy_1.FightingEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '157';
        this.fullName = 'Fighting Energy CRZ';
        this.set = 'CRZ';
    }
}
exports.FightingEnergyCRZ = FightingEnergyCRZ;
class DarknessEnergyCRZ extends basic_energies_1.DarknessEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '158';
        this.fullName = 'Darkness Energy CRZ';
        this.set = 'CRZ';
    }
}
exports.DarknessEnergyCRZ = DarknessEnergyCRZ;
class MetalEnergyCRZ extends basic_energies_2.MetalEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '159';
        this.fullName = 'Metal Energy CRZ';
        this.set = 'CRZ';
    }
}
exports.MetalEnergyCRZ = MetalEnergyCRZ;
class KricketuneCRZ extends kricketune_1.Kricketune {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG2';
        this.fullName = 'Kricketune CRZ';
        this.set = 'CRZ';
    }
}
exports.KricketuneCRZ = KricketuneCRZ;
class MagmortarCRZ extends magmortar_1.Magmortar {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG3';
        this.fullName = 'Magmortar CRZ';
        this.set = 'CRZ';
    }
}
exports.MagmortarCRZ = MagmortarCRZ;
class OricorioCRZ extends oricorio_1.Oricorio {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG4';
        this.fullName = 'Oricorio CRZ';
        this.set = 'CRZ';
    }
}
exports.OricorioCRZ = OricorioCRZ;
class LaprasCRZ extends lapras_1.Lapras {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG5';
        this.fullName = 'Lapras CRZ';
        this.set = 'CRZ';
    }
}
exports.LaprasCRZ = LaprasCRZ;
class ManaphyCRZ extends manaphy_1.Manaphy {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG6';
        this.fullName = 'Manaphy CRZ';
        this.set = 'CRZ';
    }
}
exports.ManaphyCRZ = ManaphyCRZ;
class KeldeoCRZ extends keldeo_1.Keldeo {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG7';
        this.fullName = 'Keldeo CRZ';
        this.set = 'CRZ';
    }
}
exports.KeldeoCRZ = KeldeoCRZ;
class ElectivireCRZ extends electivire_1.Electivire {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG8';
        this.fullName = 'Electivire CRZ';
        this.set = 'CRZ';
    }
}
exports.ElectivireCRZ = ElectivireCRZ;
class MewCRZ extends mew_1.Mew {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG10';
        this.fullName = 'Mew CRZ';
        this.set = 'CRZ';
    }
}
exports.MewCRZ = MewCRZ;
class Lunatone2CRZ extends lunatone_2.Lunatone {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG11';
        this.fullName = 'Lunatone2 CRZ';
        this.set = 'CRZ';
    }
}
exports.Lunatone2CRZ = Lunatone2CRZ;
class DeoxysCRZ extends deoxys_1.Deoxys {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG12';
        this.fullName = 'Deoxys CRZ';
        this.set = 'CRZ';
    }
}
exports.DeoxysCRZ = DeoxysCRZ;
class DiancieCRZ extends diancie_1.Diancie {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG13';
        this.fullName = 'Diancie CRZ';
        this.set = 'CRZ';
    }
}
exports.DiancieCRZ = DiancieCRZ;
class ComfeyCRZ extends comfey_1.Comfey {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG14';
        this.fullName = 'Comfey CRZ';
        this.set = 'CRZ';
    }
}
exports.ComfeyCRZ = ComfeyCRZ;
class Solrock2CRZ extends solrock_2.Solrock {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG15';
        this.fullName = 'Solrock2 CRZ';
        this.set = 'CRZ';
    }
}
exports.Solrock2CRZ = Solrock2CRZ;
class Absol2CRZ extends absol_1.Absol {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG16';
        this.fullName = 'Absol2 CRZ';
        this.set = 'CRZ';
    }
}
exports.Absol2CRZ = Absol2CRZ;
class MagnezoneCRZ extends magnezone_1.Magnezone {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG18';
        this.fullName = 'Magnezone CRZ';
        this.set = 'CRZ';
    }
}
exports.MagnezoneCRZ = MagnezoneCRZ;
class AltariaCRZ extends altaria_1.Altaria {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG19';
        this.fullName = 'Altaria CRZ';
        this.set = 'CRZ';
    }
}
exports.AltariaCRZ = AltariaCRZ;
class Ditto2CRZ extends ditto_2.Ditto {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG22';
        this.fullName = 'Ditto2 CRZ';
        this.set = 'CRZ';
    }
}
exports.Ditto2CRZ = Ditto2CRZ;
class DunsparceCRZ extends dunsparce_1.Dunsparce {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG23';
        this.fullName = 'Dunsparce CRZ';
        this.set = 'CRZ';
    }
}
exports.DunsparceCRZ = DunsparceCRZ;
class MiltankCRZ extends miltank_1.Miltank {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG24';
        this.fullName = 'Miltank CRZ';
        this.set = 'CRZ';
    }
}
exports.MiltankCRZ = MiltankCRZ;
class BibarelCRZ extends bibarel_1.Bibarel {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG25';
        this.fullName = 'Bibarel CRZ';
        this.set = 'CRZ';
    }
}
exports.BibarelCRZ = BibarelCRZ;
class Riolu2CRZ extends riolu_2.Riolu {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG26';
        this.fullName = 'Riolu2 CRZ';
        this.set = 'CRZ';
    }
}
exports.Riolu2CRZ = Riolu2CRZ;
class SwabluCRZ extends swablu_1.Swablu {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG27';
        this.fullName = 'Swablu CRZ';
        this.set = 'CRZ';
    }
}
exports.SwabluCRZ = SwabluCRZ;
class DuskullCRZ extends duskull_1.Duskull {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG28';
        this.fullName = 'Duskull CRZ';
        this.set = 'CRZ';
    }
}
exports.DuskullCRZ = DuskullCRZ;
class Bidoof2CRZ extends bidoof_1.Bidoof {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG29';
        this.fullName = 'Bidoof2 CRZ';
        this.set = 'CRZ';
    }
}
exports.Bidoof2CRZ = Bidoof2CRZ;
class Pikachu2CRZ extends pikachu_1.Pikachu {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG30';
        this.fullName = 'Pikachu2 CRZ';
        this.set = 'CRZ';
    }
}
exports.Pikachu2CRZ = Pikachu2CRZ;
class MareepCRZ extends mareep_1.Mareep {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG34';
        this.fullName = 'Mareep CRZ';
        this.set = 'CRZ';
    }
}
exports.MareepCRZ = MareepCRZ;
class EnteiVCRZ extends entei_v_1.EnteiV {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG36';
        this.fullName = 'Entei V CRZ';
        this.set = 'CRZ';
    }
}
exports.EnteiVCRZ = EnteiVCRZ;
class SuicuneVCRZ extends suicune_v_1.SuicuneV {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG38';
        this.fullName = 'Suicune V CRZ';
        this.set = 'CRZ';
    }
}
exports.SuicuneVCRZ = SuicuneVCRZ;
class LumineonVCRZ extends lumineon_v_1.LumineonV {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG39';
        this.fullName = 'Lumineon V CRZ';
        this.set = 'CRZ';
    }
}
exports.LumineonVCRZ = LumineonVCRZ;
class RaikouVCRZ extends raikou_v_1.RaikouV {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG41';
        this.fullName = 'Raikou V CRZ';
        this.set = 'CRZ';
    }
}
exports.RaikouVCRZ = RaikouVCRZ;
class ZeraoraVMAX2CRZ extends zeraora_vmax_1.ZeraoraVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG42';
        this.fullName = 'Zeraora VMAX2 CRZ';
        this.set = 'CRZ';
    }
}
exports.ZeraoraVMAX2CRZ = ZeraoraVMAX2CRZ;
class ZeraoraVSTAR2CRZ extends zeraora_vstar_1.ZeraoraVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG43';
        this.fullName = 'Zeraora VSTAR2 CRZ';
        this.set = 'CRZ';
    }
}
exports.ZeraoraVSTAR2CRZ = ZeraoraVSTAR2CRZ;
class ZacianV2CRZ extends zacian_v_1.ZacianV {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG48';
        this.fullName = 'Zacian V2 CRZ';
        this.set = 'CRZ';
    }
}
exports.ZacianV2CRZ = ZacianV2CRZ;
class DrapionVCRZ extends drapion_v_1.DrapionV {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG49';
        this.fullName = 'Drapion V CRZ';
        this.set = 'CRZ';
    }
}
exports.DrapionVCRZ = DrapionVCRZ;
class DarkraiVSTARCRZ extends darkrai_vstar_1.DarkraiVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG50';
        this.fullName = 'Darkrai VSTAR CRZ';
        this.set = 'CRZ';
    }
}
exports.DarkraiVSTARCRZ = DarkraiVSTARCRZ;
class HisuianSamurottVCRZ extends hisuian_samurott_v_1.HisuianSamurottV {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG51';
        this.fullName = 'Hisuian Samurott V CRZ';
        this.set = 'CRZ';
    }
}
exports.HisuianSamurottVCRZ = HisuianSamurottVCRZ;
class HisuianSamurottVSTARCRZ extends hisuian_samurott_vstar_1.HisuianSamurottVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG52';
        this.fullName = 'Hisuian Samurott VSTAR CRZ';
        this.set = 'CRZ';
    }
}
exports.HisuianSamurottVSTARCRZ = HisuianSamurottVSTARCRZ;
class ZamazentaV2CRZ extends zamazenta_v_1.ZamazentaV {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG54';
        this.fullName = 'Zamazenta V2 CRZ';
        this.set = 'CRZ';
    }
}
exports.ZamazentaV2CRZ = ZamazentaV2CRZ;
class RegigigasVSTAR2CRZ extends regigigas_vstar_1.RegigigasVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG55';
        this.fullName = 'Regigigas VSTAR2 CRZ';
        this.set = 'CRZ';
    }
}
exports.RegigigasVSTAR2CRZ = RegigigasVSTAR2CRZ;
class HisuianZoroarkVSTARCRZ extends hisuian_zoroark_vstar_1.HisuianZoroarkVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG56';
        this.fullName = 'Hisuian Zoroark VSTAR CRZ';
        this.set = 'CRZ';
    }
}
exports.HisuianZoroarkVSTARCRZ = HisuianZoroarkVSTARCRZ;
class AdamanCRZ extends adaman_1.Adaman {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG57';
        this.fullName = 'Adaman CRZ';
        this.set = 'CRZ';
    }
}
exports.AdamanCRZ = AdamanCRZ;
class CherensCareCRZ extends cherens_care_1.CherensCare {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG58';
        this.fullName = 'Cheren\'s Care CRZ';
        this.set = 'CRZ';
    }
}
exports.CherensCareCRZ = CherensCareCRZ;
class ColresssExperimentCRZ extends colress_s_experiment_1.ColresssExperiment {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG59';
        this.fullName = 'Colress\'s Experiment CRZ';
        this.set = 'CRZ';
    }
}
exports.ColresssExperimentCRZ = ColresssExperimentCRZ;
class CynthiasAmbitionCRZ extends cynthias_ambition_1.CynthiasAmbition {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG60';
        this.fullName = 'Cynthia\'s Ambition CRZ';
        this.set = 'CRZ';
    }
}
exports.CynthiasAmbitionCRZ = CynthiasAmbitionCRZ;
class GardeniasVigorCRZ extends gardenias_vigor_1.GardeniasVigor {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG61';
        this.fullName = 'Gardenia\'s Vigor CRZ';
        this.set = 'CRZ';
    }
}
exports.GardeniasVigorCRZ = GardeniasVigorCRZ;
class GrantCRZ extends grant_1.Grant {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG62';
        this.fullName = 'Grant CRZ';
        this.set = 'CRZ';
    }
}
exports.GrantCRZ = GrantCRZ;
class IridaCRZ extends irida_1.Irida {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG63';
        this.fullName = 'Irida CRZ';
        this.set = 'CRZ';
    }
}
exports.IridaCRZ = IridaCRZ;
class MelonyCRZ extends melony_1.Melony {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG64';
        this.fullName = 'Melony CRZ';
        this.set = 'CRZ';
    }
}
exports.MelonyCRZ = MelonyCRZ;
class Raihan2CRZ extends raihan_2.Raihan {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG65';
        this.fullName = 'Raihan2 CRZ';
        this.set = 'CRZ';
    }
}
exports.Raihan2CRZ = Raihan2CRZ;
class RoxanneCRZ extends roxanne_1.Roxanne {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG66';
        this.fullName = 'Roxanne CRZ';
        this.set = 'CRZ';
    }
}
exports.RoxanneCRZ = RoxanneCRZ;
class OriginFormePalkiaVSTARCRZ extends origin_forme_palkia_vstar_1.OriginFormePalkiaVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG67';
        this.fullName = 'Origin Forme Palkia VSTAR CRZ';
        this.set = 'CRZ';
    }
}
exports.OriginFormePalkiaVSTARCRZ = OriginFormePalkiaVSTARCRZ;
class OriginFormeDialgaVSTARCRZ extends origin_forme_dialga_vstar_1.OriginFormeDialgaVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG68';
        this.fullName = 'Origin Forme Dialga VSTAR CRZ';
        this.set = 'CRZ';
    }
}
exports.OriginFormeDialgaVSTARCRZ = OriginFormeDialgaVSTARCRZ;
class GiratinaVSTARCRZ extends giratina_vstar_1.GiratinaVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG69';
        this.fullName = 'Giratina VSTAR CRZ';
        this.set = 'CRZ';
    }
}
exports.GiratinaVSTARCRZ = GiratinaVSTARCRZ;
class ArceusVSTARCRZ extends arceus_vstar_1.ArceusVSTAR {
    constructor() {
        super(...arguments);
        this.setNumber = 'GG70';
        this.fullName = 'Arceus VSTAR CRZ';
        this.set = 'CRZ';
    }
}
exports.ArceusVSTARCRZ = ArceusVSTARCRZ;
class SunkernCRZ extends sunkern_1.Sunkern {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '7';
        this.fullName = 'Sunkern CRZ 7';
    }
}
exports.SunkernCRZ = SunkernCRZ;
class GrubbinCRZ extends grubbin_1.Grubbin {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '15';
        this.fullName = 'Grubbin CRZ 15';
    }
}
exports.GrubbinCRZ = GrubbinCRZ;
class CharizardVCRZ extends charizard_v_1.CharizardV {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '18';
        this.fullName = 'Charizard V CRZ 18';
    }
}
exports.CharizardVCRZ = CharizardVCRZ;
class CharizardVstarCRZ extends charizard_vstar_1.CharizardVstar {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '19';
        this.fullName = 'Charizard VSTAR CRZ 19';
    }
}
exports.CharizardVstarCRZ = CharizardVstarCRZ;
class SimisearVCRZ extends simisear_v_1.SimisearV {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '22';
        this.fullName = 'Simisear V CRZ 22';
    }
}
exports.SimisearVCRZ = SimisearVCRZ;
class SeelCRZ extends seel_1.Seel {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '29';
        this.fullName = 'Seel CRZ 29';
    }
}
exports.SeelCRZ = SeelCRZ;
class GalarianMrMimeCRZ extends galarian_mr_mime_1.GalarianMrMime {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '30';
        this.fullName = 'Galarian Mr. Mime CRZ 30';
    }
}
exports.GalarianMrMimeCRZ = GalarianMrMimeCRZ;
class CorphishCRZ extends corphish_1.Corphish {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '33';
        this.fullName = 'Corphish CRZ 33';
    }
}
exports.CorphishCRZ = CorphishCRZ;
class ShinxCRZ extends shinx_1.Shinx {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '39';
        this.fullName = 'Shinx CRZ 39';
    }
}
exports.ShinxCRZ = ShinxCRZ;
class LuxioCRZ extends luxio_1.Luxio {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '41';
        this.fullName = 'Luxio CRZ 41';
    }
}
exports.LuxioCRZ = LuxioCRZ;
class EmolgaCRZ extends emolga_1.Emolga {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '47';
        this.fullName = 'Emolga CRZ 47';
    }
}
exports.EmolgaCRZ = EmolgaCRZ;
class ZeraoraCRZ extends zeraora_1.Zeraora {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '52';
        this.fullName = 'Zeraora CRZ 52';
    }
}
exports.ZeraoraCRZ = ZeraoraCRZ;
class DusclopsCRZ extends dusclops_1.Dusclops {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '63';
        this.fullName = 'Dusclops CRZ 63';
    }
}
exports.DusclopsCRZ = DusclopsCRZ;
class GravelerCRZ extends graveler_1.Graveler {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '68';
        this.fullName = 'Graveler CRZ 68';
    }
}
exports.GravelerCRZ = GravelerCRZ;
class BaltoyCRZ extends baltoy_1.Baltoy {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '70';
        this.fullName = 'Baltoy CRZ 70';
    }
}
exports.BaltoyCRZ = BaltoyCRZ;
class KoffingCRZ extends koffing_1.Koffing {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '75';
        this.fullName = 'Koffing CRZ 75';
    }
}
exports.KoffingCRZ = KoffingCRZ;
class KrokorokCRZ extends krokorok_1.Krokorok {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '79';
        this.fullName = 'Krokorok CRZ 79';
    }
}
exports.KrokorokCRZ = KrokorokCRZ;
class MetangCRZ extends metang_1.Metang {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '90';
        this.fullName = 'Metang CRZ 90';
    }
}
exports.MetangCRZ = MetangCRZ;
class PawniardCRZ extends pawniard_1.Pawniard {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '91';
        this.fullName = 'Pawniard CRZ 91';
    }
}
exports.PawniardCRZ = PawniardCRZ;
class SnorlaxCRZ extends snorlax_1.Snorlax {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '109';
        this.fullName = 'Snorlax CRZ 109';
    }
}
exports.SnorlaxCRZ = SnorlaxCRZ;
class StarlyCRZ extends starly_1.Starly {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '110';
        this.fullName = 'Starly CRZ 110';
    }
}
exports.StarlyCRZ = StarlyCRZ;
class BeaCRZ extends bea_1.Bea {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '123';
        this.fullName = 'Bea CRZ 123';
    }
}
exports.BeaCRZ = BeaCRZ;
class FriendsInHisui2 extends friends_in_hisui_1.FriendsInHisui {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '148';
        this.fullName = 'Friends in Hisui CRZ 148';
    }
}
exports.FriendsInHisui2 = FriendsInHisui2;
class FriendsInSinnoh2 extends friends_in_sinnoh_1.FriendsInSinnoh {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '149';
        this.fullName = 'Friends in Sinnoh CRZ 149';
    }
}
exports.FriendsInSinnoh2 = FriendsInSinnoh2;
