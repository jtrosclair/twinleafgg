"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exeggutor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Exeggutor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Exeggcute';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Psychic Exchange',
                cost: [C],
                damage: 0,
                text: 'Shuffle your hand into your deck. Draw up to 8 cards.'
            },
            {
                name: 'Big Eggsplosion',
                cost: [P, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip a coin for each Energy attached to Exeggutor. This attack does 40 damage times the number of heads.'
            }];
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Exeggutor';
        this.fullName = 'Exeggutor RG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.deck, { cards: player.hand.cards.filter(c => c !== this), sourceCard: this, sourceEffect: this.attacks[0] });
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            (0, prefabs_1.DRAW_UP_TO_X_CARDS)(store, state, player, 8);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            // Count total energy provided by all attached energy cards
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.length;
            });
            effect.damage = 0;
            for (let i = 0; i < energyCount; i++) {
                (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                    if (result) {
                        effect.damage += 40;
                    }
                });
            }
        }
        return state;
    }
}
exports.Exeggutor = Exeggutor;
