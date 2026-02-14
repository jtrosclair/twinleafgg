"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yveltal = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yveltal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Fright Night',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is your Active Pokémon, each Pokémon Tool card in play has no effect.'
            }];
        this.attacks = [{
                name: 'Pitch-Black Spear',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'This attack does 60 damage to 1 of your opponent\'s Benched Pokémon-EX. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Yveltal';
        this.fullName = 'Yveltal BKT';
    }
    reduceEffect(store, state, effect) {
        // Fright Night
        if (effect instanceof play_card_effects_1.ToolEffect) {
            for (const player of state.players) {
                if (player.active.getPokemonCard() === this && !(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                    throw new game_error_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
                }
            }
        }
        // Pitch-Black Spear
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            // Count Pokemon-EX on bench and block non-EX Pokemon
            let exOnBench = 0;
            const blockedTo = [];
            opponent.bench.forEach((bench, index) => {
                var _a;
                if (bench.cards.length === 0) {
                    return;
                }
                if ((_a = bench.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                    exOnBench++;
                }
                else {
                    const target = {
                        player: game_1.PlayerType.TOP_PLAYER,
                        slot: game_1.SlotType.BENCH,
                        index
                    };
                    blockedTo.push(target);
                }
            });
            if (!exOnBench) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked: blockedTo }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const target = targets[0];
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Yveltal = Yveltal;
