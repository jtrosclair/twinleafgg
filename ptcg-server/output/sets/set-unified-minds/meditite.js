"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meditite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Meditite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Spirited Headbutt',
                cost: [F],
                damage: 40,
                text: 'This Pokémon can\'t use Spirited Headbutt during your next turn.'
            }];
        this.set = 'UNM';
        this.name = 'Meditite';
        this.fullName = 'Meditite UNM';
        this.setNumber = '109';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Spirited Headbutt')) {
                player.active.cannotUseAttacksNextTurnPending.push('Spirited Headbutt');
            }
        }
        return state;
    }
}
exports.Meditite = Meditite;
