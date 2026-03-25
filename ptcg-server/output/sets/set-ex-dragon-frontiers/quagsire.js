"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quagsire = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Quagsire extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wooper';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Dig Up',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when you play Quagsire from your hand to evolve 1 of your Pokémon, you may search your discard pile for up to 2 Pokémon Tool cards, show them to your opponent, and put them into your hand.'
            }];
        this.attacks = [{
                name: 'Pump Out',
                cost: [G, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If Quagsire has a Pokémon Tool card attached to it, this attack does 50 damage plus 20 more damage.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Quagsire';
        this.fullName = 'Quagsire DF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this)) {
            const player = effect.player;
            const blocked = [];
            player.discard.cards.forEach((card, index) => {
                if (!(card instanceof game_1.TrainerCard && card.trainerType === card_types_1.TrainerType.TOOL)) {
                    blocked.push(index);
                }
            });
            if (blocked.length === player.discard.cards.length) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, (result) => {
                if (!result) {
                    return state;
                }
                (0, prefabs_1.SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 2, blocked });
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.source.tools.length > 0) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.Quagsire = Quagsire;
