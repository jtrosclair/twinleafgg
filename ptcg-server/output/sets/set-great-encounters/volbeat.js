"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volbeat = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Volbeat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R, value: +20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Light Conduct',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if you have Illumise in play, you may search your discard pile for a Supporter card, show it to your opponent, and put it on top of your deck. This power can\'t be used if Volbeat is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Firefly Light',
                cost: [G, G],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            }
        ];
        this.set = 'GE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Volbeat';
        this.fullName = 'Volbeat GE';
        this.LIGHT_CONDUCT_MARKER = 'LIGHT_CONDUCT_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.LIGHT_CONDUCT_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            //Once per turn
            if (prefabs_1.HAS_MARKER(this.LIGHT_CONDUCT_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Cannot use if affected by special condition
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            //Must have supporter in discard
            if (!player.discard.cards.some(c => c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let hasIllumiseInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Illumise') {
                    hasIllumiseInPlay = true;
                }
            });
            if (!hasIllumiseInPlay) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            //power effect
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const deckTop = new game_1.CardList();
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: false }), selected => {
                        selected.forEach((card, index) => {
                            store.log(state, game_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
                        });
                        player.discard.moveCardTo(selected[0], deckTop);
                        deckTop.moveToTopOfDestination(player.deck);
                        store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => { });
                        prefabs_1.ADD_MARKER(this.LIGHT_CONDUCT_MARKER, player, this);
                        prefabs_1.ABILITY_USED(player, this);
                    });
                }
            });
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result => {
                if (result) {
                    attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
                }
            }));
        }
        return state;
    }
}
exports.Volbeat = Volbeat;
