"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OshawottAR = exports.EmboarAR = exports.PigniteAR = exports.TepigAR = exports.VirizionAR = exports.CottoneeAR = exports.ZekromexBR = exports.VictiniRRB = exports.NsPlanSIR = exports.GenesectexSIR = exports.ExcadrillexSIR = exports.MeloettaexSIR = exports.ZekromexSIR = exports.KyuremexSIR = exports.SerperiorexSIR = exports.NsPlanFA = exports.FennelFA = exports.GenesectexFA = exports.ExcadrillexFA = exports.MeloettaexFA = exports.ZekromexFA = exports.KyuremexFA = exports.SerperiorexFA = exports.HaxorusAR = exports.FraxureAR = exports.AxewAR = exports.CobalionAR = exports.DrillburAR = exports.ElgyemAR = exports.EelektrikAR = exports.TynamoAR = exports.EmolgaAR = exports.AlomomolaAR = exports.CarracostaAR = exports.TirtougaAR = exports.SeismitoadAR = exports.PalpitoadAR = exports.TympoleAR = exports.VolcaronaAR = exports.LarvestaAR = exports.VictiniAR = exports.ServineAR = exports.SnivyAR = exports.ToolScrapperSV11 = exports.Pokegear30SV11 = exports.EnergyRetrievalSV11 = exports.ProfessorsResearchSV11 = exports.CherenSV11 = exports.PrismEnergySV11 = exports.AirBalloonSV11 = void 0;
exports.ReshiramexWR = exports.VictiniRRW = exports.HildaSIR = exports.BouffalantexSIR = exports.HydreigonexSIR = exports.JellicentexSIR = exports.KeldeoexSIR = exports.ReshiramexSIR = exports.WhimsicottexSIR = exports.HildaFA = exports.BouffalantexFA = exports.HydreigonexFA = exports.JellicentexFA = exports.KeldeoexFA = exports.ReshiramexFA = exports.WhimsicottexFA = exports.ZweilousAR = exports.DeinoAR = exports.ZoroarkAR = exports.ZoruaAR = exports.TerrakionAR = exports.ArcheopsAR = exports.ArchenAR = exports.FrillishAR = exports.GalvantulaAR = exports.JoltikAR = exports.SamurottAR = exports.DewottAR = void 0;
const tool_scrapper_1 = require("../set-dragons-exalted/tool-scrapper");
const cheren_1 = require("../set-emerging-powers/cheren");
const prism_energy_1 = require("../set-next-destinies/prism-energy");
const energy_retrieval_1 = require("../set-scarlet-and-violet/energy-retrieval");
const pokegear_30_1 = require("../set-scarlet-and-violet/pokegear-30");
const professors_research_1 = require("../set-scarlet-and-violet/professors-research");
const air_balloon_1 = require("../set-sword-and-shield/air-balloon");
const alomomola_1 = require("./alomomola");
const archen_1 = require("./archen");
const archeops_1 = require("./archeops");
const axew_1 = require("./axew");
const bouffalant_ex_1 = require("./bouffalant-ex");
const carracosta_1 = require("./carracosta");
const cobalion_1 = require("./cobalion");
const cottonee_1 = require("./cottonee");
const deino_1 = require("./deino");
const dewott_1 = require("./dewott");
const drillbur_1 = require("./drillbur");
const eelektrik_1 = require("./eelektrik");
const elgyem_1 = require("./elgyem");
const emboar_1 = require("./emboar");
const emolga_1 = require("./emolga");
const excadrill_ex_1 = require("./excadrill-ex");
const fennel_1 = require("./fennel");
const fraxure_1 = require("./fraxure");
const frillish_1 = require("./frillish");
const galvantula_1 = require("./galvantula");
const genesect_ex_1 = require("./genesect-ex");
const haxorus_1 = require("./haxorus");
const hilda_1 = require("./hilda");
const hydreigon_ex_1 = require("./hydreigon-ex");
const jellicent_ex_1 = require("./jellicent-ex");
const joltik_1 = require("./joltik");
const keldeo_ex_1 = require("./keldeo-ex");
const kyurem_ex_1 = require("./kyurem-ex");
const larvesta_1 = require("./larvesta");
const meloetta_ex_1 = require("./meloetta-ex");
const ns_plan_1 = require("./ns-plan");
const oshawott_1 = require("./oshawott");
const palpitoad_1 = require("./palpitoad");
const pignite_1 = require("./pignite");
const reshiram_ex_1 = require("./reshiram-ex");
const samurott_1 = require("./samurott");
const seismitoad_1 = require("./seismitoad");
const serperior_ex_1 = require("./serperior-ex");
const servine_1 = require("./servine");
const snivy_1 = require("./snivy");
const tepig_1 = require("./tepig");
const terrakion_1 = require("./terrakion");
const tirtouga_1 = require("./tirtouga");
const tympole_1 = require("./tympole");
const tynamo_1 = require("./tynamo");
const victini_1 = require("./victini");
const virizion_1 = require("./virizion");
const volcarona_1 = require("./volcarona");
const whimsicott_ex_1 = require("./whimsicott-ex");
const zekrom_ex_1 = require("./zekrom-ex");
const zoroark_1 = require("./zoroark");
const zorua_1 = require("./zorua");
const zweilous_1 = require("./zweilous");
class AirBalloonSV11 extends air_balloon_1.AirBalloon {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.setNumber = '79';
        this.fullName = 'Air Balloon SV11B';
        this.set = 'BLK';
    }
}
exports.AirBalloonSV11 = AirBalloonSV11;
class PrismEnergySV11 extends prism_energy_1.PrismEnergy {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.setNumber = '86';
        this.fullName = 'Prism Energy SV11B';
        this.set = 'BLK';
    }
}
exports.PrismEnergySV11 = PrismEnergySV11;
class CherenSV11 extends cheren_1.Cheren {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.setNumber = '81';
        this.fullName = 'Cheren SV11W';
        this.set = 'WHT';
    }
}
exports.CherenSV11 = CherenSV11;
class ProfessorsResearchSV11 extends professors_research_1.ProfessorsResearch {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.setNumber = '85';
        this.fullName = 'Professors Research SV11B';
        this.set = 'BLK';
    }
}
exports.ProfessorsResearchSV11 = ProfessorsResearchSV11;
class EnergyRetrievalSV11 extends energy_retrieval_1.EnergyRetrieval {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.setNumber = '82';
        this.fullName = 'Energy Retrieval SV11W';
        this.set = 'WHT';
    }
}
exports.EnergyRetrievalSV11 = EnergyRetrievalSV11;
class Pokegear30SV11 extends pokegear_30_1.Pokegear30 {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.setNumber = '84';
        this.fullName = 'Pokegear 3.0 SV11W';
        this.set = 'BLK';
    }
}
exports.Pokegear30SV11 = Pokegear30SV11;
class ToolScrapperSV11 extends tool_scrapper_1.ToolScrapper {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.setNumber = '85';
        this.fullName = 'Tool Scrapper SV11W';
        this.set = 'WHT';
    }
}
exports.ToolScrapperSV11 = ToolScrapperSV11;
// SV11B ARs
class SnivyAR extends snivy_1.Snivy {
    constructor() {
        super(...arguments);
        this.setNumber = '87';
        this.set = 'BLK';
        this.fullName = 'SnivyAR SV11B';
    }
}
exports.SnivyAR = SnivyAR;
class ServineAR extends servine_1.Servine {
    constructor() {
        super(...arguments);
        this.setNumber = '88';
        this.set = 'BLK';
        this.fullName = 'ServineAR SV11B';
    }
}
exports.ServineAR = ServineAR;
// export class PetililAR extends Petilil {
//   public setNumber = '91';
//   public set = 'BLK';
//   public fullName: string = 'PetililAR SV11B';
// }
// export class LilligantAR extends Lilligant {
//   public setNumber = '92';
//   public set = 'BLK';
//   public fullName: string = 'LilligantAR SV11B';
// }
class VictiniAR extends victini_1.Victini {
    constructor() {
        super(...arguments);
        this.setNumber = '97';
        this.set = 'BLK';
        this.fullName = 'VictiniAR SV11B';
    }
}
exports.VictiniAR = VictiniAR;
class LarvestaAR extends larvesta_1.Larvesta {
    constructor() {
        super(...arguments);
        this.setNumber = '99';
        this.set = 'BLK';
        this.fullName = 'LarvestaAR SV11B';
    }
}
exports.LarvestaAR = LarvestaAR;
class VolcaronaAR extends volcarona_1.Volcarona {
    constructor() {
        super(...arguments);
        this.setNumber = '100';
        this.set = 'BLK';
        this.fullName = 'VolcaronaAR SV11B';
    }
}
exports.VolcaronaAR = VolcaronaAR;
class TympoleAR extends tympole_1.Tympole {
    constructor() {
        super(...arguments);
        this.setNumber = '103';
        this.set = 'BLK';
        this.fullName = 'TympoleAR SV11B';
    }
}
exports.TympoleAR = TympoleAR;
class PalpitoadAR extends palpitoad_1.Palpitoad {
    constructor() {
        super(...arguments);
        this.setNumber = '104';
        this.set = 'BLK';
        this.fullName = 'PalpitoadAR SV11B';
    }
}
exports.PalpitoadAR = PalpitoadAR;
class SeismitoadAR extends seismitoad_1.Seismitoad {
    constructor() {
        super(...arguments);
        this.setNumber = '105';
        this.set = 'BLK';
        this.fullName = 'SeismitoadAR SV11B';
    }
}
exports.SeismitoadAR = SeismitoadAR;
class TirtougaAR extends tirtouga_1.Tirtouga {
    constructor() {
        super(...arguments);
        this.setNumber = '106';
        this.set = 'BLK';
        this.fullName = 'TirtougaAR SV11B';
    }
}
exports.TirtougaAR = TirtougaAR;
class CarracostaAR extends carracosta_1.Carracosta {
    constructor() {
        super(...arguments);
        this.setNumber = '107';
        this.set = 'BLK';
        this.fullName = 'CarracostaAR SV11B';
    }
}
exports.CarracostaAR = CarracostaAR;
class AlomomolaAR extends alomomola_1.Alomomola {
    constructor() {
        super(...arguments);
        this.setNumber = '108';
        this.set = 'BLK';
        this.fullName = 'AlomomolaAR SV11B';
    }
}
exports.AlomomolaAR = AlomomolaAR;
class EmolgaAR extends emolga_1.Emolga {
    constructor() {
        super(...arguments);
        this.setNumber = '112';
        this.set = 'BLK';
        this.fullName = 'EmolgaAR SV11B';
    }
}
exports.EmolgaAR = EmolgaAR;
class TynamoAR extends tynamo_1.Tynamo {
    constructor() {
        super(...arguments);
        this.setNumber = '113';
        this.set = 'BLK';
        this.fullName = 'TynamoAR SV11B';
    }
}
exports.TynamoAR = TynamoAR;
class EelektrikAR extends eelektrik_1.Eelektrik {
    constructor() {
        super(...arguments);
        this.setNumber = '114';
        this.set = 'BLK';
        this.fullName = 'EelektrikAR SV11B';
    }
}
exports.EelektrikAR = EelektrikAR;
class ElgyemAR extends elgyem_1.Elgyem {
    constructor() {
        super(...arguments);
        this.setNumber = '120';
        this.set = 'BLK';
        this.fullName = 'Elgyem BLK 120';
    }
}
exports.ElgyemAR = ElgyemAR;
class DrillburAR extends drillbur_1.Drillbur {
    constructor() {
        super(...arguments);
        this.setNumber = '124';
        this.set = 'BLK';
        this.fullName = 'DrillburAR SV11B';
    }
}
exports.DrillburAR = DrillburAR;
class CobalionAR extends cobalion_1.Cobalion {
    constructor() {
        super(...arguments);
        this.setNumber = '144';
        this.set = 'BLK';
        this.fullName = 'CobalionAR SV11B';
    }
}
exports.CobalionAR = CobalionAR;
class AxewAR extends axew_1.Axew {
    constructor() {
        super(...arguments);
        this.setNumber = '145';
        this.set = 'BLK';
        this.fullName = 'AxewAR SV11B';
    }
}
exports.AxewAR = AxewAR;
class FraxureAR extends fraxure_1.Fraxure {
    constructor() {
        super(...arguments);
        this.setNumber = '146';
        this.set = 'BLK';
        this.fullName = 'FraxureAR SV11B';
    }
}
exports.FraxureAR = FraxureAR;
class HaxorusAR extends haxorus_1.Haxorus {
    constructor() {
        super(...arguments);
        this.setNumber = '147';
        this.set = 'BLK';
        this.fullName = 'HaxorusAR SV11B';
    }
}
exports.HaxorusAR = HaxorusAR;
// SV11B FAs
class SerperiorexFA extends serperior_ex_1.Serperiorex {
    constructor() {
        super(...arguments);
        this.setNumber = '156';
        this.set = 'BLK';
        this.fullName = 'Serperior exFA SV11B';
    }
}
exports.SerperiorexFA = SerperiorexFA;
class KyuremexFA extends kyurem_ex_1.Kyuremex {
    constructor() {
        super(...arguments);
        this.setNumber = '157';
        this.set = 'BLK';
        this.fullName = 'Kyurem exFA SV11B';
    }
}
exports.KyuremexFA = KyuremexFA;
class ZekromexFA extends zekrom_ex_1.Zekromex {
    constructor() {
        super(...arguments);
        this.setNumber = '158';
        this.set = 'BLK';
        this.fullName = 'Zekrom exFA SV11B';
    }
}
exports.ZekromexFA = ZekromexFA;
class MeloettaexFA extends meloetta_ex_1.Meloettaex {
    constructor() {
        super(...arguments);
        this.setNumber = '159';
        this.set = 'BLK';
        this.fullName = 'Meloetta exFA SV11B';
    }
}
exports.MeloettaexFA = MeloettaexFA;
class ExcadrillexFA extends excadrill_ex_1.Excadrillex {
    constructor() {
        super(...arguments);
        this.setNumber = '160';
        this.set = 'BLK';
        this.fullName = 'Excadrill exFA SV11B';
    }
}
exports.ExcadrillexFA = ExcadrillexFA;
class GenesectexFA extends genesect_ex_1.Genesectex {
    constructor() {
        super(...arguments);
        this.setNumber = '161';
        this.set = 'BLK';
        this.fullName = 'Genesect exFA SV11B';
    }
}
exports.GenesectexFA = GenesectexFA;
class FennelFA extends fennel_1.Fennel {
    constructor() {
        super(...arguments);
        this.setNumber = '162';
        this.set = 'BLK';
        this.fullName = 'FennelFA SV11B';
    }
}
exports.FennelFA = FennelFA;
class NsPlanFA extends ns_plan_1.NsPlan {
    constructor() {
        super(...arguments);
        this.setNumber = '163';
        this.set = 'BLK';
        this.fullName = 'N\'s PlotFA SV11B';
    }
}
exports.NsPlanFA = NsPlanFA;
// SV11B SIRs
class SerperiorexSIR extends serperior_ex_1.Serperiorex {
    constructor() {
        super(...arguments);
        this.setNumber = '164';
        this.set = 'BLK';
        this.fullName = 'Serperior exSIR SV11B';
    }
}
exports.SerperiorexSIR = SerperiorexSIR;
class KyuremexSIR extends kyurem_ex_1.Kyuremex {
    constructor() {
        super(...arguments);
        this.setNumber = '165';
        this.set = 'BLK';
        this.fullName = 'Kyurem exSIR SV11B';
    }
}
exports.KyuremexSIR = KyuremexSIR;
class ZekromexSIR extends zekrom_ex_1.Zekromex {
    constructor() {
        super(...arguments);
        this.setNumber = '166';
        this.set = 'BLK';
        this.fullName = 'Zekrom exSIR SV11B';
    }
}
exports.ZekromexSIR = ZekromexSIR;
class MeloettaexSIR extends meloetta_ex_1.Meloettaex {
    constructor() {
        super(...arguments);
        this.setNumber = '167';
        this.set = 'BLK';
        this.fullName = 'Meloetta exSIR SV11B';
    }
}
exports.MeloettaexSIR = MeloettaexSIR;
class ExcadrillexSIR extends excadrill_ex_1.Excadrillex {
    constructor() {
        super(...arguments);
        this.setNumber = '168';
        this.set = 'BLK';
        this.fullName = 'Excadrill exSIR SV11B';
    }
}
exports.ExcadrillexSIR = ExcadrillexSIR;
class GenesectexSIR extends genesect_ex_1.Genesectex {
    constructor() {
        super(...arguments);
        this.setNumber = '169';
        this.set = 'BLK';
        this.fullName = 'Genesect exSIR SV11B';
    }
}
exports.GenesectexSIR = GenesectexSIR;
class NsPlanSIR extends ns_plan_1.NsPlan {
    constructor() {
        super(...arguments);
        this.setNumber = '170';
        this.set = 'BLK';
        this.fullName = 'N\'s PlotSIR SV11B';
    }
}
exports.NsPlanSIR = NsPlanSIR;
class VictiniRRB extends victini_1.Victini {
    constructor() {
        super(...arguments);
        this.setNumber = '171';
        this.set = 'BLK';
        this.fullName = 'VictiniRRB SV11B';
    }
}
exports.VictiniRRB = VictiniRRB;
// SV11B Black Rare
class ZekromexBR extends zekrom_ex_1.Zekromex {
    constructor() {
        super(...arguments);
        this.setNumber = '172';
        this.set = 'BLK';
        this.fullName = 'Zekrom exBR SV11B';
    }
}
exports.ZekromexBR = ZekromexBR;
// SV11W ARs
class CottoneeAR extends cottonee_1.Cottonee {
    constructor() {
        super(...arguments);
        this.setNumber = '90';
        this.set = 'WHT';
        this.fullName = 'CottoneeAR SV11W';
    }
}
exports.CottoneeAR = CottoneeAR;
class VirizionAR extends virizion_1.Virizion {
    constructor() {
        super(...arguments);
        this.setNumber = '95';
        this.set = 'WHT';
        this.fullName = 'VirizionAR SV11W';
    }
}
exports.VirizionAR = VirizionAR;
class TepigAR extends tepig_1.Tepig {
    constructor() {
        super(...arguments);
        this.setNumber = '96';
        this.set = 'WHT';
        this.fullName = 'TepigAR SV11W';
    }
}
exports.TepigAR = TepigAR;
class PigniteAR extends pignite_1.Pignite {
    constructor() {
        super(...arguments);
        this.setNumber = '97';
        this.set = 'WHT';
        this.fullName = 'PigniteAR SV11W';
    }
}
exports.PigniteAR = PigniteAR;
class EmboarAR extends emboar_1.Emboar {
    constructor() {
        super(...arguments);
        this.setNumber = '98';
        this.set = 'WHT';
        this.fullName = 'EmboarAR SV11W';
    }
}
exports.EmboarAR = EmboarAR;
class OshawottAR extends oshawott_1.Oshawott {
    constructor() {
        super(...arguments);
        this.setNumber = '105';
        this.set = 'WHT';
        this.fullName = 'OshawottAR SV11W';
    }
}
exports.OshawottAR = OshawottAR;
class DewottAR extends dewott_1.Dewott {
    constructor() {
        super(...arguments);
        this.setNumber = '106';
        this.set = 'WHT';
        this.fullName = 'DewottAR SV11W';
    }
}
exports.DewottAR = DewottAR;
class SamurottAR extends samurott_1.Samurott {
    constructor() {
        super(...arguments);
        this.setNumber = '107';
        this.set = 'WHT';
        this.fullName = 'SamurottAR SV11W';
    }
}
exports.SamurottAR = SamurottAR;
class JoltikAR extends joltik_1.Joltik {
    constructor() {
        super(...arguments);
        this.setNumber = '116';
        this.set = 'WHT';
        this.fullName = 'JoltikAR SV11W';
    }
}
exports.JoltikAR = JoltikAR;
class GalvantulaAR extends galvantula_1.Galvantula {
    constructor() {
        super(...arguments);
        this.setNumber = '117';
        this.set = 'WHT';
        this.fullName = 'GalvantulaAR SV11W';
    }
}
exports.GalvantulaAR = GalvantulaAR;
class FrillishAR extends frillish_1.Frillish {
    constructor() {
        super(...arguments);
        this.setNumber = '126';
        this.set = 'WHT';
        this.fullName = 'FrillishAR SV11W';
    }
}
exports.FrillishAR = FrillishAR;
class ArchenAR extends archen_1.Archen {
    constructor() {
        super(...arguments);
        this.setNumber = '131';
        this.set = 'WHT';
        this.fullName = 'ArchenAR SV11W';
    }
}
exports.ArchenAR = ArchenAR;
class ArcheopsAR extends archeops_1.Archeops {
    constructor() {
        super(...arguments);
        this.setNumber = '132';
        this.set = 'WHT';
        this.fullName = 'ArcheopsAR SV11W';
    }
}
exports.ArcheopsAR = ArcheopsAR;
class TerrakionAR extends terrakion_1.Terrakion {
    constructor() {
        super(...arguments);
        this.setNumber = '135';
        this.set = 'WHT';
        this.fullName = 'TerrakionAR SV11W';
    }
}
exports.TerrakionAR = TerrakionAR;
class ZoruaAR extends zorua_1.Zorua {
    constructor() {
        super(...arguments);
        this.setNumber = '142';
        this.set = 'WHT';
        this.fullName = 'ZoruaAR SV11W';
    }
}
exports.ZoruaAR = ZoruaAR;
class ZoroarkAR extends zoroark_1.Zoroark {
    constructor() {
        super(...arguments);
        this.setNumber = '143';
        this.set = 'WHT';
        this.fullName = 'ZoroarkAR SV11W';
    }
}
exports.ZoroarkAR = ZoroarkAR;
class DeinoAR extends deino_1.Deino {
    constructor() {
        super(...arguments);
        this.setNumber = '146';
        this.set = 'WHT';
        this.fullName = 'DeinoAR SV11W';
    }
}
exports.DeinoAR = DeinoAR;
class ZweilousAR extends zweilous_1.Zweilous {
    constructor() {
        super(...arguments);
        this.setNumber = '147';
        this.set = 'WHT';
        this.fullName = 'ZweilousAR SV11W';
    }
}
exports.ZweilousAR = ZweilousAR;
// SV11W FAs
class WhimsicottexFA extends whimsicott_ex_1.Whimsicottex {
    constructor() {
        super(...arguments);
        this.setNumber = '157';
        this.set = 'WHT';
        this.fullName = 'Whimsicott exFA SV11W';
    }
}
exports.WhimsicottexFA = WhimsicottexFA;
class ReshiramexFA extends reshiram_ex_1.Reshiramex {
    constructor() {
        super(...arguments);
        this.setNumber = '158';
        this.set = 'WHT';
        this.fullName = 'Reshiram exFA SV11W';
    }
}
exports.ReshiramexFA = ReshiramexFA;
class KeldeoexFA extends keldeo_ex_1.Keldeoex {
    constructor() {
        super(...arguments);
        this.setNumber = '159';
        this.set = 'WHT';
        this.fullName = 'Keldeo exFA SV11W';
    }
}
exports.KeldeoexFA = KeldeoexFA;
class JellicentexFA extends jellicent_ex_1.Jellicentex {
    constructor() {
        super(...arguments);
        this.setNumber = '160';
        this.set = 'WHT';
        this.fullName = 'Jellicent exFA SV11W';
    }
}
exports.JellicentexFA = JellicentexFA;
class HydreigonexFA extends hydreigon_ex_1.Hydreigonex {
    constructor() {
        super(...arguments);
        this.setNumber = '161';
        this.set = 'WHT';
        this.fullName = 'Hydreigon exFA SV11W';
    }
}
exports.HydreigonexFA = HydreigonexFA;
class BouffalantexFA extends bouffalant_ex_1.Bouffalantex {
    constructor() {
        super(...arguments);
        this.setNumber = '162';
        this.set = 'WHT';
        this.fullName = 'Bouffalant exFA SV11W';
    }
}
exports.BouffalantexFA = BouffalantexFA;
class HildaFA extends hilda_1.Hilda {
    constructor() {
        super(...arguments);
        this.setNumber = '164';
        this.set = 'WHT';
        this.fullName = 'HildaFA SV11W';
    }
}
exports.HildaFA = HildaFA;
// SV11W SIRs
class WhimsicottexSIR extends whimsicott_ex_1.Whimsicottex {
    constructor() {
        super(...arguments);
        this.setNumber = '165';
        this.set = 'WHT';
        this.fullName = 'Whimsicott exSIR SV11W';
    }
}
exports.WhimsicottexSIR = WhimsicottexSIR;
class ReshiramexSIR extends reshiram_ex_1.Reshiramex {
    constructor() {
        super(...arguments);
        this.setNumber = '166';
        this.set = 'WHT';
        this.fullName = 'Reshiram exSIR SV11W';
    }
}
exports.ReshiramexSIR = ReshiramexSIR;
class KeldeoexSIR extends keldeo_ex_1.Keldeoex {
    constructor() {
        super(...arguments);
        this.setNumber = '167';
        this.set = 'WHT';
        this.fullName = 'Keldeo exSIR SV11W';
    }
}
exports.KeldeoexSIR = KeldeoexSIR;
class JellicentexSIR extends jellicent_ex_1.Jellicentex {
    constructor() {
        super(...arguments);
        this.setNumber = '168';
        this.set = 'WHT';
        this.fullName = 'Jellicent exSIR SV11W';
    }
}
exports.JellicentexSIR = JellicentexSIR;
class HydreigonexSIR extends hydreigon_ex_1.Hydreigonex {
    constructor() {
        super(...arguments);
        this.setNumber = '169';
        this.set = 'WHT';
        this.fullName = 'Hydreigon exSIR SV11W';
    }
}
exports.HydreigonexSIR = HydreigonexSIR;
class BouffalantexSIR extends bouffalant_ex_1.Bouffalantex {
    constructor() {
        super(...arguments);
        this.setNumber = '170';
        this.set = 'WHT';
        this.fullName = 'Bouffalant exSIR SV11W';
    }
}
exports.BouffalantexSIR = BouffalantexSIR;
class HildaSIR extends hilda_1.Hilda {
    constructor() {
        super(...arguments);
        this.setNumber = '171';
        this.set = 'WHT';
        this.fullName = 'HildaSIR SV11W';
    }
}
exports.HildaSIR = HildaSIR;
class VictiniRRW extends victini_1.Victini {
    constructor() {
        super(...arguments);
        this.setNumber = '172';
        this.set = 'WHT';
        this.fullName = 'VictiniRRW SV11W';
    }
}
exports.VictiniRRW = VictiniRRW;
// SV11W White Rare
class ReshiramexWR extends reshiram_ex_1.Reshiramex {
    constructor() {
        super(...arguments);
        this.setNumber = '173';
        this.set = 'WHT';
        this.fullName = 'Reshiram exWR SV11W';
    }
}
exports.ReshiramexWR = ReshiramexWR;
