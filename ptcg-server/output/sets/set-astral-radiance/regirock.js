"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regirock = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Regirock extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Regi Gate',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Giga Impact',
                cost: [F, F, C],
                damage: 140,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Regirock';
        this.fullName = 'Regirock ASR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: false });
        }
        // Giga Impact
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Regirock = Regirock;
