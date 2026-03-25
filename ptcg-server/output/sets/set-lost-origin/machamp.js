"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machamp = void 0;
const __1 = require("../..");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Machamp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Machoke';
        this.cardType = F;
        this.hp = 150;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Crisis Muscles',
                powerType: __1.PowerType.ABILITY,
                text: 'If your opponent has 3 or fewer Prize cards remaining, this Pokémon gets +150 HP.'
            }];
        this.attacks = [{
                name: 'Strong-Arm Lariat',
                cost: [F, F],
                damage: 100,
                damageCalculation: '+',
                text: 'You may do 100 more damage. If you do, during your next turn, this Pokémon can\'t attack.'
            }];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.regulationMark = 'F';
        this.name = 'Machamp';
        this.fullName = 'Machamp LOR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new __1.ConfirmPrompt(effect.player.id, __1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    effect.damage += 100;
                    player.active.cannotAttackNextTurnPending = true;
                }
            });
        }
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, effect.player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (opponent.getPrizeLeft() <= 3) {
                effect.hp += 100;
            }
            return state;
        }
        return state;
    }
}
exports.Machamp = Machamp;
