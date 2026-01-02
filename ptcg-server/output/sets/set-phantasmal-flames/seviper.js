"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seviper = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Seviper extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [C];
        this.powers = [{
                name: 'Excite Power',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have a [D] Pokemon ex in play, this Pokemon\'s attacks do 120 more damage to your opponent\'s Active Pokemon.'
            }];
        this.attacks = [{
                name: 'Jet Black Fang',
                cost: [D, D, D],
                damage: 120,
                text: '',
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Seviper';
        this.fullName = 'Seviper M2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            // Check if player has a [D] Pokemon ex in play
            let hasDarkPokemonEx = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card && card instanceof pokemon_card_1.PokemonCard &&
                    card.cardType === card_types_1.CardType.DARK &&
                    card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    hasDarkPokemonEx = true;
                }
            });
            // Add 120 more damage if condition is met
            if (hasDarkPokemonEx && effect.damage > 0) {
                effect.damage += 120;
            }
        }
        return state;
    }
}
exports.Seviper = Seviper;
