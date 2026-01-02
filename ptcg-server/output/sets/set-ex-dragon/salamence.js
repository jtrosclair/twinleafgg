"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salamence = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Salamence extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Shelgon';
        this.cardType = C;
        this.hp = 120;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: R, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Dragon Wind',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if Salamence is your Active Pokémon, you may switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.This power can\'t be used if Salamence is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Agility',
                cost: [C, C],
                damage: 20,
                text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Salamence during your opponent\'s next turn.'
            },
            {
                name: 'Dragon Claw',
                cost: [R, W, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Salamence';
        this.fullName = 'Salamence DR';
        this.DRAGON_WIND_MARKER = 'DRAGON_WIND_MARKER';
        this.AGILITY_MARKER = 'AGILITY_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Magnetic Field
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            // One per turn only
            if (prefabs_1.HAS_MARKER(this.DRAGON_WIND_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                if (cardList) {
                    opponent.switchPokemon(cardList);
                }
            });
            prefabs_1.ADD_MARKER(this.DRAGON_WIND_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    this.marker.addMarker(this.AGILITY_MARKER, this);
                    prefabs_1.ADD_MARKER(this.AGILITY_MARKER, effect.opponent, this);
                }
            });
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.PutCountersEffect) && effect.target.getPokemonCard() === this) {
            if (this.marker.hasMarker(this.AGILITY_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.AGILITY_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.AGILITY_MARKER, effect.player, this);
            this.marker.removeMarker(this.AGILITY_MARKER, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.DRAGON_WIND_MARKER, this);
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            prefabs_1.REMOVE_MARKER(this.DRAGON_WIND_MARKER, player, this);
        }
        return state;
    }
}
exports.Salamence = Salamence;
