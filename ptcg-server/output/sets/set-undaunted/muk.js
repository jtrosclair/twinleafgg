"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Muk = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Muk extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Grimer';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Sludge Drag',
                cost: [P],
                damage: 0,
                text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. The new Defending Pokémon is now Confused and Poisoned.'
            },
            {
                name: 'Pester',
                cost: [P, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is affected by a Special Condition, this attack does 50 damage plus 30 more damage.'
            }];
        this.set = 'UD';
        this.setNumber = '31';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Muk';
        this.fullName = 'Muk UD';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                opponent.switchPokemon(cardList);
                (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (effect.opponent.active.specialConditions.length > 0) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.Muk = Muk;
