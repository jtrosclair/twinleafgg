"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serperiorex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Serperiorex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Servine';
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = G;
        this.hp = 320;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Royal Cheer',
                powerType: game_1.PowerType.ABILITY,
                text: 'Attacks used by your Pokémon do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Grass Order',
                cost: [G, C, C, C],
                damage: 150,
                text: 'You may search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck.'
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Serperior ex';
        this.fullName = 'Serperior ex SV11B';
    }
    reduceEffect(store, state, effect) {
        // Royal Cheer ability - increase damage by 20
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target === effect.opponent.active) {
            const player = effect.player;
            // Check if this card is in play
            const isInPlay = player.bench.some(b => b.cards.some(c => c === this)) ||
                player.active.cards.some(c => c === this);
            if (isInPlay && !(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                effect.damage += 20;
            }
        }
        // Grass Order attack
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, {}, { min: 0, max: 3, allowCancel: false }, this.attacks[0]);
        }
        return state;
    }
}
exports.Serperiorex = Serperiorex;
