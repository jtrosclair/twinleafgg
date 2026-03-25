"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manectric2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Manectric2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Electrike';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Energy Assist',
                cost: [L],
                damage: 0,
                text: 'Attach 2 basic Energy cards from your discard pile to 1 of your Benched Pokémon.'
            },
            {
                name: 'Quick Attack',
                cost: [L, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '44';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Manectric';
        this.fullName = 'Manectric DRX 44';
    }
    reduceEffect(store, state, effect) {
        // Energy Assist - attach 2 basic Energy from discard to 1 Benched Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            const basicEnergyInDiscard = player.discard.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC);
            if (basicEnergyInDiscard.length === 0) {
                return state;
            }
            const count = Math.min(2, basicEnergyInDiscard.length);
            // Choose a Benched Pokemon first
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return state;
                }
                const target = targets[0];
                // Then choose up to 2 basic Energy from discard
                const blocked = [];
                player.discard.cards.forEach((card, index) => {
                    if (card.superType !== card_types_1.SuperType.ENERGY || card.energyType !== card_types_1.EnergyType.BASIC) {
                        blocked.push(index);
                    }
                });
                return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min: count, max: count, allowCancel: false, blocked }), selected => {
                    const cards = selected || [];
                    cards.forEach(card => {
                        player.discard.moveCardTo(card, target);
                    });
                });
            });
        }
        // Quick Attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Manectric2 = Manectric2;
