"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tauros = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Tauros extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Crush Chance',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Tauros from your hand onto your Bench, you may discard a Stadium card in play.'
            }];
        this.attacks = [{
                name: 'Call for Family',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Horn Attack',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Tauros';
        this.fullName = 'Tauros CG';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            if ((0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                    if (wantToUse) {
                        const powerEffect = new game_effects_1.PowerEffect(effect.player, this.powers[0], this);
                        store.reduceEffect(state, powerEffect);
                        // Discard Stadium
                        const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                        const player = game_1.StateUtils.findOwner(state, cardList);
                        cardList.moveTo(player.discard);
                        return state;
                    }
                    return state;
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 2 });
        }
        return state;
    }
}
exports.Tauros = Tauros;
