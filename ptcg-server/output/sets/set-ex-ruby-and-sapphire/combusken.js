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
        this.powers = [{
                name: 'Natural Cure',
                useWhenInPlay: false,
                powerType: game_1.PowerType.POKEBODY,
                text: 'When you attach a [R] Energy card from your hand to Combusken, remove all Special Conditions from Combusken.'
            }];
        this.attacks = [{
                name: 'Lunge',
                cost: [C, C],
                damage: 50,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'RS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Combusken';
        this.fullName = 'Combusken RS';
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
            if (!effect.energyCard.provides.includes(game_1.CardType.FIRE)) {
                return state;
            }
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
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
