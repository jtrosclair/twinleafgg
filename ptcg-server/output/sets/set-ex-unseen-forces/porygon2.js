"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_list_1 = require("../../game/store/state/card-list");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
function* useTearAway(next, store, state, effect) {
    const player = effect.player;
    (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, effect.card);
    let pokemonsWithTool = 0;
    const blocked = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.tools.length > 0) {
            pokemonsWithTool += 1;
        }
        else {
            blocked.push(target);
        }
    });
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const max = Math.min(1, pokemonsWithTool);
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: max, allowCancel: true, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    const target = targets[0];
    const owner = game_1.StateUtils.findOwner(state, target);
    if (target.tools.length > 0) {
        if (target.tools.length > 1) {
            const toolsList = new card_list_1.CardList();
            toolsList.cards = [...target.tools];
            let selected = [];
            yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_TOOL, toolsList, {}, { min: 1, max: 1, allowCancel: false }), results => {
                selected = results || [];
                next();
            });
            if (selected && selected.length > 0) {
                target.moveCardTo(selected[0], owner.hand);
            }
        }
        else {
            target.moveCardTo(target.tools[0], owner.hand);
        }
    }
    return state;
}
class Porygon2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Porygon';
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: '3-D Reset',
                text: 'As often as you like during your turn (before your attack), return a Pokémon Tool card attached to 1 of your Pokémon to your hand. This power can\'t be used if Porygon2 is affected by a Special Condition.',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER
            }];
        this.attacks = [{
                name: 'Data Retrieval',
                cost: [C],
                damage: 0,
                text: 'If you have less than 8 cards in your hand, draw cards until you have 8 cards in your hand.'
            },
            {
                name: 'Scramble Trip',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'If Porygon2 has a Scramble Energy card attached to it, this attack does 40 damage plus 20 more damage and the Defending Pokémon is now Confused.'
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Porygon2';
        this.fullName = 'Porygon2 UF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const generator = useTearAway(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND)(effect.player, 8);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.active.cards.some(c => c.name === 'Scramble Energy')) {
                effect.damage += 20;
            }
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.active.cards.some(c => c.name === 'Scramble Energy')) {
                (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, opponent, this);
            }
        }
        return state;
    }
}
exports.Porygon2 = Porygon2;
