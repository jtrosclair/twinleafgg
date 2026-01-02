"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crawdaunt = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Crawdaunt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Corphish';
        this.cardType = D;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Vice Grip',
                cost: [C],
                damage: 30,
                text: ''
            },
            {
                name: 'Vengeful Scissors',
                cost: [D, D, C],
                damage: 130,
                text: 'If this Pokémon has any damage counters on it, this attack can be used for [D].'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Crawdaunt';
        this.fullName = 'Crawdaunt M1L';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let hasDamageCounters = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && cardList.damage > 0) {
                    hasDamageCounters = true;
                }
            });
            if (hasDamageCounters) {
                this.attacks[1].cost = [D];
            }
        }
        return state;
    }
}
exports.Crawdaunt = Crawdaunt;
