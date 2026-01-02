"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whimsicottex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* useEnergyGift(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    yield store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 3 }), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
            player.deck.moveCardTo(transfer.card, target);
            next();
        }
    });
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Whimsicottex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Cottonee';
        this.cardType = G;
        this.hp = 230;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [];
        this.attacks = [{
                name: 'Energy Gift',
                cost: [G],
                damage: 0,
                text: 'Search your deck for up to 3 Basic Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
            },
            {
                name: 'Wonder Cotton',
                cost: [G],
                damage: 0,
                text: 'Your opponent reveals their hand. This attack does 50 damage for each Trainer card you find there.'
            }];
        this.set = 'WHT';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Whimsicott ex';
        this.fullName = 'Whimsicott ex SV11W';
    }
    reduceEffect(store, state, effect) {
        // Energy Gift
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useEnergyGift(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        // Wonder Cotton
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            state = store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => {
                const cardsInOpponentHand = opponent.hand.cards.filter(card => card instanceof game_1.TrainerCard).length;
                const damage = opponent.hand.cards.slice(0, cardsInOpponentHand);
                effect.damage = damage.length * 50;
            });
        }
        return state;
    }
}
exports.Whimsicottex = Whimsicottex;
