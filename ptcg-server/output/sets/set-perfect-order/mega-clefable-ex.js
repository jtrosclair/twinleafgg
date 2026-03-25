"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaClefableex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaClefableex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Clefairy';
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.POKEMON_SV_MEGA];
        this.cardType = P;
        this.hp = 320;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.powers = [{
                name: 'Wings of Light',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all effects of your opponent\'s Abilities done to this Pokemon.'
            }];
        this.attacks = [{
                name: 'Shooting Moon',
                cost: [P, P],
                damage: 120,
                text: 'You may discard up to 4 Energy cards from you hand. If you do, this attack does 40 more damage for each card discarded in this way.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Mega Clefable ex';
        this.fullName = 'Mega Clefable ex M3';
    }
    reduceEffect(store, state, effect) {
        // Wings of Light - Prevent opponent ability effects on this Pokemon
        if (effect instanceof game_effects_1.PowerEffect && effect.target && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard === this) {
                const targetOwner = game_1.StateUtils.findOwner(state, effect.target);
                const opponent = game_1.StateUtils.getOpponent(state, targetOwner);
                // Only prevent effects from opponent's abilities
                if (targetOwner === opponent) {
                    // Check if ability is blocked (to allow our own abilities)
                    if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, targetOwner, this)) {
                        effect.preventDefault = true;
                        return state;
                    }
                }
            }
        }
        // Shooting Moon - discard energy from hand for damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const energiesInHand = player.hand.cards.filter(card => card.superType === game_1.SuperType.ENERGY);
            if (energiesInHand.length === 0) {
                return state;
            }
            const maxToDiscard = Math.min(4, energiesInHand.length);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: maxToDiscard }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    const discardEffect = new attack_effects_1.DiscardCardsEffect(effect, cards);
                    discardEffect.target = player.active;
                    store.reduceEffect(state, discardEffect);
                    player.hand.moveCardsTo(cards, player.discard);
                    effect.damage += cards.length * 40;
                }
            });
        }
        return state;
    }
}
exports.MegaClefableex = MegaClefableex;
