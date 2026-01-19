"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kirlia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Kirlia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ralts';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P, value: +20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Teleportation Burst',
                cost: [P, C],
                damage: 30,
                text: 'You may switch Kirlia with 1 of your Benched Pokémon.'
            },
            {
                name: 'Super Psy Bolt',
                cost: [P, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Kirlia';
        this.fullName = 'Kirlia PL';
        this.usedTeleportationBurstTurn = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    this.usedTeleportationBurstTurn = true;
                }
            }, game_1.GameMessage.WANT_TO_SWITCH_POKEMON);
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedTeleportationBurstTurn) {
            const player = effect.player;
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            this.usedTeleportationBurstTurn = false;
        }
        return state;
    }
}
exports.Kirlia = Kirlia;
