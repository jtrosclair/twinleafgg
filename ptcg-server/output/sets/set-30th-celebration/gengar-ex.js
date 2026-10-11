"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gengarex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gengarex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Haunter';
        this.hp = 280;
        this.cardType = game_1.CardType.DARK;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Fainting Spell',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon, flip a coin. If heads, the Attacking Pokémon is Knocked Out.'
            }];
        this.attacks = [{
                name: 'Chaotic Pain',
                cost: [game_1.CardType.DARK, game_1.CardType.DARK],
                damage: 0,
                text: 'Place 13 damage counters on 1 of your opponent\'s Pokémon.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.name = 'Gengar ex';
        this.fullName = 'Gengar ex 30C';
    }
    reduceEffect(store, state, effect) {
        // Fainting Spell
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, wantToUse => {
                if (wantToUse) {
                    (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, flipResult => {
                        if (flipResult) {
                            opponent.active.damage += 999;
                        }
                    });
                }
            });
        }
        // Chaotic Pain
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return store.prompt(state, new game_1.ChoosePokemonPrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), (targets) => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, 130);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Gengarex = Gengarex;
