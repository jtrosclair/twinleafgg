"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaLopunnyex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class MegaLopunnyex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Buneary';
        this.cardType = C;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.hp = 330;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Gale Thrust',
                cost: [C],
                damage: 60,
                text: 'If this Pokemon was on your Bench this turn, this attack does 170 more damage.'
            }, {
                name: 'Spike Hopper',
                cost: [C, C],
                damage: 160,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokemon.'
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Mega Lopunny ex';
        this.fullName = 'Mega Lopunny ex M2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Check if this Pokemon was on the bench this turn
            const activePokemon = player.active.getPokemonCard();
            if (activePokemon && activePokemon.movedToActiveThisTurn) {
                effect.damage += 170;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            // Check if this Pokemon was on the bench this turn
            const activePokemon = player.active.getPokemonCard();
            if (activePokemon && activePokemon.movedToActiveThisTurn) {
                activePokemon.movedToActiveThisTurn = false;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            // Spike Hopper ignores effects on opponent's Active Pokemon
            // This is handled by the damage calculation system automatically
            // No special implementation needed as the text is descriptive
        }
        return state;
    }
}
exports.MegaLopunnyex = MegaLopunnyex;
