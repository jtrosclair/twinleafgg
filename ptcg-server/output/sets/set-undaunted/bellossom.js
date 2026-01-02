"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bellossom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bellossom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gloom';
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Hustle Step',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may remove 1 damage counter from each of your Pokémon. This power can\'t be used if Bellossom is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Dance \'til Dawn',
                cost: [G, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 30 damage times the number of heads. Bellossom is now Asleep.'
            }];
        this.set = 'UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Bellossom';
        this.fullName = 'Bellossom UD';
        this.HUSTLE_STEP_MARKER = 'HUSTLE_STEP_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.HUSTLE_STEP_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            player.marker.addMarker(this.HUSTLE_STEP_MARKER, this);
            prefabs_1.ABILITY_USED(player, this);
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                state = store.reduceEffect(state, healEffect);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 30 * heads;
            });
            prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this);
        }
        return state;
    }
}
exports.Bellossom = Bellossom;
