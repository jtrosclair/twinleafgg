"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yanma = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yanma extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Shockwave',
                cost: [G],
                damage: 0,
                text: 'Flip a coin. If heads, this attack does 10 damage to each of your opponent\'s Pokémon. Don\'t apply Weakness and Resistance. Then, if your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending Pokémon.'
            },
            {
                name: 'Swift',
                cost: [G, G, G],
                damage: 30,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, Pokémon Powers, or any other effects on the Defending Pokémon.'
            }
        ];
        this.set = 'N2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Yanma';
        this.fullName = 'Yanma N2';
        this.usedShockwave = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                        damageEffect.target = cardList;
                        store.reduceEffect(state, damageEffect);
                        this.usedShockwave = true;
                    });
                }
            });
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedShockwave) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentHasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!opponentHasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                if (!selected || selected.length === 0) {
                    return state;
                }
                const target = selected[0];
                opponent.switchPokemon(target);
                this.usedShockwave = false;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_2.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Yanma = Yanma;
