"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gabite = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gabite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gible';
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: C, value: +20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Gather Up',
                cost: [C],
                damage: 0,
                text: 'Search your discard pile for up to 2 Energy cards, show them to your opponent, and put them into your hand.'
            },
            {
                name: 'Marvelous Shine',
                cost: [C, C],
                damage: 0,
                text: 'Flip a coin. If heads put 4 damage counters on 1 of your opponent\'s Pokémon.If tails, remove 4 damage counters from 1 of your Pokémon.'
            }];
        this.set = 'MT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Gabite';
        this.fullName = 'Gabite MT';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND)(store, state, effect.player, this, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 2 }, this.attacks[0]);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                        if (!targets || targets.length === 0) {
                            return;
                        }
                        const damageEffect = new attack_effects_1.PutCountersEffect(effect, 40);
                        damageEffect.target = targets[0];
                        store.reduceEffect(state, damageEffect);
                    });
                }
                else {
                    store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), results => {
                        const targets = results || [];
                        if (targets.length >= 0) {
                            const healEffect = new game_effects_1.HealEffect(player, targets[0], 30);
                            store.reduceEffect(state, healEffect);
                        }
                        return state;
                    });
                }
            });
        }
        return state;
    }
}
exports.Gabite = Gabite;
