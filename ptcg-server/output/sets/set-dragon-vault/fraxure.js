"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fraxure = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Fraxure extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Axew';
        this.cardType = N;
        this.hp = 70;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.powers = [{
                name: 'Grit',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pok\u00e9mon is affected by a Special Condition, each of its attacks does 40 more damage (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Dragon Claw',
                cost: [F, M, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'DRV';
        this.setNumber = '14';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Fraxure';
        this.fullName = 'Fraxure DRV';
    }
    reduceEffect(store, state, effect) {
        // Grit - passive ability: +40 damage when affected by Special Condition
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                if (player.active.specialConditions.length > 0) {
                    effect.damage += 40;
                }
            }
        }
        return state;
    }
}
exports.Fraxure = Fraxure;
