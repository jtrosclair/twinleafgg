"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Annihilape = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Annihilape extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Primeape';
        this.cardType = P;
        this.hp = 150;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Durable Body',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon would be Knocked Out by damage from an attack, flip a coin. If heads, this Pokémon is not Knocked Out and its remaining HP becomes 10 instead.',
            }];
        this.attacks = [{
                name: 'Ghost Blow',
                cost: [P, P],
                damage: 100,
                text: 'Place 5 damage counters on 1 of your opponent\'s Benched Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '39';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Annihilape';
        this.fullName = 'Annihilape M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-ascended-heroes/mega-hawlucha-ex.ts (Tenacious Body)
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)
            && effect.target.getPokemonCard() === this) {
            const owner = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, owner, this)) {
                return state;
            }
            const checkHpEffect = new check_effects_1.CheckHpEffect(owner, effect.target);
            store.reduceEffect(state, checkHpEffect);
            if (effect.damage >= checkHpEffect.hp) {
                return store.prompt(state, new game_1.CoinFlipPrompt(owner.id, game_1.GameMessage.COIN_FLIP), result => {
                    if (result === true) {
                        effect.surviveOnTenHPReason = this.powers[0].name;
                    }
                    return state;
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!opponent.bench.some(b => b.cards.length > 0)) {
                return state;
            }
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1 }), picked => {
                if (!picked || picked.length === 0) {
                    return;
                }
                const dest = picked[0];
                const putCounters = new game_effects_1.PlaceDamageCountersEffect(player, dest, 50, this);
                store.reduceEffect(state, putCounters);
            });
        }
        return state;
    }
}
exports.Annihilape = Annihilape;
