"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cacturne = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Cacturne extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cacnea';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Rapid-Fire Needles',
                cost: [G],
                damage: 60,
                text: 'Does 30 damage to 1 of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Payback',
                cost: [G, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If your opponent has only 1 Prize card left, this attack does 60 more damage and discard an Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '10';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cacturne';
        this.fullName = 'Cacturne PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                    damageEffect.target = targets[0];
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentPrizes = (0, prefabs_1.GET_PLAYER_PRIZES)(opponent);
            if (opponentPrizes.length === 1) {
                effect.damage += 60;
                (0, attack_effects_2.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON)(store, state, effect);
            }
        }
        return state;
    }
}
exports.Cacturne = Cacturne;
