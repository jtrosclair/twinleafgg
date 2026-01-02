"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lugia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const costs_1 = require("../../game/store/prefabs/costs");
class Lugia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Crystal Type',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'Whenever you attach a [R], [W], or [P] basic Energy card from your hand to Lugia, Lugia\'s type (color) becomes the same as that Energy card type until the end of the turn.'
            }];
        this.attacks = [{
                name: 'Psychic',
                cost: [P, R],
                damage: 10,
                damageCalculation: 'x',
                text: 'This attack does 10 damage times the number of Energy cards attached to the Defending Pokémon.'
            },
            {
                name: 'Steam Blast',
                cost: [W, W, R, C],
                damage: 50,
                text: 'Discard an Energy card attached to Lugia.'
            }];
        this.set = 'AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '149';
        this.name = 'Lugia';
        this.fullName = 'Lugia AQ';
        this.R_CRYSTAL_MARKER = 'R_CRYSTAL_MARKER';
        this.W_CRYSTAL_MARKER = 'W_CRYSTAL_MARKER';
        this.P_CRYSTAL_MARKER = 'P_CRYSTAL_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.R_CRYSTAL_MARKER, this);
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.W_CRYSTAL_MARKER, this);
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.P_CRYSTAL_MARKER, this);
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.getPokemonCard() === this) {
            const player = effect.player;
            const energyCard = effect.energyCard;
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                return state;
            }
            if (effect.energyCard.energyType === card_types_1.EnergyType.BASIC) {
                if (energyCard.provides.includes(card_types_1.CardType.FIRE)) {
                    prefabs_1.REMOVE_MARKER(this.W_CRYSTAL_MARKER, player, this);
                    prefabs_1.REMOVE_MARKER(this.P_CRYSTAL_MARKER, player, this);
                    prefabs_1.ADD_MARKER(this.R_CRYSTAL_MARKER, player, this);
                }
                else if (energyCard.provides.includes(card_types_1.CardType.WATER)) {
                    prefabs_1.REMOVE_MARKER(this.R_CRYSTAL_MARKER, player, this);
                    prefabs_1.REMOVE_MARKER(this.P_CRYSTAL_MARKER, player, this);
                    prefabs_1.ADD_MARKER(this.W_CRYSTAL_MARKER, player, this);
                }
                else if (energyCard.provides.includes(card_types_1.CardType.PSYCHIC)) {
                    prefabs_1.REMOVE_MARKER(this.R_CRYSTAL_MARKER, player, this);
                    prefabs_1.REMOVE_MARKER(this.W_CRYSTAL_MARKER, player, this);
                    prefabs_1.ADD_MARKER(this.P_CRYSTAL_MARKER, player, this);
                }
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (prefabs_1.HAS_MARKER(this.R_CRYSTAL_MARKER, player, this)) {
                effect.cardTypes = [R];
            }
            else if (prefabs_1.HAS_MARKER(this.W_CRYSTAL_MARKER, player, this)) {
                effect.cardTypes = [W];
            }
            else if (prefabs_1.HAS_MARKER(this.P_CRYSTAL_MARKER, player, this)) {
                effect.cardTypes = [P];
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            const oppActive = opponent.active;
            oppActive.cards.forEach(card => {
                if (card instanceof game_1.EnergyCard) {
                    effect.damage += 10;
                }
            });
            effect.damage -= 10; // Subtract the base damage
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
        }
        return state;
    }
}
exports.Lugia = Lugia;
