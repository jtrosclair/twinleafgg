"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaChandelureex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaChandelureex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Lampent';
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 350;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Cursed Flame',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your opponent\'s Active Pokémon\'s Retreat Cost is [C] more.',
            }];
        this.attacks = [{
                name: 'Phantom Maze',
                cost: [P, P],
                damage: 130,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.',
            }];
        this.set = 'M5';
        this.setNumber = '36';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Chandelure ex';
        this.fullName = 'Mega Chandelure ex M5';
    }
    reduceEffect(store, state, effect) {
        // Ability: Cursed Flame — Ref: set-roaring-skies/hydreigon-ex.ts (CheckRetreatCostEffect); inverted for opponent Active cost increase
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const retreatingPlayer = effect.player;
            const abilityOwnerSide = game_1.StateUtils.getOpponent(state, retreatingPlayer);
            let chandelureInPlay = false;
            abilityOwnerSide.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
                if (card === this) {
                    chandelureInPlay = true;
                }
            });
            if (!chandelureInPlay) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, abilityOwnerSide, this)) {
                return state;
            }
            effect.cost.push(card_types_1.CardType.COLORLESS);
            return state;
        }
        // Phantom Maze — Ref: set-brilliant-stars/flygon.ts (Desert Pillar — Colorless in opponent Active Retreat Cost)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkRetreat = new check_effects_1.CheckRetreatCostEffect(opponent);
            store.reduceEffect(state, checkRetreat);
            const colorlessCount = checkRetreat.cost.filter(c => c === card_types_1.CardType.COLORLESS).length;
            effect.damage = 130 + 50 * colorlessCount;
        }
        return state;
    }
}
exports.MegaChandelureex = MegaChandelureex;
