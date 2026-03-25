"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haunter = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Haunter extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gastly';
        this.cardType = P;
        this.hp = 50;
        this.weakness = [];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Transparency',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'Whenever an attack does anything to Haunter, flip a coin. If heads, prevent all effects of that attack, including damage, done to Haunter. This power stops working while Haunter is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Nightmare',
                cost: [P, C],
                damage: 10,
                text: 'The Defending Pokémon is now Asleep.'
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Haunter';
        this.fullName = 'Haunter FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            if (pokemonCard !== this || sourceCard === undefined || state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            if (effect.target.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED)
                || effect.target.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP)
                || effect.target.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED)) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEMON_POWER_BLOCKED)(store, state, player, this)) {
                return state;
            }
            try {
                const coinFlip = new play_card_effects_1.CoinFlipEffect(player);
                store.reduceEffect(state, coinFlip);
            }
            catch (_a) {
                return state;
            }
            const coinFlipResult = (0, prefabs_1.SIMULATE_COIN_FLIP)(store, state, player);
            if (coinFlipResult) {
                effect.damage = 0;
                store.log(state, game_1.GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
            }
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const sleepEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            store.reduceEffect(state, sleepEffect);
            return state;
        }
        return state;
    }
}
exports.Haunter = Haunter;
