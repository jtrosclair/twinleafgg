"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wailordex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Wailordex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wailmer';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 200;
        this.weakness = [{ type: G }, { type: L }];
        this.retreat = [C, C, C, C, C];
        this.attacks = [{
                name: 'Super Deep Dive',
                cost: [C],
                damage: 0,
                text: 'If you don\'t have any Benched Pokémon, this attack does nothing. Remove 3 damage counters from Wailord ex. Switch Wailord ex with 1 of your Benched Pokémon.'
            },
            {
                name: 'Dwindling Wave',
                cost: [W, W, W, C],
                damage: 100,
                damageCalculation: '-',
                text: 'Does 100 damage minus 10 damage for each damage counter on Wailord ex.'
            }];
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.name = 'Wailord ex';
        this.fullName = 'Wailord ex SS';
        this.usedSuperDeepDive = false;
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            if (playerBench === 0) {
                return state;
            }
            const healEffect = new game_effects_1.HealEffect(player, player.active, 30);
            store.reduceEffect(state, healEffect);
            this.usedSuperDeepDive = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedSuperDeepDive) {
            this.usedSuperDeepDive = false;
            const player = effect.player;
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            effect.damage = Math.max(0, 100 - effect.player.active.damage);
        }
        return state;
    }
}
exports.Wailordex = Wailordex;
