"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arctozolt = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Arctozolt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rare Fossil';
        this.cardType = L;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Biting Whirlpool',
                powerType: game_1.PowerType.ABILITY,
                text: 'Whenever your opponent attaches an Energy card from their hand to 1 of their Pokémon, put 2 damage counters on that Pokémon.'
            }];
        this.attacks = [{
                name: 'Electro Ball',
                cost: [L, C],
                damage: 70,
                text: ''
            }];
        this.set = 'DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Arctozolt';
        this.fullName = 'Arctozolt DAA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && game_1.StateUtils.isPokemonInPlay(effect.player, this)) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            effect.target.damage += 20;
        }
        return state;
    }
}
exports.Arctozolt = Arctozolt;
