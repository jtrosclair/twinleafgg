"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasVictreebel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ErikasVictreebel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Erika\'s Weepinbell';
        this.tags = [card_types_1.CardTag.ERIKAS];
        this.cardType = G;
        this.hp = 150;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Fragrance Trap',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEMON_POWER,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, and if your opponent has any Benched Pokémon, choose 1 of them and switch it with his or her Active Pokémon. This power can\'t be used if Erika\'s Victreebel is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Razor Leaf',
                cost: [G, G, G],
                damage: 50,
                text: ''
            }];
        this.set = 'G1';
        this.setNumber = '26';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Erika\'s Victreebel';
        this.fullName = 'Erika\'s Victreebel G1';
        this.FRAGRANCE_TRAP_MARKER = 'FRAGRANCE_TRAP_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            (0, prefabs_1.REMOVE_MARKER)(this.FRAGRANCE_TRAP_MARKER, player, this);
            return state;
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.FRAGRANCE_TRAP_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.HAS_MARKER)(this.FRAGRANCE_TRAP_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_ASLEEP_CONFUSED_PARALYZED)(player, this);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result) => {
                if (result) {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                        const cardList = result[0];
                        if (cardList) {
                            opponent.switchPokemon(cardList);
                        }
                    });
                }
            });
            (0, prefabs_1.ADD_MARKER)(this.FRAGRANCE_TRAP_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
        }
        return state;
    }
}
exports.ErikasVictreebel = ErikasVictreebel;
