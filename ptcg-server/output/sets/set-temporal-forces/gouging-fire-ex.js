"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GougingFireex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GougingFireex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ANCIENT];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Heat Blast',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            },
            {
                name: 'Blaze Blitz',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 260,
                text: 'This Pokémon can\'t use Blaze Blitz again until it leaves the Active Spot.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
        this.name = 'Gouging Fire ex';
        this.fullName = 'Gouging Fire ex TEF';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Check marker
            if (player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            if (player.switchPokemon.name === this.name) {
                player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            }
            player.marker.addMarker(this.ATTACK_USED_MARKER, this);
        }
        return state;
    }
}
exports.GougingFireex = GougingFireex;
