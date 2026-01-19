"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArceusGrass = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ArceusGrass extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.tags = [card_types_1.CardTag.ARCEUS];
        this.powers = [{
                name: 'Arceus Rule',
                powerType: game_1.PowerType.ARCEUS_RULE,
                text: 'You may have as many of this card in your deck as you like.'
            }];
        this.attacks = [
            {
                name: 'Leaf Refresh',
                cost: [G, C],
                damage: 30,
                text: 'Remove 3 damage counters from each of your Benched Pokémon.'
            }
        ];
        this.set = 'AR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'AR2';
        this.name = 'Arceus';
        this.fullName = 'Arceus Grass AR';
    }
    reduceEffect(store, state, effect) {
        // Leaf Refresh
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card !== player.active) {
                    card.damage -= 30;
                }
            });
        }
        return state;
    }
}
exports.ArceusGrass = ArceusGrass;
