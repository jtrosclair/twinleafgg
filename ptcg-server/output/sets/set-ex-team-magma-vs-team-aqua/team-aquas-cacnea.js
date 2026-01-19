"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAquasCacnea = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamAquasCacnea extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_AQUA];
        this.cardType = G;
        this.additionalCardTypes = [D];
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Paralyzing Gaze',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Pin Missile',
                cost: [C, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 10 damage times the number of heads.'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Team Aqua\'s Cacnea';
        this.fullName = 'Team Aqua\'s Cacnea MA';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 4, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 10 * heads;
            });
        }
        return state;
    }
}
exports.TeamAquasCacnea = TeamAquasCacnea;
