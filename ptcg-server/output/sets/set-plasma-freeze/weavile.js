"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weavile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Weavile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sneasel';
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Hail',
                cost: [C],
                damage: 0,
                text: 'This attack does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Vilify',
                cost: [D, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Discard as many Pokémon as you like from your hand. This attack does 30 damage times the number of Pokémon you discarded.'
            }];
        this.set = 'PLF';
        this.setNumber = '66';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Weavile';
        this.fullName = 'Weavile PLF';
    }
    reduceEffect(store, state, effect) {
        // Hail
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            const activeDamageEffect = new attack_effects_1.DealDamageEffect(effect, 20);
            store.reduceEffect(state, activeDamageEffect);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        // Bite Off
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const pokemonInHand = player.hand.cards.filter(c => c.superType === card_types_1.SuperType.POKEMON).length;
            // Allow player to discard any number of pokemon
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: pokemonInHand, allowCancel: true }), transfers => {
                if (!transfers || transfers.length === 0) {
                    return state;
                }
                // Damage = per pokemon discarded
                effect.damage = transfers.length * 30;
                // Discard the cards
                for (const transfer of transfers) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards: [transfer] });
                }
                return state;
            });
        }
        return state;
    }
}
exports.Weavile = Weavile;
