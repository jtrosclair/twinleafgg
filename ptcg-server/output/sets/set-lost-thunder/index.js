"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLostThunder = void 0;
const alolan_diglett_1 = require("./alolan-diglett");
const alolan_dugtrio_1 = require("./alolan-dugtrio");
const alolan_meowth_1 = require("./alolan-meowth");
const alolan_ninetales_gx_1 = require("./alolan-ninetales-gx");
const alolan_persian_1 = require("./alolan-persian");
const alolan_vulpix_1 = require("./alolan-vulpix");
const ampharos_1 = require("./ampharos");
const ariados_1 = require("./ariados");
const azumarill_1 = require("./azumarill");
const bayleef_1 = require("./bayleef");
const beartic_1 = require("./beartic");
const beautifly_1 = require("./beautifly");
const blacephalon_gx_1 = require("./blacephalon-gx");
const blissey_1 = require("./blissey");
const blitzle_1 = require("./blitzle");
const brionne_1 = require("./brionne");
const bruxish_1 = require("./bruxish");
const carbink_1 = require("./carbink");
const carbink_2_1 = require("./carbink-2");
const cascoon_1 = require("./cascoon");
const celebi_1 = require("./celebi");
const chandelure_1 = require("./chandelure");
const chansey_1 = require("./chansey");
const chikorita_1 = require("./chikorita");
const chikorita_2_1 = require("./chikorita-2");
const chinchou_1 = require("./chinchou");
const cobalion_1 = require("./cobalion");
const cofagrigus_1 = require("./cofagrigus");
const combee_1 = require("./combee");
const cubchoo_1 = require("./cubchoo");
const cutiefly_1 = require("./cutiefly");
const cyndaquil_1 = require("./cyndaquil");
const cyndaquil_2_1 = require("./cyndaquil-2");
const dedenne_1 = require("./dedenne");
const dedenne_2_1 = require("./dedenne-2");
const delibird_1 = require("./delibird");
const dialga_1 = require("./dialga");
const ditto_1 = require("./ditto");
const ditto_prism_star_1 = require("./ditto-prism-star");
const donphan_1 = require("./donphan");
const durant_1 = require("./durant");
const dustox_1 = require("./dustox");
const eevee_1 = require("./eevee");
const electabuzz_1 = require("./electabuzz");
const electivire_1 = require("./electivire");
const entei_1 = require("./entei");
const espeon_1 = require("./espeon");
const flaaffy_1 = require("./flaaffy");
const forretress_1 = require("./forretress");
const gardevoir_1 = require("./gardevoir");
const genesect_gx_1 = require("./genesect-gx");
const girafarig_1 = require("./girafarig");
const giratina_1 = require("./giratina");
const gogoat_1 = require("./gogoat");
const granbull_1 = require("./granbull");
const grovyle_1 = require("./grovyle");
const heatran_1 = require("./heatran");
const heracross_1 = require("./heracross");
const hitmontop_1 = require("./hitmontop");
const ho_oh_1 = require("./ho-oh");
const hoppip_1 = require("./hoppip");
const hoppip_2_1 = require("./hoppip-2");
const houndoom_1 = require("./houndoom");
const houndour_1 = require("./houndour");
const jigglypuff_1 = require("./jigglypuff");
const jumpluff_1 = require("./jumpluff");
const kecleon_1 = require("./kecleon");
const kecleon_2_1 = require("./kecleon-2");
const kirlia_1 = require("./kirlia");
const lampent_1 = require("./lampent");
const lanturn_1 = require("./lanturn");
const lapras_1 = require("./lapras");
const larvitar_1 = require("./larvitar");
const larvitar_2_1 = require("./larvitar-2");
const litleo_1 = require("./litleo");
const litwick_1 = require("./litwick");
const lugia_gx_1 = require("./lugia-gx");
const magcargo_gx_1 = require("./magcargo-gx");
const magearna_1 = require("./magearna");
const mantine_1 = require("./mantine");
const mareanie_1 = require("./mareanie");
const mareanie_2_1 = require("./mareanie-2");
const mareep_1 = require("./mareep");
const mareep_2_1 = require("./mareep-2");
const marill_1 = require("./marill");
const meganium_1 = require("./meganium");
const meloetta_1 = require("./meloetta");
const miltank_1 = require("./miltank");
const mimikyu_gx_1 = require("./mimikyu-gx");
const moltres_1 = require("./moltres");
const morelull_1 = require("./morelull");
const naganadel_1 = require("./naganadel");
const natu_1 = require("./natu");
const nihilego_1 = require("./nihilego");
const nincada_1 = require("./nincada");
const ninjask_1 = require("./ninjask");
const onix_1 = require("./onix");
const pachirisu_1 = require("./pachirisu");
const phanpy_1 = require("./phanpy");
const pikipek_1 = require("./pikipek");
const pikipek_2_1 = require("./pikipek-2");
const pineco_1 = require("./pineco");
const pinsir_1 = require("./pinsir");
const poipole_1 = require("./poipole");
const popplio_1 = require("./popplio");
const popplio_2_1 = require("./popplio-2");
const primarina_1 = require("./primarina");
const pupitar_1 = require("./pupitar");
const pyroar_1 = require("./pyroar");
const quilava_1 = require("./quilava");
const raikou_1 = require("./raikou");
const ralts_1 = require("./ralts");
const ribombee_1 = require("./ribombee");
const sableye_1 = require("./sableye");
const sceptile_gx_1 = require("./sceptile-gx");
const scizor_1 = require("./scizor");
const scyther_1 = require("./scyther");
const shaymin_1 = require("./shaymin");
const shedinja_1 = require("./shedinja");
const shiinotic_1 = require("./shiinotic");
const shuckle_1 = require("./shuckle");
const shuckle_gx_1 = require("./shuckle-gx");
const sigilyph_gx_1 = require("./sigilyph-gx");
const silcoon_1 = require("./silcoon");
const skiddo_1 = require("./skiddo");
const skiploom_1 = require("./skiploom");
const slowking_1 = require("./slowking");
const slowpoke_1 = require("./slowpoke");
const slugma_1 = require("./slugma");
const smeargle_1 = require("./smeargle");
const snubbull_1 = require("./snubbull");
const spinarak_1 = require("./spinarak");
const stantler_1 = require("./stantler");
const steelix_1 = require("./steelix");
const stunfisk_1 = require("./stunfisk");
const sudowoodo_1 = require("./sudowoodo");
const suicune_1 = require("./suicune");
const suicune_gx_1 = require("./suicune-gx");
const tangela_1 = require("./tangela");
const tangrowth_1 = require("./tangrowth");
const tapu_bulu_1 = require("./tapu-bulu");
const tapu_fini_1 = require("./tapu-fini");
const tapu_koko_1 = require("./tapu-koko");
const tapu_lele_1 = require("./tapu-lele");
const toucannon_1 = require("./toucannon");
const toxapex_1 = require("./toxapex");
const treecko_1 = require("./treecko");
const trumbeak_1 = require("./trumbeak");
const typhlosion_1 = require("./typhlosion");
const tyranitar_gx_1 = require("./tyranitar-gx");
const umbreon_1 = require("./umbreon");
const unown_1 = require("./unown");
const unown_2_1 = require("./unown-2");
const unown_3_1 = require("./unown-3");
const unown_damage_1 = require("./unown-damage");
const unown_hand_1 = require("./unown-hand");
const vespiquen_1 = require("./vespiquen");
const victini_1 = require("./victini");
const virizion_gx_1 = require("./virizion-gx");
const white_kyurem_1 = require("./white-kyurem");
const wigglytuff_1 = require("./wigglytuff");
const wobbuffet_1 = require("./wobbuffet");
const wurmple_1 = require("./wurmple");
const wurmple_2_1 = require("./wurmple-2");
const xatu_1 = require("./xatu");
const xerneas_1 = require("./xerneas");
const yamask_1 = require("./yamask");
const zebstrika_1 = require("./zebstrika");
const zeraora_gx_1 = require("./zeraora-gx");
const adventure_bag_1 = require("./adventure-bag");
const aether_foundation_employee_1 = require("./aether-foundation-employee");
const choice_helmet_1 = require("./choice-helmet");
const counter_gain_1 = require("./counter-gain");
const custom_catcher_1 = require("./custom-catcher");
const electropower_1 = require("./electropower");
const faba_1 = require("./faba");
const fairy_charm_dragon_1 = require("./fairy-charm-dragon");
const fairy_charm_fighting_1 = require("./fairy-charm-fighting");
const fairy_charm_grass_1 = require("./fairy-charm-grass");
const fairy_charm_psychic_1 = require("./fairy-charm-psychic");
const heat_factory_1 = require("./heat-factory");
const heat_factory_prism_star_1 = require("./heat-factory-prism-star");
const kahili_1 = require("./kahili");
const life_forest_1 = require("./life-forest");
const lost_blender_1 = require("./lost-blender");
const lusamine_1 = require("./lusamine");
const mina_1 = require("./mina");
const mixed_herbs_1 = require("./mixed-herbs");
const moomoo_milk_1 = require("./moomoo-milk");
const morty_1 = require("./morty");
const net_ball_1 = require("./net-ball");
const professor_elms_lecture_1 = require("./professor-elms-lecture");
const sightseer_1 = require("./sightseer");
const spell_tag_1 = require("./spell-tag");
const thunder_mountain_1 = require("./thunder-mountain");
const thunder_mountain_prism_star_1 = require("./thunder-mountain-prism-star");
const wait_and_see_hammer_1 = require("./wait-and-see-hammer");
const whitney_1 = require("./whitney");
const memory_energy_1 = require("./memory-energy");
const other_prints_1 = require("./other-prints");
exports.setLostThunder = [
    // Pokemon
    new alolan_diglett_1.AlolanDiglett(),
    new alolan_dugtrio_1.AlolanDugtrio(),
    new alolan_meowth_1.AlolanMeowth(),
    new alolan_ninetales_gx_1.AlolanNinetalesGX(),
    new alolan_persian_1.AlolanPersian(),
    new alolan_vulpix_1.AlolanVulpix(),
    new ampharos_1.Ampharos(),
    new ariados_1.Ariados(),
    new azumarill_1.Azumarill(),
    new bayleef_1.Bayleef(),
    new beartic_1.Beartic(),
    new beautifly_1.Beautifly(),
    new blacephalon_gx_1.BlacephalonGX(),
    new blissey_1.Blissey(),
    new blitzle_1.Blitzle(),
    new brionne_1.Brionne(),
    new bruxish_1.Bruxish(),
    new carbink_1.Carbink(),
    new carbink_2_1.Carbink2(),
    new cascoon_1.Cascoon(),
    new celebi_1.Celebi(),
    new chandelure_1.Chandelure(),
    new chansey_1.Chansey(),
    new chikorita_1.Chikorita(),
    new chikorita_2_1.Chikorita2(),
    new chinchou_1.Chinchou(),
    new cobalion_1.Cobalion(),
    new cofagrigus_1.Cofagrigus(),
    new combee_1.Combee(),
    new cubchoo_1.Cubchoo(),
    new cutiefly_1.Cutiefly(),
    new cyndaquil_1.Cyndaquil(),
    new cyndaquil_2_1.Cyndaquil2(),
    new dedenne_1.Dedenne(),
    new dedenne_2_1.Dedenne2(),
    new delibird_1.Delibird(),
    new dialga_1.Dialga(),
    new ditto_1.Ditto(),
    new ditto_prism_star_1.DittoPrismStar(),
    new donphan_1.Donphan(),
    new durant_1.Durant(),
    new dustox_1.Dustox(),
    new eevee_1.Eevee(),
    new electabuzz_1.Electabuzz(),
    new electivire_1.Electivire(),
    new entei_1.Entei(),
    new espeon_1.Espeon(),
    new flaaffy_1.Flaaffy(),
    new forretress_1.Forretress(),
    new gardevoir_1.Gardevoir(),
    new genesect_gx_1.GenesectGx(),
    new girafarig_1.Girafarig(),
    new giratina_1.Giratina(),
    new gogoat_1.Gogoat(),
    new granbull_1.Granbull(),
    new grovyle_1.Grovyle(),
    new heatran_1.Heatran(),
    new heracross_1.Heracross(),
    new hitmontop_1.Hitmontop(),
    new ho_oh_1.HoOh(),
    new hoppip_1.Hoppip(),
    new hoppip_2_1.Hoppip2(),
    new houndoom_1.Houndoom(),
    new houndour_1.Houndour(),
    new jigglypuff_1.Jigglypuff(),
    new jumpluff_1.Jumpluff(),
    new kecleon_1.Kecleon(),
    new kecleon_2_1.Kecleon2(),
    new kirlia_1.Kirlia(),
    new lampent_1.Lampent(),
    new lanturn_1.Lanturn(),
    new lapras_1.Lapras(),
    new larvitar_1.Larvitar(),
    new larvitar_2_1.Larvitar2(),
    new litleo_1.Litleo(),
    new litwick_1.Litwick(),
    new lugia_gx_1.LugiaGX(),
    new magcargo_gx_1.MagcargoGX(),
    new magearna_1.Magearna(),
    new mantine_1.Mantine(),
    new mareanie_1.Mareanie(),
    new mareanie_2_1.Mareanie2(),
    new mareep_1.Mareep(),
    new mareep_2_1.Mareep2(),
    new marill_1.Marill(),
    new meganium_1.Meganium(),
    new meloetta_1.Meloetta(),
    new miltank_1.Miltank(),
    new mimikyu_gx_1.MimikyuGX(),
    new moltres_1.Moltres(),
    new morelull_1.Morelull(),
    new naganadel_1.Naganadel(),
    new natu_1.Natu(),
    new nihilego_1.Nihilego(),
    new nincada_1.Nincada(),
    new ninjask_1.Ninjask(),
    new onix_1.Onix(),
    new pachirisu_1.Pachirisu(),
    new phanpy_1.Phanpy(),
    new pikipek_1.Pikipek(),
    new pikipek_2_1.Pikipek2(),
    new pineco_1.Pineco(),
    new pinsir_1.Pinsir(),
    new poipole_1.Poipole(),
    new popplio_1.Popplio(),
    new popplio_2_1.Popplio2(),
    new primarina_1.Primarina(),
    new pupitar_1.Pupitar(),
    new pyroar_1.Pyroar(),
    new quilava_1.Quilava(),
    new raikou_1.Raikou(),
    new ralts_1.Ralts(),
    new ribombee_1.Ribombee(),
    new sableye_1.Sableye(),
    new sceptile_gx_1.SceptileGx(),
    new scizor_1.Scizor(),
    new scyther_1.Scyther(),
    new shaymin_1.Shaymin(),
    new shedinja_1.Shedinja(),
    new shiinotic_1.Shiinotic(),
    new shuckle_1.Shuckle(),
    new shuckle_gx_1.ShuckleGX(),
    new sigilyph_gx_1.SigilyphGx(),
    new silcoon_1.Silcoon(),
    new skiddo_1.Skiddo(),
    new skiploom_1.Skiploom(),
    new slowking_1.Slowking(),
    new slowpoke_1.Slowpoke(),
    new slugma_1.Slugma(),
    new smeargle_1.Smeargle(),
    new snubbull_1.Snubbull(),
    new spinarak_1.Spinarak(),
    new stantler_1.Stantler(),
    new steelix_1.Steelix(),
    new stunfisk_1.Stunfisk(),
    new sudowoodo_1.Sudowoodo(),
    new suicune_1.Suicune(),
    new suicune_gx_1.SuicuneGx(),
    new tangela_1.Tangela(),
    new tangrowth_1.Tangrowth(),
    new tapu_bulu_1.TapuBulu(),
    new tapu_fini_1.TapuFini(),
    new tapu_koko_1.TapuKoko(),
    new tapu_lele_1.TapuLele(),
    new toucannon_1.Toucannon(),
    new toxapex_1.Toxapex(),
    new treecko_1.Treecko(),
    new trumbeak_1.Trumbeak(),
    new typhlosion_1.Typhlosion(),
    new tyranitar_gx_1.TyranitarGx(),
    new umbreon_1.Umbreon(),
    new unown_1.Unown(),
    new unown_2_1.Unown2(),
    new unown_3_1.Unown3(),
    new unown_damage_1.UnownDAMAGE(),
    new unown_hand_1.UnownHAND(),
    new vespiquen_1.Vespiquen(),
    new victini_1.Victini(),
    new virizion_gx_1.VirizionGx(),
    new white_kyurem_1.WhiteKyurem(),
    new wigglytuff_1.Wigglytuff(),
    new wobbuffet_1.Wobbuffet(),
    new wurmple_1.Wurmple(),
    new wurmple_2_1.Wurmple2(),
    new xatu_1.Xatu(),
    new xerneas_1.Xerneas(),
    new yamask_1.Yamask(),
    new zebstrika_1.Zebstrika(),
    new zeraora_gx_1.ZeraoraGX(),
    // Trainers
    new adventure_bag_1.AdventureBag(),
    new aether_foundation_employee_1.AetherFoundationEmployee(),
    new choice_helmet_1.ChoiceHelmet(),
    new counter_gain_1.CounterGain(),
    new custom_catcher_1.CustomCatcher(),
    new electropower_1.Electropower(),
    new faba_1.Faba(),
    new fairy_charm_dragon_1.FairyCharmDragon(),
    new fairy_charm_fighting_1.FairyCharmFighting(),
    new fairy_charm_grass_1.FairyCharmGrass(),
    new fairy_charm_psychic_1.FairyCharmPsychic(),
    new heat_factory_1.HeatFactory(),
    new heat_factory_prism_star_1.HeatFactoryPrismStar(),
    new kahili_1.Kahili(),
    new life_forest_1.LifeForest(),
    new lost_blender_1.LostBlender(),
    new lusamine_1.Lusamine(),
    new mina_1.Mina(),
    new mixed_herbs_1.MixedHerbs(),
    new moomoo_milk_1.MoomooMilk(),
    new morty_1.Morty(),
    new net_ball_1.NetBall(),
    new professor_elms_lecture_1.ProfessorElmLecture(),
    new sightseer_1.Sightseer(),
    new spell_tag_1.SpellTag(),
    new thunder_mountain_1.ThunderMountain(),
    new thunder_mountain_prism_star_1.ThunderMountainPrismStar(),
    new wait_and_see_hammer_1.WaitAndSeeHammer(),
    new whitney_1.Whitney(),
    // Energy
    new memory_energy_1.MemoryEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.ZeraoraGXLOT(),
    new other_prints_1.ShuckleGX2LOT(),
    new other_prints_1.MagcargoGX2LOT(),
    new other_prints_1.BlacephalonGX2LOT(),
    new other_prints_1.AlolanNinetalesGX2LOT(),
    new other_prints_1.MimikyuGX2LOT(),
    new other_prints_1.LugiaGX2LOT(),
    new other_prints_1.Faba2LOT(),
    new other_prints_1.JudgeULLOT(),
    new other_prints_1.Mina2LOT(),
    new other_prints_1.ProfessorElmLecture3LOT(),
    new other_prints_1.ShuckleGX3LOT(),
    new other_prints_1.MagcargoGX3LOT(),
    new other_prints_1.BlacephalonGX3LOT(),
    new other_prints_1.ZeraoraGX3LOT(),
    new other_prints_1.AlolanNinetalesGX3LOT(),
    new other_prints_1.MimikyuGX3LOT(),
    new other_prints_1.LugiaGX3LOT(),
    new other_prints_1.AdventureBag2LOT(),
    new other_prints_1.CounterGain2LOT(),
    new other_prints_1.CustomCatcher2LOT(),
    new other_prints_1.Electropower3LOT(),
    new other_prints_1.LostBlender2LOT(),
    new other_prints_1.NetBall3LOT(),
    new other_prints_1.SpellTag2LOT(),
    new other_prints_1.Electropower2LOT(),
    new other_prints_1.NetBall2LOT(),
    new other_prints_1.ProfessorElmLecture2LOT(),
    new other_prints_1.Sightseer2LOT(),
    new other_prints_1.SceptileGx2(),
    new other_prints_1.VirizionGx2(),
    new other_prints_1.SuicuneGx2(),
    new other_prints_1.ZeraoraGx2(),
    new other_prints_1.SigilyphGx2(),
    new other_prints_1.TyranitarGx2(),
    new other_prints_1.GenesectGx2(),
    new other_prints_1.Kahili2(),
    new other_prints_1.Morty2(),
    new other_prints_1.Whitney2(),
    new other_prints_1.SceptileGx3(),
    new other_prints_1.VirizionGx3(),
    new other_prints_1.SuicuneGx3(),
    new other_prints_1.SigilyphGx3(),
    new other_prints_1.TyranitarGx3(),
    new other_prints_1.GenesectGx3(),
    new other_prints_1.ChoiceHelmet2(),
    new other_prints_1.WaitAndSeeHammer2(),
];
