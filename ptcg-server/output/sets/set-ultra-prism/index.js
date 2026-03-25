"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUltraPrism = void 0;
const abomasnow_1 = require("./abomasnow");
const alolan_diglett_1 = require("./alolan-diglett");
const alolan_dugtrio_1 = require("./alolan-dugtrio");
const alolan_exeggutor_1 = require("./alolan-exeggutor");
const alolan_sandshrew_1 = require("./alolan-sandshrew");
const alolan_sandslash_1 = require("./alolan-sandslash");
const alolan_vulpix_1 = require("./alolan-vulpix");
const araquanid_1 = require("./araquanid");
const bastiodon_1 = require("./bastiodon");
const bronzong_1 = require("./bronzong");
const bronzor_1 = require("./bronzor");
const buizel_1 = require("./buizel");
const buneary_1 = require("./buneary");
const carnivine_1 = require("./carnivine");
const celesteela_gx_1 = require("./celesteela-gx");
const cherrim_1 = require("./cherrim");
const cherubi_1 = require("./cherubi");
const chimchar_1 = require("./chimchar");
const chimchar_2_1 = require("./chimchar-2");
const cosmog_1 = require("./cosmog");
const cranidos_1 = require("./cranidos");
const cresselia_1 = require("./cresselia");
const croagunk_1 = require("./croagunk");
const darkrai_1 = require("./darkrai");
const dawn_wings_necrozma_gx_1 = require("./dawn-wings-necrozma-gx");
const dialga_gx_1 = require("./dialga-gx");
const drampa_1 = require("./drampa");
const drapion_1 = require("./drapion");
const drifblim_1 = require("./drifblim");
const drifloon_1 = require("./drifloon");
const dusk_mane_necrozma_gx_1 = require("./dusk-mane-necrozma-gx");
const eevee_1 = require("./eevee");
const eevee_2_1 = require("./eevee-2");
const electabuzz_1 = require("./electabuzz");
const electivire_1 = require("./electivire");
const empoleon_1 = require("./empoleon");
const exeggcute_1 = require("./exeggcute");
const fan_rotom_1 = require("./fan-rotom");
const floatzel_1 = require("./floatzel");
const frost_rotom_1 = require("./frost-rotom");
const gabite_1 = require("./gabite");
const garchomp_1 = require("./garchomp");
const gible_1 = require("./gible");
const gible_2_1 = require("./gible-2");
const giratina_1 = require("./giratina");
const glaceon_gx_1 = require("./glaceon-gx");
const glameow_1 = require("./glameow");
const grotle_1 = require("./grotle");
const gumshoos_1 = require("./gumshoos");
const heat_rotom_1 = require("./heat-rotom");
const heatran_1 = require("./heatran");
const hippopotas_1 = require("./hippopotas");
const hippowdon_1 = require("./hippowdon");
const honchkrow_1 = require("./honchkrow");
const infernape_1 = require("./infernape");
const leafeon_gx_1 = require("./leafeon-gx");
const lickilicky_1 = require("./lickilicky");
const lickitung_1 = require("./lickitung");
const lopunny_1 = require("./lopunny");
const lucario_1 = require("./lucario");
const lunala_1 = require("./lunala");
const lunala_gx_1 = require("./lunala-gx");
const lunala_prism_star_1 = require("./lunala-prism-star");
const luxio_1 = require("./luxio");
const luxray_1 = require("./luxray");
const magearna_1 = require("./magearna");
const magmar_1 = require("./magmar");
const magmortar_1 = require("./magmortar");
const magnemite_1 = require("./magnemite");
const magnemite_2_1 = require("./magnemite-2");
const magneton_1 = require("./magneton");
const magnezone_1 = require("./magnezone");
const manaphy_1 = require("./manaphy");
const monferno_1 = require("./monferno");
const morelull_1 = require("./morelull");
const mow_rotom_1 = require("./mow-rotom");
const murkrow_1 = require("./murkrow");
const oranguru_1 = require("./oranguru");
const pachirisu_1 = require("./pachirisu");
const palkia_gx_1 = require("./palkia-gx");
const passimian_1 = require("./passimian");
const pheromosa_gx_1 = require("./pheromosa-gx");
const piplup_1 = require("./piplup");
const piplup_2_1 = require("./piplup-2");
const prinplup_1 = require("./prinplup");
const purugly_1 = require("./purugly");
const rampardos_1 = require("./rampardos");
const riolu_1 = require("./riolu");
const roselia_1 = require("./roselia");
const roserade_1 = require("./roserade");
const rotom_1 = require("./rotom");
const salandit_1 = require("./salandit");
const salazzle_1 = require("./salazzle");
const shaymin_1 = require("./shaymin");
const shaymin_2_1 = require("./shaymin-2");
const shieldon_1 = require("./shieldon");
const shiinotic_1 = require("./shiinotic");
const shinx_1 = require("./shinx");
const shinx_2_1 = require("./shinx-2");
const silvally_gx_1 = require("./silvally-gx");
const skorupi_1 = require("./skorupi");
const skuntank_1 = require("./skuntank");
const sneasel_1 = require("./sneasel");
const snover_1 = require("./snover");
const solgaleo_1 = require("./solgaleo");
const solgaleo_gx_1 = require("./solgaleo-gx");
const solgaleo_prism_star_1 = require("./solgaleo-prism-star");
const spiritomb_1 = require("./spiritomb");
const stunky_1 = require("./stunky");
const tapu_lele_1 = require("./tapu-lele");
const torterra_1 = require("./torterra");
const toxicroak_1 = require("./toxicroak");
const turtonator_1 = require("./turtonator");
const turtwig_1 = require("./turtwig");
const turtwig_2_1 = require("./turtwig-2");
const type_null_1 = require("./type-null");
const wash_rotom_1 = require("./wash-rotom");
const weavile_1 = require("./weavile");
const xurkitree_gx_1 = require("./xurkitree-gx");
const yanma_1 = require("./yanma");
const yanmega_1 = require("./yanmega");
const yungoos_1 = require("./yungoos");
const ancient_crystal_1 = require("./ancient-crystal");
const cynthia_1 = require("./cynthia");
const cyrus_1 = require("./cyrus");
const cyrus_prism_star_1 = require("./cyrus-prism-star");
const electric_memory_1 = require("./electric-memory");
const escape_board_1 = require("./escape-board");
const fire_memory_1 = require("./fire-memory");
const gardenia_1 = require("./gardenia");
const lillie_1 = require("./lillie");
const looker_1 = require("./looker");
const looker_whistle_1 = require("./looker-whistle");
const mars_1 = require("./mars");
const missing_clover_1 = require("./missing-clover");
const mt_coronet_1 = require("./mt-coronet");
const order_pad_1 = require("./order-pad");
const pokemon_fan_club_1 = require("./pokemon-fan-club");
const volkner_1 = require("./volkner");
const super_boost_energy_1 = require("./super-boost-energy");
const unit_energy_grassfirewater_1 = require("./unit-energy-grassfirewater");
const unit_energy_grw_1 = require("./unit-energy-grw");
const unit_energy_lightningpsychicmetal_1 = require("./unit-energy-lightningpsychicmetal");
const unit_energy_lpm_1 = require("./unit-energy-lpm");
const other_prints_1 = require("./other-prints");
exports.setUltraPrism = [
    // Pokemon
    new abomasnow_1.Abomasnow(),
    new alolan_diglett_1.AlolanDiglett(),
    new alolan_dugtrio_1.AlolanDugtrio(),
    new alolan_exeggutor_1.AlolanExeggutor(),
    new alolan_sandshrew_1.AlolanSandshrew(),
    new alolan_sandslash_1.AlolanSandslash(),
    new alolan_vulpix_1.AlolanVulpix(),
    new araquanid_1.Araquanid(),
    new bastiodon_1.Bastiodon(),
    new bronzong_1.Bronzong(),
    new bronzor_1.Bronzor(),
    new buizel_1.Buizel(),
    new buneary_1.Buneary(),
    new carnivine_1.Carnivine(),
    new celesteela_gx_1.CelesteelaGx(),
    new cherrim_1.Cherrim(),
    new cherubi_1.Cherubi(),
    new chimchar_1.Chimchar(),
    new chimchar_2_1.Chimchar2(),
    new cosmog_1.Cosmog(),
    new cranidos_1.Cranidos(),
    new cresselia_1.Cresselia(),
    new croagunk_1.Croagunk(),
    new darkrai_1.Darkrai(),
    new dawn_wings_necrozma_gx_1.DawnWingsNecrozmaGX(),
    new dialga_gx_1.DialgaGX(),
    new drampa_1.Drampa(),
    new drapion_1.Drapion(),
    new drifblim_1.Drifblim(),
    new drifloon_1.Drifloon(),
    new dusk_mane_necrozma_gx_1.DuskManeNecrozmaGX(),
    new eevee_1.Eevee(),
    new eevee_2_1.Eevee2(),
    new electabuzz_1.Electabuzz(),
    new electivire_1.Electivire(),
    new empoleon_1.Empoleon(),
    new exeggcute_1.Exeggcute(),
    new fan_rotom_1.FanRotom(),
    new floatzel_1.Floatzel(),
    new frost_rotom_1.FrostRotom(),
    new gabite_1.Gabite(),
    new garchomp_1.Garchomp(),
    new gible_1.Gible(),
    new gible_2_1.Gible2(),
    new giratina_1.Giratina(),
    new glaceon_gx_1.GlaceonGX(),
    new glameow_1.Glameow(),
    new grotle_1.Grotle(),
    new gumshoos_1.Gumshoos(),
    new heat_rotom_1.HeatRotom(),
    new heatran_1.Heatran(),
    new hippopotas_1.Hippopotas(),
    new hippowdon_1.Hippowdon(),
    new honchkrow_1.Honchkrow(),
    new infernape_1.Infernape(),
    new leafeon_gx_1.LeafeonGx(),
    new lickilicky_1.Lickilicky(),
    new lickitung_1.Lickitung(),
    new lopunny_1.Lopunny(),
    new lucario_1.Lucario(),
    new lunala_1.Lunala(),
    new lunala_gx_1.LunalaGx(),
    new lunala_prism_star_1.LunalaPrismStar(),
    new luxio_1.Luxio(),
    new luxray_1.Luxray(),
    new magearna_1.Magearna(),
    new magmar_1.Magmar(),
    new magmortar_1.Magmortar(),
    new magnemite_1.Magnemite(),
    new magnemite_2_1.Magnemite2(),
    new magneton_1.Magneton(),
    new magnezone_1.Magnezone(),
    new manaphy_1.Manaphy(),
    new monferno_1.Monferno(),
    new morelull_1.Morelull(),
    new mow_rotom_1.MowRotom(),
    new murkrow_1.Murkrow(),
    new oranguru_1.Oranguru(),
    new pachirisu_1.Pachirisu(),
    new palkia_gx_1.PalkiaGx(),
    new passimian_1.Passimian(),
    new pheromosa_gx_1.PheromosaGx(),
    new piplup_1.Piplup(),
    new piplup_2_1.Piplup2(),
    new prinplup_1.Prinplup(),
    new purugly_1.Purugly(),
    new rampardos_1.Rampardos(),
    new riolu_1.Riolu(),
    new roselia_1.Roselia(),
    new roserade_1.Roserade(),
    new rotom_1.Rotom(),
    new salandit_1.Salandit(),
    new salazzle_1.Salazzle(),
    new shaymin_1.Shaymin(),
    new shaymin_2_1.Shaymin2(),
    new shieldon_1.Shieldon(),
    new shiinotic_1.Shiinotic(),
    new shinx_1.Shinx(),
    new shinx_2_1.Shinx2(),
    new silvally_gx_1.SilvallyGX(),
    new skorupi_1.Skorupi(),
    new skuntank_1.Skuntank(),
    new sneasel_1.Sneasel(),
    new snover_1.Snover(),
    new solgaleo_1.Solgaleo(),
    new solgaleo_gx_1.SolgaleoGx(),
    new solgaleo_prism_star_1.SolgaleoPrismStar(),
    new spiritomb_1.Spiritomb(),
    new stunky_1.Stunky(),
    new tapu_lele_1.TapuLele(),
    new torterra_1.Torterra(),
    new toxicroak_1.Toxicroak(),
    new turtonator_1.Turtonator(),
    new turtwig_1.Turtwig(),
    new turtwig_2_1.Turtwig2(),
    new type_null_1.TypeNull(),
    new wash_rotom_1.WashRotom(),
    new weavile_1.Weavile(),
    new xurkitree_gx_1.XurkitreeGx(),
    new yanma_1.Yanma(),
    new yanmega_1.Yanmega(),
    new yungoos_1.Yungoos(),
    // Trainers
    new ancient_crystal_1.AncientCrystal(),
    new cynthia_1.Cynthia(),
    new cyrus_1.Cyrus(),
    new cyrus_prism_star_1.CyrusPrismStar(),
    new electric_memory_1.ElectricMemory(),
    new escape_board_1.EscapeBoard(),
    new fire_memory_1.FireMemory(),
    new gardenia_1.Gardenia(),
    new lillie_1.Lillie(),
    new looker_1.Looker(),
    new looker_whistle_1.LookerWhistle(),
    new mars_1.Mars(),
    new missing_clover_1.MissingClover(),
    new mt_coronet_1.MtCoronet(),
    new order_pad_1.OrderPad(),
    new pokemon_fan_club_1.PokemonFanClub(),
    new volkner_1.Volkner(),
    // Energy
    new super_boost_energy_1.SuperBoostEnergy(),
    new unit_energy_grassfirewater_1.UnitEnergyGrassfirewater(),
    new unit_energy_grw_1.UnitEnergyGRW(),
    new unit_energy_lightningpsychicmetal_1.UnitEnergyLightningpsychicmetal(),
    new unit_energy_lpm_1.UnitEnergyLPM(),
    // Other Prints (Reprints & Alt Arts)
    new other_prints_1.CosmoemUPR(),
    new other_prints_1.PalPadUPR(),
    new other_prints_1.UnidentifiedFossilUPR(),
    new other_prints_1.GlaceonGX2UPR(),
    new other_prints_1.DawnWingsNecrozmaGX2UPR(),
    new other_prints_1.DuskManeNecrozmaGX2UPR(),
    new other_prints_1.DialgaGX2UPR(),
    new other_prints_1.Cynthia3UPR(),
    new other_prints_1.Gardenia2UPR(),
    new other_prints_1.Lillie3UPR(),
    new other_prints_1.LusamineUPR(),
    new other_prints_1.Mars2UPR(),
    new other_prints_1.PokemonFanClub2UPR(),
    new other_prints_1.Volkner3UPR(),
    new other_prints_1.GlaceonGX3UPR(),
    new other_prints_1.DawnWingsNecrozmaGX3UPR(),
    new other_prints_1.DuskManeNecrozmaGX3UPR(),
    new other_prints_1.DialgaGX3UPR(),
    new other_prints_1.CrushingHammerUPR(),
    new other_prints_1.EscapeBoard3UPR(),
    new other_prints_1.UnitEnergyGRW2UPR(),
    new other_prints_1.UnitEnergyLPM2UPR(),
    new other_prints_1.Cynthia2UPR(),
    new other_prints_1.EscapeBoard2UPR(),
    new other_prints_1.Lillie2UPR(),
    new other_prints_1.Volkner2UPR(),
    new other_prints_1.Lusamine2UPR(),
    new other_prints_1.DewpiderUPR(),
    new other_prints_1.LeafeonGx2(),
    new other_prints_1.PalkiaGx2(),
    new other_prints_1.LanaUPR(),
    new other_prints_1.Looker2(),
    new other_prints_1.LeafeonGx3(),
    new other_prints_1.PheromosaGx2(),
    new other_prints_1.XurkitreeGx2(),
    new other_prints_1.CelesteelaGx2(),
    new other_prints_1.PalkiaGx3(),
    new other_prints_1.MissingClover2(),
    new other_prints_1.PeekingRedCardUPR(),
];
