"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Glaceon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Glaceon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Quick Attack',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            },
            {
                name: 'Reflect Energy',
                cost: [W, C],
                damage: 40,
                text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '30';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Glaceon';
        this.fullName = 'Glaceon DEX';
        this.usedReflectEnergy = false;
    }
    reduceEffect(store, state, effect) {
        // Quick Attack - flip for +30
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 30);
        }
        // Reflect Energy - flag for after attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedReflectEnergy = true;
        }
        // Reflect Energy - move energy after attack
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this) && this.usedReflectEnergy) {
            this.usedReflectEnergy = false;
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            const hasEnergy = player.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY);
            if (!hasBenched || !hasEnergy) {
                return state;
            }
            // Get blocked indices for non-energy cards
            const blocked = [];
            player.active.cards.forEach((card, index) => {
                if (card.superType !== card_types_1.SuperType.ENERGY) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                const cards = selected || [];
                if (cards.length === 0) {
                    return;
                }
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                    if (targets && targets.length > 0) {
                        player.active.moveCardTo(cards[0], targets[0]);
                    }
                });
            });
        }
        return state;
    }
}
exports.Glaceon = Glaceon;
