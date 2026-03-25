"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaHeracrossex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaHeracrossex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.cardType = G;
        this.hp = 280;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Juggernaut Horn',
                cost: [G, G],
                damage: 100,
                damageCalculation: '+',
                text: 'If this Pokémon was damaged by an attack during your opponent\'s last turn, this attack does that much more damage.'
            },
            {
                name: 'Mountain Ramming',
                cost: [G, G, G],
                damage: 170,
                text: 'Discard the top 2 cards of your opponent\'s deck.'
            }];
        this.set = 'PFL';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Mega Heracross ex';
        this.fullName = 'Mega Heracross ex PFL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const activeCard = effect.player.active.getPokemonCard();
            if (activeCard !== undefined && activeCard.damageTakenLastTurn !== undefined) {
                effect.damage += activeCard.damageTakenLastTurn;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.deck, opponent.discard, { count: 2, sourceCard: this, sourceEffect: this.attacks[1] });
        }
        return state;
    }
}
exports.MegaHeracrossex = MegaHeracrossex;
