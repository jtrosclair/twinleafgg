"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shiftryex = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shiftryex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Nuzleaf';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = D;
        this.hp = 140;
        this.weakness = [{ type: G }, { type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Dark Eyes',
                powerType: game_1.PowerType.POKEBODY,
                text: 'After your opponent\'s Pokémon uses a Poké-Power, put 2 damage counters on that Pokémon.'
            }];
        this.attacks = [{
                name: 'Target Attack',
                cost: [D, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. If that Pokémon already has any damage counters on it, this attack does 50 damage instead. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Blade Arms',
                cost: [D, C, C],
                damage: 70,
                text: ''
            }];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.name = 'Shiftry ex';
        this.fullName = 'Shiftry ex CG';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === game_1.PowerType.POKEPOWER) {
            // Ignore synthetic probe effects emitted by IS_POKEPOWER_BLOCKED.
            if (!effect.card.powers.includes(effect.power)) {
                return state;
            }
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isShiftryInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (card === this) {
                    isShiftryInPlay = true;
                }
            });
            if (!isShiftryInPlay || (0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, opponent, this)) {
                return state;
            }
            const target = game_1.StateUtils.findCardList(state, effect.card);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList === target) {
                    const placeCountersEffect = new game_effects_1.PlaceDamageCountersEffect(player, cardList, 20, this);
                    state = store.reduceEffect(state, placeCountersEffect);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const targets = opponent.getPokemonInPlay();
            if (targets.length === 0)
                return state;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE]), selected => {
                const target = selected[0];
                const damage = target.damage > 0 ? 50 : 30;
                let damageEffect;
                if (target === opponent.active) {
                    damageEffect = new attack_effects_1.DealDamageEffect(effect, damage);
                }
                else {
                    damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
                }
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Shiftryex = Shiftryex;
