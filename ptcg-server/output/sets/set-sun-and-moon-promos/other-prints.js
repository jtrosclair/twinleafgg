"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NidoqueenSMP = exports.Zapdos2SMP = exports.CharizardSMP = exports.GiratinaSMP = exports.RaikouSMP = exports.GlaceonGXSMP = exports.DelcattySMP = exports.UltraNecrozmaGXSMP = exports.NaganadelGXSMP = exports.MalamarSMP = exports.DuskManeNecrozmaGXSMP = exports.DawnWingsNecrozmaGXSMP = exports.Mimikyu2SMP = exports.Lucario2SMP = exports.SilvallyGXSMP = exports.LatiosSMP = exports.MarshadowSMP = exports.ZoroarkGXSMP = exports.ZoruaSMP = exports.SalazzleSMP = exports.BuzzwoleGXSMP = exports.SalazzleGXSMP = exports.MarshadowGXSMP = exports.NecrozmaGXSMP = exports.LucarioSMP = exports.TapuKokoGX2SMP = exports.CosmogSMP = exports.DecidueyeGXSMP = exports.EspeonGXSMP = exports.TapuKokoGXSMP = exports.TapuBuluGXSMP = exports.TapuKoko3SMP = exports.VikavoltSMP = exports.Popplio2SMP = exports.Rowlet2SMP = exports.Oricorio2SMP = exports.OranguruSMP = exports.PassimianSMP = exports.VenusaurSnivyGXSMP = exports.TapuKokoSMP = exports.ReshiramCharizardGXSMP = exports.EspeonDeoxysGXSMP = exports.DhelmiseSMP = exports.CelebiVenusaurGXSMP = exports.MewSMP = exports.MagikarpWailordGXSMP = exports.EeveeSnorlaxGXSMP = exports.LycanrocSMP = exports.LucarioMelmetalGXSMP = exports.UmbreonDarkraiGXSMP = void 0;
exports.CharizardGXSMP60 = exports.SolgaleoGX3SMP = exports.PikachuZekromGX2SMP = exports.ReshiramCharizardGX2SMP = exports.CharizardBraixenGXSMP = exports.Charizard2SMP = exports.BlacephalonSMP = exports.PhioneSMP = exports.EnteiSMP = exports.BuzzwoleSMP = exports.Mewtwo2SMP = exports.MoltresZapdosArticunoGXSMP = exports.NecrozmaSMP = exports.GarchompGiratinaGXSMP = exports.MewtwoMewGXSMP = exports.PersianSMP = exports.VolcanionSMP = exports.JirachiSMP = void 0;
const passimian_1 = require("../set-sun-and-moon/passimian");
const oranguru_1 = require("../set-sun-and-moon/oranguru");
const oricorio_2_1 = require("../set-guardians-rising/oricorio-2");
const rowlet_1 = require("../set-sun-and-moon/rowlet");
const popplio_1 = require("../set-sun-and-moon/popplio");
const vikavolt_1 = require("../set-sun-and-moon/vikavolt");
const tapu_koko_1 = require("../set-sun-and-moon-promos/tapu-koko");
const tapu_bulu_gx_1 = require("../set-burning-shadows/tapu-bulu-gx");
const tapu_koko_gx_1 = require("../set-guardians-rising/tapu-koko-gx");
const espeon_gx_1 = require("../set-sun-and-moon/espeon-gx");
const decidueye_gx_1 = require("../set-sun-and-moon/decidueye-gx");
const cosmog_1 = require("../set-sun-and-moon/cosmog");
const tapu_koko_gx_2 = require("../set-guardians-rising/tapu-koko-gx");
const lucario_1 = require("../set-burning-shadows/lucario");
const necrozma_gx_1 = require("../set-burning-shadows/necrozma-gx");
const marshadow_gx_1 = require("../set-burning-shadows/marshadow-gx");
const salazzle_gx_1 = require("../set-burning-shadows/salazzle-gx");
const buzzwole_gx_1 = require("../set-crimson-invasion/buzzwole-gx");
const salazzle_1 = require("../set-crimson-invasion/salazzle");
const zorua_1 = require("../set-shining-legends/zorua");
const zoroark_gx_1 = require("../set-shining-legends/zoroark-gx");
const marshadow_1 = require("../set-shining-legends/marshadow");
const latios_1 = require("../set-shining-legends/latios");
const silvally_gx_1 = require("../set-ultra-prism/silvally-gx");
const lucario_2 = require("../set-ultra-prism/lucario");
const mimikyu_1 = require("../set-guardians-rising/mimikyu");
const dawn_wings_necrozma_gx_1 = require("../set-ultra-prism/dawn-wings-necrozma-gx");
const dusk_mane_necrozma_gx_1 = require("../set-ultra-prism/dusk-mane-necrozma-gx");
const malamar_1 = require("../set-forbidden-light/malamar");
const naganadel_gx_1 = require("../set-forbidden-light/naganadel-gx");
const ultra_necrozma_gx_1 = require("../set-forbidden-light/ultra-necrozma-gx");
const delcatty_1 = require("../set-celestial-storm/delcatty");
const glaceon_gx_1 = require("../set-ultra-prism/glaceon-gx");
const raikou_1 = require("../set-lost-thunder/raikou");
const giratina_1 = require("../set-lost-thunder/giratina");
const charizard_1 = require("../set-team-up/charizard");
const zapdos_1 = require("../set-team-up/zapdos");
const nidoqueen_1 = require("../set-team-up/nidoqueen");
const jirachi_1 = require("../set-team-up/jirachi");
const volcanion_1 = require("../set-unbroken-bonds/volcanion");
const persian_1 = require("../set-unbroken-bonds/persian");
const mewtwo_and_mew_gx_1 = require("../set-unified-minds/mewtwo-and-mew-gx");
const garchomp_and_giratina_gx_1 = require("../set-unified-minds/garchomp-and-giratina-gx");
const necrozma_1 = require("../set-unified-minds/necrozma");
const moltres_zapdos_articuno_gx_1 = require("../set-hidden-fates/moltres-zapdos-articuno-gx");
const mewtwo_1 = require("../set-unbroken-bonds/mewtwo");
const buzzwole_1 = require("../set-cosmic-eclipse/buzzwole");
const entei_1 = require("../set-cosmic-eclipse/entei");
const phione_1 = require("../set-cosmic-eclipse/phione");
const blacephalon_1 = require("../set-cosmic-eclipse/blacephalon");
const charizard_2 = require("../set-team-up/charizard");
const charizard_braixen_gx_1 = require("../set-cosmic-eclipse/charizard-braixen-gx");
const reshiram_and_charizard_gx_1 = require("../set-unbroken-bonds/reshiram-and-charizard-gx");
const pikachu_and_zekrom_gx_1 = require("../set-sun-and-moon-promos/pikachu-and-zekrom-gx");
const solgaleo_gx_1 = require("../set-sun-and-moon-promos/solgaleo-gx");
const venusaur_and_snivy_gx_1 = require("../set-cosmic-eclipse/venusaur-and-snivy-gx");
const celebi_and_venusaur_gx_1 = require("../set-team-up/celebi-and-venusaur-gx");
const dhelmise_1 = require("../set-guardians-rising/dhelmise");
const eevee_and_snorlax_gx_1 = require("../set-team-up/eevee-and-snorlax-gx");
const magikarp_and_wailord_gx_1 = require("../set-team-up/magikarp-and-wailord-gx");
const mew_1 = require("../set-unbroken-bonds/mew");
const lucario_and_melmetal_gx_1 = require("../set-unbroken-bonds/lucario-and-melmetal-gx");
const lycanroc_1 = require("../set-forbidden-light/lycanroc");
const reshiram_and_charizard_gx_2 = require("../set-unbroken-bonds/reshiram-and-charizard-gx");
const tapu_koko_2 = require("./tapu-koko");
const espeon_and_deoxys_gx_1 = require("../set-unified-minds/espeon-and-deoxys-gx");
const umbreon_and_darkrai_gx_1 = require("../set-unified-minds/umbreon-and-darkrai-gx");
const charizard_gx_1 = require("../set-burning-shadows/charizard-gx");
class UmbreonDarkraiGXSMP extends umbreon_and_darkrai_gx_1.UmbreonDarkraiGX {
    constructor() {
        super(...arguments);
        this.fullName = 'Umbreon & Darkrai-GX SMP';
        this.set = 'SMP';
        this.setNumber = '241';
    }
}
exports.UmbreonDarkraiGXSMP = UmbreonDarkraiGXSMP;
class LucarioMelmetalGXSMP extends lucario_and_melmetal_gx_1.LucarioMelmetalGX {
    constructor() {
        super(...arguments);
        this.fullName = 'Lucario & Melmetal-GX SMP';
        this.set = 'SMP';
        this.setNumber = '192';
    }
}
exports.LucarioMelmetalGXSMP = LucarioMelmetalGXSMP;
class LycanrocSMP extends lycanroc_1.Lycanroc {
    constructor() {
        super(...arguments);
        this.fullName = 'Lycanroc SMP';
        this.set = 'SMP';
        this.setNumber = '118';
    }
}
exports.LycanrocSMP = LycanrocSMP;
class EeveeSnorlaxGXSMP extends eevee_and_snorlax_gx_1.EeveeSnorlaxGX {
    constructor() {
        super(...arguments);
        this.fullName = 'Eevee & Snorlax-GX SMP';
        this.set = 'SMP';
        this.setNumber = '169';
    }
}
exports.EeveeSnorlaxGXSMP = EeveeSnorlaxGXSMP;
class MagikarpWailordGXSMP extends magikarp_and_wailord_gx_1.MagikarpWailordGX {
    constructor() {
        super(...arguments);
        this.fullName = 'Magikarp & Wailord-GX SMP';
        this.set = 'SMP';
        this.setNumber = '166';
    }
}
exports.MagikarpWailordGXSMP = MagikarpWailordGXSMP;
class MewSMP extends mew_1.Mew {
    constructor() {
        super(...arguments);
        this.fullName = 'Mew SMP';
        this.set = 'SMP';
        this.setNumber = '215';
    }
}
exports.MewSMP = MewSMP;
class CelebiVenusaurGXSMP extends celebi_and_venusaur_gx_1.CelebiVenusaurGX {
    constructor() {
        super(...arguments);
        this.fullName = 'Celebi & Venusaur-GX SMP';
        this.set = 'SMP';
        this.setNumber = '167';
    }
}
exports.CelebiVenusaurGXSMP = CelebiVenusaurGXSMP;
class DhelmiseSMP extends dhelmise_1.Dhelmise {
    constructor() {
        super(...arguments);
        this.fullName = 'Dhelmise SMP';
        this.set = 'SMP';
        this.setNumber = '53';
    }
}
exports.DhelmiseSMP = DhelmiseSMP;
class EspeonDeoxysGXSMP extends espeon_and_deoxys_gx_1.EspeonDeoxysGX {
    constructor() {
        super(...arguments);
        this.fullName = 'Espeon & Deoxys-GX SMP';
        this.set = 'SMP';
        this.setNumber = '240';
    }
}
exports.EspeonDeoxysGXSMP = EspeonDeoxysGXSMP;
class ReshiramCharizardGXSMP extends reshiram_and_charizard_gx_2.ReshiramCharizardGX {
    constructor() {
        super(...arguments);
        this.fullName = 'Reshiram & Charizard-GX SMP';
        this.set = 'SMP';
        this.setNumber = '201';
    }
}
exports.ReshiramCharizardGXSMP = ReshiramCharizardGXSMP;
class TapuKokoSMP extends tapu_koko_2.TapuKoko {
    constructor() {
        super(...arguments);
        this.fullName = 'Tapu Koko SMP 30a';
        this.set = 'SMP';
        this.setNumber = '30a';
    }
}
exports.TapuKokoSMP = TapuKokoSMP;
class VenusaurSnivyGXSMP extends venusaur_and_snivy_gx_1.VenusaurSnivyGX {
    constructor() {
        super(...arguments);
        this.fullName = 'Venusaur & Snivy-GX SMP';
        this.set = 'SMP';
        this.setNumber = '229';
    }
}
exports.VenusaurSnivyGXSMP = VenusaurSnivyGXSMP;
class PassimianSMP extends passimian_1.Passimian {
    constructor() {
        super(...arguments);
        this.setNumber = '12';
        this.fullName = 'Passimian SMP';
        this.set = 'SMP';
    }
}
exports.PassimianSMP = PassimianSMP;
class OranguruSMP extends oranguru_1.Oranguru {
    constructor() {
        super(...arguments);
        this.setNumber = '13';
        this.fullName = 'Oranguru SMP';
        this.set = 'SMP';
    }
}
exports.OranguruSMP = OranguruSMP;
class Oricorio2SMP extends oricorio_2_1.Oricorio2 {
    constructor() {
        super(...arguments);
        this.setNumber = '19';
        this.fullName = 'Oricorio SMP';
        this.set = 'SMP';
    }
}
exports.Oricorio2SMP = Oricorio2SMP;
class Rowlet2SMP extends rowlet_1.Rowlet {
    constructor() {
        super(...arguments);
        this.setNumber = '22';
        this.fullName = 'Rowlet2 SMP';
        this.set = 'SMP';
    }
}
exports.Rowlet2SMP = Rowlet2SMP;
class Popplio2SMP extends popplio_1.Popplio {
    constructor() {
        super(...arguments);
        this.setNumber = '24';
        this.fullName = 'Popplio2 SMP';
        this.set = 'SMP';
    }
}
exports.Popplio2SMP = Popplio2SMP;
class VikavoltSMP extends vikavolt_1.Vikavolt {
    constructor() {
        super(...arguments);
        this.setNumber = '28';
        this.fullName = 'Vikavolt SMP';
        this.set = 'SMP';
    }
}
exports.VikavoltSMP = VikavoltSMP;
class TapuKoko3SMP extends tapu_koko_1.TapuKoko {
    constructor() {
        super(...arguments);
        this.setNumber = '31';
        this.fullName = 'Tapu Koko3 SMP';
        this.set = 'SMP';
    }
}
exports.TapuKoko3SMP = TapuKoko3SMP;
class TapuBuluGXSMP extends tapu_bulu_gx_1.TapuBuluGX {
    constructor() {
        super(...arguments);
        this.setNumber = '32';
        this.fullName = 'Tapu Bulu-GX SMP';
        this.set = 'SMP';
    }
}
exports.TapuBuluGXSMP = TapuBuluGXSMP;
class TapuKokoGXSMP extends tapu_koko_gx_1.TapuKokoGX {
    constructor() {
        super(...arguments);
        this.setNumber = '33';
        this.fullName = 'Tapu Koko-GX SMP';
        this.set = 'SMP';
    }
}
exports.TapuKokoGXSMP = TapuKokoGXSMP;
class EspeonGXSMP extends espeon_gx_1.EspeonGX {
    constructor() {
        super(...arguments);
        this.setNumber = '35';
        this.fullName = 'Espeon-GX SMP';
        this.set = 'SMP';
    }
}
exports.EspeonGXSMP = EspeonGXSMP;
class DecidueyeGXSMP extends decidueye_gx_1.DecidueyeGX {
    constructor() {
        super(...arguments);
        this.setNumber = '37';
        this.fullName = 'Decidueye-GX SMP';
        this.set = 'SMP';
    }
}
exports.DecidueyeGXSMP = DecidueyeGXSMP;
class CosmogSMP extends cosmog_1.Cosmog {
    constructor() {
        super(...arguments);
        this.setNumber = '42';
        this.fullName = 'Cosmog SMP';
        this.set = 'SMP';
    }
}
exports.CosmogSMP = CosmogSMP;
class TapuKokoGX2SMP extends tapu_koko_gx_2.TapuKokoGX {
    constructor() {
        super(...arguments);
        this.setNumber = '50';
        this.fullName = 'Tapu Koko-GX2 SMP';
        this.set = 'SMP';
    }
}
exports.TapuKokoGX2SMP = TapuKokoGX2SMP;
class LucarioSMP extends lucario_1.Lucario {
    constructor() {
        super(...arguments);
        this.setNumber = '54';
        this.fullName = 'Lucario SMP';
        this.set = 'SMP';
    }
}
exports.LucarioSMP = LucarioSMP;
class NecrozmaGXSMP extends necrozma_gx_1.NecrozmaGX {
    constructor() {
        super(...arguments);
        this.setNumber = '58';
        this.fullName = 'Necrozma-GX SMP';
        this.set = 'SMP';
    }
}
exports.NecrozmaGXSMP = NecrozmaGXSMP;
class MarshadowGXSMP extends marshadow_gx_1.MarshadowGX {
    constructor() {
        super(...arguments);
        this.setNumber = '59';
        this.fullName = 'Marshadow-GX SMP';
        this.set = 'SMP';
    }
}
exports.MarshadowGXSMP = MarshadowGXSMP;
class SalazzleGXSMP extends salazzle_gx_1.SalazzleGX {
    constructor() {
        super(...arguments);
        this.setNumber = '63';
        this.fullName = 'Salazzle-GX SMP';
        this.set = 'SMP';
    }
}
exports.SalazzleGXSMP = SalazzleGXSMP;
class BuzzwoleGXSMP extends buzzwole_gx_1.BuzzwoleGX {
    constructor() {
        super(...arguments);
        this.setNumber = '69';
        this.fullName = 'Buzzwole-GX SMP';
        this.set = 'SMP';
    }
}
exports.BuzzwoleGXSMP = BuzzwoleGXSMP;
class SalazzleSMP extends salazzle_1.Salazzle {
    constructor() {
        super(...arguments);
        this.setNumber = '73';
        this.fullName = 'Salazzle SMP';
        this.set = 'SMP';
    }
}
exports.SalazzleSMP = SalazzleSMP;
class ZoruaSMP extends zorua_1.Zorua {
    constructor() {
        super(...arguments);
        this.setNumber = '83';
        this.fullName = 'Zorua SMP';
        this.set = 'SMP';
    }
}
exports.ZoruaSMP = ZoruaSMP;
class ZoroarkGXSMP extends zoroark_gx_1.ZoroarkGX {
    constructor() {
        super(...arguments);
        this.setNumber = '84';
        this.fullName = 'Zoroark-GX SMP';
        this.set = 'SMP';
    }
}
exports.ZoroarkGXSMP = ZoroarkGXSMP;
class MarshadowSMP extends marshadow_1.Marshadow {
    constructor() {
        super(...arguments);
        this.setNumber = '85';
        this.fullName = 'Marshadow SMP';
        this.set = 'SMP';
    }
}
exports.MarshadowSMP = MarshadowSMP;
class LatiosSMP extends latios_1.Latios {
    constructor() {
        super(...arguments);
        this.setNumber = '88';
        this.fullName = 'Latios SMP';
        this.set = 'SMP';
    }
}
exports.LatiosSMP = LatiosSMP;
class SilvallyGXSMP extends silvally_gx_1.SilvallyGX {
    constructor() {
        super(...arguments);
        this.setNumber = '91';
        this.fullName = 'Silvally-GX SMP';
        this.set = 'SMP';
    }
}
exports.SilvallyGXSMP = SilvallyGXSMP;
class Lucario2SMP extends lucario_2.Lucario {
    constructor() {
        super(...arguments);
        this.setNumber = '95';
        this.fullName = 'Lucario2 SMP';
        this.set = 'SMP';
    }
}
exports.Lucario2SMP = Lucario2SMP;
class Mimikyu2SMP extends mimikyu_1.Mimikyu {
    constructor() {
        super(...arguments);
        this.setNumber = '99';
        this.fullName = 'Mimikyu2 SMP';
        this.set = 'SMP';
    }
}
exports.Mimikyu2SMP = Mimikyu2SMP;
class DawnWingsNecrozmaGXSMP extends dawn_wings_necrozma_gx_1.DawnWingsNecrozmaGX {
    constructor() {
        super(...arguments);
        this.setNumber = '101';
        this.fullName = 'Dawn Wings Necrozma-GX SMP';
        this.set = 'SMP';
    }
}
exports.DawnWingsNecrozmaGXSMP = DawnWingsNecrozmaGXSMP;
class DuskManeNecrozmaGXSMP extends dusk_mane_necrozma_gx_1.DuskManeNecrozmaGX {
    constructor() {
        super(...arguments);
        this.setNumber = '102';
        this.fullName = 'Dusk Mane Necrozma-GX SMP';
        this.set = 'SMP';
    }
}
exports.DuskManeNecrozmaGXSMP = DuskManeNecrozmaGXSMP;
class MalamarSMP extends malamar_1.Malamar {
    constructor() {
        super(...arguments);
        this.setNumber = '117';
        this.fullName = 'Malamar SMP';
        this.set = 'SMP';
    }
}
exports.MalamarSMP = MalamarSMP;
class NaganadelGXSMP extends naganadel_gx_1.NaganadelGX {
    constructor() {
        super(...arguments);
        this.setNumber = '125';
        this.fullName = 'Naganadel-GX SMP';
        this.set = 'SMP';
    }
}
exports.NaganadelGXSMP = NaganadelGXSMP;
class UltraNecrozmaGXSMP extends ultra_necrozma_gx_1.UltraNecrozmaGX {
    constructor() {
        super(...arguments);
        this.setNumber = '126';
        this.fullName = 'Ultra Necrozma-GX SMP';
        this.set = 'SMP';
    }
}
exports.UltraNecrozmaGXSMP = UltraNecrozmaGXSMP;
class DelcattySMP extends delcatty_1.Delcatty {
    constructor() {
        super(...arguments);
        this.setNumber = '132';
        this.fullName = 'Delcatty SMP';
        this.set = 'SMP';
    }
}
exports.DelcattySMP = DelcattySMP;
class GlaceonGXSMP extends glaceon_gx_1.GlaceonGX {
    constructor() {
        super(...arguments);
        this.setNumber = '147';
        this.fullName = 'Glaceon-GX SMP';
        this.set = 'SMP';
    }
}
exports.GlaceonGXSMP = GlaceonGXSMP;
class RaikouSMP extends raikou_1.Raikou {
    constructor() {
        super(...arguments);
        this.setNumber = '150';
        this.fullName = 'Raikou SMP';
        this.set = 'SMP';
    }
}
exports.RaikouSMP = RaikouSMP;
class GiratinaSMP extends giratina_1.Giratina {
    constructor() {
        super(...arguments);
        this.setNumber = '151';
        this.fullName = 'Giratina SMP';
        this.set = 'SMP';
    }
}
exports.GiratinaSMP = GiratinaSMP;
class CharizardSMP extends charizard_1.Charizard {
    constructor() {
        super(...arguments);
        this.setNumber = '158';
        this.fullName = 'Charizard SMP';
        this.set = 'SMP';
    }
}
exports.CharizardSMP = CharizardSMP;
class Zapdos2SMP extends zapdos_1.Zapdos {
    constructor() {
        super(...arguments);
        this.setNumber = '159';
        this.fullName = 'Zapdos2 SMP';
        this.set = 'SMP';
    }
}
exports.Zapdos2SMP = Zapdos2SMP;
class NidoqueenSMP extends nidoqueen_1.Nidoqueen {
    constructor() {
        super(...arguments);
        this.setNumber = '160';
        this.fullName = 'Nidoqueen SMP';
        this.set = 'SMP';
    }
}
exports.NidoqueenSMP = NidoqueenSMP;
class JirachiSMP extends jirachi_1.Jirachi {
    constructor() {
        super(...arguments);
        this.setNumber = '161';
        this.fullName = 'Jirachi SMP';
        this.set = 'SMP';
    }
}
exports.JirachiSMP = JirachiSMP;
class VolcanionSMP extends volcanion_1.Volcanion {
    constructor() {
        super(...arguments);
        this.setNumber = '179';
        this.fullName = 'Volcanion SMP';
        this.set = 'SMP';
    }
}
exports.VolcanionSMP = VolcanionSMP;
class PersianSMP extends persian_1.Persian {
    constructor() {
        super(...arguments);
        this.setNumber = '182';
        this.fullName = 'Persian SMP';
        this.set = 'SMP';
    }
}
exports.PersianSMP = PersianSMP;
class MewtwoMewGXSMP extends mewtwo_and_mew_gx_1.MewtwoMewGX {
    constructor() {
        super(...arguments);
        this.setNumber = '191';
        this.fullName = 'Mewtwo & Mew-GX SMP';
        this.set = 'SMP';
    }
}
exports.MewtwoMewGXSMP = MewtwoMewGXSMP;
class GarchompGiratinaGXSMP extends garchomp_and_giratina_gx_1.GarchompGiratinaGX {
    constructor() {
        super(...arguments);
        this.setNumber = '193';
        this.fullName = 'Garchomp & Giratina-GX SMP';
        this.set = 'SMP';
    }
}
exports.GarchompGiratinaGXSMP = GarchompGiratinaGXSMP;
class NecrozmaSMP extends necrozma_1.Necrozma {
    constructor() {
        super(...arguments);
        this.setNumber = '204';
        this.fullName = 'Necrozma SMP';
        this.set = 'SMP';
    }
}
exports.NecrozmaSMP = NecrozmaSMP;
class MoltresZapdosArticunoGXSMP extends moltres_zapdos_articuno_gx_1.MoltresZapdosArticunoGX {
    constructor() {
        super(...arguments);
        this.setNumber = '210';
        this.fullName = 'Moltres & Zapdos & Articuno-GX SMP';
        this.set = 'SMP';
    }
}
exports.MoltresZapdosArticunoGXSMP = MoltresZapdosArticunoGXSMP;
class Mewtwo2SMP extends mewtwo_1.Mewtwo {
    constructor() {
        super(...arguments);
        this.setNumber = '214';
        this.fullName = 'Mewtwo2 SMP';
        this.set = 'SMP';
    }
}
exports.Mewtwo2SMP = Mewtwo2SMP;
class BuzzwoleSMP extends buzzwole_1.Buzzwole {
    constructor() {
        super(...arguments);
        this.setNumber = '218';
        this.fullName = 'Buzzwole SMP';
        this.set = 'SMP';
    }
}
exports.BuzzwoleSMP = BuzzwoleSMP;
class EnteiSMP extends entei_1.Entei {
    constructor() {
        super(...arguments);
        this.setNumber = '219';
        this.fullName = 'Entei SMP';
        this.set = 'SMP';
    }
}
exports.EnteiSMP = EnteiSMP;
class PhioneSMP extends phione_1.Phione {
    constructor() {
        super(...arguments);
        this.setNumber = '220';
        this.fullName = 'Phione SMP';
        this.set = 'SMP';
    }
}
exports.PhioneSMP = PhioneSMP;
class BlacephalonSMP extends blacephalon_1.Blacephalon {
    constructor() {
        super(...arguments);
        this.setNumber = '221';
        this.fullName = 'Blacephalon SMP';
        this.set = 'SMP';
    }
}
exports.BlacephalonSMP = BlacephalonSMP;
class Charizard2SMP extends charizard_2.Charizard {
    constructor() {
        super(...arguments);
        this.setNumber = '226';
        this.fullName = 'Charizard2 SMP';
        this.set = 'SMP';
    }
}
exports.Charizard2SMP = Charizard2SMP;
class CharizardBraixenGXSMP extends charizard_braixen_gx_1.CharizardBraixenGX {
    constructor() {
        super(...arguments);
        this.setNumber = '230';
        this.fullName = 'Charizard & Braixen-GX SMP';
        this.set = 'SMP';
    }
}
exports.CharizardBraixenGXSMP = CharizardBraixenGXSMP;
class ReshiramCharizardGX2SMP extends reshiram_and_charizard_gx_1.ReshiramCharizardGX {
    constructor() {
        super(...arguments);
        this.setNumber = '247';
        this.fullName = 'Reshiram & Charizard-GX2 SMP';
        this.set = 'SMP';
    }
}
exports.ReshiramCharizardGX2SMP = ReshiramCharizardGX2SMP;
class PikachuZekromGX2SMP extends pikachu_and_zekrom_gx_1.PikachuZekromGX {
    constructor() {
        super(...arguments);
        this.setNumber = '248';
        this.fullName = 'Pikachu & Zekrom-GX2 SMP';
        this.set = 'SMP';
    }
}
exports.PikachuZekromGX2SMP = PikachuZekromGX2SMP;
class SolgaleoGX3SMP extends solgaleo_gx_1.SolgaleoGX {
    constructor() {
        super(...arguments);
        this.setNumber = '104a';
        this.fullName = 'Solgaleo-GX3 SMP';
        this.set = 'SMP';
    }
}
exports.SolgaleoGX3SMP = SolgaleoGX3SMP;
class CharizardGXSMP60 extends charizard_gx_1.CharizardGX {
    constructor() {
        super(...arguments);
        this.setNumber = '60';
        this.fullName = 'Charizard-GX SMP 60';
        this.set = 'SMP';
    }
}
exports.CharizardGXSMP60 = CharizardGXSMP60;
