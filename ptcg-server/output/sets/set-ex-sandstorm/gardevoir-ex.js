"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gardevoirex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Gardevoirex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 150;
        this.weakness = [{ type: G }, { type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Feedback',
                cost: [P, C],
                damage: 0,
                text: 'Count the number of cards in your opponent\'s hand. Put that many damage counters on the Defending Pokémon.'
            },
            {
                name: 'Psystorm',
                cost: [P, C, C, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the total amount of Energy attached to all Pokémon in play.'
            }];
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Gardevoir ex';
        this.fullName = 'Gardevoir ex SS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(effect.opponent.hand.cards.length, store, state, effect);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            let energies = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    energies += 1;
                });
            });
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    energies += 1;
                });
            });
            effect.damage = energies * 10;
        }
        return state;
    }
}
exports.Gardevoirex = Gardevoirex;
