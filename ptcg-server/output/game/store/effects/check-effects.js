"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPrizesDestinationEffect = exports.AddSpecialConditionsPowerEffect = exports.CheckTableStateEffect = exports.CheckProvidedEnergyEffect = exports.CheckAttackCostEffect = exports.CheckRetreatCostEffect = exports.CheckPokemonTypeEffect = exports.CheckPokemonStatsEffect = exports.CheckPokemonPlayedTurnEffect = exports.CheckHpEffect = exports.CheckPokemonAttacksEffect = exports.CheckPokemonPowersEffect = exports.CheckEffects = void 0;
const card_types_1 = require("../card/card-types");
var CheckEffects;
(function (CheckEffects) {
    CheckEffects["CHECK_HP_EFFECT"] = "CHECK_HP_EFFECT";
    CheckEffects["CHECK_PRIZES_COUNT_EFFECT"] = "CHECK_PRIZE_COUNT_EFFECT";
    CheckEffects["CHECK_POKEMON_STATS_EFFECT"] = "CHECK_POKEMON_STATS_EFFECT";
    CheckEffects["CHECK_POKEMON_POWERS_EFFECT"] = "CHECK_POKEMON_POWERS_EFFECT";
    CheckEffects["CHECK_POKEMON_ATTACKS_EFFECT"] = "CHECK_POKEMON_ATTACKS_EFFECT";
    CheckEffects["CHECK_POKEMON_TYPE_EFFECT"] = "CHECK_POKEMON_TYPE_EFFECT";
    CheckEffects["CHECK_RETREAT_COST_EFFECT"] = "CHECK_RETREAT_COST_EFFECT";
    CheckEffects["CHECK_ATTACK_COST_EFFECT"] = "CHECK_ATTACK_COST_EFFECT";
    CheckEffects["CHECK_ENOUGH_ENERGY_EFFECT"] = "CHECK_ENOUGH_ENERGY_EFFECT";
    CheckEffects["CHECK_POKEMON_PLAYED_TURN_EFFECT"] = "CHECK_POKEMON_PLAYED_TURN_EFFECT";
    CheckEffects["CHECK_TABLE_STATE_EFFECT"] = "CHECK_TABLE_STATE_EFFECT";
    CheckEffects["ADD_SPECIAL_CONDITIONS_EFFECT"] = "ADD_SPECIAL_CONDITIONS_EFFECT";
    CheckEffects["CHECK_PRIZES_DESTINATION_EFFECT"] = "CHECK_PRIZES_DESTINATION_EFFECT";
})(CheckEffects = exports.CheckEffects || (exports.CheckEffects = {}));
class CheckPokemonPowersEffect {
    constructor(player, target) {
        this.type = CheckEffects.CHECK_POKEMON_POWERS_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        const pokemonCard = target.getPokemonCard();
        this.powers = pokemonCard ? pokemonCard.powers : [];
    }
}
exports.CheckPokemonPowersEffect = CheckPokemonPowersEffect;
class CheckPokemonAttacksEffect {
    constructor(player) {
        this.type = CheckEffects.CHECK_POKEMON_ATTACKS_EFFECT;
        this.preventDefault = false;
        this.player = player;
        const tool = player.active.tools[0];
        if (!!tool && tool.attacks.length > 0) {
            this.attacks = [...tool.attacks];
        }
        else {
            this.attacks = [];
        }
    }
}
exports.CheckPokemonAttacksEffect = CheckPokemonAttacksEffect;
class CheckHpEffect {
    constructor(player, target) {
        this.type = CheckEffects.CHECK_HP_EFFECT;
        this.preventDefault = false;
        this.nonstackingBoosts = [];
        this.player = player;
        this.target = target;
        this.pokemonCard = target.getPokemonCard();
        this.hp = this.pokemonCard ? this.pokemonCard.hp : 0;
    }
    get hp() {
        if (this.pokemonCard === undefined) {
            return 0;
        }
        return this.pokemonCard.hp + this.target.hpBonus;
    }
    set hp(value) {
        if (this.pokemonCard !== undefined) {
            this.target.hpBonus = value - this.pokemonCard.hp;
        }
    }
}
exports.CheckHpEffect = CheckHpEffect;
class CheckPokemonPlayedTurnEffect {
    constructor(player, target) {
        this.type = CheckEffects.CHECK_POKEMON_PLAYED_TURN_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        this.pokemonPlayedTurn = target.pokemonPlayedTurn;
    }
}
exports.CheckPokemonPlayedTurnEffect = CheckPokemonPlayedTurnEffect;
class CheckPokemonStatsEffect {
    constructor(target) {
        this.type = CheckEffects.CHECK_POKEMON_STATS_EFFECT;
        this.preventDefault = false;
        this.target = target;
        const pokemonCard = target.getPokemonCard();
        this.weakness = pokemonCard ? [...pokemonCard.weakness] : [];
        this.resistance = pokemonCard ? [...pokemonCard.resistance] : [];
    }
}
exports.CheckPokemonStatsEffect = CheckPokemonStatsEffect;
class CheckPokemonTypeEffect {
    constructor(target) {
        this.type = CheckEffects.CHECK_POKEMON_TYPE_EFFECT;
        this.preventDefault = false;
        this.target = target;
        const pokemonCard = target.getPokemonCard();
        this.cardTypes = pokemonCard ? [pokemonCard.cardType] : [];
        if (pokemonCard && pokemonCard.additionalCardTypes) {
            this.cardTypes = [...this.cardTypes, ...pokemonCard.additionalCardTypes];
        }
    }
}
exports.CheckPokemonTypeEffect = CheckPokemonTypeEffect;
class CheckRetreatCostEffect {
    constructor(player) {
        this.type = CheckEffects.CHECK_RETREAT_COST_EFFECT;
        this.preventDefault = false;
        this.player = player;
        const pokemonCard = player.active.getPokemonCard();
        this.cost = pokemonCard !== undefined ? [...pokemonCard.retreat] : [];
    }
}
exports.CheckRetreatCostEffect = CheckRetreatCostEffect;
class CheckAttackCostEffect {
    constructor(player, attack) {
        this.type = CheckEffects.CHECK_ATTACK_COST_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.attack = attack;
        this.cost = [...attack.cost];
    }
}
exports.CheckAttackCostEffect = CheckAttackCostEffect;
class CheckProvidedEnergyEffect {
    constructor(player, source) {
        this.type = CheckEffects.CHECK_ENOUGH_ENERGY_EFFECT;
        this.preventDefault = false;
        this._energyMap = [];
        this.totalProvidedTypes = [];
        this.specialEnergiesProvideColorless = false;
        this.player = player;
        this.source = source === undefined ? player.active : source;
    }
    // Apply effects such as Temple of Sinnoh and Spectral Breach
    get energyMap() {
        if (this.specialEnergiesProvideColorless) {
            this._energyMap.forEach((value) => {
                if (value.card.energyType === card_types_1.EnergyType.SPECIAL) {
                    value.provides = [card_types_1.CardType.COLORLESS];
                }
            });
        }
        return this._energyMap;
    }
}
exports.CheckProvidedEnergyEffect = CheckProvidedEnergyEffect;
class CheckTableStateEffect {
    constructor(benchSizes) {
        this.type = CheckEffects.CHECK_TABLE_STATE_EFFECT;
        this.preventDefault = false;
        this.benchSizes = benchSizes;
    }
}
exports.CheckTableStateEffect = CheckTableStateEffect;
class AddSpecialConditionsPowerEffect {
    constructor(player, source, target, specialConditions, poisonDamage = 10, burnDamage = 20, sleepFlips = 1) {
        this.type = CheckEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.source = source;
        this.target = target;
        this.specialConditions = specialConditions;
        this.poisonDamage = poisonDamage;
        this.burnDamage = burnDamage;
        this.sleepFlips = sleepFlips;
    }
}
exports.AddSpecialConditionsPowerEffect = AddSpecialConditionsPowerEffect;
class CheckPrizesDestinationEffect {
    constructor(player, destination) {
        this.type = CheckEffects.CHECK_PRIZES_DESTINATION_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.destination = destination;
    }
}
exports.CheckPrizesDestinationEffect = CheckPrizesDestinationEffect;
