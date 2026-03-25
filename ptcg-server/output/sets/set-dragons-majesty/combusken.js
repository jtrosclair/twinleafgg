"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Combusken = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Combusken extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Torchic';
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Lunge',
                cost: [R, C],
                damage: 60,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }
        ];
        this.powers = [{
                name: 'Heat Boost',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'Whenever you attach an Energy card from your hand to this Pokémon, remove all Special Conditions from it.'
            }];
        this.set = 'DRM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Combusken';
        this.fullName = 'Combusken DRM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === false) {
                    effect.damage = 0;
                }
            });
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            if (effect.target.specialConditions.length === 0) {
                return state;
            }
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const conditions = effect.target.specialConditions.slice();
            conditions.forEach(condition => {
                effect.target.removeSpecialCondition(condition);
            });
        }
        return state;
    }
}
exports.Combusken = Combusken;
