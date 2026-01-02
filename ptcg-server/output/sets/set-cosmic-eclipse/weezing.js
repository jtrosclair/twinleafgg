"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weezing = void 0;
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Weezing extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Koffing';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Blow-Away Bomb',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when you discard this Pokémon with the effect of Roxie, you may put 1 damage counter on each of your opponent\'s Pokémon. (Place damage counters after the effect of Roxie.)'
            }];
        this.attacks = [{
                name: 'Balloon Burst',
                cost: [P, C],
                damage: 90,
                text: 'Discard this Pokémon and all cards attached to it.'
            }];
        this.set = 'CEC';
        this.setNumber = '77';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Weezing';
        this.fullName = 'Weezing CEC';
        this.usedBalloonBurst = false;
    }
    reduceEffect(store, state, effect) {
        // Blow-Away Bomb is handled in Roxie. 
        // It shouldn't be, so if you can figure out how to get it to be contained in Koffing and Weezing themselves, please do so.
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            this.usedBalloonBurst = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedBalloonBurst === true) {
            const player = effect.player;
            const target = player.active;
            // Separate Pokemon card from attached cards
            const pokemons = target.getPokemons();
            const otherCards = target.cards.filter(card => !(card instanceof game_1.PokemonCard));
            // Move other cards to discard first
            if (otherCards.length > 0) {
                prefabs_1.MOVE_CARDS(store, state, target, player.discard, { cards: otherCards });
            }
            // Move Pokemon to discard
            if (pokemons.length > 0) {
                prefabs_1.MOVE_CARDS(store, state, target, player.discard, { cards: pokemons });
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedBalloonBurst) {
            this.usedBalloonBurst = false;
        }
        return state;
    }
}
exports.Weezing = Weezing;
