"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsTarountula = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TeamRocketsTarountula extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.TEAM_ROCKET];
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Take Down',
                cost: [G],
                damage: 30,
                text: 'This Pokémon also does 10 damage to itself.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '19';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Tarountula';
        this.fullName = 'Team Rocket\'s Tarountula DRI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.TeamRocketsTarountula = TeamRocketsTarountula;
