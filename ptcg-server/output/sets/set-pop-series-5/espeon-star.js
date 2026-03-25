"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EspeonStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class EspeonStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Purple Ray',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Espeon Star from your hand onto your Bench, you may use this power. Each Active Pokémon (both yours and your opponent\'s) is now Confused.'
            }];
        this.attacks = [
            {
                name: 'Psychic Boom',
                cost: [P, P, C],
                damage: 30,
                text: 'Does 30 damage plus 10 more damage for each Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'P5';
        this.name = 'Espeon Star';
        this.fullName = 'Espeon Star P5';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && !(0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (!result) {
                    return state;
                }
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
                (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, player, this);
                (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, opponent, this);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList === opponent.active) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, cardList);
                    store.reduceEffect(state, checkProvidedEnergy);
                    const blockedCards = [];
                    checkProvidedEnergy.energyMap.forEach(em => {
                        if (!em.provides.includes(card_types_1.CardType.ANY)) {
                            blockedCards.push(em.card);
                        }
                    });
                    const damagePerEnergy = 10;
                    effect.damage += checkProvidedEnergy.energyMap.length * damagePerEnergy;
                }
            });
        }
        return state;
    }
}
exports.EspeonStar = EspeonStar;
