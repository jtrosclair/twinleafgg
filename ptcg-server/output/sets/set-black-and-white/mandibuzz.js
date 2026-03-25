"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mandibuzz = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mandibuzz extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Vullaby';
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Dark Pulse',
                cost: [D],
                damage: 20,
                damageCalculation: 'x',
                text: 'Does 20 damage times the number of [D] Energy attached to all of your Pokémon.'
            },
            {
                name: 'Punishment',
                cost: [D, D],
                damage: 40,
                damageCalculation: '+',
                text: 'If the Defending Pokémon has an Ability, this attack does 30 more damage.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.name = 'Mandibuzz';
        this.fullName = 'Mandibuzz BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let darkEnergy = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                cardList.cards.forEach(card => {
                    if (card.superType === card_types_1.SuperType.ENERGY) {
                        darkEnergy += card.provides.filter(e => e === card_types_1.CardType.DARK).length;
                    }
                });
            });
            effect.damage = 20 * darkEnergy;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defendingCard = opponent.active.getPokemonCard();
            if (defendingCard && defendingCard.powers && defendingCard.powers.length > 0) {
                // Check if any power is an Ability
                const hasAbility = defendingCard.powers.some(p => p.powerType === pokemon_types_1.PowerType.ABILITY);
                if (hasAbility) {
                    effect.damage += 30;
                }
            }
        }
        return state;
    }
}
exports.Mandibuzz = Mandibuzz;
