"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roserade = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Roserade extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Roselia';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Energy Signal',
                useWhenInPlay: false,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'When you attach a [G] Energy card or [P] Energy card from your hand to Roserade during your turn, you may use this power. If you attach a [G] Energy card, the Defending Pokémon is now Confused. If you attach a [P] Energy card, the Defending Pokémon is now Poisoned. This power can\'t be used if Roserade is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Power Blow',
                cost: [G, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Does 20 damage times the amount of Energy attached to Roserade.'
            }];
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Roserade';
        this.fullName = 'Roserade UL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardList = player.active;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            store.reduceEffect(state, checkProvidedEnergy);
            const energyCount = checkProvidedEnergy.energyMap.length;
            effect.damage = 20 * energyCount;
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.getPokemonCard() === this) {
            const player = effect.player;
            if (effect.target.specialConditions.length > 0) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (effect.energyCard.name !== 'Grass Energy' && effect.energyCard.name !== 'Psychic Energy') {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    if (effect.energyCard.name === 'Grass Energy') {
                        (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, player), this);
                    }
                    if (effect.energyCard.name === 'Psychic Energy') {
                        (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, player), this);
                    }
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        return state;
    }
}
exports.Roserade = Roserade;
