"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianPerrserker = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GalarianPerrserker extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Galarian Meowth';
        this.cardType = M;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Stealy Claws',
                cost: [M],
                damage: 20,
                text: 'Flip 3 coins. If any of them are heads, your opponent reveals their hand. Then, for each heads, discard a Trainer card from your opponent\'s hand.'
            },
            {
                name: 'Claw Slash',
                cost: [M, C, C],
                damage: 90,
                text: ''
            }];
        this.set = 'VIV';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '113';
        this.name = 'Galarian Perserker';
        this.fullName = 'Galarian Perserker VIV';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let headsCount = 0;
            prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, (results) => {
                results.forEach(result => {
                    if (result) {
                        headsCount++;
                    }
                });
                if (headsCount === 0) {
                    return state;
                }
                const minDiscard = Math.min(opponent.hand.cards.filter(c => c.superType === card_types_1.SuperType.TRAINER).length, headsCount);
                let cards = [];
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, { superType: card_types_1.SuperType.TRAINER }, { min: minDiscard, max: minDiscard, allowCancel: false }), selected => {
                    cards = selected || [];
                    opponent.hand.moveCardsTo(cards, opponent.discard);
                });
            });
        }
        return state;
    }
}
exports.GalarianPerrserker = GalarianPerrserker;
