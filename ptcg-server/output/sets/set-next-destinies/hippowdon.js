"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hippowdon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hippowdon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hippopotas';
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Sand Bazooka',
                cost: [F, C, C],
                damage: 70,
                text: 'You may move 1 Energy attached to this Pokémon to 1 of your Benched Pokémon.'
            },
            {
                name: 'Rock Tumble',
                cost: [F, F, C, C],
                damage: 90,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '66';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hippowdon';
        this.fullName = 'Hippowdon NXD';
        this.usedSandBazooka = false;
    }
    reduceEffect(store, state, effect) {
        // Sand Bazooka - flag for after attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedSandBazooka = true;
        }
        // Sand Bazooka - move energy after attack
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this) && this.usedSandBazooka) {
            this.usedSandBazooka = false;
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            const hasEnergy = player.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY);
            if (!hasBenched || !hasEnergy) {
                return state;
            }
            // Get blocked indices for non-energy cards
            const blocked = [];
            player.active.cards.forEach((card, index) => {
                if (card.superType !== card_types_1.SuperType.ENERGY) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.active, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: true, blocked }), selected => {
                const cards = selected || [];
                if (cards.length === 0) {
                    return;
                }
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                    if (targets && targets.length > 0) {
                        player.active.moveCardTo(cards[0], targets[0]);
                    }
                });
            });
        }
        // Rock Tumble - ignores resistance
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Hippowdon = Hippowdon;
