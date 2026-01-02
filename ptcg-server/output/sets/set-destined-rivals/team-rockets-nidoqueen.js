"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsNidoqueen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsNidoqueen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Team Rocket\'s Nidorina';
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = D;
        this.hp = 170;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Love Impact',
                cost: [D],
                damage: 60,
                damageCalculation: '+',
                text: 'If you have any Benched Pokémon with Nidoking in its name, this attack does 120 more damage.'
            },
            {
                name: 'Mega Kick',
                cost: [D, D],
                damage: 130,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '116';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Nidoqueen';
        this.fullName = 'Team Rocket\'s Nidoqueen DRI';
    }
    reduceEffect(store, state, effect) {
        // Love Impact
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let isNidokingInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                var _a;
                if ((_a = card.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name.includes('Nidoking')) {
                    isNidokingInPlay = true;
                }
            });
            if (isNidokingInPlay) {
                effect.damage += 120;
            }
        }
        return state;
    }
}
exports.TeamRocketsNidoqueen = TeamRocketsNidoqueen;
