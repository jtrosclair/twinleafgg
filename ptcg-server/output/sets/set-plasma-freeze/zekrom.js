"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zekrom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zekrom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Mach Claw',
                cost: [L, C, C],
                damage: 50,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            },
            {
                name: 'Fusion Bolt',
                cost: [L, C, C, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If Reshiram is on your Bench, this attack does 40 more damage.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '39';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zekrom';
        this.fullName = 'Zekrom PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.ignoreResistance = true;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let hasReshiram = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList === player.active) {
                    return;
                }
                const pokemon = cardList.getPokemonCard();
                if (pokemon && pokemon.name === 'Reshiram') {
                    hasReshiram = true;
                }
            });
            if (hasReshiram) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.Zekrom = Zekrom;
