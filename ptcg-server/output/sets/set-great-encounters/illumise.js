"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Illumise = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Illumise extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: R, value: +20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Scent Conduct',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, search your deck for a [G] Basic Pokémon and put it onto your Bench. Shuffle your deck afterward. This power can\'t be used if Illumise is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Firefly Scent',
                cost: [G, C],
                damage: 30,
                text: 'If the Defending Pokémon has any Poké-Bodies, that Pokémon is now Asleep.'
            }
        ];
        this.set = 'GE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Illumise';
        this.fullName = 'Illumise GE';
        this.SCENT_CONDUCT_MARKER = 'SCENT_CONDUCT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            (0, prefabs_1.REMOVE_MARKER)(this.SCENT_CONDUCT_MARKER, effect.player, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SCENT_CONDUCT_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.SCENT_CONDUCT_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result) => {
                if (result) {
                    (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, player, { cardType: card_types_1.CardType.GRASS, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1 });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && opponentActive.powers.some(power => power.powerType === game_1.PowerType.POKEBODY)) {
                (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
            }
        }
        return state;
    }
}
exports.Illumise = Illumise;
