"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gardevoir = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Gardevoir extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.hp = 100;
        this.cardType = P;
        this.additionalCardTypes = [M];
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Energy Jump',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may move an Energy card attached to 1 of your Pokémon to another of your Pokémon. This power can\'t be used if Gardevoir is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Psychic Rage',
                cost: [M, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage for each damage counter on Gardevoir to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Black Magic',
                cost: [P, C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Does 10 damage plus 20 more damage times the number of your opponent\'s Benched Pokémon.'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Gardevoir';
        this.fullName = 'Gardevoir DS';
        this.ENERGY_JUMP_MARKER = 'ENERGY_JUMP_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            prefabs_1.REMOVE_MARKER(this.ENERGY_JUMP_MARKER, effect.player, this);
        }
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (prefabs_1.HAS_MARKER(this.ENERGY_JUMP_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                const blockedCards = [];
                checkProvidedEnergy.energyMap.forEach(em => {
                    if (em.provides.length === 0) {
                        blockedCards.push(em.card);
                    }
                });
                cardList.cards.forEach(em => {
                    if (cardList.getPokemons().includes(em)) {
                        blockedCards.push(em);
                    }
                });
                const blocked = [];
                blockedCards.forEach(bc => {
                    const index = cardList.cards.indexOf(bc);
                    if (index !== -1 && !blocked.includes(index)) {
                        blocked.push(index);
                    }
                });
                if (blocked.length !== 0) {
                    blockedMap.push({ source: target, blocked });
                }
            });
            return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], {}, { min: 1, max: 1, allowCancel: false, blockedMap }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    prefabs_1.ADD_MARKER(this.ENERGY_JUMP_MARKER, player, this);
                    prefabs_1.ABILITY_USED(player, this);
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    if (transfer.card instanceof game_1.PokemonCard) {
                        // If card is in source energies, move it from there; otherwise move from main cards array
                        if (source.energies.cards.includes(transfer.card)) {
                            source.energies.moveCardTo(transfer.card, target.energies);
                            // Also ensure it's in target's main cards array
                            if (!target.cards.includes(transfer.card)) {
                                target.cards.push(transfer.card);
                            }
                        }
                        else {
                            source.moveCardTo(transfer.card, target);
                            if (!target.energies.cards.includes(transfer.card)) {
                                target.energies.cards.push(transfer.card);
                            }
                        }
                    }
                    else {
                        source.moveCardTo(transfer.card, target);
                    }
                }
                return state;
            });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.ENERGY_JUMP_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(effect.player.active.damage, effect, store, state);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            //Get number of benched pokemon
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const totalBenched = opponentBenched;
            effect.damage += (totalBenched * 20);
        }
        return state;
    }
}
exports.Gardevoir = Gardevoir;
