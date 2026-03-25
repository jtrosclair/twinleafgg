"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tyrantrum = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tyrantrum extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Tyrunt';
        this.cardType = F;
        this.hp = 180;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Tyrannoguts',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokemon has any Special Energy attached, it gets +150 HP.'
            }];
        this.attacks = [{
                name: 'Wreak Havoc',
                cost: [F, C],
                damage: 160,
                text: 'Flip a coin until you get tails. For each heads, discard the top card of your opponent\'s deck.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Tyrantrum';
        this.fullName = 'Tyrantrum M3';
    }
    reduceEffect(store, state, effect) {
        // Ability: +150 HP if has Special Energy
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.getPokemonCard() === this) {
            const player = effect.player;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, effect.target);
            store.reduceEffect(state, checkEnergy);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            const hasSpecialEnergy = checkEnergy.energyMap.some(em => {
                const card = em.card;
                return card.superType === card_types_1.SuperType.ENERGY && card.energyType === card_types_1.EnergyType.SPECIAL;
            });
            if (hasSpecialEnergy) {
                effect.hp += 150;
            }
        }
        // Attack: Flip coins until tails, discard top card for each heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const flipCoins = (s) => {
                if (opponent.deck.cards.length === 0) {
                    return s;
                }
                return store.prompt(s, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), result => {
                    if (result === true) {
                        // Heads - discard top card
                        const deckTop = new game_1.CardList();
                        opponent.deck.moveTo(deckTop, 1);
                        if (deckTop.cards.length > 0) {
                            store.log(s, game_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: opponent.name, card: deckTop.cards[0].name, effect: 'Wreak Havoc' });
                            deckTop.moveTo(opponent.discard);
                        }
                        // Continue flipping
                        return flipCoins(s);
                    }
                    // Tails - stop flipping
                    return s;
                });
            };
            return flipCoins(state);
        }
        return state;
    }
}
exports.Tyrantrum = Tyrantrum;
