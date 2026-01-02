"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AromaticGrassEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AromaticGrassEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [C];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.regulationMark = 'D';
        this.name = 'Aromatic Grass Energy';
        this.fullName = 'Aromatic Grass Energy VIV';
        this.legacyFullName = 'Aromatic Energy VIV';
        this.text = `As long as this card is attached to a Pokémon, it provides[G] Energy.
    
The [G] Pokémon this card is attached to recovers from all Special Conditions and can't be affected by any Special Conditions.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.GRASS] });
            return state;
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            const pokemon = effect.target;
            if (prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, pokemon)) {
                return state;
            }
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(pokemon);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.GRASS)) {
                return state;
            }
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
            pokemon.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
            return state;
        }
        const cardList = game_1.StateUtils.findCardList(state, this);
        if (effect instanceof check_effects_1.CheckTableStateEffect &&
            cardList instanceof game_1.PokemonCardList &&
            cardList.cards.includes(this)) {
            if (prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, cardList)) {
                return state;
            }
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.GRASS)) {
                return state;
            }
            cardList.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
            cardList.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
            cardList.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
            cardList.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
            cardList.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
        }
        return state;
    }
}
exports.AromaticGrassEnergy = AromaticGrassEnergy;
