"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonsMagnemite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class HolonsMagnemite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.HOLONS];
        this.cardType = M;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Special Energy Effect',
                powerType: game_1.PowerType.HOLONS_SPECIAL_ENERGY_EFFECT,
                useFromHand: true,
                text: 'You may attach this as an Energy card from your hand to 1 of your Pokémon. While attached, this card is a Special Energy card and provides [C] Energy. [Click this effect to use it.]'
            }];
        this.attacks = [{
                name: 'Linear Attack',
                cost: [M],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Holon\'s Magnemite';
        this.fullName = 'Holon\'s Magnemite DS';
        // EnergyCard interface properties
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.text = 'This card provides [C] Energy.';
        this.isBlocked = false;
        this.blendedEnergies = [];
        this.blendedEnergyCount = 1;
        this.energyEffect = undefined;
    }
    reduceEffect(store, state, effect) {
        // Auto-detect if we've been removed from energies (e.g. discarded, returned to hand)
        // and reset superType back to POKEMON
        if (this.superType === card_types_1.SuperType.ENERGY) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (!(cardList instanceof game_1.PokemonCardList) || !cardList.energies.cards.includes(this)) {
                this.superType = card_types_1.SuperType.POKEMON;
            }
        }
        // The Special Energy Stuff
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.energyPlayedTurn === state.turn) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.energyPlayedTurn = state.turn;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                // Moving it onto the pokemon - first to main cards array, then to energies
                effect.preventDefault = true;
                player.hand.moveCardTo(this, targets[0]);
                if (!targets[0].energies.cards.includes(this)) {
                    targets[0].energies.cards.push(this);
                }
                this.superType = card_types_1.SuperType.ENERGY;
            });
        }
        // Provide energy when attached as energy
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.energies.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: this.provides });
        }
        // Linear Attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(10, effect, store, state);
        }
        return state;
    }
}
exports.HolonsMagnemite = HolonsMagnemite;
