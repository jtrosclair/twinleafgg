"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAudinoEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MAudinoEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.MEGA];
        this.stage = card_types_1.Stage.MEGA;
        this.evolvesFrom = 'Audino-EX';
        this.cardType = C;
        this.hp = 220;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.powers = [
            {
                name: 'Mega Evolution Rule',
                powerType: game_1.PowerType.MEGA_EVOLUTION_RULE,
                text: 'When 1 of your Pokémon becomes a Mega Evolution Pokémon, your turn ends.'
            }
        ];
        this.attacks = [
            {
                name: 'Magical Symphony',
                cost: [C, C, C],
                damage: 110,
                text: 'If you played a Supporter card from your hand during this turn, this attack does 50 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'FCO';
        this.name = 'M Audino-EX';
        this.fullName = 'M Audino-EX FCO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
    }
    reduceEffect(store, state, effect) {
        // screw the rules
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            if (effect.target.tools.length > 0 && effect.target.tools[0].name === 'Audino Spirit Link') {
                return state;
            }
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(effect.player);
            store.reduceEffect(state, endTurnEffect);
        }
        // Magical Symphony
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.supporterTurn >= 1) {
                (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(50, effect, store, state);
            }
        }
        return state;
    }
}
exports.MAudinoEx = MAudinoEx;
