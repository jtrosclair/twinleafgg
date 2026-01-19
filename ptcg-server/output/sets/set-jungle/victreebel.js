"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victreebel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Victreebel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Weepinbell';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Lure',
                cost: [G],
                damage: 0,
                text: 'If your opponent has any Benched Pokémon, choose 1 of them and switch it with his or her Active Pokémon.'
            },
            {
                name: 'Acid',
                cost: [G, G],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Victreebel';
        this.fullName = 'Victreebel JU';
    }
    reduceEffect(store, state, effect) {
        // Lure
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            else {
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                    const cardList = result[0];
                    opponent.switchPokemon(cardList);
                    return state;
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
                }
            });
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Victreebel = Victreebel;
