"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nuzleaf = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Nuzleaf extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Seedot';
        this.cardType = D;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Surprise Punch',
                cost: [D, C],
                damage: 20,
                text: 'Move an Energy attached to the Defending Pokémon to 1 of your opponent\'s Benched Pokémon.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '71';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Nuzleaf';
        this.fullName = 'Nuzleaf NXD';
        this.usedSurprisePunch = false;
    }
    reduceEffect(store, state, effect) {
        // Surprise Punch - flag for after attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedSurprisePunch = true;
        }
        // Surprise Punch - move opponent's energy after attack
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this) && this.usedSurprisePunch) {
            this.usedSurprisePunch = false;
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            const hasEnergy = opponent.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY);
            if (!hasBenched || !hasEnergy) {
                return state;
            }
            // Get blocked indices for non-energy cards
            const blocked = [];
            opponent.active.cards.forEach((card, index) => {
                if (card.superType !== card_types_1.SuperType.ENERGY) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                const cards = selected || [];
                if (cards.length === 0) {
                    return;
                }
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                    if (targets && targets.length > 0) {
                        opponent.active.moveCardTo(cards[0], targets[0]);
                    }
                });
            });
        }
        return state;
    }
}
exports.Nuzleaf = Nuzleaf;
