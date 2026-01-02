"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ribombee = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ribombee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cutiefly';
        this.cardType = Y;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Honey Gather',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may search your deck for up to 2 basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.',
            }];
        this.attacks = [{
                name: 'Pollen Shot',
                cost: [C],
                damage: 20,
                text: ''
            },];
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Ribombee';
        this.fullName = 'Ribombee BUS';
        this.HONEY_GATHER_MARKER = 'HONEY_GATHER_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Honey Gather
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (prefabs_1.HAS_MARKER(this.HONEY_GATHER_MARKER, effect.player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2 }, this.powers[0]);
            prefabs_1.ADD_MARKER(this.HONEY_GATHER_MARKER, effect.player, this);
            prefabs_1.ABILITY_USED(player, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.HONEY_GATHER_MARKER, this);
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && prefabs_1.HAS_MARKER(this.HONEY_GATHER_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.HONEY_GATHER_MARKER, effect.player, this);
        }
        return state;
    }
}
exports.Ribombee = Ribombee;
