"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chimecho = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Chimecho extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Delta Support',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if you have a Supporter card with Holon in its name in play, you may search your discard pile for a basic Energy card or a Delta Rainbow Energy card, show it to your opponent, and put it into your hand. This power can\'t be used if Chimecho is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Hook',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'HP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Chimecho';
        this.fullName = 'Chimecho HP';
        this.HOLON_SUPPORTER_MARKER = 'HOLON_SUPPORTER_MARKER';
        this.DELTA_SUPPORT_USED_MARKER = 'DELTA_SUPPORT_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Track supporters played
        if (effect instanceof play_card_effects_1.PlaySupporterEffect) {
            if (effect.trainerCard.tags.includes(card_types_1.CardTag.DELTA_SPECIES)) {
                effect.player.marker.addMarker(this.HOLON_SUPPORTER_MARKER, this);
            }
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            prefabs_1.REMOVE_MARKER(this.DELTA_SUPPORT_USED_MARKER, effect.player, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.DELTA_SUPPORT_USED_MARKER, this);
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.HOLON_SUPPORTER_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (prefabs_1.HAS_MARKER(this.DELTA_SUPPORT_USED_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (!prefabs_1.HAS_MARKER(this.HOLON_SUPPORTER_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard && (c.energyType === card_types_1.EnergyType.BASIC || c.name === 'Delta Rainbow Energy');
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked = [];
            player.discard.cards.forEach((card, index) => {
                if (card instanceof game_1.EnergyCard && (card.energyType === card_types_1.EnergyType.BASIC || card.name === 'Delta Rainbow Energy')) {
                }
                else {
                    blocked.push(index);
                }
            });
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blocked }), cards => {
                cards = cards || [];
                prefabs_1.MOVE_CARDS(store, state, player.discard, player.hand, { cards: cards, sourceCard: this, sourceEffect: this.powers[0] });
            });
            prefabs_1.ADD_MARKER(this.DELTA_SUPPORT_USED_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
        }
        return state;
    }
}
exports.Chimecho = Chimecho;
