"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sawsbuck = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sawsbuck extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Deerling';
        this.cardType = G;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Changing Seasons',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for a Stadium card, reveal it, and put it into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Superpowered Horns',
                cost: [G, C, C],
                damage: 110,
                text: ''
            }];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sawsbuck';
        this.fullName = 'Sawsbuck TEF';
        this.CHANGING_SEASONS_MARKER = 'CHANGING_SEASONS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            effect.player.marker.removeMarker(this.CHANGING_SEASONS_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.CHANGING_SEASONS_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.CHANGING_SEASONS_MARKER, player, this);
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (!(card instanceof game_1.TrainerCard && card.trainerType === game_1.TrainerType.STADIUM)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: game_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false, blocked }, this.powers[0]);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.CHANGING_SEASONS_MARKER, this);
        return state;
    }
}
exports.Sawsbuck = Sawsbuck;
