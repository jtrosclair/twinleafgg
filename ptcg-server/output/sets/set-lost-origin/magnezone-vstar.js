"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagnezoneVSTAR = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MagnezoneVSTAR extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.VSTAR;
        this.evolvesFrom = 'Magnezone V';
        this.cardType = game_1.CardType.LIGHTNING;
        this.tags = [game_1.CardTag.POKEMON_VSTAR];
        this.hp = 270;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Magnetic Grip',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 180,
                text: 'Search your deck for up to 2 Item cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Splitting Beam',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.LIGHTNING],
                damage: 0,
                text: 'This attack does 90 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 VSTAR Power in a game.)'
            }
        ];
        this.set = 'LOR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.name = 'Magnezone VSTAR';
        this.fullName = 'Magnezone VSTAR LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.TRAINER, trainerType: game_1.TrainerType.ITEM }, { min: 0, max: 2, allowCancel: true }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            player.usedVSTAR = true;
            prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(90, effect, store, state, 0, 2);
        }
        return state;
    }
}
exports.MagnezoneVSTAR = MagnezoneVSTAR;
