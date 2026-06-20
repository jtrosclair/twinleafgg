"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meganium = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Meganium extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Bayleef';
        this.cardType = G;
        this.hp = 160;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Wild Growth',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each Basic [G] Energy attached to your Pokémon provides [G][G] Energy. You can\'t apply more than 1 Wild Growth Ability at a time.'
            }];
        this.attacks = [{
                name: 'Solar Beam',
                cost: [G, G, C, C],
                damage: 140,
                text: '',
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Meganium';
        this.fullName = 'Meganium M1S';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
            const player = effect.player;
            let hasMeganiumInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasMeganiumInPlay = true;
                }
            });
            if (!hasMeganiumInPlay) {
                return state;
            }
            if (hasMeganiumInPlay) {
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                effect.source.cards.forEach(c => {
                    if (c instanceof game_1.EnergyCard && !effect.energyMap.some(e => e.card === c)) {
                        const providedTypes = c.provides.filter(type => type === card_types_1.CardType.GRASS);
                        if (providedTypes.length > 0) {
                            effect.energyMap.push({ card: c, provides: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS] });
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
exports.Meganium = Meganium;
