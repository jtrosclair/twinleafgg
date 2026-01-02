"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Farfetchd = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Farfetchd extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Collect',
                cost: [C],
                damage: 0,
                text: 'Draw 2 cards.'
            },
            {
                name: 'Tool Buster',
                cost: [C],
                damage: 20,
                text: 'Before doing damage, discard all Pokémon Tool cards from your opponent\'s Active Pokémon. If you discarded a Pokémon Tool card in this way, this attack does 70 more damage.'
            }
        ];
        this.set = 'TEU';
        this.setNumber = '127';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Farfetch\'d';
        this.fullName = 'Farfetch\'d TEU';
    }
    reduceEffect(store, state, effect) {
        // Collect
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 2);
            return state;
        }
        // Tool Buster
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const activePokemon = opponent.active;
            let toolDiscarded = false;
            if (activePokemon.tools.length > 0) {
                activePokemon.moveCardsTo([...activePokemon.tools], opponent.discard);
                toolDiscarded = true;
            }
            if (toolDiscarded) {
                effect.damage += 70;
            }
            return state;
        }
        return state;
    }
}
exports.Farfetchd = Farfetchd;
