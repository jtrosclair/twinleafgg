"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grimer = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Grimer extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Lure Poison',
                cost: [P],
                damage: 0,
                text: 'Flip a coin. If heads, switch 1 of your opponent\'s Benched Pokémon with the Defending Pokémon. The new Defending Pokémon is now Poisoned.'
            },
            {
                name: 'Sludge Toss',
                cost: [P, C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'PLF';
        this.setNumber = '45';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Grimer';
        this.fullName = 'Grimer PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const hasBench = opponent.bench.some(b => b.cards.length > 0);
                    if (!hasBench) {
                        return;
                    }
                    store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                        if (targets && targets.length > 0) {
                            opponent.switchPokemon(targets[0]);
                            opponent.active.addSpecialCondition(card_types_1.SpecialCondition.POISONED);
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Grimer = Grimer;
