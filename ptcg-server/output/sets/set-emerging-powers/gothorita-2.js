"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gothorita2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Gothorita2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gothita';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Deleting Glare',
                cost: [P],
                damage: 0,
                text: 'Flip a coin. If heads, discard an Energy attached to 1 of your opponent\'s Pokémon.'
            },
            {
                name: 'Super Psy Bolt',
                cost: [P, C, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Gothorita';
        this.fullName = 'Gothorita EPO 46';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if any opponent Pokémon has energy
            let hasEnergyOnField = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                    hasEnergyOnField = true;
                }
            });
            if (!hasEnergyOnField) {
                return state;
            }
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                        if (targets && targets.length > 0) {
                            const target = targets[0];
                            const energyCards = target.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                            if (energyCards.length > 0) {
                                let cards = [];
                                return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                                    cards = selected || [];
                                    if (cards.length > 0) {
                                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                                        return store.reduceEffect(state, discardEnergy);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Gothorita2 = Gothorita2;
