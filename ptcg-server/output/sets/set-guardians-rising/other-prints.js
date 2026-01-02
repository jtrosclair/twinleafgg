"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetagrossGX4GRI = exports.EnhancedHammer2GRI = exports.ChoiceBand2GRI = exports.SylveonGX2GRI = exports.TapuLeleGX2GRI = exports.Garbodor2GRI = exports.AlolanVulpix2GRI = exports.FightingEnergyGRI = exports.LightningEnergyGRI = exports.GrassEnergyGRI = exports.RareCandyGRI = exports.EnhancedHammer3GRI = exports.AquaPatch2GRI = exports.DrampaGX3GRI = exports.SylveonGX4GRI = exports.MetagrossGX3GRI = exports.LycanrocGX3GRI = exports.TapuLeleGX4GRI = exports.TapuKokoGX3GRI = exports.AlolanNinetalesGX3GRI = exports.DecidueyeGXGRI = exports.Mallow2GRI = exports.HauGRI = exports.DrampaGX2GRI = exports.SylveonGX3GRI = exports.MetagrossGX2GRI = exports.LycanrocGX2GRI = exports.TapuLeleGX3GRI = exports.TapuKokoGX2GRI = exports.AlolanNinetalesGX2GRI = exports.EnergyRecyclerGRI = exports.RescueStretcherGRI = exports.MaxPotionGRI3 = exports.MaxPotionGRI2 = exports.MaxPotionGRI = exports.FieldBlowerGRI2 = exports.FieldBlowerGRI = exports.EnhancedHammerGRI = exports.EnergyLotoGRI = exports.DoubleColorlessEnergyGRISR = exports.AlolanVulpixGRI = void 0;
const energy_recycler_1 = require("../set-battle-styles/energy-recycler");
const alolan_ninetales_gx_1 = require("../set-guardians-rising/alolan-ninetales-gx");
const tapu_koko_gx_1 = require("../set-guardians-rising/tapu-koko-gx");
const tapu_lele_gx_1 = require("../set-guardians-rising/tapu-lele-gx");
const lycanroc_gx_1 = require("../set-guardians-rising/lycanroc-gx");
const metagross_gx_1 = require("../set-guardians-rising/metagross-gx");
const sylveon_gx_1 = require("../set-guardians-rising/sylveon-gx");
const drampa_gx_1 = require("../set-guardians-rising/drampa-gx");
const hau_1 = require("../set-celestial-storm/hau");
const mallow_1 = require("../set-guardians-rising/mallow");
const decidueye_gx_1 = require("../set-sun-and-moon/decidueye-gx");
const aqua_patch_1 = require("../set-guardians-rising/aqua-patch");
const enhanced_hammer_1 = require("../set-twilight-masquerade/enhanced-hammer");
const rare_candy_1 = require("../set-ex-holon-phantoms/rare-candy");
const grass_energy_1 = require("../set-base-set-energy/grass-energy");
const lightning_energy_1 = require("../set-base-set-energy/lightning-energy");
const fighting_energy_1 = require("../set-base-set-energy/fighting-energy");
const alolan_vulpix_1 = require("../set-hidden-fates/alolan-vulpix");
const garbodor_1 = require("../set-guardians-rising/garbodor");
const choice_band_1 = require("../set-guardians-rising/choice-band");
const alolan_vulpix_2 = require("../set-hidden-fates/alolan-vulpix");
const double_colorless_energy_1 = require("../set-base-set/double-colorless-energy");
const enhanced_hammer_2 = require("../set-twilight-masquerade/enhanced-hammer");
const field_blower_1 = require("./field-blower");
const max_potion_1 = require("../set-emerging-powers/max-potion");
const rescue_stretcher_1 = require("./rescue-stretcher");
const energy_loto_1 = require("../set-astral-radiance/energy-loto");
class AlolanVulpixGRI extends alolan_vulpix_2.AlolanVulpix {
    constructor() {
        super(...arguments);
        this.fullName = 'Alolan Vulpix GRI';
        this.setNumber = '21';
        this.set = 'GRI';
    }
}
exports.AlolanVulpixGRI = AlolanVulpixGRI;
class DoubleColorlessEnergyGRISR extends double_colorless_energy_1.DoubleColorlessEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '166';
        this.fullName = 'Double Colorless Energy GRI SR';
        this.set = 'GRI';
        this.text = 'Double Colorless Energy provides [C][C] Energy.';
    }
}
exports.DoubleColorlessEnergyGRISR = DoubleColorlessEnergyGRISR;
class EnergyLotoGRI extends energy_loto_1.EnergyLoto {
    constructor() {
        super(...arguments);
        this.fullName = 'Energy Loto GRI';
        this.setNumber = '122';
        this.set = 'GRI';
    }
}
exports.EnergyLotoGRI = EnergyLotoGRI;
class EnhancedHammerGRI extends enhanced_hammer_2.EnhancedHammer {
    constructor() {
        super(...arguments);
        this.fullName = 'Enhanced Hammer GRI';
        this.setNumber = '124';
        this.set = 'GRI';
    }
}
exports.EnhancedHammerGRI = EnhancedHammerGRI;
class FieldBlowerGRI extends field_blower_1.FieldBlower {
    constructor() {
        super(...arguments);
        this.fullName = 'Field Blower GRI 125a';
        this.setNumber = '125a';
        this.set = 'GRI';
    }
}
exports.FieldBlowerGRI = FieldBlowerGRI;
class FieldBlowerGRI2 extends field_blower_1.FieldBlower {
    constructor() {
        super(...arguments);
        this.fullName = 'Field Blower GRI 163';
        this.setNumber = '163';
        this.set = 'GRI';
    }
}
exports.FieldBlowerGRI2 = FieldBlowerGRI2;
class MaxPotionGRI extends max_potion_1.MaxPotion {
    constructor() {
        super(...arguments);
        this.fullName = 'Max Potion GRI';
        this.setNumber = '128';
        this.set = 'GRI';
        this.text = 'Heal all damage from 1 of your Pokémon. If you do, discard all Energy from that Pokémon.';
    }
}
exports.MaxPotionGRI = MaxPotionGRI;
class MaxPotionGRI2 extends max_potion_1.MaxPotion {
    constructor() {
        super(...arguments);
        this.fullName = 'Max Potion GRI 128a';
        this.setNumber = '128a';
        this.set = 'GRI';
        this.text = 'Heal all damage from 1 of your Pokémon. If you do, discard all Energy from that Pokémon.';
    }
}
exports.MaxPotionGRI2 = MaxPotionGRI2;
class MaxPotionGRI3 extends max_potion_1.MaxPotion {
    constructor() {
        super(...arguments);
        this.fullName = 'Max Potion GRI 164';
        this.setNumber = '164';
        this.set = 'GRI';
        this.text = 'Heal all damage from 1 of your Pokémon. If you do, discard all Energy from that Pokémon.';
    }
}
exports.MaxPotionGRI3 = MaxPotionGRI3;
class RescueStretcherGRI extends rescue_stretcher_1.RescueStretcher {
    constructor() {
        super(...arguments);
        this.fullName = 'Rescue Stretcher GRI 130a';
        this.setNumber = '130a';
        this.set = 'GRI';
    }
}
exports.RescueStretcherGRI = RescueStretcherGRI;
class EnergyRecyclerGRI extends energy_recycler_1.EnergyRecycler {
    constructor() {
        super(...arguments);
        this.setNumber = '123';
        this.fullName = 'Energy Recycler GRI';
        this.set = 'GRI';
    }
}
exports.EnergyRecyclerGRI = EnergyRecyclerGRI;
class AlolanNinetalesGX2GRI extends alolan_ninetales_gx_1.AlolanNinetalesGX {
    constructor() {
        super(...arguments);
        this.setNumber = '132';
        this.fullName = 'Alolan Ninetales-GX2 GRI';
        this.set = 'GRI';
    }
}
exports.AlolanNinetalesGX2GRI = AlolanNinetalesGX2GRI;
class TapuKokoGX2GRI extends tapu_koko_gx_1.TapuKokoGX {
    constructor() {
        super(...arguments);
        this.setNumber = '135';
        this.fullName = 'Tapu Koko-GX2 GRI';
        this.set = 'GRI';
    }
}
exports.TapuKokoGX2GRI = TapuKokoGX2GRI;
class TapuLeleGX3GRI extends tapu_lele_gx_1.TapuLeleGX {
    constructor() {
        super(...arguments);
        this.setNumber = '137';
        this.fullName = 'Tapu Lele-GX3 GRI';
        this.set = 'GRI';
    }
}
exports.TapuLeleGX3GRI = TapuLeleGX3GRI;
class LycanrocGX2GRI extends lycanroc_gx_1.LycanrocGX {
    constructor() {
        super(...arguments);
        this.setNumber = '138';
        this.fullName = 'Lycanroc-GX2 GRI';
        this.set = 'GRI';
    }
}
exports.LycanrocGX2GRI = LycanrocGX2GRI;
class MetagrossGX2GRI extends metagross_gx_1.MetagrossGX {
    constructor() {
        super(...arguments);
        this.setNumber = '139';
        this.fullName = 'Metagross-GX2 GRI';
        this.set = 'GRI';
    }
}
exports.MetagrossGX2GRI = MetagrossGX2GRI;
class SylveonGX3GRI extends sylveon_gx_1.SylveonGX {
    constructor() {
        super(...arguments);
        this.setNumber = '140';
        this.fullName = 'Sylveon-GX3 GRI';
        this.set = 'GRI';
    }
}
exports.SylveonGX3GRI = SylveonGX3GRI;
class DrampaGX2GRI extends drampa_gx_1.DrampaGX {
    constructor() {
        super(...arguments);
        this.setNumber = '142';
        this.fullName = 'Drampa-GX2 GRI';
        this.set = 'GRI';
    }
}
exports.DrampaGX2GRI = DrampaGX2GRI;
class HauGRI extends hau_1.Hau {
    constructor() {
        super(...arguments);
        this.setNumber = '144';
        this.fullName = 'Hau GRI';
        this.set = 'GRI';
    }
}
exports.HauGRI = HauGRI;
class Mallow2GRI extends mallow_1.Mallow {
    constructor() {
        super(...arguments);
        this.setNumber = '145';
        this.fullName = 'Mallow2 GRI';
        this.set = 'GRI';
    }
}
exports.Mallow2GRI = Mallow2GRI;
class DecidueyeGXGRI extends decidueye_gx_1.DecidueyeGX {
    constructor() {
        super(...arguments);
        this.setNumber = '146';
        this.fullName = 'Decidueye-GX GRI';
        this.set = 'GRI';
    }
}
exports.DecidueyeGXGRI = DecidueyeGXGRI;
class AlolanNinetalesGX3GRI extends alolan_ninetales_gx_1.AlolanNinetalesGX {
    constructor() {
        super(...arguments);
        this.setNumber = '150';
        this.fullName = 'Alolan Ninetales-GX3 GRI';
        this.set = 'GRI';
    }
}
exports.AlolanNinetalesGX3GRI = AlolanNinetalesGX3GRI;
class TapuKokoGX3GRI extends tapu_koko_gx_1.TapuKokoGX {
    constructor() {
        super(...arguments);
        this.setNumber = '153';
        this.fullName = 'Tapu Koko-GX3 GRI';
        this.set = 'GRI';
    }
}
exports.TapuKokoGX3GRI = TapuKokoGX3GRI;
class TapuLeleGX4GRI extends tapu_lele_gx_1.TapuLeleGX {
    constructor() {
        super(...arguments);
        this.setNumber = '155';
        this.fullName = 'Tapu Lele-GX4 GRI';
        this.set = 'GRI';
    }
}
exports.TapuLeleGX4GRI = TapuLeleGX4GRI;
class LycanrocGX3GRI extends lycanroc_gx_1.LycanrocGX {
    constructor() {
        super(...arguments);
        this.setNumber = '156';
        this.fullName = 'Lycanroc-GX3 GRI';
        this.set = 'GRI';
    }
}
exports.LycanrocGX3GRI = LycanrocGX3GRI;
class MetagrossGX3GRI extends metagross_gx_1.MetagrossGX {
    constructor() {
        super(...arguments);
        this.setNumber = '157';
        this.fullName = 'Metagross-GX3 GRI';
        this.set = 'GRI';
    }
}
exports.MetagrossGX3GRI = MetagrossGX3GRI;
class SylveonGX4GRI extends sylveon_gx_1.SylveonGX {
    constructor() {
        super(...arguments);
        this.setNumber = '158';
        this.fullName = 'Sylveon-GX4 GRI';
        this.set = 'GRI';
    }
}
exports.SylveonGX4GRI = SylveonGX4GRI;
class DrampaGX3GRI extends drampa_gx_1.DrampaGX {
    constructor() {
        super(...arguments);
        this.setNumber = '160';
        this.fullName = 'Drampa-GX3 GRI';
        this.set = 'GRI';
    }
}
exports.DrampaGX3GRI = DrampaGX3GRI;
class AquaPatch2GRI extends aqua_patch_1.AquaPatch {
    constructor() {
        super(...arguments);
        this.setNumber = '161';
        this.fullName = 'Aqua Patch2 GRI';
        this.set = 'GRI';
    }
}
exports.AquaPatch2GRI = AquaPatch2GRI;
class EnhancedHammer3GRI extends enhanced_hammer_1.EnhancedHammer {
    constructor() {
        super(...arguments);
        this.setNumber = '162';
        this.fullName = 'Enhanced Hammer3 GRI';
        this.set = 'GRI';
    }
}
exports.EnhancedHammer3GRI = EnhancedHammer3GRI;
class RareCandyGRI extends rare_candy_1.RareCandy {
    constructor() {
        super(...arguments);
        this.setNumber = '165';
        this.fullName = 'Rare Candy GRI';
        this.set = 'GRI';
    }
}
exports.RareCandyGRI = RareCandyGRI;
class GrassEnergyGRI extends grass_energy_1.GrassEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '167';
        this.fullName = 'Grass Energy GRI';
        this.set = 'GRI';
    }
}
exports.GrassEnergyGRI = GrassEnergyGRI;
class LightningEnergyGRI extends lightning_energy_1.LightningEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '168';
        this.fullName = 'Lightning Energy GRI';
        this.set = 'GRI';
    }
}
exports.LightningEnergyGRI = LightningEnergyGRI;
class FightingEnergyGRI extends fighting_energy_1.FightingEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '169';
        this.fullName = 'Fighting Energy GRI';
        this.set = 'GRI';
    }
}
exports.FightingEnergyGRI = FightingEnergyGRI;
class AlolanVulpix2GRI extends alolan_vulpix_1.AlolanVulpix {
    constructor() {
        super(...arguments);
        this.setNumber = '21a';
        this.fullName = 'Alolan Vulpix2 GRI';
        this.set = 'GRI';
    }
}
exports.AlolanVulpix2GRI = AlolanVulpix2GRI;
class Garbodor2GRI extends garbodor_1.Garbodor {
    constructor() {
        super(...arguments);
        this.setNumber = '51a';
        this.fullName = 'Garbodor2 GRI';
        this.set = 'GRI';
    }
}
exports.Garbodor2GRI = Garbodor2GRI;
class TapuLeleGX2GRI extends tapu_lele_gx_1.TapuLeleGX {
    constructor() {
        super(...arguments);
        this.setNumber = '60a';
        this.fullName = 'Tapu Lele-GX2 GRI';
        this.set = 'GRI';
    }
}
exports.TapuLeleGX2GRI = TapuLeleGX2GRI;
class SylveonGX2GRI extends sylveon_gx_1.SylveonGX {
    constructor() {
        super(...arguments);
        this.setNumber = '92a';
        this.fullName = 'Sylveon-GX2 GRI';
        this.set = 'GRI';
    }
}
exports.SylveonGX2GRI = SylveonGX2GRI;
class ChoiceBand2GRI extends choice_band_1.ChoiceBand {
    constructor() {
        super(...arguments);
        this.setNumber = '121a';
        this.fullName = 'Choice Band2 GRI';
        this.set = 'GRI';
    }
}
exports.ChoiceBand2GRI = ChoiceBand2GRI;
class EnhancedHammer2GRI extends enhanced_hammer_1.EnhancedHammer {
    constructor() {
        super(...arguments);
        this.setNumber = '124a';
        this.fullName = 'Enhanced Hammer2 GRI';
        this.set = 'GRI';
    }
}
exports.EnhancedHammer2GRI = EnhancedHammer2GRI;
class MetagrossGX4GRI extends metagross_gx_1.MetagrossGX {
    constructor() {
        super(...arguments);
        this.setNumber = '157a';
        this.fullName = 'Metagross-GX4 GRI';
        this.set = 'GRI';
    }
}
exports.MetagrossGX4GRI = MetagrossGX4GRI;
