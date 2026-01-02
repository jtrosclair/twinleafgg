"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Umbreonex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Umbreonex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = D;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Darker Ring',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), when you play Umbreon ex from your hand to evolve 1 of your Pokémon, switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.'
            }];
        this.attacks = [{
                name: 'Black Cry',
                cost: [C],
                damage: 20,
                text: 'The Defending Pokémon can\'t retreat or use any Poké-Powers during your opponent\'s next turn.'
            },
            {
                name: 'Darkness Fang',
                cost: [D, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'UF';
        this.setNumber = '112';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Umbreon ex';
        this.fullName = 'Umbreon ex UF';
        this.BLACK_CRY_MARKER = 'BLACK_CRY_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Darker Ring
        if (prefabs_1.JUST_EVOLVED(effect, this) && !prefabs_1.IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                if (cardList) {
                    opponent.switchPokemon(cardList);
                }
            });
        }
        // Black Cry
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            prefabs_1.ADD_MARKER(this.BLACK_CRY_MARKER, opponent.active, this);
            return prefabs_1.BLOCK_RETREAT(store, state, effect, this);
        }
        prefabs_1.BLOCK_RETREAT_IF_MARKER(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.BLACK_CRY_MARKER, this);
        // Black Cry Power
        if (effect instanceof game_effects_1.PowerEffect && prefabs_1.HAS_MARKER(this.BLACK_CRY_MARKER, effect.player.active, this) && effect.power.powerType === game_1.PowerType.POKEPOWER) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
        }
        return state;
    }
}
exports.Umbreonex = Umbreonex;
