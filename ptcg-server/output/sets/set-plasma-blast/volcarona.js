"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volcarona = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Volcarona extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Larvesta';
        this.cardType = R;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Solar Transporter',
                cost: [C],
                damage: 0,
                text: 'Reveal the top 5 cards of your deck and put all Team Plasma cards you find there into your hand. Discard the other cards.'
            },
            {
                name: 'Leech Life',
                cost: [R, R, C],
                damage: 50,
                text: 'Heal from this Pok\u00e9mon the same amount of damage you did to the Defending Pok\u00e9mon.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '13';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Volcarona';
        this.fullName = 'Volcarona PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const topCards = player.deck.cards.slice(0, Math.min(5, player.deck.cards.length));
            if (topCards.length === 0) {
                return state;
            }
            const teamPlasmaCards = [];
            const otherCards = [];
            topCards.forEach(card => {
                if (card instanceof pokemon_card_1.PokemonCard && card.tags.includes(card_types_1.CardTag.TEAM_PLASMA)) {
                    teamPlasmaCards.push(card);
                }
                else if (card instanceof trainer_card_1.TrainerCard && card.tags.includes(card_types_1.CardTag.TEAM_PLASMA)) {
                    teamPlasmaCards.push(card);
                }
                else if (card.superType === card_types_1.SuperType.ENERGY && card.tags.includes(card_types_1.CardTag.TEAM_PLASMA)) {
                    teamPlasmaCards.push(card);
                }
                else {
                    otherCards.push(card);
                }
            });
            // Show all revealed cards to opponent
            store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, topCards), () => {
                // Move Team Plasma cards to hand
                teamPlasmaCards.forEach(card => {
                    player.deck.moveCardTo(card, player.hand);
                });
                // Discard the other cards
                otherCards.forEach(card => {
                    player.deck.moveCardTo(card, player.discard);
                });
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect.damage, effect, store, state);
        }
        return state;
    }
}
exports.Volcarona = Volcarona;
