"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ninjask = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ninjask extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nincada';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [];
        this.powers = [{
                name: 'Cast-Off Shell',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon, you may search your deck for Shedinja and put it onto your Bench. Shuffle your deck afterward.'
            }];
        this.attacks = [{
                name: 'U-Turn',
                cost: [G, C],
                damage: 90,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Ninjask';
        this.fullName = 'Ninjask M1S';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.JUST_EVOLVED(effect, this)) {
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { name: 'Shedinja' }, { min: 0, max: 1 });
        }
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
        }
        return state;
    }
}
exports.Ninjask = Ninjask;
