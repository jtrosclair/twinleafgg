"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setXY = void 0;
const aegislash_1 = require("./aegislash");
const aegislash_2_1 = require("./aegislash-2");
const arbok_1 = require("./arbok");
const aromatisse_1 = require("./aromatisse");
const beedrill_1 = require("./beedrill");
const bibarel_1 = require("./bibarel");
const bidoof_1 = require("./bidoof");
const bisharp_1 = require("./bisharp");
const blastoise_ex_1 = require("./blastoise-ex");
const braixen_1 = require("./braixen");
const bunnelby_1 = require("./bunnelby");
const chesnaught_1 = require("./chesnaught");
const chespin_1 = require("./chespin");
const cloyster_1 = require("./cloyster");
const conkeldurr_1 = require("./conkeldurr");
const corsola_1 = require("./corsola");
const delcatty_1 = require("./delcatty");
const delphox_1 = require("./delphox");
const diggersby_1 = require("./diggersby");
const diglett_1 = require("./diglett");
const dodrio_1 = require("./dodrio");
const doduo_1 = require("./doduo");
const doublade_1 = require("./doublade");
const dugtrio_1 = require("./dugtrio");
const dunsparce_1 = require("./dunsparce");
const ekans_1 = require("./ekans");
const electrode_1 = require("./electrode");
const emolga_ex_1 = require("./emolga-ex");
const fennekin_1 = require("./fennekin");
const fletchinder_1 = require("./fletchinder");
const fletchling_1 = require("./fletchling");
const froakie_1 = require("./froakie");
const frogadier_1 = require("./frogadier");
const furfrou_1 = require("./furfrou");
const gogoat_1 = require("./gogoat");
const gourgeist_1 = require("./gourgeist");
const greninja_1 = require("./greninja");
const grumpig_1 = require("./grumpig");
const gurdurr_1 = require("./gurdurr");
const herdier_1 = require("./herdier");
const honedge_1 = require("./honedge");
const illumise_1 = require("./illumise");
const inkay_1 = require("./inkay");
const inkay_2_1 = require("./inkay-2");
const jigglypuff_1 = require("./jigglypuff");
const jigglypuff_2_1 = require("./jigglypuff-2");
const kakuna_1 = require("./kakuna");
const krokorok_1 = require("./krokorok");
const krookodile_1 = require("./krookodile");
const lapras_1 = require("./lapras");
const ledian_1 = require("./ledian");
const ledyba_1 = require("./ledyba");
const lillipup_1 = require("./lillipup");
const lunatone_1 = require("./lunatone");
const m_blastoise_ex_1 = require("./m-blastoise-ex");
const m_venusaur_ex_1 = require("./m-venusaur-ex");
const magcargo_1 = require("./magcargo");
const malamar_1 = require("./malamar");
const malamar_2_1 = require("./malamar-2");
const mr_mime_1 = require("./mr-mime");
const panpour_1 = require("./panpour");
const pansage_1 = require("./pansage");
const pansear_1 = require("./pansear");
const pawniard_1 = require("./pawniard");
const phantump_1 = require("./phantump");
const pikachu_1 = require("./pikachu");
const pumpkaboo_1 = require("./pumpkaboo");
const quilladin_1 = require("./quilladin");
const raichu_1 = require("./raichu");
const rhydon_1 = require("./rhydon");
const rhyhorn_1 = require("./rhyhorn");
const rhyperior_1 = require("./rhyperior");
const sableye_1 = require("./sableye");
const sandile_1 = require("./sandile");
const scatterbug_1 = require("./scatterbug");
const scolipede_1 = require("./scolipede");
const shellder_1 = require("./shellder");
const simipour_1 = require("./simipour");
const simisage_1 = require("./simisage");
const simisear_1 = require("./simisear");
const skarmory_ex_1 = require("./skarmory-ex");
const skiddo_1 = require("./skiddo");
const skitty_1 = require("./skitty");
const slugma_1 = require("./slugma");
const slurpuff_1 = require("./slurpuff");
const solrock_1 = require("./solrock");
const spewpa_1 = require("./spewpa");
const spoink_1 = require("./spoink");
const spritzee_1 = require("./spritzee");
const starmie_1 = require("./starmie");
const staryu_1 = require("./staryu");
const stoutland_1 = require("./stoutland");
const swellow_1 = require("./swellow");
const swirlix_1 = require("./swirlix");
const taillow_1 = require("./taillow");
const talonflame_1 = require("./talonflame");
const tauros_1 = require("./tauros");
const timburr_1 = require("./timburr");
const trevenant_1 = require("./trevenant");
const venusaur_ex_1 = require("./venusaur-ex");
const vivillon_1 = require("./vivillon");
const volbeat_1 = require("./volbeat");
const voltorb_1 = require("./voltorb");
const weedle_1 = require("./weedle");
const whirlipede_1 = require("./whirlipede");
const wigglytuff_1 = require("./wigglytuff");
const wigglytuff_2_1 = require("./wigglytuff-2");
const xerneas_ex_1 = require("./xerneas-ex");
const yveltal_ex_1 = require("./yveltal-ex");
const zoroark_1 = require("./zoroark");
const zorua_1 = require("./zorua");
const cassius_1 = require("./cassius");
const evosoda_1 = require("./evosoda");
const fairy_garden_1 = require("./fairy-garden");
const hard_charm_1 = require("./hard-charm");
const muscle_band_1 = require("./muscle-band");
const professor_sycamore_1 = require("./professor-sycamore");
const professors_letter_1 = require("./professors-letter");
const roller_skates_1 = require("./roller-skates");
const shadow_circle_1 = require("./shadow-circle");
const shauna_1 = require("./shauna");
const super_potion_1 = require("./super-potion");
const basic_energies_1 = require("./basic-energies");
const double_colorless_energy_1 = require("./double-colorless-energy");
const other_prints_1 = require("./other-prints");
exports.setXY = [
    // Pokemon
    new aegislash_1.Aegislash(),
    new aegislash_2_1.Aegislash2(),
    new arbok_1.Arbok(),
    new aromatisse_1.Aromatisse(),
    new beedrill_1.Beedrill(),
    new bibarel_1.Bibarel(),
    new bidoof_1.Bidoof(),
    new bisharp_1.Bisharp(),
    new blastoise_ex_1.BlastoiseEx(),
    new braixen_1.Braixen(),
    new bunnelby_1.Bunnelby(),
    new chesnaught_1.Chesnaught(),
    new chespin_1.Chespin(),
    new cloyster_1.Cloyster(),
    new conkeldurr_1.Conkeldurr(),
    new corsola_1.Corsola(),
    new delcatty_1.Delcatty(),
    new delphox_1.Delphox(),
    new diggersby_1.Diggersby(),
    new diglett_1.Diglett(),
    new dodrio_1.Dodrio(),
    new doduo_1.Doduo(),
    new doublade_1.Doublade(),
    new dugtrio_1.Dugtrio(),
    new dunsparce_1.Dunsparce(),
    new ekans_1.Ekans(),
    new electrode_1.Electrode(),
    new emolga_ex_1.EmolgaEx(),
    new fennekin_1.Fennekin(),
    new fletchinder_1.Fletchinder(),
    new fletchling_1.Fletchling(),
    new froakie_1.Froakie(),
    new frogadier_1.Frogadier(),
    new furfrou_1.Furfrou(),
    new gogoat_1.Gogoat(),
    new gourgeist_1.Gourgeist(),
    new greninja_1.Greninja(),
    new grumpig_1.Grumpig(),
    new gurdurr_1.Gurdurr(),
    new herdier_1.Herdier(),
    new honedge_1.Honedge(),
    new illumise_1.Illumise(),
    new inkay_1.Inkay(),
    new inkay_2_1.Inkay2(),
    new jigglypuff_1.Jigglypuff(),
    new jigglypuff_2_1.Jigglypuff2(),
    new kakuna_1.Kakuna(),
    new krokorok_1.Krokorok(),
    new krookodile_1.Krookodile(),
    new lapras_1.Lapras(),
    new ledian_1.Ledian(),
    new ledyba_1.Ledyba(),
    new lillipup_1.Lillipup(),
    new lunatone_1.Lunatone(),
    new m_blastoise_ex_1.MBlastoiseEx(),
    new m_venusaur_ex_1.MVenusaurEX(),
    new magcargo_1.Magcargo(),
    new malamar_1.Malamar(),
    new malamar_2_1.Malamar2(),
    new mr_mime_1.MrMime(),
    new panpour_1.Panpour(),
    new pansage_1.Pansage(),
    new pansear_1.Pansear(),
    new pawniard_1.Pawniard(),
    new phantump_1.Phantump(),
    new pikachu_1.Pikachu(),
    new pumpkaboo_1.Pumpkaboo(),
    new quilladin_1.Quilladin(),
    new raichu_1.Raichu(),
    new rhydon_1.Rhydon(),
    new rhyhorn_1.Rhyhorn(),
    new rhyperior_1.Rhyperior(),
    new sableye_1.Sableye(),
    new sandile_1.Sandile(),
    new scatterbug_1.Scatterbug(),
    new scolipede_1.Scolipede(),
    new shellder_1.Shellder(),
    new simipour_1.Simipour(),
    new simisage_1.Simisage(),
    new simisear_1.Simisear(),
    new skarmory_ex_1.SkarmoryEx(),
    new skiddo_1.Skiddo(),
    new skitty_1.Skitty(),
    new slugma_1.Slugma(),
    new slurpuff_1.Slurpuff(),
    new solrock_1.Solrock(),
    new spewpa_1.Spewpa(),
    new spoink_1.Spoink(),
    new spritzee_1.Spritzee(),
    new starmie_1.Starmie(),
    new staryu_1.Staryu(),
    new stoutland_1.Stoutland(),
    new swellow_1.Swellow(),
    new swirlix_1.Swirlix(),
    new taillow_1.Taillow(),
    new talonflame_1.Talonflame(),
    new tauros_1.Tauros(),
    new timburr_1.Timburr(),
    new trevenant_1.Trevenant(),
    new venusaur_ex_1.VenusaurEx(),
    new vivillon_1.Vivillon(),
    new volbeat_1.Volbeat(),
    new voltorb_1.Voltorb(),
    new weedle_1.Weedle(),
    new whirlipede_1.Whirlipede(),
    new wigglytuff_1.Wigglytuff(),
    new wigglytuff_2_1.Wigglytuff2(),
    new xerneas_ex_1.XerneasEX(),
    new yveltal_ex_1.YveltalEx(),
    new zoroark_1.Zoroark(),
    new zorua_1.Zorua(),
    // Trainers
    new cassius_1.Cassius(),
    new evosoda_1.Evosoda(),
    new fairy_garden_1.FairyGarden(),
    new hard_charm_1.HardCharm(),
    new muscle_band_1.MuscleBand(),
    new professor_sycamore_1.ProfessorSycamore(),
    new professors_letter_1.ProfessorsLetter(),
    new roller_skates_1.RollerSkates(),
    new shadow_circle_1.ShadowCircle(),
    new shauna_1.Shauna(),
    new super_potion_1.SuperPotion(),
    // Energy
    new basic_energies_1.GrassEnergy(),
    new double_colorless_energy_1.DoubleColorlessEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.ProfessorSycamoreXY(),
    new other_prints_1.YveltalXY(),
    new other_prints_1.XerneasXY(),
    new other_prints_1.GreatBallXY(),
    new other_prints_1.MaxReviveXY(),
    new other_prints_1.RedCardXY(),
    new other_prints_1.TeamFlareGruntXY(),
    new other_prints_1.RainbowEnergyPLXY(),
    new other_prints_1.YveltalEx2XY(),
    new other_prints_1.XerneasEX2XY(),
    new other_prints_1.VenipedeXY(),
    new other_prints_1.VenusaurEx2(),
    new other_prints_1.BlastoiseEx2(),
    new other_prints_1.EmolgaEx2(),
    new other_prints_1.SkarmoryEx2(),
];
