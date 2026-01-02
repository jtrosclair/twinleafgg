"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wobbuffet = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Wobbuffet extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Stages of Evolution',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Wobbuffet is an Evolved Pokémon, your opponent pays [C] more to retreat his or her Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Grind',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the amount of Energy attached to Wobbuffet.'
            },
            {
                name: 'Shadow Tag',
                cost: [P, P, C],
                damage: 0,
                text: 'Put 7 damage counters on the Defending Pokémon at the end of your opponent\'s next turn.'
            }];
        this.set = 'LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Wobbuffet';
        this.fullName = 'Wobbuffet LM';
        this.KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
        this.CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isWobbuffetInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this && cardList.getPokemons().length > 1) {
                    isWobbuffetInPlay = true;
                }
            });
            if (!isWobbuffetInPlay) {
                return state;
            }
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                return state;
            }
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard) {
                effect.cost.push(game_1.CardType.COLORLESS);
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.getPokemonCard() === this) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                    store.reduceEffect(state, checkProvidedEnergy);
                    const blockedCards = [];
                    checkProvidedEnergy.energyMap.forEach(em => {
                        if (!em.provides.includes(game_1.CardType.ANY)) {
                            blockedCards.push(em.card);
                        }
                    });
                    const damagePerEnergy = 10;
                    effect.damage = checkProvidedEnergy.energyMap.length * damagePerEnergy;
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.player.marker.addMarker(this.KNOCKOUT_MARKER, this);
            opponent.active.marker.addMarker(this.CLEAR_KNOCKOUT_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.CLEAR_KNOCKOUT_MARKER, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.player.active.damage += 70;
            effect.player.active.marker.removeMarker(this.CLEAR_KNOCKOUT_MARKER, this);
            opponent.marker.removeMarker(this.KNOCKOUT_MARKER, this);
        }
        return state;
    }
}
exports.Wobbuffet = Wobbuffet;
