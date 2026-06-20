"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banette = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const ghost_veil_1 = require("./ghost-veil");
class Banette extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shuppet';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Ghost Veil',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon can\'t be affected by effects of attacks or Abilities from your opponent\'s Pokémon.',
            }];
        this.attacks = [{
                name: 'Doll Catch',
                cost: [P],
                damage: 80,
                text: 'You may search your deck for any card and put it into your hand. If you do, shuffle your deck.',
            }];
        this.set = 'M5';
        this.setNumber = '32';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Banette';
        this.fullName = 'Banette M5';
    }
    reduceEffect(store, state, effect) {
        (0, ghost_veil_1.reduceGhostVeil)(store, state, effect, this);
        // Ref: set-chilling-reign/tapu-fini.ts (optional effect — ConfirmPrompt)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_DRAW_CARDS), wantSearch => {
                if (wantSearch && player.deck.cards.length > 0) {
                    (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, {}, { min: 1, max: 1, allowCancel: false }, effect);
                }
            });
        }
        return state;
    }
}
exports.Banette = Banette;
