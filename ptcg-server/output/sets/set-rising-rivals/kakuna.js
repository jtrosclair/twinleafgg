"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kakuna = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kakuna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Weedle';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R, value: +20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Exoskeleton',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Any damage done to Kakuna by attacks is reduced by 20 (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Dangerous Evolution',
                cost: [G],
                damage: 0,
                text: 'The Defending Pokémon is now Poisoned. Flip a coin. If heads, search your deck for an Evolution card that evolves from Kakuna and put it onto Kakuna. (This counts as evolving Kakuna.) Shuffle your deck afterward.'
            }];
        this.set = 'RR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Kakuna';
        this.fullName = 'Kakuna RR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.getPokemonCard() === this) {
            if (!(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
                effect.damage -= 20;
            }
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, opponent, this);
            if (player.deck.cards.length === 0) {
                return state;
            }
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    let cards = [];
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, evolvesFrom: this.name }, { min: 0, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                        if (cards.length > 0) {
                            // Evolve Pokemon
                            player.deck.moveCardsTo(cards, player.active);
                            player.active.clearEffects();
                            player.active.pokemonPlayedTurn = state.turn;
                        }
                        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    });
                }
            });
        }
        return state;
    }
}
exports.Kakuna = Kakuna;
