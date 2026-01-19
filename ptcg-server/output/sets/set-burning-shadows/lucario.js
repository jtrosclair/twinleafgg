"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lucario = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lucario extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Riolu';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Stance',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may prevent all effects of your opponent\'s attacks, including damage, done to this Pokémon until the end of your opponent\'s next turn.'
            }];
        this.attacks = [
            {
                name: 'Submarine Blow',
                cost: [F, F, F],
                damage: 120,
                text: ''
            }
        ];
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Lucario';
        this.fullName = 'Lucario BUS';
        this.STANCE_MARKER = 'STANCE_MARKER';
        this.CLEAR_STANCE_MARKER = 'CLEAR_STANCE_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, wantToUse => {
                if (wantToUse) {
                    const cardList = game_1.StateUtils.findCardList(state, this);
                    cardList.marker.addMarker(this.STANCE_MARKER, this);
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
            return state;
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this) && effect.target.marker.hasMarker(this.STANCE_MARKER, this)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                (_a = cardList.marker) === null || _a === void 0 ? void 0 : _a.removeMarker(this.STANCE_MARKER, this);
            }
        }
        return state;
    }
}
exports.Lucario = Lucario;
