"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kadabra = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Kadabra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Abra';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Psychic Draw',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may draw 2 cards.'
            }];
        this.attacks = [{
                name: 'Super Psy Bolt',
                cost: [P],
                damage: 30,
                text: ''
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Kadabra';
        this.fullName = 'Kadabra M1S';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.JUST_EVOLVED(effect, this)) {
            const player = effect.player;
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    prefabs_1.DRAW_CARDS(player, 2);
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        return state;
    }
}
exports.Kadabra = Kadabra;
