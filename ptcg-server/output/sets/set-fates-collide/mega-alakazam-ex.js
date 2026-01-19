"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAlakazamEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MAlakazamEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.MEGA];
        this.stage = card_types_1.Stage.MEGA;
        this.evolvesFrom = 'Alakazam-EX';
        this.cardType = P;
        this.hp = 210;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [
            {
                name: 'Mega Evolution Rule',
                powerType: game_1.PowerType.MEGA_EVOLUTION_RULE,
                text: 'When 1 of your Pokémon becomes a Mega Evolution Pokémon, your turn ends.'
            }
        ];
        this.attacks = [
            {
                name: 'Zen Force',
                cost: [P, C],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each damage counter on your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'FCO';
        this.name = 'M Alakazam-EX';
        this.fullName = 'M Alakazam-EX FCO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
    }
    reduceEffect(store, state, effect) {
        // screw the rules
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            if (effect.target.tools.length > 0 && effect.target.tools[0].name === 'Alakazam Spirit Link') {
                return state;
            }
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(effect.player);
            store.reduceEffect(state, endTurnEffect);
        }
        // Zen Force
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.damage += effect.opponent.active.damage * 3;
        }
        return state;
    }
}
exports.MAlakazamEx = MAlakazamEx;
