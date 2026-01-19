"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skitty = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Skitty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Tail Whip',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon can\'t attack during your opponent\'s next turn.'
            },
            {
                name: 'Tackle',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'PK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Skitty';
        this.fullName = 'Skitty PK';
        this.TAIL_WHIP_MARKER = 'TAIL_WHIP_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.ADD_MARKER)(this.TAIL_WHIP_MARKER, opponent.active, this);
                }
            });
        }
        if (effect instanceof game_effects_1.UseAttackEffect && (0, prefabs_1.HAS_MARKER)(this.TAIL_WHIP_MARKER, effect.player.active, this)) {
            throw new game_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            (0, prefabs_1.REMOVE_MARKER)(this.TAIL_WHIP_MARKER, effect.player.active, this);
        }
        return state;
    }
}
exports.Skitty = Skitty;
