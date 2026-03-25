"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragoniteex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dragoniteex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.evolvesFrom = 'Dragonair';
        this.cardType = N;
        this.hp = 330;
        this.weakness = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Wing Attack',
                cost: [C],
                damage: 70,
                text: ''
            },
            {
                name: 'Mighty Meteor',
                cost: [W, L],
                damage: 140,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 140 more damage.' +
                    'If tails, during your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'G';
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '159';
        this.name = 'Dragonite ex';
        this.fullName = 'Dragonite ex OBF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (!result) {
                    player.active.cannotAttackNextTurnPending = true;
                }
                if (result) {
                    effect.damage += 140;
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Dragoniteex = Dragoniteex;
