"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Numel = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Numel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Singe',
                cost: [R],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            },
            {
                name: 'Heat Blast',
                cost: [R, R, C],
                damage: 60,
                text: ''
            }];
        this.set = 'PAF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Numel';
        this.fullName = 'Numel PAF';
        this.regulationMark = 'G';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
        return state;
    }
}
exports.Numel = Numel;
