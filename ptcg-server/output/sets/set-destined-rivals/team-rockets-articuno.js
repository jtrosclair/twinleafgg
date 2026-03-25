"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsArticuno = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class TeamRocketsArticuno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Resistant Veil',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all effects of your opponent\'s Pokémon\'s attacks done to your Basic Team Rocket\'s Pokémon. (Damage is not an effect.)'
            }];
        this.attacks = [
            {
                name: 'Dark Frost',
                cost: [W, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'If this Pokémon has Team Rocket Energy attached, this attack does 60 more damage.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '51';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Articuno';
        this.fullName = 'Team Rocket\'s Articuno DRI';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        // Resistant Veil
        if (effect instanceof attack_effects_1.PutCountersEffect) {
            const opponent = effect.opponent;
            let isArticunoInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card.getPokemonCard() === this) {
                    isArticunoInPlay = true;
                }
            });
            if (!isArticunoInPlay) {
                return state;
            }
            if (state.phase === game_1.GamePhase.ATTACK) {
                const target = effect.target;
                if (((_a = target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.BASIC && ((_b = target.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.TEAM_ROCKET))) {
                    effect.preventDefault = true;
                }
            }
        }
        // Dark Frost
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.player.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.name === 'Team Rocket Energy')) {
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.TeamRocketsArticuno = TeamRocketsArticuno;
