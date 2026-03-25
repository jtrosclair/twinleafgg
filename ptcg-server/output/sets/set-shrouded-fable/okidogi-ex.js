"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Okidogiex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Okidogiex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.regulationMark = 'H';
        this.cardType = D;
        this.weakness = [{ type: F }];
        this.hp = 250;
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Poisonous Musculature',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 Basic [D] Energy cards and attach them to this Pokémon. Then, shuffle your deck. If you attached Energy to a Pokémon in this way, this Pokémon is now Poisoned. '
            },
            {
                name: 'Chain-Crazed',
                cost: [D, D, C],
                damage: 130,
                damageCalculation: '+',
                text: 'If this Pokémon is Poisoned, this attack does 130 more damage.'
            }
        ];
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Okidogi ex';
        this.fullName = 'Okidogi ex SFA';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === undefined) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Darkness Energy' }, { min: 0, max: 2, allowCancel: false }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, cardList);
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
                    specialConditionEffect.target = effect.player.active;
                    store.reduceEffect(state, specialConditionEffect);
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.active.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                const attackEffect = effect;
                attackEffect.damage += 130;
            }
            return state;
        }
        return state;
    }
}
exports.Okidogiex = Okidogiex;
