"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cryogonal = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Cryogonal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Icy Wind',
                cost: [W],
                damage: 10,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Ice Shard',
                cost: [W, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is a Fighting Pokémon, this attack does 40 more damage.'
            }
        ];
        this.set = 'NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Cryogonal';
        this.fullName = 'Cryogonal NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const defendingPokemon = opponent.active.getPokemonCard();
            if (defendingPokemon && defendingPokemon.cardType === card_types_1.CardType.FIGHTING) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.Cryogonal = Cryogonal;
