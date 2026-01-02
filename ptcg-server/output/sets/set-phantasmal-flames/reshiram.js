"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reshiram = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Reshiram extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Flame',
                cost: [R],
                damage: 30,
                text: '',
            },
            {
                name: 'Burning Flare',
                cost: [R, R, R, R],
                damage: 240,
                text: 'This Pokemon does 60 damage to itself.',
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Reshiram';
        this.fullName = 'Reshiram M2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Deal 60 damage to this Pokemon
            const damageEffect = new attack_effects_1.DealDamageEffect(effect, 60);
            damageEffect.target = player.active;
            return store.reduceEffect(state, damageEffect);
        }
        return state;
    }
}
exports.Reshiram = Reshiram;
