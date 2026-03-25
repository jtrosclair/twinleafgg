"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Larvesta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Larvesta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Peck Off',
                cost: [C],
                damage: 10,
                text: 'Before doing damage, discard all Pokémon Tools from your opponent\'s Active Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Larvesta';
        this.fullName = 'Larvesta SV11B';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const activePokemon = opponent.active;
            if (activePokemon.tools.length > 0) {
                activePokemon.moveCardsTo([...activePokemon.tools], opponent.discard);
            }
            return state;
        }
        return state;
    }
}
exports.Larvesta = Larvesta;
