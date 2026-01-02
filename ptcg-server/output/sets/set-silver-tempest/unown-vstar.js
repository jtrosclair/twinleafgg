"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnownVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class UnownVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Unown V';
        this.cardType = P;
        this.hp = 250;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Tri Power',
                cost: [P],
                damage: 70,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 70 damage for each heads.'
            },
            {
                name: 'Star Cipher',
                cost: [C, C, C],
                damage: 0,
                text: 'Until this Pokémon leaves play, it gains an Ability that has the effect "The Weakness of each of your opponent\'s Pokémon in play is now [P]. (The amount of Weakness doesn\'t change.)" (You can\'t use more than 1 VSTAR Power in a game.)'
            },
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Unown VSTAR';
        this.fullName = 'Unown VSTAR SIT';
        this.STAR_CIPHER_MARKER = 'STAR_CIPHER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 70 * heads;
            });
        }
        // Star Cipher
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            prefabs_1.ADD_MARKER(this.STAR_CIPHER_MARKER, player, this);
            player.usedVSTAR = true;
        }
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            if (!prefabs_1.HAS_MARKER(this.STAR_CIPHER_MARKER, player, this)) {
                return state;
            }
            // Add the power
            effect.powers.push({
                name: 'Star Cipher',
                powerType: game_1.PowerType.ABILITY,
                text: 'The Weakness of each of your opponent\'s Pokémon in play is now [P]. (The amount of Weakness doesn\'t change.)',
            });
        }
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = effect.target;
            // Check for opponent's Unown VSTAR
            let isUnownInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isUnownInPlay = true;
                }
            });
            // Return if no Unown VSTAR 
            if (!isUnownInPlay) {
                return state;
            }
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, opponent, this)) {
                return state;
            }
            if (!prefabs_1.HAS_MARKER(this.STAR_CIPHER_MARKER, opponent, this)) {
                return state;
            }
            // Check if weakness can be changed
            const canApplyAbility = new game_effects_1.EffectOfAbilityEffect(opponent, this.powers[0], this, pokemonCard);
            store.reduceEffect(state, canApplyAbility);
            if (canApplyAbility.target) {
                effect.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
            }
        }
        return state;
    }
}
exports.UnownVSTAR = UnownVSTAR;
