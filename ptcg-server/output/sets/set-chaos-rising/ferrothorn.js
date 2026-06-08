"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ferrothorn = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const energy_card_1 = require("../../game/store/card/energy-card");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ferrothorn extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ferroseed';
        this.hp = 130;
        this.cardType = M;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Prank Drop',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'When this Pokemon is discarded from your deck by your opponent\'s effect, your opponent discards the top 8 cards of their deck.'
            }];
        this.attacks = [{
                name: 'Special Whip',
                cost: [M, M, C],
                damage: 70,
                damageCalculation: '+',
                text: 'If this Pokemon has any Special Energy attached, this attack does 70 more damage.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.usSetNumber = 'CRI 63';
        this.name = 'Ferrothorn';
        this.fullName = 'Ferrothorn M4';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_effects_1.MoveCardsEffect) {
            const cards = effect.cards || [];
            if (!cards.includes(this))
                return state;
            if (effect.source === undefined || effect.destination === undefined)
                return state;
            try {
                const deckOwner = game_1.StateUtils.findOwner(state, effect.source);
                const effectOwner = effect.sourceCard ? game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, effect.sourceCard)) : null;
                if (effect.source !== deckOwner.deck || effect.destination !== deckOwner.discard)
                    return state;
                if (effectOwner !== deckOwner) {
                    (0, prefabs_1.DISCARD_TOP_X_OF_OPPONENTS_DECK)(store, state, deckOwner, 8, this, effect);
                }
            }
            catch (_b) {
                return state;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const hasSpecialEnergy = (_a = effect.source) === null || _a === void 0 ? void 0 : _a.cards.some((c) => c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL);
            if (hasSpecialEnergy) {
                effect.damage += 70;
            }
        }
        return state;
    }
}
exports.Ferrothorn = Ferrothorn;
