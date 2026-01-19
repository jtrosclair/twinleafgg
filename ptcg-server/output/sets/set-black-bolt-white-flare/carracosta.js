"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carracosta = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const card_types_1 = require("../../game/store/card/card-types");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Carracosta extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Tirtouga';
        this.cardType = W;
        this.hp = 180;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Mighty Shell',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all damage and effects done to this Pokémon by attacks from your opponent\'s Pokemon that have any Special Energy attached to them.'
            }];
        this.attacks = [{
                name: 'Bite Down',
                cost: [W, C, C],
                damage: 0,
                text: 'The Defending Pokemon can\'t retreat during your opponent\'s next turn.'
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '23';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Carracosta';
        this.fullName = 'Carracosta SV11W';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (sourceCard) {
                // Only block if the attacking Pokémon has any Special Energy attached
                const specialEnergyAttached = effect.source.energies.cards.some(card => card.energyType === card_types_1.EnergyType.SPECIAL);
                if (!specialEnergyAttached) {
                    return state;
                }
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const player = game_1.StateUtils.findOwner(state, effect.target);
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                effect.preventDefault = true;
            }
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Carracosta = Carracosta;
