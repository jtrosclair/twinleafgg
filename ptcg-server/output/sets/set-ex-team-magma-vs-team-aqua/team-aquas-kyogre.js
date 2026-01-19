"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAquasKyogre = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamAquasKyogre extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_AQUA];
        this.cardType = W;
        this.additionalCardTypes = [D];
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Power Saver',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as the number of Pokémon in play (both yours and your opponent\'s) that has Team Aqua in its name is 3 or less, Team Aqua\'s Kyogre can\'t attack.'
            }];
        this.attacks = [{
                name: 'Aqua Trip',
                cost: [W, C],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused. If tails, the Defending Pokémon is now Asleep.'
            },
            {
                name: 'Aqua Smash',
                cost: [W, W, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is affected by a Special Condition, this attack does 50 damage plus 20 more damage.'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Team Aqua\'s Kyogre';
        this.fullName = 'Team Aqua\'s Kyogre MA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseAttackEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Count Team Rocket's Pokémon in play
            let teamAquaPokemonCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === null || card === void 0 ? void 0 : card.tags.includes(card_types_1.CardTag.TEAM_AQUA)) {
                    teamAquaPokemonCount++;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === null || card === void 0 ? void 0 : card.tags.includes(card_types_1.CardTag.TEAM_AQUA)) {
                    teamAquaPokemonCount++;
                }
            });
            // If less than 4 Team Rocket's Pokémon, prevent attack
            if (teamAquaPokemonCount <= 3) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)(store, state, effect);
                }
                else {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (effect.opponent.active.specialConditions.length > 0) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.TeamAquasKyogre = TeamAquasKyogre;
