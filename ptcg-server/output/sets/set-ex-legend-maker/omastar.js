"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Omastar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Omastar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Omanyte';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Ancient Fang',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as you have Kabuto, Kabutops, or Kabutops ex in play, Omastar\'s attacks do 20 more damage to the Defending Pokémon (before applying Weakness and Resistance).',
            }];
        this.attacks = [{
                name: 'Drag Off',
                cost: [W, C],
                damage: 10,
                text: 'Before doing damage, you may choose 1 of your opponent\'s Benched Pokémon and switch it with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.'
            },
            {
                name: 'Hydro Splash',
                cost: [W, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Omastar';
        this.fullName = 'Omastar LM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
            const player = effect.player;
            let isKabuInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Kabuto' || card.name === 'Kabutops' || card.name === 'Kabutops ex') {
                    isKabuInPlay = true;
                }
            });
            if (!isKabuInPlay) {
                return state;
            }
            if (effect.source.getPokemonCard() === this) {
                effect.damage += 20;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const bench = opponent.bench.filter(bench => bench.cards.length > 0);
            if (bench.length === 0) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                        const cardList = result[0];
                        opponent.switchPokemon(cardList);
                    });
                }
            }, game_1.GameMessage.WANT_TO_SWITCH_POKEMON);
        }
        return state;
    }
}
exports.Omastar = Omastar;
