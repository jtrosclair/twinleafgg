"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beldum = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Beldum extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Magnetic Call',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, search your deck for a [M] Basic Pokémon and put it onto your Bench. Shuffle your deck afterward. This power can\'t be used if Beldum is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Metal Charge',
                cost: [M, C],
                damage: 30,
                text: 'Put 1 damage counter on Beldum.'
            }];
        this.set = 'NP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Beldum';
        this.fullName = 'Beldum NP';
        this.MAGNETIC_CALL_MARKER = 'MAGNETIC_CALL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.MAGNETIC_CALL_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.MAGNETIC_CALL_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.MAGNETIC_CALL_MARKER, player, this);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result) => {
                if (result) {
                    (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { cardType: card_types_1.CardType.METAL, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: false });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.player.active.damage += 10;
        }
        return state;
    }
}
exports.Beldum = Beldum;
