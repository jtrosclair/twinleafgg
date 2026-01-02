"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDestinedRivals = void 0;
const other_prints_1 = require("./other-prints");
const ethans_adventure_1 = require("./ethans-adventure");
const ethans_cyndaquil_1 = require("./ethans-cyndaquil");
const ethans_ho_oh_ex_1 = require("./ethans-ho-oh-ex");
const ethans_magcargo_1 = require("./ethans-magcargo");
const ethans_pichu_1 = require("./ethans-pichu");
const ethans_quilava_1 = require("./ethans-quilava");
const ethans_slugma_1 = require("./ethans-slugma");
const ethans_typhlosion_1 = require("./ethans-typhlosion");
const mistys_gyarados_1 = require("./mistys-gyarados");
const mistys_magikarp_1 = require("./mistys-magikarp");
const mistys_psyduck_1 = require("./mistys-psyduck");
const other_prints_2 = require("./other-prints");
const cynthias_garchomp_ex_1 = require("./cynthias-garchomp-ex");
const cynthias_gible_1 = require("./cynthias-gible");
const cynthias_roserade_1 = require("./cynthias-roserade");
const cynthias_roselia_1 = require("./cynthias-roselia");
const cynthias_gabite_1 = require("./cynthias-gabite");
const cynthias_spiritomb_1 = require("./cynthias-spiritomb");
const cynthias_power_weight_1 = require("./cynthias-power-weight");
const rotom_1 = require("./rotom");
const mow_rotom_1 = require("./mow-rotom");
const wash_rotom_1 = require("./wash-rotom");
const heat_rotom_1 = require("./heat-rotom");
const zeraora_1 = require("./zeraora");
const teal_mask_ogerpon_1 = require("./teal-mask-ogerpon");
const hearthflame_mask_ogerpon_1 = require("./hearthflame-mask-ogerpon");
const wellspring_mask_ogerpon_1 = require("./wellspring-mask-ogerpon");
const cornerstone_mask_ogerpon_1 = require("./cornerstone-mask-ogerpon");
const ponyta_1 = require("./ponyta");
const rapidash_1 = require("./rapidash");
const shaymin_1 = require("./shaymin");
const mistys_staryu_1 = require("./mistys-staryu");
const applin_1 = require("./applin");
const dipplin_1 = require("./dipplin");
const hydrapple_1 = require("./hydrapple");
const dwebble_1 = require("./dwebble");
const crustle_1 = require("./crustle");
const mcs_hype_up_1 = require("./mcs-hype-up");
const mistys_starmie_1 = require("./mistys-starmie");
const cynthias_feebas_1 = require("./cynthias-feebas");
const cynthias_milotic_1 = require("./cynthias-milotic");
const mistys_lapras_1 = require("./mistys-lapras");
const yanma_1 = require("./yanma");
const yanmega_ex_1 = require("./yanmega-ex");
const dondozo_ex_1 = require("./dondozo-ex");
const electabuzz_1 = require("./electabuzz");
const electivire_ex_1 = require("./electivire-ex");
const sacred_ash_1 = require("./sacred-ash");
const ethans_pinsir_1 = require("./ethans-pinsir");
const arvens_toedscool_1 = require("./arvens-toedscool");
const arvens_toedscruel_1 = require("./arvens-toedscruel");
const arvens_maschiff_1 = require("./arvens-maschiff");
const arvens_mabosstiff_ex_1 = require("./arvens-mabosstiff-ex");
const arvens_skwovet_1 = require("./arvens-skwovet");
const arvens_greedent_1 = require("./arvens-greedent");
const arvens_sandwich_1 = require("./arvens-sandwich");
const annihilape_1 = require("./annihilape");
const arboliva_ex_1 = require("./arboliva-ex");
const blaziken_1 = require("./blaziken");
const cetitan_ex_1 = require("./cetitan-ex");
const cetoddle_1 = require("./cetoddle");
const clamperl_1 = require("./clamperl");
const combusken_1 = require("./combusken");
const dolliv_1 = require("./dolliv");
const gorebyss_1 = require("./gorebyss");
const granite_cave_1 = require("./granite-cave");
const huntail_1 = require("./huntail");
const mankey_1 = require("./mankey");
const marnies_grimmsnarl_ex_1 = require("./marnies-grimmsnarl-ex");
const marnies_impidimp_1 = require("./marnies-impidimp");
const marnies_liepard_1 = require("./marnies-liepard");
const marnies_morgrem_1 = require("./marnies-morgrem");
const marnies_morpeko_1 = require("./marnies-morpeko");
const marnies_purrloin_1 = require("./marnies-purrloin");
const marnies_scrafty_1 = require("./marnies-scrafty");
const marnies_scraggy_1 = require("./marnies-scraggy");
const primeape_1 = require("./primeape");
const regirock_ex_1 = require("./regirock-ex");
const smoliv_1 = require("./smoliv");
const spikemuth_gym_1 = require("./spikemuth-gym");
const stevens_baltoy_1 = require("./stevens-baltoy");
const stevens_beldum_1 = require("./stevens-beldum");
const stevens_carbink_1 = require("./stevens-carbink");
const stevens_claydol_1 = require("./stevens-claydol");
const stevens_metagross_ex_1 = require("./stevens-metagross-ex");
const stevens_metang_1 = require("./stevens-metang");
const stevens_skarmory_1 = require("./stevens-skarmory");
const taillow_1 = require("./taillow");
const team_rockets_energy_1 = require("./team-rockets-energy");
const team_rockets_ampharos_1 = require("./team-rockets-ampharos");
const team_rockets_arbok_1 = require("./team-rockets-arbok");
const team_rockets_archer_1 = require("./team-rockets-archer");
const team_rockets_ariana_1 = require("./team-rockets-ariana");
const team_rockets_articuno_1 = require("./team-rockets-articuno");
const team_rockets_chingling_1 = require("./team-rockets-chingling");
const team_rockets_crobat_ex_1 = require("./team-rockets-crobat-ex");
const team_rockets_drowzee_1 = require("./team-rockets-drowzee");
const team_rockets_ekans_1 = require("./team-rockets-ekans");
const team_rockets_factory_1 = require("./team-rockets-factory");
const team_rockets_flaaffy_1 = require("./team-rockets-flaaffy");
const team_rockets_giovanni_1 = require("./team-rockets-giovanni");
const team_rockets_golbat_1 = require("./team-rockets-golbat");
const team_rockets_great_ball_1 = require("./team-rockets-great-ball");
const team_rockets_hypno_1 = require("./team-rockets-hypno");
const team_rockets_koffing_1 = require("./team-rockets-koffing");
const team_rockets_larvitar_1 = require("./team-rockets-larvitar");
const team_rockets_mareep_1 = require("./team-rockets-mareep");
const team_rockets_meowth_1 = require("./team-rockets-meowth");
const team_rockets_mewtwo_ex_1 = require("./team-rockets-mewtwo-ex");
const team_rockets_mimikyu_1 = require("./team-rockets-mimikyu");
const team_rockets_moltres_ex_1 = require("./team-rockets-moltres-ex");
const team_rockets_murkrow_1 = require("./team-rockets-murkrow");
const team_rockets_nidoking_ex_1 = require("./team-rockets-nidoking-ex");
const team_rockets_nidoqueen_1 = require("./team-rockets-nidoqueen");
const team_rockets_nidoran_female_1 = require("./team-rockets-nidoran-female");
const team_rockets_nidoran_male_1 = require("./team-rockets-nidoran-male");
const team_rockets_nidorina_1 = require("./team-rockets-nidorina");
const team_rockets_nidorino_1 = require("./team-rockets-nidorino");
const team_rockets_persian_ex_1 = require("./team-rockets-persian-ex");
const team_rockets_petrel_1 = require("./team-rockets-petrel");
const team_rockets_porygon_1 = require("./team-rockets-porygon");
const team_rockets_porygon_z_1 = require("./team-rockets-porygon-z");
const team_rockets_porygon2_1 = require("./team-rockets-porygon2");
const team_rockets_proton_1 = require("./team-rockets-proton");
const team_rockets_pupitar_1 = require("./team-rockets-pupitar");
const team_rockets_transceiver_1 = require("./team-rockets-transceiver");
const team_rockets_sneasel_1 = require("./team-rockets-sneasel");
const team_rockets_spidops_1 = require("./team-rockets-spidops");
const team_rockets_tarountula_1 = require("./team-rockets-tarountula");
const team_rockets_tyranitar_1 = require("./team-rockets-tyranitar");
const team_rockets_venture_bomb_1 = require("./team-rockets-venture-bomb");
const team_rockets_watchtower_1 = require("./team-rockets-watchtower");
const team_rockets_weezing_1 = require("./team-rockets-weezing");
const team_rockets_wobbuffet_1 = require("./team-rockets-wobbuffet");
const team_rockets_zapdos_1 = require("./team-rockets-zapdos");
const team_rockets_zubat_1 = require("./team-rockets-zubat");
const torchic_1 = require("./torchic");
const tm_machine_1 = require("./tm-machine");
exports.setDestinedRivals = [
    new taillow_1.Taillow(),
    new teal_mask_ogerpon_1.TealMaskOgerpon(),
    new hearthflame_mask_ogerpon_1.HearthflameMaskOgerpon(),
    new wellspring_mask_ogerpon_1.WellspringMaskOgerpon(),
    new rotom_1.Rotom(),
    new mow_rotom_1.MowRotom(),
    new wash_rotom_1.WashRotom(),
    new heat_rotom_1.HeatRotom(),
    new zeraora_1.Zeraora(),
    new cornerstone_mask_ogerpon_1.CornerstoneMaskOgerpon(),
    new ponyta_1.Ponyta(),
    new rapidash_1.Rapidash(),
    new shaymin_1.Shaymin(),
    new applin_1.Applin(),
    new dipplin_1.Dipplin(),
    new hydrapple_1.Hydrapple(),
    new dwebble_1.Dwebble(),
    new crustle_1.Crustle(),
    new mcs_hype_up_1.EmceesHype(),
    new yanma_1.Yanma(),
    new yanmega_ex_1.Yanmegaex(),
    new dondozo_ex_1.Dondozoex(),
    new electabuzz_1.Electabuzz(),
    new electivire_ex_1.Electivireex(),
    new sacred_ash_1.SacredAsh(),
    new tm_machine_1.TMMachine(),
    new arvens_toedscool_1.ArvensToedscool(),
    new arvens_toedscruel_1.ArvensToedscruel(),
    new arvens_maschiff_1.ArvensMaschiff(),
    new arvens_mabosstiff_ex_1.ArvensMabosstiffex(),
    new arvens_skwovet_1.ArvensSkwovet(),
    new arvens_greedent_1.ArvensGreedent(),
    new arvens_sandwich_1.ArvensSandwich(),
    new other_prints_2.CynthiasRoseradeIR(),
    new cynthias_garchomp_ex_1.CynthiasGarchompex(),
    new cynthias_gible_1.CynthiasGible(),
    new cynthias_roserade_1.CynthiasRoserade(),
    new cynthias_roselia_1.CynthiasRoselia(),
    new cynthias_gabite_1.CynthiasGabite(),
    new cynthias_spiritomb_1.CynthiasSpiritomb(),
    new cynthias_power_weight_1.CynthiasPowerWeight(),
    new cynthias_feebas_1.CynthiasFeebas(),
    new cynthias_milotic_1.CynthiasMilotic(),
    new other_prints_2.EthansHoOhexSIR(),
    new ethans_adventure_1.EthansAdventure(),
    new ethans_ho_oh_ex_1.EthansHoOhex(),
    new ethans_cyndaquil_1.EthansCyndaquil(),
    new ethans_quilava_1.EthansQuilava(),
    new ethans_typhlosion_1.EthansTyphlosion(),
    new ethans_slugma_1.EthansSlugma(),
    new ethans_magcargo_1.EthansMagcargo(),
    new ethans_pichu_1.EthansPichu(),
    new ethans_pinsir_1.EthansPinsir(),
    new mistys_psyduck_1.MistysPsyduck(),
    new mistys_magikarp_1.MistysMagikarp(),
    new mistys_gyarados_1.MistysGyarados(),
    new mistys_staryu_1.MistysStaryu(),
    new mistys_starmie_1.MistysStarmie(),
    new mistys_lapras_1.MistysLapras(),
    new cetoddle_1.Cetoddle(),
    new cetitan_ex_1.Cetitanex(),
    new torchic_1.Torchic(),
    new combusken_1.Combusken(),
    new blaziken_1.Blaziken(),
    new mankey_1.Mankey(),
    new primeape_1.Primeape(),
    new annihilape_1.Annihilape(),
    new other_prints_2.EnergyRecyclerDRI(),
    new regirock_ex_1.Regirockex(),
    new smoliv_1.Smoliv(),
    new dolliv_1.Dolliv(),
    new arboliva_ex_1.Arbolivaex(),
    new clamperl_1.Clamperl(),
    new huntail_1.Huntail(),
    new gorebyss_1.Gorebyss(),
    new marnies_impidimp_1.MarniesImpidimp(),
    new marnies_morgrem_1.MarniesMorgrem(),
    new marnies_grimmsnarl_ex_1.MarniesGrimmsnarlex(),
    new marnies_morpeko_1.MarniesMorpeko(),
    new marnies_purrloin_1.MarniesPurrloin(),
    new marnies_liepard_1.MarniesLiepard(),
    new marnies_scrafty_1.MarniesScrafty(),
    new marnies_scraggy_1.MarniesScraggy(),
    new spikemuth_gym_1.SpikemuthGym(),
    new stevens_beldum_1.StevensBeldum(),
    new stevens_metang_1.StevensMetang(),
    new stevens_metagross_ex_1.StevensMetagrossex(),
    new stevens_carbink_1.StevensCarbink(),
    new stevens_baltoy_1.StevensBaltoy(),
    new stevens_claydol_1.StevensClaydol(),
    new stevens_skarmory_1.StevensSkarmory(),
    new granite_cave_1.GraniteCave(),
    new team_rockets_mewtwo_ex_1.TeamRocketsMewtwoex(),
    new team_rockets_tarountula_1.TeamRocketsTarountula(),
    new team_rockets_spidops_1.TeamRocketsSpidops(),
    new team_rockets_porygon_1.TeamRocketsPorygon(),
    new team_rockets_porygon2_1.TeamRocketsPorygon2(),
    new team_rockets_porygon_z_1.TeamRocketsPorygonZ(),
    new team_rockets_transceiver_1.TeamRocketsTransceiver(),
    new team_rockets_archer_1.TeamRocketsArcher(),
    new team_rockets_ariana_1.TeamRocketsAriana(),
    new team_rockets_energy_1.TeamRocketsEnergy(),
    new team_rockets_giovanni_1.TeamRocketsGiovanni(),
    new team_rockets_meowth_1.TeamRocketsMeowth(),
    new team_rockets_persian_ex_1.TeamRocketsPersianex(),
    new team_rockets_mareep_1.TeamRocketsMareep(),
    new team_rockets_flaaffy_1.TeamRocketsFlaaffy(),
    new team_rockets_ampharos_1.TeamRocketsAmpharos(),
    new team_rockets_wobbuffet_1.TeamRocketsWobbuffet(),
    new team_rockets_great_ball_1.TeamRocketsGreatBall(),
    new team_rockets_drowzee_1.TeamRocketsDrowzee(),
    new team_rockets_hypno_1.TeamRocketsHypno(),
    new team_rockets_larvitar_1.TeamRocketsLarvitar(),
    new team_rockets_pupitar_1.TeamRocketsPupitar(),
    new team_rockets_tyranitar_1.TeamRocketsTyranitar(),
    new team_rockets_moltres_ex_1.TeamRocketsMoltresex(),
    new team_rockets_articuno_1.TeamRocketsArticuno(),
    new team_rockets_zapdos_1.TeamRocketsZapdos(),
    new team_rockets_zubat_1.TeamRocketsZubat(),
    new team_rockets_golbat_1.TeamRocketsGolbat(),
    new team_rockets_crobat_ex_1.TeamRocketsCrobatex(),
    new team_rockets_venture_bomb_1.TeamRocketsVentureBomb(),
    new team_rockets_petrel_1.TeamRocketsPetrel(),
    new team_rockets_proton_1.TeamRocketsProton(),
    new team_rockets_sneasel_1.TeamRocketsSneasel(),
    new team_rockets_koffing_1.TeamRocketsKoffing(),
    new team_rockets_weezing_1.TeamRocketsWeezing(),
    new team_rockets_mimikyu_1.TeamRocketsMimikyu(),
    new team_rockets_nidoran_male_1.TeamRocketsNidoranMale(),
    new team_rockets_nidorino_1.TeamRocketsNidorino(),
    new team_rockets_nidoking_ex_1.TeamRocketsNidokingex(),
    new team_rockets_nidoran_female_1.TeamRocketsNidoranFemale(),
    new team_rockets_nidorina_1.TeamRocketsNidorina(),
    new team_rockets_nidoqueen_1.TeamRocketsNidoqueen(),
    new team_rockets_ekans_1.TeamRocketsEkans(),
    new team_rockets_arbok_1.TeamRocketsArbok(),
    new team_rockets_murkrow_1.TeamRocketsMurkrow(),
    new team_rockets_watchtower_1.TeamRocketsWatchtower(),
    new team_rockets_factory_1.TeamRocketsFactory(),
    new team_rockets_chingling_1.TeamRocketsChingling(),
    new other_prints_1.RellorDRI(),
    new other_prints_1.JudgeULDRI(),
    new other_prints_1.Yanma2DRI(),
    new other_prints_1.CynthiasRoserade2DRI(),
    new other_prints_1.Shaymin2DRI(),
    new other_prints_1.Crustle2DRI(),
    new other_prints_1.TeamRocketsSpidops2DRI(),
    new other_prints_1.Hydrapple2DRI(),
    new other_prints_1.Rapidash2DRI(),
    new other_prints_1.EthansTyphlosion2DRI(),
    new other_prints_1.Blaziken2DRI(),
    new other_prints_1.MistysPsyduck2DRI(),
    new other_prints_1.MistysLapras2DRI(),
    new other_prints_1.Clamperl2DRI(),
    new other_prints_1.Rotom2DRI(),
    new other_prints_1.TeamRocketsWeezing2DRI(),
    new other_prints_1.TeamRocketsMurkrow2DRI(),
    new other_prints_1.TeamRocketsMeowth2DRI(),
    new other_prints_1.ArvensGreedent2DRI(),
    new other_prints_1.Yanmegaex2DRI(),
    new other_prints_1.Arbolivaex2DRI(),
    new other_prints_1.TeamRocketsMoltresex2DRI(),
    new other_prints_1.EthansHoOhex2DRI(),
    new other_prints_1.Cetitanex2DRI(),
    new other_prints_1.Dondozoex2DRI(),
    new other_prints_1.Electivireex2DRI(),
    new other_prints_1.TeamRocketsMewtwoex2DRI(),
    new other_prints_1.Regirockex2DRI(),
    new other_prints_1.CynthiasGarchompex2DRI(),
    new other_prints_1.TeamRocketsNidokingex2DRI(),
    new other_prints_1.TeamRocketsCrobatex2DRI(),
    new other_prints_1.ArvensMabosstiffex2DRI(),
    new other_prints_1.TeamRocketsPersianex2DRI(),
    new other_prints_1.EmceesHype2DRI(),
    new other_prints_1.EthansAdventure2DRI(),
    new other_prints_1.JudgeUL2DRI(),
    new other_prints_1.TeamRocketsArcher2DRI(),
    new other_prints_1.TeamRocketsAriana2DRI(),
    new other_prints_1.TeamRocketsGiovanni2DRI(),
    new other_prints_1.TeamRocketsPetrel2DRI(),
    new other_prints_1.TeamRocketsProton2DRI(),
    new other_prints_1.Yanmegaex3DRI(),
    new other_prints_1.TeamRocketsMoltresex3DRI(),
    new other_prints_1.EthansHoOhex3DRI(),
    new other_prints_1.TeamRocketsMewtwoex3DRI(),
    new other_prints_1.CynthiasGarchompex3DRI(),
    new other_prints_1.TeamRocketsNidokingex3DRI(),
    new other_prints_1.TeamRocketsCrobatex3DRI(),
    new other_prints_1.ArvensMabosstiffex3DRI(),
    new other_prints_1.EthansAdventure3DRI(),
    new other_prints_1.TeamRocketsAriana3DRI(),
    new other_prints_1.TeamRocketsGiovanni3DRI(),
    new other_prints_1.EthansHoOhex4DRI(),
    new other_prints_1.TeamRocketsMewtwoex4DRI(),
    new other_prints_1.CynthiasGarchompex4DRI(),
    new other_prints_1.TeamRocketsCrobatex4DRI(),
    new other_prints_1.JammingTowerDRI(),
    new other_prints_1.LevinciaDRI(),
];
