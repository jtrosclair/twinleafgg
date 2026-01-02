"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dipplin = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dipplin extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Applin';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Festival Lead',
                powerType: game_1.PowerType.ABILITY,
                text: 'If Festival Grounds is in play, this Pokémon may use an attack it has twice. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Do the Wave',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                barrage: false,
                text: 'This attack does 20 damage for each of your Benched Pokémon.'
            }];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.setNumber = '18';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dipplin';
        this.fullName = 'Dipplin TWM1';
    }
    reduceEffect(store, state, effect) {
        // Handle the Do the Wave attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const activePokemon = opponent.active.getPokemonCard();
            if (activePokemon) {
                const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
                effect.damage = playerBenched * 20;
            }
            if (!prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
                // Dynamically set barrage if Festival Grounds is in play
                const stadiumCard = game_1.StateUtils.getStadiumCard(state);
                if (stadiumCard && stadiumCard.name === 'Festival Grounds') {
                    this.attacks[0].barrage = true;
                }
                else {
                    this.attacks[0].barrage = false;
                }
            }
        }
        return state;
    }
}
exports.Dipplin = Dipplin;
