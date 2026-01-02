"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsVanilluxe = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class NsVanilluxe extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'N\'s Vanillish';
        this.tags = [card_types_1.CardTag.NS];
        this.cardType = W;
        this.hp = 150;
        this.weakness = [{ type: M }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Layered Snow',
                cost: [C, C],
                damage: 0,
                text: 'Double the number of damage counters on each of your opponent\'s Pokémon.'
            },
            {
                name: 'Blizzard',
                cost: [W, C, C],
                damage: 120,
                text: 'This attack also does 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'N\'s Vanilluxe';
        this.fullName = 'N\'s Vanilluxe M2a';
    }
    reduceEffect(store, state, effect) {
        // Layered Snow - double damage counters on each opponent's Pokémon
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.cards.length > 0 && cardList.damage > 0) {
                    // Double the damage by adding the same amount
                    const damageToAdd = cardList.damage;
                    const countersEffect = new attack_effects_1.PutCountersEffect(effect, damageToAdd);
                    countersEffect.target = cardList;
                    store.reduceEffect(state, countersEffect);
                }
            });
        }
        // Blizzard - deal 10 damage to each benched Pokémon
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.NsVanilluxe = NsVanilluxe;
