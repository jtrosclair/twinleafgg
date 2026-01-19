"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gorebyss = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Gorebyss extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Clamperl';
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [];
        this.attacks = [{
                name: 'Stun Needle',
                cost: [C],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Mystic Water',
                cost: [W, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 20 damage plus 10 more damage for each [P] Energy in play.'
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Gorebyss';
        this.fullName = 'Gorebyss HL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_2.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            let energyCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const playerCheckProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, playerCheckProvidedEnergyEffect);
                playerCheckProvidedEnergyEffect.energyMap.forEach(em => {
                    energyCount += em.provides.filter(cardType => {
                        return cardType === card_types_1.CardType.PSYCHIC || cardType === card_types_1.CardType.ANY;
                    }).length;
                });
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                const oppCheckProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent, cardList);
                store.reduceEffect(state, oppCheckProvidedEnergyEffect);
                oppCheckProvidedEnergyEffect.energyMap.forEach(em => {
                    energyCount += em.provides.filter(cardType => {
                        return cardType === card_types_1.CardType.PSYCHIC || cardType === card_types_1.CardType.ANY;
                    }).length;
                });
            });
            effect.damage += energyCount * 10;
        }
        return state;
    }
}
exports.Gorebyss = Gorebyss;
