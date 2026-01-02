"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nosepass = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Nosepass extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Magnetic Reversal',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if Nosepass is your Active Pokémon, you may flip a coin. If heads, switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch. This power can\'t be used if Nosepass is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Sharpen',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'DX';
        this.setNumber = '42';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Nosepass';
        this.fullName = 'Nosepass DX';
        this.MAGNETIC_REVERSAL_MARKER = 'MAGNETIC_REVERSAL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            prefabs_1.REMOVE_MARKER(this.MAGNETIC_REVERSAL_MARKER, player, this);
            return state;
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.MAGNETIC_REVERSAL_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.HAS_MARKER(this.MAGNETIC_REVERSAL_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
                if (result) {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                        const cardList = result[0];
                        if (cardList) {
                            opponent.switchPokemon(cardList);
                        }
                    });
                }
            });
            prefabs_1.ADD_MARKER(this.MAGNETIC_REVERSAL_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
        }
        return state;
    }
}
exports.Nosepass = Nosepass;
