"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Darmanitan = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Darmanitan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Darumaka';
        this.cardType = R;
        this.hp = 150;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Blazing Ball',
                cost: [C, C, C, C],
                damage: 40,
                text: 'This attack does 40 more damage for each [R] Energy attached to this Pokémon.',
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Darmanitan';
        this.fullName = 'Darmanitan M2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => cardType === card_types_1.CardType.FIRE || cardType === card_types_1.CardType.ANY).length;
            });
            effect.damage += energyCount * 40;
        }
        return state;
    }
}
exports.Darmanitan = Darmanitan;
