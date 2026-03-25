"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasWeepinbell = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ErikasWeepinbell extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Erika\'s Bellsprout';
        this.cardType = G;
        this.tags = [card_types_1.CardTag.ERIKAS];
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Drool',
                cost: [G],
                damage: 10,
                text: ''
            },
            {
                name: 'Flytrap',
                cost: [G, G],
                damage: 20,
                text: 'Before doing damage, choose 1 of your opponent\'s Benched Pokémon and switch it with his or her Active Pokémon. This attack can\'t be used if your opponent has no Benched Pokémon.'
            }];
        this.set = 'G1';
        this.name = 'Erika\'s Weepinbell';
        this.fullName = 'Erika\'s Weepinbell G1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
    }
    reduceEffect(store, state, effect) {
        // Flytrap
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const bench = opponent.bench.filter(bench => bench.cards.length > 0);
            if (bench.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                opponent.switchPokemon(cardList);
            });
        }
        return state;
    }
}
exports.ErikasWeepinbell = ErikasWeepinbell;
