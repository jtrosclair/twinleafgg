"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasTangela = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ErikasTangela extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.ERIKAS];
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Gathering of Blossoms',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may use this Ability. Search your deck for an Erika\'s Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Bind',
                cost: [G, C],
                damage: 50,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Erika\'s Tangela';
        this.fullName = 'Erika\'s Tangela MC';
        this.COLORFUL_RIOT_MARKER = 'COLORFUL_RIOT_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Colorful Riot ability
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.COLORFUL_RIOT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && card.tags.includes(game_1.CardTag.ERIKAS)) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, player, {}, { min: 0, max: 1, blocked });
            player.marker.addMarker(this.COLORFUL_RIOT_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
        }
        // Bind attack - coin flip for Paralyzed
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result) => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        // Reset marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.COLORFUL_RIOT_MARKER, this)) {
            effect.player.marker.removeMarker(this.COLORFUL_RIOT_MARKER, this);
        }
        return state;
    }
}
exports.ErikasTangela = ErikasTangela;
