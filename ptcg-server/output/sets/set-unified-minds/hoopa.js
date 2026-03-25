"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoopa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hoopa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Evil Admonition',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each of your opponent\'s Pokémon that has an Ability.'
            },
            {
                name: 'Mind Shock',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '140';
        this.name = 'Hoopa';
        this.fullName = 'Hoopa UNM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let pokemonWithUsableAbilities = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (cardList.getPokemonCard()) {
                    const powersEffect = new check_effects_1.CheckPokemonPowersEffect(opponent, card);
                    state = store.reduceEffect(state, powersEffect);
                    if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.ABILITY)) {
                        pokemonWithUsableAbilities++;
                    }
                }
            });
            effect.damage += pokemonWithUsableAbilities * 20;
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.ignoreResistance = true;
            effect.ignoreWeakness = true;
        }
        return state;
    }
}
exports.Hoopa = Hoopa;
