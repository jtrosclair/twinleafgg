"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimalGroudonEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class PrimalGroudonEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.MEGA, card_types_1.CardTag.PRIMAL];
        this.stage = card_types_1.Stage.MEGA;
        this.evolvesFrom = 'Groudon-EX';
        this.cardType = F;
        this.hp = 240;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.powers = [
            {
                name: 'Primal Reversion Rule',
                powerType: game_1.PowerType.MEGA_EVOLUTION_RULE,
                text: 'When 1 of your Pokémon becomes Primal Groudon-EX, your turn ends.'
            },
            {
                name: 'Ω Barrier',
                powerType: game_1.PowerType.ANCIENT_TRAIT,
                text: 'Whenever your opponent plays a Trainer card (excluding Pokémon Tools and Stadium cards), prevent all effects of that card done to this Pokémon.'
            },
        ];
        this.attacks = [
            {
                name: 'Gaia Volcano',
                cost: [F, F, F, C],
                damage: 100,
                damageCalculation: '+',
                text: 'If there is any Stadium card in play, this attack does 100 more damage. Discard that Stadium card.'
            }
        ];
        this.set = 'PRC';
        this.name = 'Primal Groudon-EX';
        this.fullName = 'Primal Groudon-EX PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // wow i hate the rules
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            if (effect.target.tools.length > 0 && effect.target.tools[0].name === 'Groudon Spirit Link') {
                return state;
            }
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(effect.player);
            store.reduceEffect(state, endTurnEffect);
        }
        // Ω Barrier
        if (effect instanceof play_card_effects_1.TrainerTargetEffect && ((_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards.includes(this))) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // finding if the owner of the card is playing the trainer or if the opponent is
            let isGroudonOnOpposingSide = false;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    isGroudonOnOpposingSide = true;
                }
            });
            if (!isGroudonOnOpposingSide) {
                return state;
            }
            effect.preventDefault = true;
        }
        // Gaia Volcano
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (game_1.StateUtils.getStadiumCard(state) === undefined) {
                return state;
            }
            effect.damage += 100;
            (0, prefabs_1.DISCARD_A_STADIUM_CARD_IN_PLAY)(state);
        }
        return state;
    }
}
exports.PrimalGroudonEx = PrimalGroudonEx;
