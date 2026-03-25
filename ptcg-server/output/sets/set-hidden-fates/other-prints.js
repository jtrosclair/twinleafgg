"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilvallyGXHIF = exports.NoivernGXHIF = exports.SylveonGXHIF = exports.GardevoirGXHIF = exports.KartanaGXHIF = exports.GuzzlordGXHIF = exports.DarkraiGXHIF = exports.BuzzwoleGXHIF = exports.LycanrocGXHIF = exports.LucarioGXHIF = exports.NaganadelGXHIF = exports.BanetteGXHIF = exports.EspeonGXHIF = exports.MewtwoGX2HIF = exports.ElectrodeGXHIF = exports.GreninjaGXHIF = exports.GlaceonGXHIF = exports.ArticunoGXHIF = exports.AlolanNinetalesGXHIF = exports.DecidueyeGXHIF = exports.OranguruHIF = exports.NoibatHIF = exports.Eevee3HIF = exports.GarchompHIF = exports.GabiteHIF = exports.GibleHIF = exports.DiancieHIF = exports.RaltsHIF = exports.MagnezoneHIF = exports.ZoruaHIF = exports.BuzzwoleHIF = exports.RockruffHIF = exports.LucarioHIF = exports.RioluHIF = exports.SudowoodoHIF = exports.PoipoleHIF = exports.MalamarHIF = exports.InkayHIF = exports.ShuppetHIF = exports.FrogadierHIF = exports.FroakieFrubblesHIF = exports.DartrixHIF = exports.RowletHIF = exports.MoltresZapdosArticunoGX3HIF = exports.MoltresZapdosArticunoGX2HIF = exports.LtSurgesStrategyHIF = exports.BillsAnalysisHIF = exports.SlowpokeHIF = exports.GuzmaHIF = exports.BrocksGritHIF = void 0;
exports.JessieAndJames2 = exports.GiovannisExile2 = exports.SabrinasSuggestionHIF = exports.PokemonCenterLadyHIF = exports.MistysDeterminationHIF = exports.KogasTrapHIF = exports.GiovannisExileHIF = exports.BlainesLastStandHIF = exports.PikachuHIF = exports.StaryuHIF = exports.CharmeleonHIF = exports.HikerHIF = exports.AetherFoundationEmployeeHIF = exports.UmbreonGxHIF = exports.ZygardeGxHIF = exports.TurtonatorGxHIF = exports.GolisopodGxHIF = exports.TypeNullHIF = exports.SwabluHIF = exports.KartanaHIF = exports.CelesteelaHIF = exports.MetangHIF = exports.BeldumHIF = exports.MagnetonHIF = exports.MagnemiteHIF = exports.GuzzlordHIF = exports.XurkitreeHIF = exports.PheromosaHIF = exports.ScytherHIF = exports.CharizardGXHIF = exports.TapuLeleGXHIF = exports.TapuKokoGXHIF = exports.TapuFiniGXHIF = exports.TapuBuluGXHIF = exports.ShrineOfPunishmentHIF = exports.MtCoronetHIF = exports.BrookletHillHIF = exports.AetherParadiseConvserationAreaHIF = exports.LadyFLIHIF = exports.FishermanHSHIF = exports.CynthiaHIF = exports.DrampaGXHIF = void 0;
const slowpoke_1 = require("../set-lost-thunder/slowpoke");
const bills_analysis_1 = require("../set-team-up/bills-analysis");
const lt_surges_strategy_1 = require("../set-unbroken-bonds/lt-surges-strategy");
const moltres_zapdos_articuno_gx_1 = require("../set-hidden-fates/moltres-zapdos-articuno-gx");
const rowlet_1 = require("../set-sun-and-moon/rowlet");
const dartrix_1 = require("../set-sun-and-moon/dartrix");
const froakie_2_1 = require("../set-forbidden-light/froakie-2");
const frogadier_1 = require("../set-forbidden-light/frogadier");
const shuppet_1 = require("../set-celestial-storm/shuppet");
const inkay_1 = require("../set-forbidden-light/inkay");
const malamar_1 = require("../set-forbidden-light/malamar");
const poipole_1 = require("../set-forbidden-light/poipole");
const sudowoodo_1 = require("../set-guardians-rising/sudowoodo");
const riolu_1 = require("../set-ultra-prism/riolu");
const lucario_1 = require("../set-ultra-prism/lucario");
const rockruff_1 = require("../set-forbidden-light/rockruff");
const buzzwole_1 = require("../set-forbidden-light/buzzwole");
const zorua_1 = require("../set-shining-legends/zorua");
const magnezone_1 = require("../set-ultra-prism/magnezone");
const ralts_1 = require("../set-burning-shadows/ralts");
const diancie_1 = require("../set-burning-shadows/diancie");
const gible_1 = require("../set-ultra-prism/gible");
const gabite_1 = require("../set-ultra-prism/gabite");
const garchomp_1 = require("../set-ultra-prism/garchomp");
const eevee_1 = require("../set-sun-and-moon/eevee");
const noibat_1 = require("../set-burning-shadows/noibat");
const oranguru_1 = require("../set-sun-and-moon/oranguru");
const decidueye_gx_1 = require("../set-sun-and-moon/decidueye-gx");
const alolan_ninetales_gx_1 = require("../set-guardians-rising/alolan-ninetales-gx");
const articuno_gx_1 = require("../set-celestial-storm/articuno-gx");
const glaceon_gx_1 = require("../set-ultra-prism/glaceon-gx");
const greninja_gx_1 = require("../set-forbidden-light/greninja-gx");
const electrode_gx_1 = require("../set-celestial-storm/electrode-gx");
const mewtwo_gx_1 = require("../set-shining-legends/mewtwo-gx");
const espeon_gx_1 = require("../set-sun-and-moon/espeon-gx");
const banette_gx_1 = require("../set-celestial-storm/banette-gx");
const naganadel_gx_1 = require("../set-forbidden-light/naganadel-gx");
const lucario_gx_1 = require("../set-sun-and-moon-promos/lucario-gx");
const lycanroc_gx_1 = require("../set-guardians-rising/lycanroc-gx");
const buzzwole_gx_1 = require("../set-crimson-invasion/buzzwole-gx");
const darkrai_gx_1 = require("../set-burning-shadows/darkrai-gx");
const guzzlord_gx_1 = require("../set-crimson-invasion/guzzlord-gx");
const kartana_gx_1 = require("../set-crimson-invasion/kartana-gx");
const gardevoir_gx_1 = require("../set-burning-shadows/gardevoir-gx");
const sylveon_gx_1 = require("../set-guardians-rising/sylveon-gx");
const noivern_gx_1 = require("../set-burning-shadows/noivern-gx");
const silvally_gx_1 = require("../set-ultra-prism/silvally-gx");
const drampa_gx_1 = require("../set-guardians-rising/drampa-gx");
const cynthia_1 = require("../set-ultra-prism/cynthia");
const other_prints_1 = require("../set-heartgold-and-soulsilver/other-prints");
const other_prints_2 = require("../set-forbidden-light/other-prints");
const aether_paradise_conservation_area_1 = require("../set-guardians-rising/aether-paradise-conservation-area");
const brooklet_hill_1 = require("../set-guardians-rising/brooklet-hill");
const mt_coronet_1 = require("../set-ultra-prism/mt-coronet");
const shrine_of_punishment_1 = require("../set-celestial-storm/shrine-of-punishment");
const tapu_bulu_gx_1 = require("../set-burning-shadows/tapu-bulu-gx");
const tapu_fini_gx_1 = require("../set-burning-shadows/tapu-fini-gx");
const tapu_koko_gx_1 = require("../set-guardians-rising/tapu-koko-gx");
const tapu_lele_gx_1 = require("../set-guardians-rising/tapu-lele-gx");
const brocks_grit_1 = require("../set-evolutions/brocks-grit");
const guzma_1 = require("../set-burning-shadows/guzma");
const charizard_gx_1 = require("../set-burning-shadows/charizard-gx");
const scyther_1 = require("../set-celestial-storm/scyther");
const pheromosa_1 = require("../set-forbidden-light/pheromosa");
const xurkitree_1 = require("../set-forbidden-light/xurkitree");
const guzzlord_1 = require("../set-forbidden-light/guzzlord");
const magnemite_1 = require("../set-forbidden-light/magnemite");
const magneton_1 = require("../set-ultra-prism/magneton");
const beldum_1 = require("../set-guardians-rising/beldum");
const metang_1 = require("../set-guardians-rising/metang");
const celesteela_1 = require("../set-celestial-storm/celesteela");
const kartana_1 = require("../set-celestial-storm/kartana");
const swablu_1 = require("../set-dragons-majesty/swablu");
const type_null_1 = require("../set-crimson-invasion/type-null");
const golisopod_gx_1 = require("../set-burning-shadows/golisopod-gx");
const turtonator_gx_1 = require("../set-guardians-rising/turtonator-gx");
const zygarde_gx_1 = require("../set-forbidden-light/zygarde-gx");
const umbreon_gx_1 = require("../set-sun-and-moon/umbreon-gx");
const aether_foundation_employee_1 = require("../set-lost-thunder/aether-foundation-employee");
const hiker_1 = require("../set-celestial-storm/hiker");
const charmeleon_1 = require("../set-base-set/charmeleon");
const staryu_1 = require("../set-team-up/staryu");
const pikachu_1 = require("../set-black-and-white-promos/pikachu");
const blaines_last_stand_1 = require("../set-dragons-majesty/blaines-last-stand");
const giovannis_exile_1 = require("../set-unbroken-bonds/giovannis-exile");
const kogas_trap_1 = require("../set-unbroken-bonds/kogas-trap");
const mistys_determination_1 = require("../set-evolutions/mistys-determination");
const pokemon_center_lady_1 = require("../set-flashfire/pokemon-center-lady");
const sabrinas_suggestion_1 = require("../set-team-up/sabrinas-suggestion");
const jessie_and_james_1 = require("./jessie-and-james");
class BrocksGritHIF extends brocks_grit_1.BrocksGrit {
    constructor() {
        super(...arguments);
        this.fullName = 'Brock\'s Grit HIF';
        this.set = 'HIF';
        this.setNumber = '53';
    }
}
exports.BrocksGritHIF = BrocksGritHIF;
class GuzmaHIF extends guzma_1.Guzma {
    constructor() {
        super(...arguments);
        this.fullName = 'Guzma HIF';
        this.set = 'HIF';
        this.setNumber = 'SV84';
    }
}
exports.GuzmaHIF = GuzmaHIF;
class SlowpokeHIF extends slowpoke_1.Slowpoke {
    constructor() {
        super(...arguments);
        this.setNumber = '12';
        this.fullName = 'Slowpoke HIF';
        this.set = 'HIF';
    }
}
exports.SlowpokeHIF = SlowpokeHIF;
class BillsAnalysisHIF extends bills_analysis_1.BillsAnalysis {
    constructor() {
        super(...arguments);
        this.setNumber = '51';
        this.fullName = 'Bill\'s Analysis HIF';
        this.set = 'HIF';
    }
}
exports.BillsAnalysisHIF = BillsAnalysisHIF;
class LtSurgesStrategyHIF extends lt_surges_strategy_1.LtSurgesStrategy {
    constructor() {
        super(...arguments);
        this.setNumber = '60';
        this.fullName = 'Lt. Surge\'s Strategy HIF';
        this.set = 'HIF';
    }
}
exports.LtSurgesStrategyHIF = LtSurgesStrategyHIF;
class MoltresZapdosArticunoGX2HIF extends moltres_zapdos_articuno_gx_1.MoltresZapdosArticunoGX {
    constructor() {
        super(...arguments);
        this.setNumber = '66';
        this.fullName = 'Moltres & Zapdos & Articuno-GX2 HIF';
        this.set = 'HIF';
    }
}
exports.MoltresZapdosArticunoGX2HIF = MoltresZapdosArticunoGX2HIF;
class MoltresZapdosArticunoGX3HIF extends moltres_zapdos_articuno_gx_1.MoltresZapdosArticunoGX {
    constructor() {
        super(...arguments);
        this.setNumber = '69';
        this.fullName = 'Moltres & Zapdos & Articuno-GX3 HIF';
        this.set = 'HIF';
    }
}
exports.MoltresZapdosArticunoGX3HIF = MoltresZapdosArticunoGX3HIF;
class RowletHIF extends rowlet_1.Rowlet {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV2';
        this.fullName = 'Rowlet HIF';
        this.set = 'HIF';
    }
}
exports.RowletHIF = RowletHIF;
class DartrixHIF extends dartrix_1.Dartrix {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV3';
        this.fullName = 'Dartrix HIF';
        this.set = 'HIF';
    }
}
exports.DartrixHIF = DartrixHIF;
class FroakieFrubblesHIF extends froakie_2_1.FroakieFrubbles {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV11';
        this.fullName = 'Froakie HIF';
        this.set = 'HIF';
    }
}
exports.FroakieFrubblesHIF = FroakieFrubblesHIF;
class FrogadierHIF extends frogadier_1.Frogadier {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV12';
        this.fullName = 'Frogadier HIF';
        this.set = 'HIF';
    }
}
exports.FrogadierHIF = FrogadierHIF;
class ShuppetHIF extends shuppet_1.Shuppet {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV16';
        this.fullName = 'Shuppet HIF';
        this.set = 'HIF';
    }
}
exports.ShuppetHIF = ShuppetHIF;
class InkayHIF extends inkay_1.Inkay {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV17';
        this.fullName = 'Inkay HIF';
        this.set = 'HIF';
    }
}
exports.InkayHIF = InkayHIF;
class MalamarHIF extends malamar_1.Malamar {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV18';
        this.fullName = 'Malamar HIF';
        this.set = 'HIF';
    }
}
exports.MalamarHIF = MalamarHIF;
class PoipoleHIF extends poipole_1.Poipole {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV19';
        this.fullName = 'Poipole HIF';
        this.set = 'HIF';
    }
}
exports.PoipoleHIF = PoipoleHIF;
class SudowoodoHIF extends sudowoodo_1.Sudowoodo {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV20';
        this.fullName = 'Sudowoodo HIF';
        this.set = 'HIF';
    }
}
exports.SudowoodoHIF = SudowoodoHIF;
class RioluHIF extends riolu_1.Riolu {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV21';
        this.fullName = 'Riolu HIF';
        this.set = 'HIF';
    }
}
exports.RioluHIF = RioluHIF;
class LucarioHIF extends lucario_1.Lucario {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV22';
        this.fullName = 'Lucario HIF';
        this.set = 'HIF';
    }
}
exports.LucarioHIF = LucarioHIF;
class RockruffHIF extends rockruff_1.Rockruff {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV23';
        this.fullName = 'Rockruff HIF';
        this.set = 'HIF';
    }
}
exports.RockruffHIF = RockruffHIF;
class BuzzwoleHIF extends buzzwole_1.Buzzwole {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV24';
        this.fullName = 'Buzzwole HIF';
        this.set = 'HIF';
    }
}
exports.BuzzwoleHIF = BuzzwoleHIF;
class ZoruaHIF extends zorua_1.Zorua {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV25';
        this.fullName = 'Zorua HIF';
        this.set = 'HIF';
    }
}
exports.ZoruaHIF = ZoruaHIF;
class MagnezoneHIF extends magnezone_1.Magnezone {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV29';
        this.fullName = 'Magnezone HIF';
        this.set = 'HIF';
    }
}
exports.MagnezoneHIF = MagnezoneHIF;
class RaltsHIF extends ralts_1.Ralts {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV34';
        this.fullName = 'Ralts HIF';
        this.set = 'HIF';
    }
}
exports.RaltsHIF = RaltsHIF;
class DiancieHIF extends diancie_1.Diancie {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV36';
        this.fullName = 'Diancie HIF';
        this.set = 'HIF';
    }
}
exports.DiancieHIF = DiancieHIF;
class GibleHIF extends gible_1.Gible {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV38';
        this.fullName = 'Gible HIF';
        this.set = 'HIF';
    }
}
exports.GibleHIF = GibleHIF;
class GabiteHIF extends gabite_1.Gabite {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV39';
        this.fullName = 'Gabite HIF';
        this.set = 'HIF';
    }
}
exports.GabiteHIF = GabiteHIF;
class GarchompHIF extends garchomp_1.Garchomp {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV40';
        this.fullName = 'Garchomp HIF';
        this.set = 'HIF';
    }
}
exports.GarchompHIF = GarchompHIF;
class Eevee3HIF extends eevee_1.Eevee {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV41';
        this.fullName = 'Eevee3 HIF';
        this.set = 'HIF';
    }
}
exports.Eevee3HIF = Eevee3HIF;
class NoibatHIF extends noibat_1.Noibat {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV43';
        this.fullName = 'Noibat HIF';
        this.set = 'HIF';
    }
}
exports.NoibatHIF = NoibatHIF;
class OranguruHIF extends oranguru_1.Oranguru {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV44';
        this.fullName = 'Oranguru HIF';
        this.set = 'HIF';
    }
}
exports.OranguruHIF = OranguruHIF;
class DecidueyeGXHIF extends decidueye_gx_1.DecidueyeGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV47';
        this.fullName = 'Decidueye-GX HIF';
        this.set = 'HIF';
    }
}
exports.DecidueyeGXHIF = DecidueyeGXHIF;
class AlolanNinetalesGXHIF extends alolan_ninetales_gx_1.AlolanNinetalesGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV53';
        this.fullName = 'Alolan Ninetales-GX HIF';
        this.set = 'HIF';
    }
}
exports.AlolanNinetalesGXHIF = AlolanNinetalesGXHIF;
class ArticunoGXHIF extends articuno_gx_1.ArticunoGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV54';
        this.fullName = 'Articuno-GX HIF';
        this.set = 'HIF';
    }
}
exports.ArticunoGXHIF = ArticunoGXHIF;
class GlaceonGXHIF extends glaceon_gx_1.GlaceonGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV55';
        this.fullName = 'Glaceon-GX HIF';
        this.set = 'HIF';
    }
}
exports.GlaceonGXHIF = GlaceonGXHIF;
class GreninjaGXHIF extends greninja_gx_1.GreninjaGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV56';
        this.fullName = 'Greninja-GX HIF';
        this.set = 'HIF';
    }
}
exports.GreninjaGXHIF = GreninjaGXHIF;
class ElectrodeGXHIF extends electrode_gx_1.ElectrodeGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV57';
        this.fullName = 'Electrode-GX HIF';
        this.set = 'HIF';
    }
}
exports.ElectrodeGXHIF = ElectrodeGXHIF;
class MewtwoGX2HIF extends mewtwo_gx_1.MewtwoGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV59';
        this.fullName = 'Mewtwo-GX2 HIF';
        this.set = 'HIF';
    }
}
exports.MewtwoGX2HIF = MewtwoGX2HIF;
class EspeonGXHIF extends espeon_gx_1.EspeonGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV60';
        this.fullName = 'Espeon-GX HIF';
        this.set = 'HIF';
    }
}
exports.EspeonGXHIF = EspeonGXHIF;
class BanetteGXHIF extends banette_gx_1.BanetteGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV61';
        this.fullName = 'Banette-GX HIF';
        this.set = 'HIF';
    }
}
exports.BanetteGXHIF = BanetteGXHIF;
class NaganadelGXHIF extends naganadel_gx_1.NaganadelGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV63';
        this.fullName = 'Naganadel-GX HIF';
        this.set = 'HIF';
    }
}
exports.NaganadelGXHIF = NaganadelGXHIF;
class LucarioGXHIF extends lucario_gx_1.LucarioGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV64';
        this.fullName = 'Lucario-GX HIF';
        this.set = 'HIF';
    }
}
exports.LucarioGXHIF = LucarioGXHIF;
class LycanrocGXHIF extends lycanroc_gx_1.LycanrocGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV66';
        this.fullName = 'Lycanroc-GX HIF';
        this.set = 'HIF';
    }
}
exports.LycanrocGXHIF = LycanrocGXHIF;
class BuzzwoleGXHIF extends buzzwole_gx_1.BuzzwoleGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV68';
        this.fullName = 'Buzzwole-GX HIF';
        this.set = 'HIF';
    }
}
exports.BuzzwoleGXHIF = BuzzwoleGXHIF;
class DarkraiGXHIF extends darkrai_gx_1.DarkraiGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV70';
        this.fullName = 'Darkrai-GX HIF';
        this.set = 'HIF';
    }
}
exports.DarkraiGXHIF = DarkraiGXHIF;
class GuzzlordGXHIF extends guzzlord_gx_1.GuzzlordGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV71';
        this.fullName = 'Guzzlord-GX HIF';
        this.set = 'HIF';
    }
}
exports.GuzzlordGXHIF = GuzzlordGXHIF;
class KartanaGXHIF extends kartana_gx_1.KartanaGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV73';
        this.fullName = 'Kartana-GX HIF';
        this.set = 'HIF';
    }
}
exports.KartanaGXHIF = KartanaGXHIF;
class GardevoirGXHIF extends gardevoir_gx_1.GardevoirGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV75';
        this.fullName = 'Gardevoir-GX HIF';
        this.set = 'HIF';
    }
}
exports.GardevoirGXHIF = GardevoirGXHIF;
class SylveonGXHIF extends sylveon_gx_1.SylveonGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV76';
        this.fullName = 'Sylveon-GX HIF';
        this.set = 'HIF';
    }
}
exports.SylveonGXHIF = SylveonGXHIF;
class NoivernGXHIF extends noivern_gx_1.NoivernGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV78';
        this.fullName = 'Noivern-GX HIF';
        this.set = 'HIF';
    }
}
exports.NoivernGXHIF = NoivernGXHIF;
class SilvallyGXHIF extends silvally_gx_1.SilvallyGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV79';
        this.fullName = 'Silvally-GX HIF';
        this.set = 'HIF';
    }
}
exports.SilvallyGXHIF = SilvallyGXHIF;
class DrampaGXHIF extends drampa_gx_1.DrampaGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV80';
        this.fullName = 'Drampa-GX HIF';
        this.set = 'HIF';
    }
}
exports.DrampaGXHIF = DrampaGXHIF;
class CynthiaHIF extends cynthia_1.Cynthia {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV82';
        this.fullName = 'Cynthia HIF';
        this.set = 'HIF';
    }
}
exports.CynthiaHIF = CynthiaHIF;
class FishermanHSHIF extends other_prints_1.FishermanHS {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV83';
        this.fullName = 'Fisherman HIF';
        this.set = 'HIF';
    }
}
exports.FishermanHSHIF = FishermanHSHIF;
class LadyFLIHIF extends other_prints_2.LadyFLI {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV86';
        this.fullName = 'Lady HIF';
        this.set = 'HIF';
    }
}
exports.LadyFLIHIF = LadyFLIHIF;
class AetherParadiseConvserationAreaHIF extends aether_paradise_conservation_area_1.AetherParadiseConvserationArea {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV87';
        this.fullName = 'Aether Paradise Conservation Area HIF';
        this.set = 'HIF';
    }
}
exports.AetherParadiseConvserationAreaHIF = AetherParadiseConvserationAreaHIF;
class BrookletHillHIF extends brooklet_hill_1.BrookletHill {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV88';
        this.fullName = 'Brooklet Hill HIF';
        this.set = 'HIF';
    }
}
exports.BrookletHillHIF = BrookletHillHIF;
class MtCoronetHIF extends mt_coronet_1.MtCoronet {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV89';
        this.fullName = 'Mt. Coronet HIF';
        this.set = 'HIF';
    }
}
exports.MtCoronetHIF = MtCoronetHIF;
class ShrineOfPunishmentHIF extends shrine_of_punishment_1.ShrineOfPunishment {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV90';
        this.fullName = 'Shrine of Punishment HIF';
        this.set = 'HIF';
    }
}
exports.ShrineOfPunishmentHIF = ShrineOfPunishmentHIF;
class TapuBuluGXHIF extends tapu_bulu_gx_1.TapuBuluGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV91';
        this.fullName = 'Tapu Bulu-GX HIF';
        this.set = 'HIF';
    }
}
exports.TapuBuluGXHIF = TapuBuluGXHIF;
class TapuFiniGXHIF extends tapu_fini_gx_1.TapuFiniGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV92';
        this.fullName = 'Tapu Fini-GX HIF';
        this.set = 'HIF';
    }
}
exports.TapuFiniGXHIF = TapuFiniGXHIF;
class TapuKokoGXHIF extends tapu_koko_gx_1.TapuKokoGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV93';
        this.fullName = 'Tapu Koko-GX HIF';
        this.set = 'HIF';
    }
}
exports.TapuKokoGXHIF = TapuKokoGXHIF;
class TapuLeleGXHIF extends tapu_lele_gx_1.TapuLeleGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV94';
        this.fullName = 'Tapu Lele-GX HIF';
        this.set = 'HIF';
    }
}
exports.TapuLeleGXHIF = TapuLeleGXHIF;
class CharizardGXHIF extends charizard_gx_1.CharizardGX {
    constructor() {
        super(...arguments);
        this.setNumber = 'SV49';
        this.fullName = 'Charizard-GX HIF SV49';
        this.set = 'HIF';
    }
}
exports.CharizardGXHIF = CharizardGXHIF;
class ScytherHIF extends scyther_1.Scyther {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV1';
        this.fullName = 'Scyther HIF';
    }
}
exports.ScytherHIF = ScytherHIF;
class PheromosaHIF extends pheromosa_1.Pheromosa {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV5';
        this.fullName = 'Pheromosa HIF';
    }
}
exports.PheromosaHIF = PheromosaHIF;
class XurkitreeHIF extends xurkitree_1.Xurkitree {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV14';
        this.fullName = 'Xurkitree HIF';
    }
}
exports.XurkitreeHIF = XurkitreeHIF;
class GuzzlordHIF extends guzzlord_1.Guzzlord {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV26';
        this.fullName = 'Guzzlord HIF';
    }
}
exports.GuzzlordHIF = GuzzlordHIF;
class MagnemiteHIF extends magnemite_1.Magnemite {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV27';
        this.fullName = 'Magnemite HIF';
    }
}
exports.MagnemiteHIF = MagnemiteHIF;
class MagnetonHIF extends magneton_1.Magneton {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV28';
        this.fullName = 'Magneton HIF';
    }
}
exports.MagnetonHIF = MagnetonHIF;
class BeldumHIF extends beldum_1.Beldum {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV30';
        this.fullName = 'Beldum HIF';
    }
}
exports.BeldumHIF = BeldumHIF;
class MetangHIF extends metang_1.Metang {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV31';
        this.fullName = 'Metang HIF';
    }
}
exports.MetangHIF = MetangHIF;
class CelesteelaHIF extends celesteela_1.Celesteela {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV32';
        this.fullName = 'Celesteela HIF';
    }
}
exports.CelesteelaHIF = CelesteelaHIF;
class KartanaHIF extends kartana_1.Kartana {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV33';
        this.fullName = 'Kartana HIF';
    }
}
exports.KartanaHIF = KartanaHIF;
class SwabluHIF extends swablu_1.Swablu {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV42';
        this.fullName = 'Swablu HIF';
    }
}
exports.SwabluHIF = SwabluHIF;
class TypeNullHIF extends type_null_1.TypeNull {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV45';
        this.fullName = 'Type: Null HIF';
    }
}
exports.TypeNullHIF = TypeNullHIF;
class GolisopodGxHIF extends golisopod_gx_1.GolisopodGx {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV48';
        this.fullName = 'Golisopod-GX HIF';
    }
}
exports.GolisopodGxHIF = GolisopodGxHIF;
class TurtonatorGxHIF extends turtonator_gx_1.TurtonatorGx {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV52';
        this.fullName = 'Turtonator-GX HIF';
    }
}
exports.TurtonatorGxHIF = TurtonatorGxHIF;
class ZygardeGxHIF extends zygarde_gx_1.ZygardeGx {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV65';
        this.fullName = 'Zygarde-GX HIF';
    }
}
exports.ZygardeGxHIF = ZygardeGxHIF;
class UmbreonGxHIF extends umbreon_gx_1.UmbreonGx {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV69';
        this.fullName = 'Umbreon-GX HIF';
    }
}
exports.UmbreonGxHIF = UmbreonGxHIF;
class AetherFoundationEmployeeHIF extends aether_foundation_employee_1.AetherFoundationEmployee {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV81';
        this.fullName = 'Aether Foundation Employee HIF';
    }
}
exports.AetherFoundationEmployeeHIF = AetherFoundationEmployeeHIF;
class HikerHIF extends hiker_1.Hiker {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = 'SV85';
        this.fullName = 'Hiker HIF';
    }
}
exports.HikerHIF = HikerHIF;
class CharmeleonHIF extends charmeleon_1.Charmeleon {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = '8';
        this.fullName = 'Charmeleon HIF 8';
    }
}
exports.CharmeleonHIF = CharmeleonHIF;
class StaryuHIF extends staryu_1.Staryu {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = '13';
        this.fullName = 'Staryu HIF';
    }
}
exports.StaryuHIF = StaryuHIF;
class PikachuHIF extends pikachu_1.Pikachu {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = '19';
        this.fullName = 'Pikachu HIF';
    }
}
exports.PikachuHIF = PikachuHIF;
class BlainesLastStandHIF extends blaines_last_stand_1.BlaineSLastStand {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = '52';
        this.fullName = 'Blaine\'s Last Stand HIF';
    }
}
exports.BlainesLastStandHIF = BlainesLastStandHIF;
class GiovannisExileHIF extends giovannis_exile_1.GiovannisExile {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = '57';
        this.fullName = 'Giovanni\'s Exile HIF';
    }
}
exports.GiovannisExileHIF = GiovannisExileHIF;
class KogasTrapHIF extends kogas_trap_1.KogasTrap {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = '59';
        this.fullName = 'Koga\'s Trap HIF';
    }
}
exports.KogasTrapHIF = KogasTrapHIF;
class MistysDeterminationHIF extends mistys_determination_1.MistysDetermination {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = '62';
        this.fullName = 'Misty\'s Determination HIF';
    }
}
exports.MistysDeterminationHIF = MistysDeterminationHIF;
class PokemonCenterLadyHIF extends pokemon_center_lady_1.PokemonCenterLady {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = '64';
        this.fullName = 'Pokémon Center Lady HIF';
    }
}
exports.PokemonCenterLadyHIF = PokemonCenterLadyHIF;
class SabrinasSuggestionHIF extends sabrinas_suggestion_1.SabrinasSuggestion {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = '65';
        this.fullName = 'Sabrina\'s Suggestion HIF';
    }
}
exports.SabrinasSuggestionHIF = SabrinasSuggestionHIF;
class GiovannisExile2 extends giovannis_exile_1.GiovannisExile {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = '67';
        this.fullName = 'Giovanni\'s Exile HIF 67';
    }
}
exports.GiovannisExile2 = GiovannisExile2;
class JessieAndJames2 extends jessie_and_james_1.JessieAndJames {
    constructor() {
        super(...arguments);
        this.set = 'HIF';
        this.setNumber = '68';
        this.fullName = 'Jessie & James HIF 68';
    }
}
exports.JessieAndJames2 = JessieAndJames2;
