"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NitroFireEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class NitroFireEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.FIRE];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.usSetNumber = 'CRI 81';
        this.name = 'Nitro Fire Energy';
        this.fullName = 'Nitro Fire Energy M4';
        this.text = 'As long as this card is attached to a Pokemon, it provides [R] Energy. If an attack used by the [R] Pokemon this card is attached to would discard this card, put it into your hand instead.';
    }
    reduceEffect(store, state, effect) {
        var _a, _b, _c;
        if (effect instanceof attack_effects_1.DiscardCardsEffect && ((_a = effect.cards) === null || _a === void 0 ? void 0 : _a.includes(this))) {
            try {
                const pokemon = effect.source;
                if (!((_c = (_b = pokemon === null || pokemon === void 0 ? void 0 : pokemon.energies) === null || _b === void 0 ? void 0 : _b.cards) === null || _c === void 0 ? void 0 : _c.includes(this)))
                    return state;
                const owner = game_1.StateUtils.findOwner(state, pokemon);
                if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, owner, this, pokemon))
                    return state;
                const checkType = new check_effects_1.CheckPokemonTypeEffect(pokemon);
                store.reduceEffect(state, checkType);
                if (checkType.cardTypes.includes(card_types_1.CardType.FIRE)) {
                    effect.cards = effect.cards.filter(c => c !== this);
                    pokemon.energies.moveCardTo(this, owner.hand);
                }
            }
            catch (_d) {
                return state;
            }
        }
        return state;
    }
}
exports.NitroFireEnergy = NitroFireEnergy;
