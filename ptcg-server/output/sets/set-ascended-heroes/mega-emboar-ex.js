"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaEmboarex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaEmboarex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Pignite';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = R;
        this.hp = 380;
        this.weakness = [{ type: W }];
        this.resistance = [];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Crimson Blast',
                cost: [R, R, C],
                damage: 320,
                text: 'This Pokémon also does 60 damage to itself.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Mega Emboar ex';
        this.fullName = 'Mega Emboar ex MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 60);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.MegaEmboarex = MegaEmboarex;
