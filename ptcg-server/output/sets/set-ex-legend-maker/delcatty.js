"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delcatty = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Delcatty extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Skitty';
        this.cardType = C;
        this.weakness = [{ type: F }];
        this.hp = 80;
        this.retreat = [C];
        this.powers = [{
                name: 'Reactive Shift',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may move a React Energy card attached to 1 of your Pokémon to another of your Pokémon. This power can\'t be used if Delcatty is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Energy Link',
                cost: [C],
                damage: 20,
                text: 'Search your discard pile for an Energy card and attach it to Delcatty.'
            },
            {
                name: 'Tail Whap',
                cost: [C, C, C],
                damage: 40,
                text: ''
            }];
        this.set = 'LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Delcatty';
        this.fullName = 'Delcatty LM';
        this.REACTIVE_SHIFT_MARKER = 'REACTIVE_SHIFT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.REACTIVE_SHIFT_MARKER, this);
            return state;
        }
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.REACTIVE_SHIFT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            let hasReactEnergy = false;
            let pokemonCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                pokemonCount += 1;
                const reactEnergyAttached = cardList.cards.some(c => {
                    return c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
                });
                hasReactEnergy = hasReactEnergy || reactEnergyAttached;
            });
            if (!hasReactEnergy || pokemonCount <= 1) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, name: 'React Energy' }, { min: 1, max: 1, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    player.marker.addMarker(this.REACTIVE_SHIFT_MARKER, this);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        }
                    });
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
                return state;
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.REACTIVE_SHIFT_MARKER, this)) {
            effect.player.marker.removeMarker(this.REACTIVE_SHIFT_MARKER, this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (!player.discard.cards.some(card => card.superType === card_types_1.SuperType.ENERGY)) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    prefabs_1.MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.attacks[0] });
                }
            });
        }
        return state;
    }
}
exports.Delcatty = Delcatty;
