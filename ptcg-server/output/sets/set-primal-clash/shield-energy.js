"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShieldEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ShieldEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [C];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'PRC';
        this.name = 'Shield Energy';
        this.fullName = 'Shield Energy PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '143';
        this.text = 'This card can only be attached to [M] Pokémon. This card provides [M] Energy only while this card is attached to a [M] Pokémon.' +
            '\n\n' +
            'The attacks of your opponent\'s Pokémon do 10 less damage to the [M] Pokémon this card is attached to (before applying Weakness and Resistance).' +
            '\n\n' +
            '(If this card is attached to anything other than a [M] Pokémon, discard this card.)';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        // Provide energy when attached to Metal Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.METAL)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.METAL] });
            }
        }
        // Prevent attaching to non Metal Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.METAL)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        // Discard card when not attached to Metal Pokemon
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this) || prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, cardList)) {
                        return;
                    }
                    const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                    store.reduceEffect(state, checkPokemonType);
                    if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.METAL)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
        }
        // Damage reduction
        if (effect instanceof attack_effects_1.PutDamageEffect && ((_b = (_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards) === null || _b === void 0 ? void 0 : _b.includes(this))) {
            if (prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.opponent, this, effect.target)) {
                return state;
            }
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.METAL)) {
                effect.reduceDamage(10);
            }
        }
        return state;
    }
}
exports.ShieldEnergy = ShieldEnergy;
