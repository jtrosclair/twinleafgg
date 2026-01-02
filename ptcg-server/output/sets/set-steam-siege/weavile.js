"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weavile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_types_2 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
function* useTearAway(next, store, state, effect) {
    const player = effect.player;
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
    targets.forEach(target => {
        const owner = game_1.StateUtils.findOwner(state, target);
        if (target.tools.length > 0) {
            if (target.tools.length > 1) {
                store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_TOOL, target, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_2.TrainerType.TOOL }, { min: 1, max: 1, allowCancel: false }), selected => {
                    if (selected && selected.length > 0) {
                        prefabs_1.MOVE_CARD_TO(state, selected[0], owner.hand);
                    }
                });
            }
            else {
                target.moveCardTo(target.tools[0], owner.hand);
            }
        }
    });
    return state;
}
class Weavile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sneasel';
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Tear Away',
                text: 'As often as you like during your turn (before your attack), you may put a Pokémon Tool card attached to 1 of your Pokémon into your hand.',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY
            }];
        this.attacks = [{
                name: 'Slash',
                cost: [D, C],
                damage: 40,
                text: ''
            }];
        this.set = 'STS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Weavile';
        this.fullName = 'Weavile STS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const generator = useTearAway(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Weavile = Weavile;
