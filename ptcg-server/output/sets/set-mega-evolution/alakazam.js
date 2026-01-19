"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alakazam = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Alakazam extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kadabra';
        this.cardType = P;
        this.hp = 140;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Psychic Draw',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may draw 3 cards.'
            }];
        this.attacks = [{
                name: 'Hand Power',
                cost: [P],
                damage: 0,
                text: 'Put 2 damage counters on your opponent\'s Active Pokémon for each card in your hand.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Alakazam';
        this.fullName = 'Alakazam M1S';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.DRAW_CARDS)(player, 3);
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON)(effect.player.hand.cards.length * 2, store, state, effect);
        }
        return state;
    }
}
exports.Alakazam = Alakazam;
