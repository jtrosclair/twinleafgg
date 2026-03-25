"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KyuremEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class KyuremEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 180;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Frozen Wings',
                cost: [W, C, C],
                damage: 60,
                text: 'Discard a Special Energy attached to the Defending Pokémon.'
            },
            {
                name: 'Hail Blizzard',
                cost: [W, W, C, C],
                damage: 120,
                text: 'This Pokémon can\'t use Hail Blizzard during your next turn.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '38';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kyurem-EX';
        this.fullName = 'Kyurem-EX NXD';
    }
    reduceEffect(store, state, effect) {
        // Frozen Wings - discard Special Energy from defending
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Find special energy on defender
            const specialEnergy = opponent.active.cards.filter(card => card.superType === card_types_1.SuperType.ENERGY && card.energyType === card_types_1.EnergyType.SPECIAL);
            if (specialEnergy.length > 0) {
                // Discard the first special energy found
                const discardEffect = new attack_effects_1.DiscardCardsEffect(effect, [specialEnergy[0]]);
                discardEffect.target = opponent.active;
                store.reduceEffect(state, discardEffect);
            }
        }
        // Hail Blizzard - can't use next turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Hail Blizzard')) {
                player.active.cannotUseAttacksNextTurnPending.push('Hail Blizzard');
            }
        }
        return state;
    }
}
exports.KyuremEx = KyuremEx;
