"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miltank = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Miltank extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Max Milk',
                cost: [C, C],
                damage: 0,
                text: 'Heal all damage from 1 of your Pokémon. Then, discard all Energy attached to this Pokémon.'
            },
            {
                name: 'Tackle',
                cost: [C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'PLF';
        this.setNumber = '93';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Miltank';
        this.fullName = 'Miltank PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    targets[0].damage = 0;
                }
                (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
            });
        }
        return state;
    }
}
exports.Miltank = Miltank;
