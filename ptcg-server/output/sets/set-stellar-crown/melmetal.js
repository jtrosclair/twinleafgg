"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Melmetal = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Melmetal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Meltan';
        this.cardType = M;
        this.hp = 160;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Wrack Down',
                cost: [C, C],
                damage: 50,
                text: ''
            },
            {
                name: 'Reforged Axe',
                cost: [M, C, C],
                damage: 250,
                text: 'Before doing damage, discard all Pokémon Tools from this Pokémon. If you can\'t discard any, this attack does nothing.'
            }];
        this.set = 'SCR';
        this.regulationMark = 'H';
        this.setNumber = '104';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Melmetal';
        this.fullName = 'Melmetal SCR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.damage = 0; // Reset damage to 0 if no tools are discarded
            // Discard active Pokemon's tool first
            const activePokemon = opponent.active;
            if (activePokemon.tools.length > 0) {
                prefabs_1.MOVE_CARD_TO(state, activePokemon.tools[0], opponent.discard);
                if (activePokemon.tools.length > 1) {
                    activePokemon.moveCardsTo(activePokemon.tools.slice(1), opponent.discard);
                }
                effect.damage = 250; // Set damage to 250 if a tool was discarded
            }
        }
        return state;
    }
}
exports.Melmetal = Melmetal;
