"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vileplume = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vileplume extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gloom';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Poison Pollen',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, the Defending Pokémon is now Poisoned. This power can\'t be used if Vileplume is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Petal Dance',
                cost: [G, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 30 damage times the number of heads. Vileplume is now Confused.'
            }];
        this.set = 'EX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Vileplume';
        this.fullName = 'Vileplume EX';
        this.POISON_POLLEN_MARKER = 'POISON_POLLEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.POISON_POLLEN_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            player.marker.addMarker(this.POISON_POLLEN_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.POISON_POLLEN_MARKER, this);
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.POISON_POLLEN_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 3, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 30 * heads;
                (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.player, this);
            });
        }
        return state;
    }
}
exports.Vileplume = Vileplume;
