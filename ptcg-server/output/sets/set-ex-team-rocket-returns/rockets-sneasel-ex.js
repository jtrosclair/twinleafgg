"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsSneaselex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class RocketsSneaselex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ROCKETS];
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Drag Off',
                cost: [D],
                damage: 10,
                text: 'Before doing damage, you may switch 1 of your opponent\'s Benched Pokémon with the Defending Pokémon. If you do, this attack does 10 damage to the new Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.'
            },
            {
                name: 'Dark Ring',
                cost: [D, D, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Does 30 damage plus 10 more damage for each of your [D] Pokémon in play.'
            }
        ];
        this.set = 'TRR';
        this.name = 'Rocket\'s Sneasel ex';
        this.fullName = 'Rocket\'s Seasel ex TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '103';
    }
    reduceEffect(store, state, effect) {
        // Drag Off
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
        // Rock Smash
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let darksInPlay = 0;
            const activeType = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, activeType);
            if (activeType.cardTypes.includes(card_types_1.CardType.DARK)) {
                darksInPlay++;
            }
            player.bench.forEach(benchSpot => {
                if (benchSpot.cards.length > 0) {
                    const benchedType = new check_effects_1.CheckPokemonTypeEffect(benchSpot);
                    store.reduceEffect(state, benchedType);
                    if (benchedType.cardTypes.includes(card_types_1.CardType.DARK)) {
                        darksInPlay++;
                    }
                }
            });
            effect.damage += 10 * darksInPlay;
        }
        return state;
    }
}
exports.RocketsSneaselex = RocketsSneaselex;
