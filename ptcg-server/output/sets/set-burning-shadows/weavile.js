"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weavile = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Weavile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 90;
        this.retreat = [];
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.attacks = [
            {
                name: 'Rule of Evil',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 60 damage to each Pokémon that has an Ability (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Slash',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Weavile';
        this.fullName = 'Weavile BUS';
        this.evolvesFrom = 'Sneasel';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Calculate damage for opponent's Pokemon
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (cardList.getPokemonCard()) {
                    const powersEffect = new check_effects_1.CheckPokemonPowersEffect(opponent, card);
                    state = store.reduceEffect(state, powersEffect);
                    if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.ABILITY)) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                        damageEffect.target = cardList;
                        store.reduceEffect(state, damageEffect);
                    }
                }
            });
            // Calculate damage for player's Pokemon
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList.getPokemonCard()) {
                    const powersEffect = new check_effects_1.CheckPokemonPowersEffect(player, card);
                    state = store.reduceEffect(state, powersEffect);
                    if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.ABILITY)) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                        damageEffect.target = cardList;
                        store.reduceEffect(state, damageEffect);
                    }
                }
            });
            return state;
        }
        return state;
    }
}
exports.Weavile = Weavile;
