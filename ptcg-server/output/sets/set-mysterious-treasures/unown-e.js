"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnownE = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
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
            const unownESlot = player.bench[benchIndex];
            const unownECard = unownESlot.getPokemonCard();
            if (!unownECard) {
                return state;
            }
            // Move all attached cards to discard first
            const otherCards = unownESlot.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
                !unownESlot.getPokemons().includes(card) &&
                (!unownESlot.tools || !unownESlot.tools.includes(card)));
            const tools = [...unownESlot.tools];
            // Move tools to discard first
            if (tools.length > 0) {
                for (const tool of tools) {
                    unownESlot.moveCardTo(tool, player.discard);
                }
            }
            // Move other cards to discard
            if (otherCards.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, unownESlot, player.discard, { cards: otherCards });
            }
            // Now attach Unown E as a Pokemon Tool
            unownESlot.moveCardTo(unownECard, targets[0]);
            targets[0].tools.push(unownECard);
            unownESlot.clearEffects();
        }
    });
}
class UnownE extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P, value: +10 }];
        this.retreat = [C];
        this.powers = [{
                name: 'EQUIP',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if Unown E is on your Bench, you may discard all cards attached to Unown E and attach Unown E to 1 of your Pokémon as a Pokémon Tool card. As long as Unown E is attached to a Pokémon, that Pokémon gets +10 HP.'
            }];
        this.attacks = [{
                name: 'Hidden Power',
                cost: [C, C],
                damage: 0,
                text: '**THIS ATTACK DOES NOT WORK LIL BRO**\n\nDuring your opponent\'s next turn, whenever your opponent flips a coin, treat it as tails.'
            }];
        this.set = 'MT';
        this.name = 'Unown [E]';
        this.fullName = 'Unown [E] MT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const generator = usePower(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.tools.includes(this) && effect.target.getPokemonCard() !== this) {
            const card = effect.target.getPokemonCard();
            if (card === undefined) {
                return state;
            }
            if (card.stage === card_types_1.Stage.BASIC) {
                effect.hp += 10;
            }
            return state;
        }
        return state;
    }
}
exports.UnownE = UnownE;
