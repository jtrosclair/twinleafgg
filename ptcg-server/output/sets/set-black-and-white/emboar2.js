"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emboar2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Emboar2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Pignite';
        this.cardType = R;
        this.hp = 150;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Heat Crash',
                cost: [R, C, C],
                damage: 50,
                text: ''
            },
            {
                name: 'Flare Blitz',
                cost: [R, R, C, C],
                damage: 150,
                text: 'Discard all [R] Energy attached to this Pokémon.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Emboar';
        this.fullName = 'Emboar BLW 19';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Discard all Fire Energy attached to this Pokémon
            const fireEnergies = player.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY && c.provides.includes(card_types_1.CardType.FIRE));
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, fireEnergies);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.Emboar2 = Emboar2;
