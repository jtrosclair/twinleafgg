"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Muk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
class Muk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Grimer';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Poison Suction',
                cost: [P, C, C],
                damage: 60,
                text: 'If the Defending Pokémon is Poisoned, heal 60 damage from this Pokémon.'
            },
            {
                name: 'Sludge Crash',
                cost: [P, P, C, C],
                damage: 80,
                text: 'Flip a coin until you get tails. For each heads, discard an Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '46';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Muk';
        this.fullName = 'Muk PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Poison Suction
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 60);
            }
        }
        // Attack 2: Sludge Crash
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_2.FLIP_UNTIL_TAILS_AND_COUNT_HEADS)(store, state, player, headsCount => {
                // Discard up to headsCount energy from defending
                const energyCount = opponent.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY).length;
                const toDiscard = Math.min(headsCount, energyCount);
                if (toDiscard <= 0) {
                    return;
                }
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: toDiscard, max: toDiscard, allowCancel: false }), selected => {
                    if (selected && selected.length > 0) {
                        selected.forEach(card => {
                            opponent.active.moveCardTo(card, opponent.discard);
                        });
                    }
                });
            });
        }
        return state;
    }
}
exports.Muk = Muk;
