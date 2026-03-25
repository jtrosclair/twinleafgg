"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Genesectex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Genesectex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = M;
        this.hp = 220;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Metal Signal',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for up to 2 [M] Evolution Pokemon, reveal them, and put them into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Protect Charge',
                cost: [M, M, C],
                damage: 150,
                text: 'During your opponent\'s next turn, this Pokemon takes 30 less damage from attacks.'
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '67';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Genesect ex';
        this.fullName = 'Genesect ex SV11B';
        this.turnTracker = 0;
        this.METAL_SIGNAL_MARKER = 'METAL_SIGNAL_MARKER';
        this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            effect.player.marker.removeMarker(this.METAL_SIGNAL_MARKER, this);
            effect.player.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            this.turnTracker = 0;
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.METAL_SIGNAL_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.METAL_SIGNAL_MARKER, player, this);
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (!(card instanceof game_1.PokemonCard && card.cardType === game_1.CardType.METAL && card.evolvesFrom !== '' && card.stage !== game_1.Stage.LV_X)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: game_1.SuperType.POKEMON }, { min: 0, max: 2, allowCancel: false, blocked }, this.powers[0]);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.METAL_SIGNAL_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this) && effect.target.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER)) {
            effect.damage -= 30;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
            this.turnTracker++;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this) && this.turnTracker == 2) {
            effect.player.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
        }
        return state;
    }
}
exports.Genesectex = Genesectex;
