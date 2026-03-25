"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victreebel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Victreebel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Weepinbell';
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Nectar Pod',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may switch 1 of your opponent\'s Benched Stage 2 Evolved Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch. This power can\'t be used if Victreebel is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Sleep Poison',
                cost: [G, C],
                damage: 10,
                text: 'The Defending Pokémon is now Asleep and Poisoned.'
            },
            {
                name: 'Sharp Leaf',
                cost: [G, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 40 damage plus 30 more damage.'
            }];
        this.set = 'LM';
        this.setNumber = '13';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Victreebel';
        this.fullName = 'Victreebel LM';
        this.NECTAR_POD_MARKER = 'NECTAR_POD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            (0, prefabs_1.REMOVE_MARKER)(this.NECTAR_POD_MARKER, player, this);
            return state;
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.NECTAR_POD_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.HAS_MARKER)(this.NECTAR_POD_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            const blocked = [];
            const hasBench = opponent.bench.some((b, index) => {
                const benchedPokemon = b.getPokemonCard();
                const isStage2 = (benchedPokemon === null || benchedPokemon === void 0 ? void 0 : benchedPokemon.stage) === card_types_1.Stage.STAGE_2;
                if (!isStage2) {
                    blocked.push({ player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.BENCH, index });
                }
                return isStage2;
            });
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.ADD_MARKER)(this.NECTAR_POD_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, blocked }), result => {
                const cardList = result[0];
                if (cardList) {
                    opponent.switchPokemon(cardList);
                }
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Victreebel = Victreebel;
