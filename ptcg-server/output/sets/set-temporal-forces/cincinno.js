"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cinccino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cinccino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Minccino';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Gentle Slap',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            },
            {
                name: 'Special Roll',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                damageCalculation: 'x',
                text: 'This attack does 70 damage for each Special Energy card attached to this Pokémon.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
        this.name = 'Cinccino';
        this.fullName = 'Cinccino TEF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const pokemon = player.active;
            let specialEnergyCount = 0;
            pokemon.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard) {
                    if (c.energyType === card_types_1.EnergyType.SPECIAL) {
                        specialEnergyCount++;
                    }
                }
            });
            effect.damage = specialEnergyCount * 70;
            return state;
        }
        return state;
    }
}
exports.Cinccino = Cinccino;
