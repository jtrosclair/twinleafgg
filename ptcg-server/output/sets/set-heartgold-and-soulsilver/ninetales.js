"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ninetales = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Ninetales extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Vulpix';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Roast Reveal',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may discard a [R] Energy card from your hand. If you do, draw 3 cards. This power can\'t be used if Ninetales is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Will-o\'-the-wisp',
                cost: [R, R, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Ninetales';
        this.fullName = 'Ninetales HS';
        this.ROAST_REVEAL_MARKER = 'ROAST_REVEAL_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Energy Draw
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof energy_card_1.EnergyCard && c.name === 'Fire Energy';
            });
            // One per turn only
            if (prefabs_1.HAS_MARKER(this.ROAST_REVEAL_MARKER, player, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            // Cannot use if affected by special conditions
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            // Cannot use if there is no energy in hand
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, name: 'Fire Energy' }, { allowCancel: true, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(cards, player.discard);
                prefabs_1.DRAW_CARDS(player, 3);
            });
            prefabs_1.ADD_MARKER(this.ROAST_REVEAL_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
            return state;
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            prefabs_1.REMOVE_MARKER(this.ROAST_REVEAL_MARKER, player, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.ROAST_REVEAL_MARKER, this);
        return state;
    }
}
exports.Ninetales = Ninetales;
