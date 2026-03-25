"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaporeonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vaporeonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = W;
        this.hp = 280;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Severe Squall',
                cost: [W, C],
                damage: 0,
                text: 'This attack does 60 damage to each of your opponent\'s Pokémon ex. Don\'t apply Weakness and Resistance for this damage.'
            },
            {
                name: 'Aquamarine',
                cost: [R, W, L],
                damage: 280,
                text: 'During your next turn, this Pokemon can\'t attack.'
            }];
        this.regulationMark = 'H';
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Vaporeon ex';
        this.fullName = 'Vaporeon ex PRE';
    }
    reduceEffect(store, state, effect) {
        // Severe Squall
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_2.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        // Aquamarine
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Vaporeonex = Vaporeonex;
