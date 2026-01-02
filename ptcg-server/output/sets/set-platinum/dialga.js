"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialga = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dialga extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Reverse Time',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Dialga from your hand onto your Bench, you may search your discard pile for up to 3 in any combination of Pokémon (excluding Pokémon LV.X) and basic Energy cards. Show them to your opponent and put them on top of your deck in any order.'
            }];
        this.attacks = [
            {
                name: 'Time-Space Traveling',
                cost: [M, C, C],
                damage: 50,
                text: 'Draw cards until you have 7 cards in your hand.'
            }
        ];
        this.set = 'PL';
        this.setNumber = '5';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dialga';
        this.fullName = 'Dialga PL';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!player.discard.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC)
                && !player.discard.cards.some(c => c instanceof pokemon_card_1.PokemonCard && c.stage !== card_types_1.Stage.LV_X)) {
                return state;
            }
            if (prefabs_1.IS_POKEPOWER_BLOCKED(store, state, player, this)) {
                return state;
            }
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, wantToUse => {
                if (wantToUse) {
                    const blocked = [];
                    player.discard.cards.forEach((c, index) => {
                        const isPokemon = c instanceof pokemon_card_1.PokemonCard && c.stage !== card_types_1.Stage.LV_X;
                        const isBasicEnergy = c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
                        if (!isPokemon && !isBasicEnergy) {
                            blocked.push(index);
                        }
                    });
                    const deckTop = new game_1.CardList();
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 1, max: 3, allowCancel: false, blocked }), selected => {
                        if (selected.length === 0)
                            return;
                        selected.forEach(card => {
                            store.log(state, game_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
                            prefabs_1.MOVE_CARD_TO(state, card, deckTop);
                        });
                        store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                            if (order === null)
                                return state;
                            deckTop.applyOrder(order);
                            deckTop.moveToTopOfDestination(player.deck);
                            store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => { });
                        });
                        prefabs_1.ABILITY_USED(player, this);
                    });
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND(effect.player, 7);
        }
        return state;
    }
}
exports.Dialga = Dialga;
