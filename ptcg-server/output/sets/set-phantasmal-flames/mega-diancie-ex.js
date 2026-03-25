"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaDiancieex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaDiancieex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 270;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.powers = [{
                name: 'Diamond Coat',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Garland Ray',
                cost: [P, P],
                damage: 120,
                damageCalculation: 'x',
                text: 'Discard up to 2 Energy cards from this Pokémon, and this attack does 120 damage for each card you discarded in this way.'
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Diancie ex';
        this.fullName = 'Mega Diancie ex M2';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY }, { min: 1, max: 2, allowCancel: false }), transfers => {
                if (transfers === null) {
                    effect.damage = 0;
                    return state;
                }
                const cardsDiscarded = transfers.length;
                effect.damage = 120 * cardsDiscarded;
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = player.discard;
                    source.moveCardTo(transfer.card, target);
                }
                return state;
            });
        }
        // Reduce damage by 30
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            // It's not this pokemon card
            if (pokemonCard !== this) {
                return state;
            }
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            effect.damage = Math.max(0, effect.damage - 30);
        }
        return state;
    }
}
exports.MegaDiancieex = MegaDiancieex;
