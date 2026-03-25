"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsHonchkrow = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsHonchkrow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Rocket\'s Murkrow';
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = D;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Rocket Feathers',
                cost: [C, C],
                damage: 60,
                damageCalculation: 'x',
                text: 'You may discard any number of Supporter cards with "Team Rocket" in their name from your hand, and this attack does 60 damage for each card you discarded in this way.'
            },
            {
                name: 'Hammer In',
                cost: [D, C, C],
                damage: 100,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '127';
        this.name = 'Team Rocket\'s Honchkrow';
        this.fullName = 'Team Rocket\'s Honchkrow M2a';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hand = player.hand;
            // Find Team Rocket Supporter cards in hand
            const teamRocketSupporters = hand.cards.filter(card => card instanceof trainer_card_1.TrainerCard &&
                card.trainerType === card_types_1.TrainerType.SUPPORTER &&
                card.name.includes('Team Rocket'));
            // Create blocked array for non-Team Rocket Supporters
            const blocked = [];
            hand.cards.forEach((card, index) => {
                if (!(card instanceof trainer_card_1.TrainerCard &&
                    card.trainerType === card_types_1.TrainerType.SUPPORTER &&
                    card.name.includes('Team Rocket'))) {
                    blocked.push(index);
                }
            });
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, hand, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: teamRocketSupporters.length, allowCancel: false, blocked }), selected => {
                const discardCount = selected || [];
                // Operation canceled by the user or no cards selected
                if (discardCount.length === 0) {
                    effect.damage = 0;
                    return state;
                }
                // Move selected cards to discard pile
                player.hand.moveCardsTo(discardCount, player.discard);
                // Calculate damage: 60 per card discarded
                effect.damage = 60 * discardCount.length;
            });
        }
        return state;
    }
}
exports.TeamRocketsHonchkrow = TeamRocketsHonchkrow;
