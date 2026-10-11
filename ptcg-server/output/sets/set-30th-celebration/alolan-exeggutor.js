"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanExeggutor = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AlolanExeggutor extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Exeggcute';
        this.hp = 150;
        this.cardType = game_1.CardType.GRASS;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Scale Up',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has 6 or more [G] Energy attached, it gets +250 HP.'
            }];
        this.attacks = [{
                name: 'Mega Drain',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 150,
                text: 'Heal 50 damage from this Pokémon.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Alolan Exeggutor';
        this.fullName = 'Alolan Exeggutor 30C';
    }
    reduceEffect(store, state, effect) {
        // Scale Up
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)
            && effect.target.getPokemonCard() === this) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, effect.target);
            state = store.reduceEffect(state, checkProvidedEnergy);
            let grassEnergy = 0;
            checkProvidedEnergy.energyMap.forEach(em => {
                grassEnergy += em.provides.filter(t => t === game_1.CardType.GRASS || t === game_1.CardType.ANY).length;
            });
            if (grassEnergy >= 6) {
                effect.hp += 250;
            }
        }
        // Mega Drain
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 50);
        }
        return state;
    }
}
exports.AlolanExeggutor = AlolanExeggutor;
