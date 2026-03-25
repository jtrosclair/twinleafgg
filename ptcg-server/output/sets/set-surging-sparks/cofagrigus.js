"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cofagrigus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Cofagrigus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yamask';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Law of the Underworld',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Put 6 damage counters on each Pokémon that has an Ability (both yours and your opponent\'s).'
            },
            {
                name: 'Spooky Shot',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            },
        ];
        this.set = 'SSP';
        this.setNumber = '83';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Cofagrigus';
        this.fullName = 'Cofagrigus SSP';
    }
    reduceEffect(store, state, effect) {
        // Law of the Underworld
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                // Check if the Pokemon has an Ability
                const powersEffect = new check_effects_1.CheckPokemonPowersEffect(player, card);
                state = store.reduceEffect(state, powersEffect);
                if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.ABILITY)) {
                    // Put 6 damage counters on the Pokemon
                    const damageEffect = new attack_effects_1.PutCountersEffect(effect, 60);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                // Check if the Pokemon has an Ability
                const powersEffect = new check_effects_1.CheckPokemonPowersEffect(opponent, card);
                state = store.reduceEffect(state, powersEffect);
                if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.ABILITY)) {
                    // Put 6 damage counters on the Pokemon
                    const damageEffect = new attack_effects_1.PutCountersEffect(effect, 60);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Cofagrigus = Cofagrigus;
