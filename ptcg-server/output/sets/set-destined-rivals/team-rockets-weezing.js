"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsWeezing = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsWeezing extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Rocket\'s Koffing';
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = D;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'All-Out Explosion',
                cost: [D, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'This attack does 40 damage for each Pokémon in play with Koffing or Weezing in its name.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '126';
        this.name = 'Team Rocket\'s Weezing';
        this.fullName = 'Team Rocket\'s Weezing DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            let koffingsAndWeezings = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                var _a, _b;
                if (((_a = card.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name.includes('Koffing')) || ((_b = card.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.name.includes('Weezing'))) {
                    koffingsAndWeezings++;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                var _a, _b;
                if (((_a = card.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name.includes('Koffing')) || ((_b = card.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.name.includes('Weezing'))) {
                    koffingsAndWeezings++;
                }
            });
            effect.damage = 40 * koffingsAndWeezings;
        }
        return state;
    }
}
exports.TeamRocketsWeezing = TeamRocketsWeezing;
