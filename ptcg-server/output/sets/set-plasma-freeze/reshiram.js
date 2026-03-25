"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reshiram = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Reshiram extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Purifying Flame',
                cost: [R, C, C],
                damage: 50,
                text: 'Remove all Special Conditions from this Pokémon.'
            },
            {
                name: 'Fusion Flare',
                cost: [R, C, C, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If Zekrom is on your Bench, this attack does 40 more damage.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Reshiram';
        this.fullName = 'Reshiram PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.clearAllSpecialConditions();
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let hasZekrom = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList === player.active) {
                    return;
                }
                const pokemon = cardList.getPokemonCard();
                if (pokemon && pokemon.name === 'Zekrom') {
                    hasZekrom = true;
                }
            });
            if (hasZekrom) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.Reshiram = Reshiram;
