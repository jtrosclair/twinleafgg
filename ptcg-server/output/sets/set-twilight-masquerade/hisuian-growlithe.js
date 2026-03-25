"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianGrowlithe = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HisuianGrowlithe extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Blazing Destruction',
                cost: [],
                damage: 0,
                text: 'Discard a Stadium in play.'
            },
            {
                name: 'Take Down',
                cost: [F, C],
                damage: 40,
                text: 'This Pokémon also does 10 damage to itself.'
            }
        ];
        this.set = 'TWM';
        this.name = 'Hisuian Growlithe';
        this.fullName = 'Hisuian Growlithe TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.regulationMark = 'H';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (!stadiumCard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            else {
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const player = game_1.StateUtils.findOwner(state, cardList);
                cardList.moveTo(player.discard);
                return state;
            }
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.HisuianGrowlithe = HisuianGrowlithe;
