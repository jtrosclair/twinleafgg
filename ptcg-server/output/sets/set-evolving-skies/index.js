"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEvolvingSkies = void 0;
const altaria_1 = require("./altaria");
const ampharos_1 = require("./ampharos");
const appletun_1 = require("./appletun");
const applin_1 = require("./applin");
const arctovish_v_1 = require("./arctovish-v");
const avalugg_1 = require("./avalugg");
const bagon_1 = require("./bagon");
const bergmite_1 = require("./bergmite");
const boldore_1 = require("./boldore");
const braviary_1 = require("./braviary");
const carvanha_1 = require("./carvanha");
const chinchou_1 = require("./chinchou");
const crustle_1 = require("./crustle");
const cryogonal_1 = require("./cryogonal");
const cutiefly_1 = require("./cutiefly");
const deino_1 = require("./deino");
const dialga_1 = require("./dialga");
const dracozolt_v_1 = require("./dracozolt-v");
const dracozolt_vmax_1 = require("./dracozolt-vmax");
const dragonite_v_1 = require("./dragonite-v");
const drampa_1 = require("./drampa");
const drowzee_1 = require("./drowzee");
const duraludon_v_1 = require("./duraludon-v");
const duraludon_vmax_1 = require("./duraludon-vmax");
const dwebble_1 = require("./dwebble");
const eevee_1 = require("./eevee");
const eiscue_1 = require("./eiscue");
const eldegoss_1 = require("./eldegoss");
const emolga_1 = require("./emolga");
const entei_1 = require("./entei");
const espeon_v_1 = require("./espeon-v");
const espeon_vmax_1 = require("./espeon-vmax");
const feebas_1 = require("./feebas");
const flaaffy_1 = require("./flaaffy");
const flabebe_1 = require("./flabebe");
const flapple_1 = require("./flapple");
const flareon_v_1 = require("./flareon-v");
const flareon_vmax_1 = require("./flareon-vmax");
const fletchinder_1 = require("./fletchinder");
const fletchling_1 = require("./fletchling");
const floette_1 = require("./floette");
const florges_1 = require("./florges");
const froslass_1 = require("./froslass");
const full_art_1 = require("./full-art");
const galarian_zapdos_1 = require("./galarian_zapdos");
const galarian_articuno_1 = require("./galarian-articuno");
const galarian_moltres_1 = require("./galarian-moltres");
const garbodor_v_1 = require("./garbodor-v");
const garbodor_vmax_1 = require("./garbodor-vmax");
const gigalith_1 = require("./gigalith");
const glaceon_v_1 = require("./glaceon-v");
const glaceon_vmax_1 = require("./glaceon-vmax");
const golduck_1 = require("./golduck");
const golurk_v_1 = require("./golurk-v");
const gossifleur_1 = require("./gossifleur");
const gourgeist_1 = require("./gourgeist");
const gyarados_v_1 = require("./gyarados-v");
const gyarados_vmax_1 = require("./gyarados-vmax");
const herdier_1 = require("./herdier");
const hippopotas_1 = require("./hippopotas");
const hippowdon_1 = require("./hippowdon");
const hitmonchan_1 = require("./hitmonchan");
const hoppip_1 = require("./hoppip");
const hydreigon_1 = require("./hydreigon");
const hypno_1 = require("./hypno");
const inteleon_1 = require("./inteleon");
const jolteon_v_1 = require("./jolteon-v");
const jolteon_vmax_1 = require("./jolteon-vmax");
const jumpluff_1 = require("./jumpluff");
const kyurem_1 = require("./kyurem");
const lanturn_1 = require("./lanturn");
const leafeon_v_1 = require("./leafeon-v");
const leafeon_vmax_1 = require("./leafeon-vmax");
const lilligant_1 = require("./lilligant");
const lillipup_1 = require("./lillipup");
const litleo_1 = require("./litleo");
const lombre_1 = require("./lombre");
const lotad_1 = require("./lotad");
const ludicolo_1 = require("./ludicolo");
const luvdisc_1 = require("./luvdisc");
const lycanroc_v_1 = require("./lycanroc-v");
const lycanroc_vmax_1 = require("./lycanroc-vmax");
const mareep_1 = require("./mareep");
const marshadow_1 = require("./marshadow");
const medicham_v_1 = require("./medicham-v");
const milotic_1 = require("./milotic");
const nickit_1 = require("./nickit");
const noivern_v_1 = require("./noivern-v");
const nuzleaf_1 = require("./nuzleaf");
const palpitoad_1 = require("./palpitoad");
const petilil_1 = require("./petilil");
const pikachu_1 = require("./pikachu");
const pinsir_1 = require("./pinsir");
const psyduck_1 = require("./psyduck");
const pumpkaboo_1 = require("./pumpkaboo");
const pyroar_1 = require("./pyroar");
const raichu_1 = require("./raichu");
const rayquaza_v_1 = require("./rayquaza-v");
const rayquaza_vmax_1 = require("./rayquaza-vmax");
const regidrago_1 = require("./regidrago");
const regieleki_1 = require("./regieleki");
const ribombee_1 = require("./ribombee");
const roggenrola_1 = require("./roggenrola");
const rufflet_1 = require("./rufflet");
const sableye_1 = require("./sableye");
const salamence_1 = require("./salamence");
const scrafty_1 = require("./scrafty");
const scraggy_1 = require("./scraggy");
const seedot_1 = require("./seedot");
const seismitoad_1 = require("./seismitoad");
const sharpedo_1 = require("./sharpedo");
const shelgon_1 = require("./shelgon");
const shiftry_1 = require("./shiftry");
const skiploom_1 = require("./skiploom");
const slaking_1 = require("./slaking");
const smeargle_1 = require("./smeargle");
const stoutland_1 = require("./stoutland");
const suicune_v_1 = require("./suicune-v");
const swablu_1 = require("./swablu");
const swoobat_1 = require("./swoobat");
const sylveon_v_1 = require("./sylveon-v");
const sylveon_vmax_1 = require("./sylveon-vmax");
const talonflame_1 = require("./talonflame");
const teddiursa_1 = require("./teddiursa");
const tentacool_1 = require("./tentacool");
const tentacruel_1 = require("./tentacruel");
const thievul_1 = require("./thievul");
const trevenant_v_1 = require("./trevenant-v");
const trevenant_vmax_1 = require("./trevenant-vmax");
const tropius_1 = require("./tropius");
const tympole_1 = require("./tympole");
const umbreon_v_1 = require("./umbreon-v");
const umbreon_vmax_1 = require("./umbreon-vmax");
const ursaring_1 = require("./ursaring");
const vaporeon_v_1 = require("./vaporeon-v");
const vaporeon_vmax_1 = require("./vaporeon-vmax");
const victini_1 = require("./victini");
const vigoroth_1 = require("./vigoroth");
const volcarona_v_1 = require("./volcarona-v");
const wishiwashi_1 = require("./wishiwashi");
const wobbuffet_1 = require("./wobbuffet");
const woobat_1 = require("./woobat");
const zoroark_1 = require("./zoroark");
const zorua_1 = require("./zorua");
const zweilous_1 = require("./zweilous");
const zygarde_1 = require("./zygarde");
const aroma_lady_1 = require("./aroma-lady");
const boost_shake_1 = require("./boost-shake");
const copycat_1 = require("./copycat");
const crystal_cave_1 = require("./crystal-cave");
const digging_gloves_1 = require("./digging-gloves");
const dream_ball_1 = require("./dream-ball");
const elemental_badge_1 = require("./elemental-badge");
const full_face_guard_1 = require("./full-face-guard");
const gordie_1 = require("./gordie");
const lucky_ice_pop_1 = require("./lucky-ice-pop");
const moon_and_sun_badge_1 = require("./moon-and-sun-badge");
const raihan_1 = require("./raihan");
const rapid_strike_scroll_of_the_flying_dragon_1 = require("./rapid-strike-scroll-of-the-flying-dragon");
const rescue_carrier_1 = require("./rescue-carrier");
const ribbon_badge_1 = require("./ribbon-badge");
const rubber_gloves_1 = require("./rubber-gloves");
const shopping_center_1 = require("./shopping-center");
const single_strike_scroll_of_the_fanged_dragon_1 = require("./single-strike-scroll-of-the-fanged-dragon");
const snow_leaf_badge_1 = require("./snow-leaf-badge");
const spirit_mask_1 = require("./spirit-mask");
const stormy_mountains_1 = require("./stormy-mountains");
const switching_cups_1 = require("./switching-cups");
const toy_catcher_1 = require("./toy-catcher");
const zinnias_resolve_1 = require("./zinnias-resolve");
const treasure_energy_1 = require("./treasure-energy");
const other_prints_1 = require("./other-prints");
exports.setEvolvingSkies = [
    // Pokemon
    new altaria_1.Altaria(),
    new ampharos_1.Ampharos(),
    new appletun_1.Appletun(),
    new applin_1.Applin(),
    new arctovish_v_1.ArctovishV(),
    new avalugg_1.Avalugg(),
    new bagon_1.Bagon(),
    new bergmite_1.Bergmite(),
    new boldore_1.Boldore(),
    new braviary_1.Braviary(),
    new carvanha_1.Carvanha(),
    new chinchou_1.Chinchou(),
    new crustle_1.Crustle(),
    new cryogonal_1.Cryogonal(),
    new cutiefly_1.Cutiefly(),
    new deino_1.Deino(),
    new dialga_1.Dialga(),
    new dracozolt_v_1.DracozoltV(),
    new dracozolt_vmax_1.DracozoltVmax(),
    new dragonite_v_1.DragoniteV(),
    new drampa_1.Drampa(),
    new drowzee_1.Drowzee(),
    new duraludon_v_1.DuraludonV(),
    new duraludon_vmax_1.DuraludonVMAX(),
    new dwebble_1.Dwebble(),
    new eevee_1.Eevee(),
    new eiscue_1.Eiscue(),
    new eldegoss_1.Eldegoss(),
    new emolga_1.Emolga(),
    new entei_1.Entei(),
    new espeon_v_1.EspeonV(),
    new espeon_vmax_1.EspeonVMAX(),
    new feebas_1.Feebas(),
    new flaaffy_1.Flaaffy(),
    new flabebe_1.Flabebe(),
    new flapple_1.Flapple(),
    new flareon_v_1.FlareonV(),
    new flareon_vmax_1.FlareonVmax(),
    new fletchinder_1.Fletchinder(),
    new fletchling_1.Fletchling(),
    new floette_1.Floette(),
    new florges_1.Florges(),
    new froslass_1.Froslass(),
    new full_art_1.RayquazaVAA(),
    new galarian_zapdos_1.GalarianZapdos(),
    new galarian_articuno_1.GalarianArticuno(),
    new galarian_moltres_1.GalarianMoltres(),
    new garbodor_v_1.GarbodorV(),
    new garbodor_vmax_1.GarbodorVmax(),
    new gigalith_1.Gigalith(),
    new glaceon_v_1.GlaceonV(),
    new glaceon_vmax_1.GlaceonVmax(),
    new golduck_1.Golduck(),
    new golurk_v_1.GolurkV(),
    new gossifleur_1.Gossifleur(),
    new gourgeist_1.Gourgeist(),
    new gyarados_v_1.GyaradosV(),
    new gyarados_vmax_1.GyaradosVMAX(),
    new herdier_1.Herdier(),
    new hippopotas_1.Hippopotas(),
    new hippowdon_1.Hippowdon(),
    new hitmonchan_1.Hitmonchan(),
    new hoppip_1.Hoppip(),
    new hydreigon_1.Hydreigon(),
    new hypno_1.Hypno(),
    new inteleon_1.Inteleon(),
    new jolteon_v_1.JolteonV(),
    new jolteon_vmax_1.JolteonVmax(),
    new jumpluff_1.Jumpluff(),
    new kyurem_1.Kyurem(),
    new lanturn_1.Lanturn(),
    new leafeon_v_1.LeafeonV(),
    new leafeon_vmax_1.LeafeonVMAX(),
    new lilligant_1.Lilligant(),
    new lillipup_1.Lillipup(),
    new litleo_1.Litleo(),
    new lombre_1.Lombre(),
    new lotad_1.Lotad(),
    new ludicolo_1.Ludicolo(),
    new luvdisc_1.Luvdisc(),
    new lycanroc_v_1.LycanrocV(),
    new lycanroc_vmax_1.LycanrocVmax(),
    new mareep_1.Mareep(),
    new marshadow_1.Marshadow(),
    new medicham_v_1.MedichamV(),
    new milotic_1.Milotic(),
    new nickit_1.Nickit(),
    new noivern_v_1.NoivernV(),
    new nuzleaf_1.Nuzleaf(),
    new palpitoad_1.Palpitoad(),
    new petilil_1.Petilil(),
    new pikachu_1.Pikachu(),
    new pinsir_1.Pinsir(),
    new psyduck_1.Psyduck(),
    new pumpkaboo_1.Pumpkaboo(),
    new pyroar_1.Pyroar(),
    new raichu_1.Raichu(),
    new rayquaza_v_1.RayquazaV(),
    new rayquaza_vmax_1.RayquazaVMAX(),
    new regidrago_1.Regidrago(),
    new regieleki_1.Regieleki(),
    new ribombee_1.Ribombee(),
    new roggenrola_1.Roggenrola(),
    new rufflet_1.Rufflet(),
    new sableye_1.Sableye(),
    new salamence_1.Salamence(),
    new scrafty_1.Scrafty(),
    new scraggy_1.Scraggy(),
    new seedot_1.Seedot(),
    new seismitoad_1.Seismitoad(),
    new sharpedo_1.Sharpedo(),
    new shelgon_1.Shelgon(),
    new shiftry_1.Shiftry(),
    new skiploom_1.Skiploom(),
    new slaking_1.Slaking(),
    new smeargle_1.Smeargle(),
    new stoutland_1.Stoutland(),
    new suicune_v_1.SuicuneV(),
    new swablu_1.Swablu(),
    new swoobat_1.Swoobat(),
    new sylveon_v_1.SylveonV(),
    new sylveon_vmax_1.SylveonVMAX(),
    new talonflame_1.Talonflame(),
    new teddiursa_1.Teddiursa(),
    new tentacool_1.Tentacool(),
    new tentacruel_1.Tentacruel(),
    new thievul_1.Thievul(),
    new trevenant_v_1.TrevenantV(),
    new trevenant_vmax_1.TrevenantVmax(),
    new tropius_1.Tropius(),
    new tympole_1.Tympole(),
    new umbreon_v_1.UmbreonV(),
    new umbreon_vmax_1.UmbreonVMAX(),
    new ursaring_1.Ursaring(),
    new vaporeon_v_1.VaporeonV(),
    new vaporeon_vmax_1.VaporeonVmax(),
    new victini_1.Victini(),
    new vigoroth_1.Vigoroth(),
    new volcarona_v_1.VolcaronaV(),
    new wishiwashi_1.Wishiwashi(),
    new wobbuffet_1.Wobbuffet(),
    new woobat_1.Woobat(),
    new zoroark_1.Zoroark(),
    new zorua_1.Zorua(),
    new zweilous_1.Zweilous(),
    new zygarde_1.Zygarde(),
    // Trainers
    new aroma_lady_1.AromaLady(),
    new boost_shake_1.BoostShake(),
    new copycat_1.Copycat(),
    new crystal_cave_1.CrystalCave(),
    new digging_gloves_1.DiggingGloves(),
    new dream_ball_1.DreamBall(),
    new elemental_badge_1.ElementalBadge(),
    new full_face_guard_1.FullFaceGuard(),
    new gordie_1.Gordie(),
    new lucky_ice_pop_1.LuckyIcePop(),
    new moon_and_sun_badge_1.MoonAndSunBadge(),
    new raihan_1.Raihan(),
    new rapid_strike_scroll_of_the_flying_dragon_1.RapidStrikeScrollOfTheFlyingDragon(),
    new rescue_carrier_1.RescueCarrier(),
    new ribbon_badge_1.RibbonBadge(),
    new rubber_gloves_1.RubberGloves(),
    new shopping_center_1.ShoppingCenter(),
    new single_strike_scroll_of_the_fanged_dragon_1.SingleStrikeScrollOfTheFangedDragon(),
    new snow_leaf_badge_1.SnowLeafBadge(),
    new spirit_mask_1.SpiritMask(),
    new stormy_mountains_1.StormyMountains(),
    new switching_cups_1.SwitchingCups(),
    new toy_catcher_1.ToyCatcher(),
    new zinnias_resolve_1.ZinniasResolve(),
    // Energy
    new treasure_energy_1.TreasureEnergy(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.SlakothEVS(),
    new other_prints_1.LeafeonV2(),
    new other_prints_1.LeafeonV3(),
    new other_prints_1.TrevenantV2(),
    new other_prints_1.VolcaronaV2(),
    new other_prints_1.GyaradosV2(),
    new other_prints_1.SuicuneV2(),
    new other_prints_1.GlaceonV2(),
    new other_prints_1.GlaceonV3(),
    new other_prints_1.ArctovishV2(),
    new other_prints_1.DracozoltV2(),
    new other_prints_1.EspeonV2(),
    new other_prints_1.EspeonV3(),
    new other_prints_1.GolurkV2(),
    new other_prints_1.GolurkV3(),
    new other_prints_1.SylveonV2(),
    new other_prints_1.SylveonV3(),
    new other_prints_1.MedichamV2(),
    new other_prints_1.MedichamV3(),
    new other_prints_1.LycanrocV2(),
    new other_prints_1.UmbreonV2(),
    new other_prints_1.UmbreonV3(),
    new other_prints_1.GarbodorV2(),
    new other_prints_1.DragoniteV2(),
    new other_prints_1.RayquazaV2(),
    new other_prints_1.NoivernV2(),
    new other_prints_1.NoivernV3(),
    new other_prints_1.DuraludonV2(),
    new other_prints_1.DuraludonV3(),
    new other_prints_1.AromaLady2(),
    new other_prints_1.Copycat2(),
    new other_prints_1.Gordie2(),
    new other_prints_1.Raihan2(),
    new other_prints_1.ZinniasResolve2(),
    new other_prints_1.LeafeonVmax2(),
    new other_prints_1.LeafeonVmax3(),
    new other_prints_1.TrevenantVmax2(),
    new other_prints_1.GyaradosVmax2(),
    new other_prints_1.GlaceonVmax2(),
    new other_prints_1.GlaceonVmax3(),
    new other_prints_1.DracozoltVmax2(),
    new other_prints_1.SylveonVmax2(),
    new other_prints_1.SylveonVmax3(),
    new other_prints_1.LycanrocVmax2(),
    new other_prints_1.UmbreonVmax2(),
    new other_prints_1.UmbreonVmax3(),
    new other_prints_1.GarbodorVmax2(),
    new other_prints_1.RayquazaVmax2(),
    new other_prints_1.RayquazaVmax3(),
    new other_prints_1.DuraludonVmax2(),
    new other_prints_1.DuraludonVmax3(),
    new other_prints_1.AromaLady3(),
    new other_prints_1.Copycat3(),
    new other_prints_1.Gordie3(),
    new other_prints_1.Raihan3(),
    new other_prints_1.ZinniasResolve3(),
    new other_prints_1.CresseliaEVS(),
    new other_prints_1.BoostShake2(),
    new other_prints_1.CrystalCave2(),
    new other_prints_1.FullFaceGuard2(),
    new other_prints_1.StormyMountains2(),
    new other_prints_1.ToyCatcher2(),
    new other_prints_1.TurffieldStadiumEVS(),
];
