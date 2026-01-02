"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salamenceex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Salamenceex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Shelgon';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = C;
        this.hp = 160;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: R, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Volcanic Flame',
                cost: [R, R, C, C],
                damage: 150,
                text: 'Discard the top 5 cards of your deck.'
            },
            {
                name: 'Hydro Wave',
                cost: [W, W, C, C],
                damage: 0,
                text: 'Discard all [W] Energy attached to Salamence ex. This attack does 30 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'PK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Salamence ex';
        this.fullName = 'Salamence ex PK';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            player.deck.moveTo(player.discard, 5);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergy);
            checkProvidedEnergy.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.WATER) || em.provides.includes(card_types_1.CardType.ANY)) {
                    prefabs_1.MOVE_CARDS(store, state, player.active, player.discard, { cards: [em.card] });
                }
            });
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList !== opponent.active) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Salamenceex = Salamenceex;
