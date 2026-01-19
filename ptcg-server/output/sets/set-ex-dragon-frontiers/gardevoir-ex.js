"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gardevoirex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Gardevoirex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = R;
        this.hp = 150;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Imprison',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if Gardevoir ex is your Active Pokémon, you may put an Imprison marker on 1 of your opponent\'s Pokémon. Any Pokémon that has any Imprison markers on it can\'t use any Poké-Powers or Poké-Bodies. This power can\'t be used if Gardevoir ex is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Flame Ball',
                cost: [R, C, C],
                damage: 80,
                text: 'You may move a [R] Energy card attached to Gardevoir ex to 1 of your Benched Pokémon.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Gardevoir ex';
        this.fullName = 'Gardevoir ex DF';
        this.IMPRISON_MARKER = 'IMPRISON_MARKER';
        this.IMPRISON_USED_MARKER = 'IMPRISON_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if ((0, prefabs_1.HAS_MARKER)(this.IMPRISON_USED_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                const pokemonList = targets[0];
                if (pokemonList !== undefined) {
                    (0, prefabs_1.ADD_MARKER)(this.IMPRISON_MARKER, pokemonList, this);
                }
                (0, prefabs_1.ADD_MARKER)(this.IMPRISON_USED_MARKER, player, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
                return state;
            });
        }
        if (effect instanceof game_effects_1.PowerEffect
            && (effect.power.powerType === game_1.PowerType.POKEPOWER || effect.power.powerType === game_1.PowerType.POKEBODY)) {
            // Find the PokemonCardList that contains effect.card (probably a better way to do this tbh)
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const allLists = [player.active, ...player.bench, ...opponent.active ? [opponent.active] : [], ...opponent.bench];
            const pokemonCardList = allLists.find(list => list.cards.includes(effect.card));
            if (pokemonCardList && (0, prefabs_1.HAS_MARKER)(this.IMPRISON_MARKER, pokemonCardList, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            const blockedFrom = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList !== player.active) {
                    blockedFrom.push(target);
                }
            });
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                const blockedCards = [];
                checkProvidedEnergy.energyMap.forEach(em => {
                    if (!em.provides.includes(card_types_1.CardType.FIRE) && !em.provides.includes(card_types_1.CardType.ANY)) {
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
            store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], {}, { allowCancel: true, blockedMap, blockedFrom, min: 0, max: 1 }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    if (transfer.card instanceof pokemon_card_1.PokemonCard) {
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
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.IMPRISON_USED_MARKER, this);
        return state;
    }
}
exports.Gardevoirex = Gardevoirex;
