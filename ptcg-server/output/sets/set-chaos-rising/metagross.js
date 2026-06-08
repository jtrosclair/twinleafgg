"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metagross = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Metagross extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Metang';
        this.hp = 170;
        this.cardType = M;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Bounce Back',
                cost: [M, M, C],
                damage: 60,
                text: 'Your opponent switches their Active Pokemon with 1 of their Benched Pokemon.'
            },
            {
                name: 'Metallic Hammer',
                cost: [M, M, M, C],
                damage: 150,
                damageCalculation: '+',
                text: 'You may discard 3 [M] Energy from this Pokemon. If you do, this attack does 150 more damage.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.usSetNumber = 'POR 59';
        this.name = 'Metagross';
        this.fullName = 'Metagross M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench)
                return state;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                if (result && result.length > 0) {
                    opponent.switchPokemon(result[0]);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this) && effect instanceof game_effects_1.AttackEffect) {
            const player = effect.player;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            checkEnergy.source = effect.source;
            state = store.reduceEffect(state, checkEnergy);
            const metalCount = checkEnergy.energyMap.filter(e => e.provides.some((p) => p === card_types_1.CardType.METAL)).length;
            if (metalCount >= 3) {
                return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_DISCARD_ENERGY), confirm => {
                    if (confirm) {
                        effect.damage += 150;
                        return (0, costs_1.DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON)(store, state, effect, 3, card_types_1.CardType.METAL, 3, [game_1.SlotType.ACTIVE]);
                    }
                });
            }
        }
        return state;
    }
}
exports.Metagross = Metagross;
