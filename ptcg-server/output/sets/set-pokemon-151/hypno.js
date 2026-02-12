"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hypno = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hypno extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Drowzee';
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 110;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Here for Hypnosis',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may make your opponent\'s Active Pokémon Asleep.'
            }];
        this.attacks = [{
                name: 'Super Psy Bolt',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.PSYCHIC, game_1.CardType.COLORLESS],
                damage: 110,
                text: ''
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.name = 'Hypno';
        this.fullName = 'Hypno MEW';
    }
    reduceEffect(store, state, effect) {
        // Here for Hypnosis ability - when evolving, may make opponent's Active Pokémon Asleep
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this))
                return state;
            // Apply Asleep condition to opponent's Active Pokémon
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const specialConditionEffect = new check_effects_1.AddSpecialConditionsPowerEffect(player, this, opponent.active, [game_1.SpecialCondition.ASLEEP]);
            store.reduceEffect(state, specialConditionEffect);
            return state;
        }
        return state;
    }
}
exports.Hypno = Hypno;
