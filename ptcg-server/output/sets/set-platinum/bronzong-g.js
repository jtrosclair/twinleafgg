"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BronzongG = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class BronzongG extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_SP];
        this.cardType = M;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.resistance = [{ type: R, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Galactic Switch',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may move an Energy card attached to 1 of your Pokémon SP to another of your Pokémon. Then, put 2 damage counters on Bronzong G. This power can\'t be used if Bronzong G is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Psychic Pulse',
                cost: [M, C, C],
                damage: 40,
                text: 'Does 10 damage to each of your opponent\'s Benched Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Bronzong G';
        this.fullName = 'Bronzong G PL';
        this.GALACTIC_SWITCH_MARKER = 'GALACTIC_SWITCH_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.GALACTIC_SWITCH_MARKER, this);
            return state;
        }
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.GALACTIC_SWITCH_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            let hasEnergy = false;
            let pokemonCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                var _a;
                pokemonCount += 1;
                // Only consider Pokémon SP for energy movement
                if ((_a = card.tags) === null || _a === void 0 ? void 0 : _a.includes(card_types_1.CardTag.POKEMON_SP)) {
                    const basicEnergyAttached = cardList.cards.some(c => c instanceof game_1.EnergyCard);
                    hasEnergy = hasEnergy || basicEnergyAttached;
                }
            });
            if (!hasEnergy || pokemonCount <= 1) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Block all Pokémon whose tags don't include CardTag.POKEMON_SP as sources
            const blockedFrom = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                var _a;
                if (!((_a = card.tags) === null || _a === void 0 ? void 0 : _a.includes(card_types_1.CardTag.POKEMON_SP))) {
                    blockedFrom.push(target);
                }
            });
            return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blockedFrom }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    prefabs_1.ADD_MARKER(this.GALACTIC_SWITCH_MARKER, player, this);
                    prefabs_1.ABILITY_USED(player, this);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === effect.card) {
                            cardList.damage += 20; // Add 2 damage counters
                        }
                    });
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
                return state;
            });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.GALACTIC_SWITCH_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            benched.forEach(target => {
                if (target.damage !== 0) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.BronzongG = BronzongG;
