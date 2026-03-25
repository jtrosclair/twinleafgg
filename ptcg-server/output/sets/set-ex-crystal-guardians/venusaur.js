"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venusaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Venusaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Ivysaur';
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Chlorophyll',
                powerType: game_1.PowerType.POKEBODY,
                text: 'All Energy cards that provide only [C] Energy attached to your [G] Pokémon provide [G] Energy instead.'
            }];
        this.attacks = [{
                name: 'Green Blast',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 20 damage plus 10 more damage for each [G] Energy attached to all of your Pokémon.'
            },
            {
                name: 'Toxic Sleep',
                cost: [G, G, C],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep and Poisoned. Put 2 damage counters instead of 1 on the Defending Pokémon between turns.'
            }];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Venusaur';
        this.fullName = 'Venusaur CG';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
            const player = effect.player;
            if (!game_1.StateUtils.isPokemonInPlay(player, this)) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const checkType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkType);
            if (!checkType.cardTypes.includes(card_types_1.CardType.GRASS)) {
                return state;
            }
            effect.energyMap.forEach(energy => {
                if (energy.card.superType !== card_types_1.SuperType.ENERGY || energy.provides.length === 0) {
                    return;
                }
                if (!energy.provides.every(type => type === card_types_1.CardType.COLORLESS)) {
                    return;
                }
                energy.provides = energy.provides.map(() => card_types_1.CardType.GRASS);
            });
            // CheckProvidedEnergyEffect runs before the default energy-map population reducer,
            // so add transformed entries for attached energy cards that are not yet mapped.
            effect.source.cards.forEach(card => {
                if (!(card instanceof game_1.EnergyCard) || effect.energyMap.some(e => e.card === card)) {
                    return;
                }
                // Some special energies (e.g. Rainbow) define their own CheckProvidedEnergyEffect
                // mapping. If we also push here, the same card can be counted twice.
                const probe = new check_effects_1.CheckProvidedEnergyEffect(effect.player, effect.source);
                card.reduceEffect(store, state, probe);
                if (probe.energyMap.some(e => e.card === card)) {
                    return;
                }
                const provides = card.provides.every(type => type === card_types_1.CardType.COLORLESS)
                    ? card.provides.map(() => card_types_1.CardType.GRASS)
                    : card.provides;
                effect.energyMap.push({ card, provides });
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let energyCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(em => {
                    energyCount += em.provides.filter(cardType => {
                        return cardType === card_types_1.CardType.GRASS || cardType === card_types_1.CardType.ANY;
                    }).length;
                });
            });
            effect.damage += energyCount * 10;
            return state;
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this, 20);
        }
        return state;
    }
}
exports.Venusaur = Venusaur;
