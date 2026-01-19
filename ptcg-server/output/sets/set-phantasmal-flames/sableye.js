"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sableye = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sableye extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Angry Claw',
                cost: [D],
                damage: 20,
                damageCalculation: '+',
                text: 'If you have a Stage 2 [D] Pokémon in play, this attack does 70 more damage.'
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Sableye';
        this.fullName = 'Sableye MBG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let hasStage2Dark = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const pokemon = cardList.getPokemonCard();
                if (pokemon && pokemon.stage === game_1.Stage.STAGE_2 && pokemon.cardType === game_1.CardType.DARK) {
                    hasStage2Dark = true;
                }
            });
            if (hasStage2Dark) {
                effect.damage += 70;
            }
        }
        return state;
    }
}
exports.Sableye = Sableye;
