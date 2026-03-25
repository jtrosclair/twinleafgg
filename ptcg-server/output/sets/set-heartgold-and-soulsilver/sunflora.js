"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sunflora = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sunflora extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sunkern';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Sunshine Grace',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may search your deck for a [G] Pokémon, show it to your opponent, and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Sunflora is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Blade Arms',
                cost: [G, G, C],
                damage: 40,
                text: ''
            }];
        this.set = 'HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Sunflora';
        this.fullName = 'Sunflora HS';
        this.SUNSHINE_GRACE_MARKER = 'SUNSHINE_GRACE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SUNSHINE_GRACE_MARKER, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SUNSHINE_GRACE_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.SUNSHINE_GRACE_MARKER, this);
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, cardType: card_types_1.CardType.GRASS }, { min: 0, max: 1, allowCancel: true }), cards => {
                (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards, sourceCard: this, sourceEffect: this.powers[0] });
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    player.marker.addMarker(this.SUNSHINE_GRACE_MARKER, this);
                });
                return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
            });
        }
        return state;
    }
}
exports.Sunflora = Sunflora;
