"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianWeezing = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GalarianWeezing extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Koffing';
        this.cardType = D;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Energy Factory',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each basic [D] Energy attached to your Pokémon that have “Weezing” in their name provides [D][D] Energy. You can\'t apply more than 1 Energy Factory Ability at a time.'
            }];
        this.attacks = [
            {
                name: 'Suffocating Gas',
                cost: [D, C],
                damage: 50,
                text: '',
            }
        ];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Galarian Weezing';
        this.fullName = 'Galarian Weezing CRE';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
            const player = effect.player;
            let hasThisInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasThisInPlay = true;
                }
            });
            if (!hasThisInPlay) {
                return state;
            }
            if (hasThisInPlay) {
                if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                    return state;
                }
                if (!((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name.includes('Weezing'))) {
                    return state;
                }
                effect.source.cards.forEach(c => {
                    if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && !effect.energyMap.some(e => e.card === c)) {
                        const providedTypes = c.provides.filter(type => type === card_types_1.CardType.DARK);
                        if (providedTypes.length > 0) {
                            effect.energyMap.push({ card: c, provides: [card_types_1.CardType.DARK, card_types_1.CardType.DARK] });
                        }
                    }
                });
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.GalarianWeezing = GalarianWeezing;
