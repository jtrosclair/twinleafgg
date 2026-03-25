"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidoking = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Nidoking extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Nidorino';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Lovestrike',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 40 more damage for each Nidoqueen on your Bench.'
            },
            {
                name: 'Horn Drill',
                cost: [F, C, C, C],
                damage: 90,
                text: ''
            }
        ];
        this.set = 'PLF';
        this.setNumber = '58';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Nidoking';
        this.fullName = 'Nidoking PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let nidoqueenCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList === player.active) {
                    return;
                }
                const pokemon = cardList.getPokemonCard();
                if (pokemon && pokemon.name === 'Nidoqueen') {
                    nidoqueenCount++;
                }
            });
            effect.damage += nidoqueenCount * 40;
        }
        return state;
    }
}
exports.Nidoking = Nidoking;
