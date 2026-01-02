"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnownQ = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* usePower(next, store, state, self, effect) {
    const player = effect.player;
    const cardList = game_1.StateUtils.findCardList(state, self);
    // check if UnownQ is on player's Bench
    const benchIndex = player.bench.indexOf(cardList);
    if (benchIndex === -1) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    const pokemonCard = player.bench[benchIndex].getPokemonCard();
    if (pokemonCard !== self) {
        throw new game_1.GameError(game_1.GameMessage.ILLEGAL_ACTION);
    }
    // Check if player has a Pokemon without tool, other than UnownQ
    let hasPokemonWithoutTool = false;
    const blocked = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.tools.length === 0 && card !== self) {
            hasPokemonWithoutTool = true;
        }
        else {
            blocked.push(target);
        }
    });
    if (!hasPokemonWithoutTool) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    // everything checked, we are ready to attach UnownQ as a tool.
    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true, blocked }), targets => {
        if (targets && targets.length > 0) {
            // Get the slot and card before moving anything
            const unownQSlot = player.bench[benchIndex];
            const unownQCard = unownQSlot.getPokemonCard();
            if (!unownQCard) {
                return state;
            }
            // Move all attached cards to discard first
            const otherCards = unownQSlot.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
                !unownQSlot.getPokemons().includes(card) &&
                (!unownQSlot.tools || !unownQSlot.tools.includes(card)));
            const tools = [...unownQSlot.tools];
            // Move tools to discard first
            if (tools.length > 0) {
                for (const tool of tools) {
                    unownQSlot.moveCardTo(tool, player.discard);
                }
            }
            // Move other cards to discard
            if (otherCards.length > 0) {
                prefabs_1.MOVE_CARDS(store, state, unownQSlot, player.discard, { cards: otherCards });
            }
            // Now attach Unown Q as a Pokemon Tool
            unownQSlot.moveCardTo(unownQCard, targets[0]);
            targets[0].tools.push(unownQCard);
            unownQSlot.clearEffects();
        }
    });
}
class UnownQ extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC, value: 10 }];
        this.retreat = [];
        this.powers = [{
                name: 'Quick',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if Unown Q is on your ' +
                    'Bench, you may discard all cards attached to Unown Q and attach Unown Q ' +
                    'to 1 of your Pokemon as Pokemon Tool card. As long as Unown Q ' +
                    'is attached to a Pokemon, you pay C less to retreat that Pokemon.'
            }];
        this.attacks = [
            {
                name: 'Hidden Power',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'MD';
        this.name = 'Unown Q';
        this.fullName = 'Unown Q MD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = usePower(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.tools.includes(this)) {
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            if (index !== -1) {
                effect.cost.splice(index, 1);
            }
            return state;
        }
        return state;
    }
}
exports.UnownQ = UnownQ;
