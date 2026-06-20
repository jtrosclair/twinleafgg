"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaDarkraiex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaDarkraiex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.hp = 280;
        this.cardType = D;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Night Raid',
                cost: [D, D],
                damage: 110,
                damageCalculation: '+',
                text: 'If any of your Benched Pokémon have any damage counters on them, this attack does 110 more damage.',
            },
            {
                name: 'Abyss Eye',
                cost: [D, D, D],
                damage: 0,
                text: 'If your opponent\'s Active Pokémon is affected by any Special Condition, it is now Knocked Out.',
            }];
        this.set = 'M5';
        this.setNumber = '46';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Darkrai ex';
        this.fullName = 'Mega Darkrai ex M5';
    }
    reduceEffect(store, state, effect) {
        // Night Raid
        // Ref: set-mega-evolution/mega-camerupt-ex.ts (Roasting Heat - conditional bonus damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const benchDamaged = player.bench.some(b => b.cards.length > 0 && b.damage > 0);
            if (benchDamaged) {
                effect.damage += 110;
            }
        }
        // Abyss Eye
        // Ref: set-pokemon-151/weezing.ts (KnockOutEffect + TAKE_X_PRIZES — effect KO, not damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const opponentActive = opponent.active;
            if (opponentActive.specialConditions.length > 0) {
                opponentActive.clearAllSpecialConditions();
                const ko = new game_effects_1.KnockOutEffect(opponent, opponent.active);
                store.reduceEffect(state, ko);
                return (0, prefabs_1.TAKE_X_PRIZES)(store, state, effect.player, ko.prizeCount);
            }
        }
        return state;
    }
}
exports.MegaDarkraiex = MegaDarkraiex;
