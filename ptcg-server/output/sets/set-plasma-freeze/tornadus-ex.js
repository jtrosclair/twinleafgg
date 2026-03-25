"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TornadusEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TornadusEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 180;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Windfall',
                cost: [C],
                damage: 0,
                text: 'Shuffle your hand into your deck. Then, draw 6 cards.'
            },
            {
                name: 'Jet Blast',
                cost: [C, C, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Plasma Energy attached to this Pokémon.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '98';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tornadus-EX';
        this.fullName = 'Tornadus-EX PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Windfall - shuffle hand into deck, draw 6
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Shuffle entire hand into deck
            const cards = player.hand.cards.slice();
            cards.forEach(c => {
                player.hand.moveCardTo(c, player.deck);
            });
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            (0, prefabs_1.DRAW_CARDS)(player, 6);
        }
        // Attack 2: Jet Blast - +30 per Plasma Energy attached
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkEnergy);
            let plasmaEnergyCount = 0;
            checkEnergy.energyMap.forEach(em => {
                if (em.card.superType === card_types_1.SuperType.ENERGY && em.card.name === 'Plasma Energy') {
                    plasmaEnergyCount++;
                }
            });
            effect.damage += 30 * plasmaEnergyCount;
        }
        return state;
    }
}
exports.TornadusEx = TornadusEx;
