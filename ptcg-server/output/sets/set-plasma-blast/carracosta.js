"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carracosta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_card_1 = require("../../game/store/card/trainer-card");
class Carracosta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tirtouga';
        this.cardType = W;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Fossil Clutch',
                cost: [W, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'You may discard an Item card that has Fossil in its name from your hand. If you do, this attack does 50 more damage.'
            },
            {
                name: 'Waterfall',
                cost: [W, W, C, C],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'PLB';
        this.setNumber = '28';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Carracosta';
        this.fullName = 'Carracosta PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasFossilItem = player.hand.cards.some(c => c instanceof trainer_card_1.TrainerCard &&
                c.trainerType === card_types_1.TrainerType.ITEM &&
                c.name.includes('Fossil'));
            if (hasFossilItem) {
                const blocked = [];
                player.hand.cards.forEach((c, index) => {
                    if (!(c instanceof trainer_card_1.TrainerCard) ||
                        c.trainerType !== card_types_1.TrainerType.ITEM ||
                        !c.name.includes('Fossil')) {
                        blocked.push(index);
                    }
                });
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 0, max: 1, allowCancel: true, blocked }), selected => {
                    if (selected && selected.length > 0) {
                        player.hand.moveCardTo(selected[0], player.discard);
                        effect.damage += 50;
                    }
                });
            }
        }
        return state;
    }
}
exports.Carracosta = Carracosta;
