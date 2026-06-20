"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lurantisex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lurantisex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Fomantis';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = G;
        this.hp = 260;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Lively Cutter',
                cost: [G],
                damage: 60,
                damageCalculation: '+',
                text: 'If this Pokémon healed during this turn, this attack does 200 more damage.',
            },
            {
                name: 'Leaf Guard',
                cost: [G, C],
                damage: 140,
                text: 'During your opponent\'s next turn, this Pokémon takes 50 less damage from attacks.',
            }];
        this.set = 'M5';
        this.setNumber = '4';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lurantis ex';
        this.fullName = 'Lurantis ex M5';
        this.HEALED_THIS_TURN = 'M5_LURANTIS_EX_HEALED';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.HealEffect && effect.target.getPokemonCard() === this) {
            (0, prefabs_1.ADD_MARKER)(this.HEALED_THIS_TURN, effect.player, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            (0, prefabs_1.REMOVE_MARKER)(this.HEALED_THIS_TURN, effect.player, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.HEALED_THIS_TURN, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this) && (0, prefabs_1.HAS_MARKER)(this.HEALED_THIS_TURN, effect.player, this)) {
            effect.damage += 200;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.player.active.damageReductionNextTurn = 50;
        }
        return state;
    }
}
exports.Lurantisex = Lurantisex;
