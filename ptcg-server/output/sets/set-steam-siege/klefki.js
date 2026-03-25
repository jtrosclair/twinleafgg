"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klefki = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
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
            // Attach Unown Q as a Pokemon Tool
            player.bench[benchIndex].moveCardTo(pokemonCard, targets[0]);
            targets[0].tools.push(pokemonCard);
            // Discard other cards
            const unownGSlot = player.bench[benchIndex];
            const unownGCard = unownGSlot.getPokemonCard();
            if (!unownGCard) {
                return state;
            }
            const otherCards = unownGSlot.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
                !unownGSlot.getPokemons().includes(card) &&
                (!unownGSlot.tools || !unownGSlot.tools.includes(card)));
            const tools = [...unownGSlot.tools];
            // Move tools to discard first
            if (tools.length > 0) {
                for (const tool of tools) {
                    unownGSlot.moveCardTo(tool, player.discard);
                }
            }
            // Move other cards to discard
            if (otherCards.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, unownGSlot, player.discard, { cards: otherCards });
            }
            unownGSlot.clearEffects();
        }
    });
}
class Klefki extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Wonder Lock',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is on your Bench, you may discard all cards attached to this Pokémon and attach it to 1 of your Pokémon as a Pokémon Tool card. Prevent any damage done to the Pokémon this card is attached to by attacks from your opponent\'s Mega Evolution Pokémon. If this card is attached to a Pokémon, discard this card at the end of your opponent\'s turn.'
            }];
        this.attacks = [{
                name: 'Fairy Wind',
                cost: [Y, C],
                damage: 30,
                text: ''
            }];
        this.set = 'STS';
        this.name = 'Klefki';
        this.fullName = 'Klefki STS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const generator = usePower(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        // Wonder Lock: prevent damage to the Pokémon this is attached to from opponent's Mega attacks.
        // AttackEffect has no .target; the defender is effect.opponent.active. Only run when this card
        // is attached to the defender (in target.cards), not when in deck/hand/etc.
        if (effect instanceof game_effects_1.AttackEffect) {
            const target = (_a = effect.opponent) === null || _a === void 0 ? void 0 : _a.active;
            if (!target || !target.cards.includes(this) || target.getPokemonCard() === this) {
                return state;
            }
            const sourceCard = (_b = effect.source) === null || _b === void 0 ? void 0 : _b.getPokemonCard();
            if (sourceCard && sourceCard.tags.includes(card_types_1.CardTag.MEGA)) {
                if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, effect.player, this)) {
                    return state;
                }
                effect.damage = 0;
                effect.preventDefault = true;
            }
        }
        // Discard at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const opponent = effect.player;
            const player = game_1.StateUtils.getOpponent(state, opponent);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (!(cardList instanceof game_1.PokemonCardList) || cardList.getPokemonCard() === this) {
                return state;
            }
            // Do nothing if the end turn effect is for this player (not opponent)
            if (effect.player === game_1.StateUtils.findOwner(state, cardList)) {
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, index) => {
                if (cardList.cards.includes(this)) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, cardList, player.discard, { cards: [this] });
                }
            });
        }
        return state;
    }
}
exports.Klefki = Klefki;
