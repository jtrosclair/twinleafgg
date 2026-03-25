"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharizardGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CharizardGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Charmeleon';
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.cardType = R;
        this.hp = 250;
        this.weakness = [{ type: W }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Wing Attack',
                cost: [C, C, C],
                damage: 70,
                text: ''
            },
            {
                name: 'Crimson Storm',
                cost: [R, R, R, C, C],
                damage: 300,
                text: 'Discard 3 [R] Energy from this Pokémon.'
            },
            {
                name: 'Raging Out-GX',
                cost: [R, C, C],
                damage: 0,
                text: 'Discard the top 10 cards of your opponent\'s deck. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Charizard-GX';
        this.fullName = 'Charizard-GX BUS';
    }
    reduceEffect(store, state, effect) {
        // Crimson Storm: Discard 3 [R] energy from this Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.DISCARD_SPECIFIC_ENERGY_FROM_THIS_POKEMON)(store, state, effect, [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE]);
        }
        // Raging Out-GX: mill opponent 10, no damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 2, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            (0, prefabs_1.DISCARD_TOP_X_OF_OPPONENTS_DECK)(store, state, effect.player, 10, this, this.attacks[2]);
        }
        return state;
    }
}
exports.CharizardGX = CharizardGX;
