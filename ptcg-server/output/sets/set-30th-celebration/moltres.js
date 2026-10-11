"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moltres = void 0;
const game_1 = require("../../game");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Moltres extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 120;
        this.cardType = game_1.CardType.FIRE;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Fiery Flapping',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if you have Articuno and Zapdos in play, you may use this Ability. Attach a Basic [R] Energy card from your hand to this Pokémon.'
            }];
        this.attacks = [{
                name: 'Fire Spin',
                cost: [game_1.CardType.FIRE, game_1.CardType.FIRE, game_1.CardType.COLORLESS],
                damage: 130,
                text: 'Discard 2 Energy from this Pokémon.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Moltres';
        this.fullName = 'Moltres 30C';
        this.FIERY_FLAPPING_MARKER = 'FIERY_FLAPPING_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Fiery Flapping
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            let hasArticuno = false;
            let hasZapdos = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList.getPokemonCard() !== card) {
                    return;
                }
                if (card.name === 'Articuno') {
                    hasArticuno = true;
                }
                if (card.name === 'Zapdos') {
                    hasZapdos = true;
                }
            });
            if (!hasArticuno || !hasZapdos) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInHand = player.hand.cards.some(c => c instanceof game_1.EnergyCard
                && c.energyType === game_1.EnergyType.BASIC
                && c.provides.includes(game_1.CardType.FIRE));
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.FIERY_FLAPPING_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            const cardList = game_1.StateUtils.findCardList(state, this);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.hand, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 1, max: 1, allowCancel: false }), cards => {
                if (cards && cards.length > 0) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, cardList, { cards: cards, sourceCard: this });
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.FIERY_FLAPPING_MARKER, this);
        // Fire Spin
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
        }
        return state;
    }
}
exports.Moltres = Moltres;
