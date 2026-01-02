"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ursaring = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Ursaring extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Teddiursa';
        this.cardType = C;
        this.hp = 80;
        this.retreat = [C, C];
        this.weakness = [{ type: F }];
        this.powers = [{
                name: 'Intimidating Ring',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as Ursaring is your Active Pokémon, your opponent\'s Basic Pokémon can\'t attack or use any Poké-Powers.'
            }];
        this.attacks = [
            {
                name: 'Drag Off',
                cost: [C, C],
                damage: 20,
                text: 'Before doing damage, you may switch 1 of your opponent\'s Benched Pokémon with the Defending Pokémon. If you do, this attack does 20 damage to the new Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.'
            },
            {
                name: 'Rock Smash',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 40 damage plus 20 more damage.'
            }
        ];
        this.set = 'UF';
        this.name = 'Ursaring';
        this.fullName = 'Ursaring UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Block attacks from basics when active
        if (effect instanceof game_effects_1.AttackEffect && ((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.BASIC) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, opponent, this)) {
                return state;
            }
            if (opponent.active.getPokemonCard() === this) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        // Block Poké-Powers from basics when active
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === pokemon_types_1.PowerType.POKEPOWER) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, opponent, this)) {
                return state;
            }
            let effectCardList;
            player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (card === effect.card) {
                    effectCardList = cardList;
                }
            });
            if (((effectCardList === null || effectCardList === void 0 ? void 0 : effectCardList.getPokemons().length) === 1 || effect.card.tags.includes(card_types_1.CardTag.LEGEND)) && opponent.active.getPokemonCard() === this) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        // Drag Off
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const bench = opponent.bench.filter(bench => bench.cards.length > 0);
            if (bench.length === 0) {
                return state;
            }
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                        const cardList = result[0];
                        opponent.switchPokemon(cardList);
                    });
                }
            }, game_1.GameMessage.WANT_TO_SWITCH_POKEMON);
        }
        // Rock Smash
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
        }
        return state;
    }
}
exports.Ursaring = Ursaring;
