import { ensureClientCards } from '../../client/cards';
import { SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { State } from '../../game/store/state/state';
import { padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

type PrintedAttack = [print: string, attack: string, damage: number, condition: SpecialCondition, energy: string[]];

const printedAttacks: PrintedAttack[] = [
  ["Amoonguss SIT 12", "Hypno Hammer", 50, SpecialCondition.ASLEEP, ["Grass Energy SVE", "Water Energy SVE"]],
  ["Dragonair SIT 130", "Wrap", 30, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Drowzee SIT 60", "Hypnotic Ray", 20, SpecialCondition.ASLEEP, ["Psychic Energy SVE", "Water Energy SVE"]],
  ["Milotic SIT 40", "Mellow Wave", 60, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE"]],
  ["Misdreavus SIT 63", "Confuse Ray", 10, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Ninetales SIT 18", "Hypnotic Gaze", 0, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Relicanth SIT 44", "Water Pulse", 30, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE"]],
  ["Unown V SIT", "Shady Stamp", 30, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Hearthflame Mask Ogerpon DRI", "Searing Flame", 80, SpecialCondition.BURNED, ["Fire Energy SVE", "Fire Energy SVE", "Water Energy SVE"]],
  ["Steven's Claydol DRI", "Eerie Light", 20, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Team Rocket's Drowzee DRI", "Hypnotic Ray", 10, SpecialCondition.ASLEEP, ["Psychic Energy SVE"]],
  ["Team Rocket's Flaaffy DRI", "Thunder Shock", 50, SpecialCondition.PARALYZED, ["Lightning Energy SVE", "Water Energy SVE"]],
  ["Team Rocket's Golbat DRI", "Confuse Ray", 30, SpecialCondition.CONFUSED, ["Darkness Energy SVE"]],
  ["Team Rocket's Zubat DRI", "Poison Spray", 0, SpecialCondition.POISONED, ["Darkness Energy SVE"]],
  ["Spheal SSP", "Powder Snow", 10, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Brute Bonnet TWM", "Poison Spray", 0, SpecialCondition.POISONED, ["Darkness Energy SVE"]],
  ["Poliwhirl TWM", "Hypnosis", 0, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Poliwrath TWM", "Hypnosis", 0, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Gulpin SCR", "Super Poison Breath", 30, SpecialCondition.POISONED, ["Darkness Energy SVE", "Darkness Energy SVE", "Water Energy SVE"]],
  ["Swalot SCR", "Venomous Hit", 100, SpecialCondition.POISONED, ["Darkness Energy SVE", "Darkness Energy SVE", "Water Energy SVE"]],
  ["Bonsly OBF", "Blubbering", 10, SpecialCondition.CONFUSED, []],
  ["Rotom SVI", "Thunder Shock", 20, SpecialCondition.PARALYZED, ["Lightning Energy SVE"]],
  ["Exeggcute CRZ 57", "Psy Bolt", 20, SpecialCondition.PARALYZED, ["Psychic Energy SVE", "Water Energy SVE"]],
  ["Girafarig CRZ 61", "Psybeam", 30, SpecialCondition.CONFUSED, ["Psychic Energy SVE", "Water Energy SVE"]],
  ["Hatterene VMAX CRZ 66", "G-Max Smite", 150, SpecialCondition.CONFUSED, ["Psychic Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Ariados LOR 113", "Venomous Fang", 80, SpecialCondition.POISONED, ["Darkness Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Darkrai LOR 120", "Nightmare", 30, SpecialCondition.ASLEEP, ["Darkness Energy SVE", "Water Energy SVE"]],
  ["Electrike LOR 54", "Thunder Fang", 20, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Hariyama LOR 98", "Shove", 40, SpecialCondition.PARALYZED, ["Fighting Energy SVE", "Water Energy SVE"]],
  ["Litleo LOR 28", "Singe", 0, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Makuhita LOR 97", "Fake Out", 20, SpecialCondition.PARALYZED, ["Fighting Energy SVE", "Water Energy SVE"]],
  ["Mimikyu LOR", "Perplex", 0, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Poliwrath LOR 85", "Split Spiral Punch", 60, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Raichu LOR 53", "Thunder Shock", 30, SpecialCondition.PARALYZED, ["Lightning Energy SVE"]],
  ["Roserade LOR 15", "Poisonous Whip", 30, SpecialCondition.POISONED, ["Grass Energy SVE"]],
  ["Spinarak LOR 112", "Poison Sting", 10, SpecialCondition.POISONED, ["Darkness Energy SVE"]],
  ["Swanna LOR 47", "Water Pulse", 20, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Azelf ASR 67", "Mind Bend", 30, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Darkrai V ASR", "Dark Void", 130, SpecialCondition.ASLEEP, ["Darkness Energy SVE", "Darkness Energy SVE", "Water Energy SVE"]],
  ["Glameow ASR 127", "Fake Out", 20, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Heatran V ASR 25", "Heat Burn", 30, SpecialCondition.BURNED, ["Fire Energy SVE", "Water Energy SVE"]],
  ["Heatran VMAX ASR 26", "Max Heat Burst", 180, SpecialCondition.BURNED, ["Fire Energy SVE", "Fire Energy SVE", "Water Energy SVE"]],
  ["Hisuian Sneasler V ASR 94", "Poison Claws", 0, SpecialCondition.POISONED, []],
  ["Hisuian Typhlosion V ASR 53", "Singe", 0, SpecialCondition.BURNED, []],
  ["Mismagius ASR 59", "Psybeam", 50, SpecialCondition.CONFUSED, ["Psychic Energy SVE", "Water Energy SVE"]],
  ["Purugly ASR 128", "Body Slam", 30, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Swinub ASR 31", "Icy Wind", 40, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Breloom BRS", "Spore Ball", 30, SpecialCondition.ASLEEP, ["Grass Energy SVE"]],
  ["Dusclops BRS 61", "Fade to Black", 30, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Duskull BRS", "Perplex", 10, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Grimer BRS 84", "Poison Gas", 0, SpecialCondition.POISONED, ["Darkness Energy SVE"]],
  ["Luxio BRS 50", "Thunder Shock", 30, SpecialCondition.PARALYZED, ["Lightning Energy SVE"]],
  ["Piplup BRS 35", "Bubble", 10, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Snorunt BRS 34", "Ice Breath", 0, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Bewear FST 151", "Split Spiral Punch", 40, SpecialCondition.CONFUSED, ["Fighting Energy SVE", "Water Energy SVE"]],
  ["Chandelure V FST 39", "Confuse Ray", 0, SpecialCondition.CONFUSED, ["Fire Energy SVE"]],
  ["Frosmoth FST 85", "Icy Wind", 0, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Galarian Darmanitan FST 72", "Powder Snow", 30, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE"]],
  ["Galarian Zigzagoon FST 159", "Lick", 10, SpecialCondition.PARALYZED, ["Darkness Energy SVE"]],
  ["Garbodor FST 169", "Poison Gas", 30, SpecialCondition.POISONED, ["Darkness Energy SVE"]],
  ["Gligar FST 140", "Poison Sting", 0, SpecialCondition.POISONED, ["Fighting Energy SVE"]],
  ["Gliscor FST 141", "Venomous Hit", 100, SpecialCondition.POISONED, ["Fighting Energy SVE", "Fighting Energy SVE", "Water Energy SVE"]],
  ["Jynx FST 112", "Dazzle Dance", 30, SpecialCondition.CONFUSED, ["Psychic Energy SVE", "Water Energy SVE"]],
  ["Simipour FST 69", "Water Pulse", 20, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Sizzlipede FST 47", "Singe", 0, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Sliggoo FST 196", "Body Slam", 50, SpecialCondition.PARALYZED, ["Water Energy SVE", "Psychic Energy SVE"]],
  ["Trubbish FST", "Super Poison Breath", 20, SpecialCondition.POISONED, ["Darkness Energy SVE", "Water Energy SVE"]],
  ["Tynamo FST 95", "Thunder Wave", 0, SpecialCondition.PARALYZED, ["Lightning Energy SVE"]],
  ["Ampharos EVS", "Thunder Shock", 40, SpecialCondition.PARALYZED, ["Lightning Energy SVE"]],
  ["Emolga EVS", "Thunder Shock", 30, SpecialCondition.PARALYZED, ["Lightning Energy SVE"]],
  ["Flabébé EVS", "Hypnotic Gaze", 0, SpecialCondition.ASLEEP, ["Psychic Energy SVE"]],
  ["Flareon V EVS", "Scorching Column", 120, SpecialCondition.BURNED, ["Fire Energy SVE", "Fire Energy SVE", "Water Energy SVE"]],
  ["Florges EVS", "Wonder Shine", 110, SpecialCondition.CONFUSED, ["Psychic Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Golduck EVS", "Psybeam", 20, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Hypno EVS", "Hypnosis", 0, SpecialCondition.ASLEEP, ["Psychic Energy SVE"]],
  ["Nuzleaf EVS", "Fake Out", 20, SpecialCondition.PARALYZED, ["Darkness Energy SVE"]],
  ["Ampharos CRE", "Thunder Shock", 50, SpecialCondition.PARALYZED, ["Lightning Energy SVE"]],
  ["Banette CRE", "Eerie Light", 50, SpecialCondition.CONFUSED, ["Psychic Energy SVE", "Water Energy SVE"]],
  ["Gastly CRE", "Sleep Pulse", 10, SpecialCondition.ASLEEP, ["Psychic Energy SVE"]],
  ["Lapras CRE", "Icy Wind", 50, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE"]],
  ["Qwilfish CRE", "Poison Jab", 30, SpecialCondition.POISONED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Ralts CRE", "Confuse Ray", 0, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Scolipede CRE", "Poison Sting", 50, SpecialCondition.POISONED, ["Darkness Energy SVE"]],
  ["Whirlipede CRE", "Poison Sting", 20, SpecialCondition.POISONED, ["Darkness Energy SVE"]],
  ["Centiskorch BST", "Bursting Inferno", 130, SpecialCondition.BURNED, ["Fire Energy SVE", "Fire Energy SVE", "Fire Energy SVE", "Water Energy SVE"]],
  ["Chimecho BST", "Pleasant Tone", 20, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Corphish BST", "Bubble Beam", 30, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Entei BST", "Fire Fang", 90, SpecialCondition.BURNED, ["Fire Energy SVE", "Fire Energy SVE", "Water Energy SVE"]],
  ["Grumpig BST", "Dazzle Dance", 30, SpecialCondition.CONFUSED, ["Psychic Energy SVE", "Water Energy SVE"]],
  ["Mawile BST", "Powerful Vise", 20, SpecialCondition.PARALYZED, ["Metal Energy SVE"]],
  ["Salazzle BST", "Perplex", 0, SpecialCondition.CONFUSED, ["Fire Energy SVE"]],
  ["Sizzlipede BST", "Searing Flame", 20, SpecialCondition.BURNED, ["Fire Energy SVE", "Water Energy SVE"]],
  ["Alcremie VIV", "Wonder Shine", 60, SpecialCondition.CONFUSED, ["Psychic Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Ampharos V VIV", "Dazzle Blast", 50, SpecialCondition.CONFUSED, ["Lightning Energy SVE", "Water Energy SVE"]],
  ["Coalossal V VIV", "Searing Flame", 90, SpecialCondition.BURNED, ["Fighting Energy SVE", "Fighting Energy SVE", "Water Energy SVE"]],
  ["Dedenne VIV", "Tail Trickery", 10, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Dusclops VIV", "Confuse Ray", 0, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Galarian Darmanitan V VIV", "Freezing Headbutt", 50, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Garbodor VIV", "Poison Spray", 80, SpecialCondition.POISONED, ["Darkness Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Ampharos DAA", "Dazzle Blast", 50, SpecialCondition.CONFUSED, ["Lightning Energy SVE"]],
  ["Arctovish DAA", "Cold Breath", 130, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Ariados DAA", "Poison Sting", 30, SpecialCondition.POISONED, ["Darkness Energy SVE", "Water Energy SVE"]],
  ["Combusken DAA", "Heat Beak", 40, SpecialCondition.BURNED, ["Fire Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Crobat V DAA", "Venomous Fang", 70, SpecialCondition.POISONED, ["Darkness Energy SVE", "Water Energy SVE"]],
  ["Fletchinder DAA", "Searing Flame", 20, SpecialCondition.BURNED, ["Water Energy SVE"]],
  ["Gothitelle DAA", "Mind Bend", 40, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Heatran DAA", "Fire Fang", 30, SpecialCondition.BURNED, ["Fire Energy SVE", "Water Energy SVE"]],
  ["Houndoom V DAA", "Searing Flame", 20, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Larvesta DAA", "Singe", 0, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Mareanie DAA", "Poison Tentacles", 20, SpecialCondition.POISONED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Morelull DAA", "Spore", 0, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Parasect DAA", "Mushroom Tackle", 30, SpecialCondition.PARALYZED, ["Grass Energy SVE"]],
  ["Pincurchin DAA", "Zing Zap", 50, SpecialCondition.PARALYZED, ["Lightning Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Purrloin DAA", "Fake Out", 20, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Toxapex DAA", "Poisonous Whip", 80, SpecialCondition.POISONED, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Vanillish DAA", "Freezing Headbutt", 30, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Vanillite DAA", "Ice Over", 10, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Wigglytuff DAA", "Sleep Pulse", 30, SpecialCondition.ASLEEP, ["Psychic Energy SVE"]],
  ["Abomasnow RCL", "Soothing Scent", 80, SpecialCondition.ASLEEP, ["Grass Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Chandelure RCL", "Mirage Flare", 110, SpecialCondition.CONFUSED, ["Fire Energy SVE", "Water Energy SVE"]],
  ["Cinderace VMAX RCL", "Max Pyro Ball", 170, SpecialCondition.BURNED, ["Fire Energy SVE", "Fire Energy SVE", "Water Energy SVE"]],
  ["Galarian Darumaka RCL", "Ice Punch", 30, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Galarian Mr. Mime RCL", "Icy Wind", 10, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Heatmor RCL", "Lick", 20, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Indeedee RCL", "Psybeam", 30, SpecialCondition.CONFUSED, ["Psychic Energy SVE", "Water Energy SVE"]],
  ["Litwick RCL", "Scorch", 0, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Magmortar RCL", "Burst Punch", 30, SpecialCondition.BURNED, ["Fire Energy SVE", "Water Energy SVE"]],
  ["Malamar V RCL", "Brain Shake", 130, SpecialCondition.CONFUSED, ["Darkness Energy SVE", "Darkness Energy SVE", "Water Energy SVE"]],
  ["Meditite RCL", "Yoga Shock", 10, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Milotic V RCL", "Hypno Splash", 150, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Ninetales RCL", "Flickering Flames", 90, SpecialCondition.ASLEEP, ["Fire Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Seismitoad RCL", "Split Spiral Punch", 30, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Shuckle RCL", "Bind", 50, SpecialCondition.PARALYZED, ["Grass Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Stunky RCL", "Poison Gas", 10, SpecialCondition.POISONED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Toxtricity V RCL", "Poison Jab", 20, SpecialCondition.POISONED, ["Lightning Energy SVE"]],
  ["Tympole RCL", "Spiral Attack", 0, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Cinderace SSH 35", "Pyro Ball", 50, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Claydol SSH", "Psybeam", 30, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Cloyster SSH", "Shell Grab", 30, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Galvantula SSH 71", "Volt Wave", 60, SpecialCondition.PARALYZED, ["Lightning Energy SVE", "Water Energy SVE"]],
  ["Gengar SSH", "Hypnoblast", 90, SpecialCondition.ASLEEP, ["Psychic Energy SVE", "Psychic Energy SVE", "Water Energy SVE"]],
  ["Haunter SSH", "Nightmare", 20, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Heatmor SSH", "Searing Flame", 10, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Salandit SSH", "Smog", 0, SpecialCondition.POISONED, ["Fire Energy SVE"]],
  ["Salazzle SSH", "Searing Flame", 20, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Skorupi SSH", "Poison Sting", 0, SpecialCondition.POISONED, ["Darkness Energy SVE"]],
  ["Alolan Grimer CEC", "Nasty Goo", 20, SpecialCondition.PARALYZED, ["Darkness Energy SVE", "Water Energy SVE"]],
  ["Cradily CEC", "Poison Tentacles", 110, SpecialCondition.POISONED, ["Grass Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Kirlia CEC", "Hypnosis", 0, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Lileep CEC", "Confuse Ray", 0, SpecialCondition.CONFUSED, ["Grass Energy SVE"]],
  ["Mimikyu CEC 97", "Tail Trickery", 20, SpecialCondition.CONFUSED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Pikachu CEC", "Nuzzle", 0, SpecialCondition.PARALYZED, ["Lightning Energy SVE"]],
  ["Probopass CEC", "Hard Press", 60, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Raichu CEC", "Nuzzle", 0, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Skrelp CEC", "Poison Breath", 0, SpecialCondition.POISONED, ["Psychic Energy SVE"]],
  ["Slugma CEC", "Singe", 0, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Slurpuff CEC", "Olfactory Enchantment", 0, SpecialCondition.CONFUSED, ["Fairy Energy XY"]],
  ["Spheal CEC 50", "Body Slam", 30, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Swoobat CEC", "Supersonic", 0, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Togedemaru CEC 74", "Thunder Shock", 30, SpecialCondition.PARALYZED, ["Lightning Energy SVE", "Water Energy SVE"]],
  ["Xatu CEC", "Creepy Wind", 0, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Onix-GX HIF", "Bind", 30, SpecialCondition.PARALYZED, ["Fighting Energy SVE"]],
  ["Reshiram-GX HIF", "Scorching Column", 110, SpecialCondition.BURNED, ["Fire Energy SVE", "Fire Energy SVE", "Fire Energy SVE", "Water Energy SVE"]],
  ["Seviper HIF", "Venomous Fang", 30, SpecialCondition.POISONED, ["Psychic Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Voltorb HIF", "Thunder Shock", 20, SpecialCondition.PARALYZED, ["Lightning Energy SVE", "Water Energy SVE"]],
  ["Breloom UNM", "Spore", 0, SpecialCondition.ASLEEP, ["Grass Energy SVE"]],
  ["Celebi UNM", "Mind Bend", 20, SpecialCondition.CONFUSED, ["Grass Energy SVE"]],
  ["Elgyem UNM", "Psybeam", 10, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Exeggutor UNM", "Mind Bend", 30, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Foongus UNM", "Spore", 0, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Giratina UNM", "Fade to Black", 70, SpecialCondition.CONFUSED, ["Psychic Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Joltik UNM", "Jolt", 0, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Magnemite UNM", "Supersonic", 0, SpecialCondition.CONFUSED, ["Lightning Energy SVE"]],
  ["Relicanth UNM", "Water Pulse", 30, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE"]],
  ["Shroomish UNM", "Poison Powder", 0, SpecialCondition.POISONED, ["Grass Energy SVE"]],
  ["Snover UNM", "Powder Snow", 10, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Talonflame UNM", "Heat Wave", 40, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Xurkitree UNM", "Signal Beam", 50, SpecialCondition.CONFUSED, ["Lightning Energy SVE", "Lightning Energy SVE"]],
  ["Arbok UNB", "Wrap", 30, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Chatot UNB", "Tone-Deaf", 10, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Drowzee UNB", "Hypnosis", 0, SpecialCondition.ASLEEP, ["Psychic Energy SVE"]],
  ["Ekans UNB", "Glare", 0, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Gastly UNB 68", "Smog", 0, SpecialCondition.POISONED, ["Psychic Energy SVE"]],
  ["Gliscor UNB", "Poison Jab", 70, SpecialCondition.POISONED, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Inkay UNB", "Perplex", 0, SpecialCondition.CONFUSED, ["Darkness Energy SVE"]],
  ["Kingler UNB", "Bubble Beam", 80, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Litten UNB", "Singe", 0, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Poliwhirl UNB", "Bubble", 20, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Squirtle UNB", "Bubble", 10, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Tentacruel UNB", "Wrap", 60, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Torracat UNB", "Fire Fang", 20, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Venonat UNB 10", "Psybeam", 10, SpecialCondition.CONFUSED, ["Grass Energy SVE"]],
  ["Wigglytuff UNB", "Sleepy Ball", 80, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Aerodactyl TEU", "Supersonic", 0, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Bronzong TEU", "Shady Stamp", 70, SpecialCondition.CONFUSED, ["Metal Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Charmeleon TEU", "Fire Fang", 30, SpecialCondition.BURNED, ["Fire Energy SVE", "Fire Energy SVE"]],
  ["Emolga TEU", "Nuzzle", 0, SpecialCondition.PARALYZED, ["Lightning Energy SVE"]],
  ["Jynx TEU", "Dazzle Dance", 0, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Omanyte TEU", "Tickle", 30, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Parasect TEU", "Mysterious Powder", 30, SpecialCondition.CONFUSED, ["Grass Energy SVE", "Water Energy SVE"]],
  ["Staryu TEU", "Numbing Water", 10, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Tentacool TEU", "Wrap", 10, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Ariados LOT", "Poison Jab", 70, SpecialCondition.POISONED, ["Grass Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Bayleef LOT", "Soothing Scent", 20, SpecialCondition.ASLEEP, ["Grass Energy SVE"]],
  ["Bruxish LOT", "Mind Bend", 20, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Dedenne LOT", "Nuzzle", 0, SpecialCondition.PARALYZED, ["Lightning Energy SVE"]],
  ["Electabuzz LOT", "Thunder Shock", 30, SpecialCondition.PARALYZED, ["Lightning Energy SVE", "Water Energy SVE"]],
  ["Entei LOT", "Fire Fang", 20, SpecialCondition.BURNED, ["Fire Energy SVE", "Water Energy SVE"]],
  ["Flaaffy LOT", "Signal Beam", 40, SpecialCondition.CONFUSED, ["Lightning Energy SVE", "Lightning Energy SVE"]],
  ["Jigglypuff LOT", "Sing", 0, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE"]],
  ["Lapras LOT", "Ice Beam", 50, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Mareep LOT 76", "Thunder Shock", 10, SpecialCondition.PARALYZED, ["Lightning Energy SVE"]],
  ["Meloetta LOT", "Sing", 0, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Morelull LOT", "Perplex", 0, SpecialCondition.CONFUSED, ["Fairy Energy XY"]],
  ["Popplio LOT", "Disarming Voice", 20, SpecialCondition.CONFUSED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Primarina LOT", "Hypno Splash", 80, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Quilava LOT", "Super Singe", 60, SpecialCondition.BURNED, ["Fire Energy SVE", "Fire Energy SVE", "Fire Energy SVE"]],
  ["Stantler LOT", "Mystifying Horns", 0, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Tangela LOT", "Bind", 40, SpecialCondition.PARALYZED, ["Grass Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Tapu Fini LOT", "Wonder Shine", 100, SpecialCondition.CONFUSED, ["Fairy Energy XY", "Fairy Energy XY", "Water Energy SVE"]],
  ["Toucannon LOT", "Heat Beak", 40, SpecialCondition.BURNED, ["Water Energy SVE"]],
  ["Toxapex LOT", "Poison Sting", 0, SpecialCondition.POISONED, ["Water Energy SVE"]],
  ["Wurmple LOT 24", "Poison Sting", 0, SpecialCondition.POISONED, ["Grass Energy SVE"]],
  ["Baltoy CES", "Psy Bolt", 20, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Claydol CES", "Psy Bolt", 20, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Illumise CES", "Pheromone Signals", 20, SpecialCondition.CONFUSED, ["Grass Energy SVE"]],
  ["Larvitar CES", "Leer", 0, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Loudred CES", "Cracking Voice", 60, SpecialCondition.CONFUSED, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Lunatone CES", "Psyshock", 10, SpecialCondition.PARALYZED, ["Psychic Energy SVE"]],
  ["Luvdisc CES", "Water Pulse", 20, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE"]],
  ["Palossand-GX CES", "Eerie Light", 60, SpecialCondition.CONFUSED, ["Fighting Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Pelipper CES", "Water Pulse", 80, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Shiftry-GX CES", "Perplex", 40, SpecialCondition.CONFUSED, ["Grass Energy SVE"]],
  ["Shuppet CES 64", "Perplex", 0, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Skitty CES", "Fake Out", 10, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Surskit CES", "Bubble", 0, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Torkoal CES", "Searing Flame", 80, SpecialCondition.BURNED, ["Fire Energy SVE", "Fire Energy SVE", "Water Energy SVE"]],
  ["Victreebel CES", "Corrosive Acid", 80, SpecialCondition.BURNED, ["Grass Energy SVE", "Grass Energy SVE", "Water Energy SVE"]],
  ["Voltorb CES", "Thunder Shock", 20, SpecialCondition.PARALYZED, ["Lightning Energy SVE", "Water Energy SVE"]],
  ["Abomasnow FLI", "Hypno Hammer", 80, SpecialCondition.ASLEEP, ["Grass Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Amaura FLI", "Powder Snow", 30, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE"]],
  ["Azelf FLI", "Hypnoblast", 10, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Heliolisk FLI", "Volt Wave", 80, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Honedge FLI 2", "Metal Sound", 0, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Hoopa FLI", "Psy Bolt", 10, SpecialCondition.PARALYZED, ["Psychic Energy SVE"]],
  ["Infernape FLI", "Burst Punch", 50, SpecialCondition.BURNED, ["Fighting Energy SVE", "Water Energy SVE"]],
  ["Noivern FLI", "Supersonic", 20, SpecialCondition.CONFUSED, ["Water Energy SVE"]],
  ["Poipole FLI", "Spit Poison", 0, SpecialCondition.POISONED, ["Water Energy SVE"]],
  ["Spewpa FLI", "String Shot", 20, SpecialCondition.PARALYZED, ["Grass Energy SVE"]],
  ["Xurkitree FLI", "Dazzle Blast", 20, SpecialCondition.CONFUSED, ["Lightning Energy SVE"]],
  ["Zygarde FLI 72", "Glare", 20, SpecialCondition.PARALYZED, ["Water Energy SVE", "Water Energy SVE"]],
  ["Abomasnow UPR", "Hypno Hammer", 80, SpecialCondition.ASLEEP, ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]],
  ["Bronzong UPR", "Psy Bolt", 20, SpecialCondition.PARALYZED, ["Metal Energy SVE"]],
  ["Bronzor UPR", "Hypnosis", 0, SpecialCondition.ASLEEP, ["Metal Energy SVE"]],
  ["Drifloon UPR", "Creepy Wind", 0, SpecialCondition.CONFUSED, ["Psychic Energy SVE"]],
  ["Infernape UPR", "Burst Punch", 50, SpecialCondition.BURNED, ["Fire Energy SVE", "Water Energy SVE"]],
  ["Manaphy UPR", "Water Pulse", 20, SpecialCondition.ASLEEP, ["Water Energy SVE"]],
  ["Monferno UPR", "Super Singe", 20, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Pachirisu UPR", "Nuzzle", 0, SpecialCondition.PARALYZED, ["Lightning Energy SVE"]],
  ["Pheromosa-GX UPR", "Cruel Spike", 60, SpecialCondition.CONFUSED, ["Grass Energy SVE", "Grass Energy SVE"]],
  ["Prinplup UPR", "Bubble Beam", 20, SpecialCondition.PARALYZED, ["Water Energy SVE"]],
  ["Shaymin UPR", "Soothing Scent", 30, SpecialCondition.ASLEEP, ["Grass Energy SVE", "Water Energy SVE"]],
  ["Toxicroak UPR", "Poison Jab", 30, SpecialCondition.POISONED, ["Psychic Energy SVE"]],
  ["Turtonator UPR", "Searing Flame", 10, SpecialCondition.BURNED, ["Fire Energy SVE"]],
  ["Yanmega UPR", "Supersonic", 30, SpecialCondition.CONFUSED, ["Grass Energy SVE"]],
];

describe('printed attack Special Conditions', () => {
  beforeAll(ensureClientCards);

  for (const [card, attack, damage, condition, energy] of printedAttacks) {
    for (const shield of [true, false]) {
      it(`${card} ${attack} ${shield ? 'respects' : 'applies without'} attack-effect protection`, () => {
        const random = spyOn(Math, 'random').and.returnValue(shield ? 0.1 : 0.9);
        const g = setupGame({
          turn: 5,
          player1: { active: { card, energy }, deck: padDeck(16) },
          player2: { active: { card: 'Finneon MT', energy: ['Water Energy SVE'] }, deck: padDeck(16) },
        });
        const target = g.player2.active;
        const defender = target.getPokemonCard()!;
        defender.hp = 1000;
        defender.weakness = [];
        defender.resistance = [];
        g.state.activePlayer = 1;
        useAttack(g.store, g.state, 1, 'Elegant Swim');
        expect(target.preventEffectsOfAttacksNextTurn).toBe(shield);

        const observed: { damage: number; applied: boolean; isAttack: boolean }[] = [];
        const reduce = g.store.reduceEffect.bind(g.store);
        spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
          const next = reduce(state, effect);
          if ((effect instanceof AddSpecialConditionsEffect || effect instanceof AddSpecialConditionsPowerEffect)
            && effect.target === target && effect.specialConditions.includes(condition)) {
            observed.push({
              damage: target.damage,
              applied: target.specialConditions.includes(condition),
              isAttack: effect instanceof AddSpecialConditionsEffect,
            });
          }
          return next;
        });
        random.and.returnValue(0.1);
        useAttack(g.store, g.state, 0, attack);

        if (shield) {
          expect(observed.some(event => event.applied)).toBe(false);
        } else {
          expect(observed).toEqual([{ damage, applied: true, isAttack: true }]);
        }
        g.store.cleanup();
      });
    }
  }
});

describe('Special Condition attack source and timing', () => {
  beforeAll(ensureClientCards);

  it('keeps the coin flip and skips Paralysis on tails for Wrap', () => {
    spyOn(Math, 'random').and.returnValue(0.9);
    const g = setupGame({
      turn: 5,
      player1: { active: { card: 'Dragonair SIT 130', energy: padDeck(2) }, deck: padDeck(16) },
      player2: { active: { card: 'Rookidee SSH' }, deck: padDeck(16) },
    });
    useAttack(g.store, g.state, 0, 'Wrap');
    expect(g.player2.active.damage).toBe(30);
    expect(g.player2.active.specialConditions).not.toContain(SpecialCondition.PARALYZED);
    g.store.cleanup();
  });

  for (const [barrier, opening, energy, blocks] of [
    ['Finneon MT', 'Elegant Swim', ['Water Energy SVE'], true],
    ['Clefable BKP', 'Moon Barrier', ['Fairy Energy XY'], false],
  ] as const) {
    it(`attributes a copied Wrap to Mew ex when facing ${opening}`, () => {
      spyOn(Math, 'random').and.returnValue(0.1);
      const g = setupGame({
        turn: 5,
        player1: { active: { card: barrier, energy: [...energy] }, deck: padDeck(16) },
        player2: {
          active: { card: 'Mew ex 30C', energy: padDeck(2) },
          bench: [{ card: 'Dragonair SIT 130' }],
          deck: padDeck(16),
        },
      });
      const sources: string[] = [];
      const reduce = g.store.reduceEffect.bind(g.store);
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof AddSpecialConditionsEffect && effect.target === g.player1.active) {
          sources.push(effect.source.getPokemonCard()!.fullName);
        }
        return reduce(state, effect);
      });

      useAttack(g.store, g.state, 0, opening);
      g.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Wrap' }));
      useAbility(g.store, g.state, 1, 'Memory Helix');

      expect(sources).toEqual(['Mew ex 30C']);
      expect(g.player1.active.damage).toBe(blocks ? 0 : 30);
      expect(g.player1.active.specialConditions.includes(SpecialCondition.PARALYZED)).toBe(!blocks);
      g.store.cleanup();
    });
  }

  it('uses the actual source when Mimikyu copies the opponent’s last Wrap', () => {
    const random = spyOn(Math, 'random').and.returnValue(0.9);
    const g = setupGame({
      turn: 5,
      player1: { active: { card: 'Dragonair SIT 130', energy: padDeck(2) }, deck: padDeck(16) },
      player2: {
        active: { card: 'Mimikyu TEU', energy: ['Fairy Energy XY', 'Water Energy SVE'] },
        deck: padDeck(16),
      },
    });
    useAttack(g.store, g.state, 0, 'Wrap');
    expect(g.player2.active.specialConditions).not.toContain(SpecialCondition.PARALYZED);
    random.and.returnValue(0.1);

    const sources: string[] = [];
    const reduce = g.store.reduceEffect.bind(g.store);
    spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof AddSpecialConditionsEffect && effect.target === g.player1.active) {
        sources.push(effect.source.getPokemonCard()!.fullName);
      }
      return reduce(state, effect);
    });

    useAttack(g.store, g.state, 1, 'Copycat');

    expect(sources).toEqual(['Mimikyu TEU']);
    expect(g.player1.active.damage).toBe(30);
    expect(g.player1.active.specialConditions).toContain(SpecialCondition.PARALYZED);
    g.store.cleanup();
  });

  it('lets Toxic Powder apply Poison while attack-effect protection is active', () => {
    spyOn(Math, 'random').and.returnValue(0.1);
    const g = setupGame({
      turn: 5,
      player1: { active: { card: 'Finneon MT', energy: padDeck(1) }, deck: padDeck(16) },
      player2: {
        active: { card: 'Rookidee SSH' },
        bench: [{ card: 'Brute Bonnet PAR', tools: ['Ancient Booster Energy Capsule PAR'] }],
        deck: padDeck(16),
      },
    });
    useAttack(g.store, g.state, 0, 'Elegant Swim');
    expect(g.player1.active.preventEffectsOfAttacksNextTurn).toBe(true);
    useAbility(g.store, g.state, 1, 'Toxic Powder');

    expect(g.player1.active.specialConditions).toContain(SpecialCondition.POISONED);
    g.store.cleanup();
  });
});
