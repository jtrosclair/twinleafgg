"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMagmasGroudon = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamMagmasGroudon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_MAGMA];
        this.cardType = F;
        this.additionalCardTypes = [D];
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Power Saver',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as the number of Pokémon in play (both yours and your opponent\'s) that has Team Magma in its name is 3 or less, Team Magma\'s Groudon can\'t attack.'
            }];
        this.attacks = [{
                name: 'Linear Attack',
                cost: [F, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Pulverize',
                cost: [F, F, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon already has at least 2 damage counters on it, this attack does 50 damage plus 20 more damage.'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Team Magma\'s Groudon';
        this.fullName = 'Team Magma\'s Groudon MA';
        this.wantsToSwitch = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseAttackEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Count Team Rocket's Pokémon in play
            let teamMagmaPokemonCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === null || card === void 0 ? void 0 : card.tags.includes(card_types_1.CardTag.TEAM_MAGMA)) {
                    teamMagmaPokemonCount++;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === null || card === void 0 ? void 0 : card.tags.includes(card_types_1.CardTag.TEAM_MAGMA)) {
                    teamMagmaPokemonCount++;
                }
            });
            // If less than 4 Team Rocket's Pokémon, prevent attack
            if (teamMagmaPokemonCount <= 3) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(20, effect, store, state);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.active.damage >= 20) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.TeamMagmasGroudon = TeamMagmasGroudon;
