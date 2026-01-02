"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gourgeist = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Gourgeist extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: D }];
        this.retreat = [C, C, C];
        this.evolvesFrom = 'Pumpkaboo';
        this.powers = [{
                name: 'Gourgantic',
                powerType: game_1.PowerType.ABILITY,
                text: ' If this Pokemon has any [G] Energy attached to it, its maximum HP is 200.'
            }];
        this.attacks = [{
                name: 'Horror Note',
                cost: [P, C, C],
                damage: 10,
                damageCalculation: 'x',
                text: ' This attack does 10 damage times the number of cards in your hand. '
            }];
        this.set = 'PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Gourgeist';
        this.fullName = 'Gourgeist PHF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, effect.target);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let grassProvided = false;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.GRASS)) {
                    grassProvided = true;
                }
                if ((em.card instanceof game_1.EnergyCard && em.card.blendedEnergies.includes(card_types_1.CardType.GRASS)) ||
                    (em.provides.includes(card_types_1.CardType.GRASS) || em.provides.includes(card_types_1.CardType.ANY))) {
                    grassProvided = true;
                }
            });
            if (grassProvided) {
                effect.hp += 100;
                return state;
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            effect.damage = player.hand.cards.length * 10;
        }
        return state;
    }
}
exports.Gourgeist = Gourgeist;
