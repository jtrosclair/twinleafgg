"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Articuno = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Articuno extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 120;
        this.cardType = game_1.CardType.WATER;
        this.weakness = [{ type: game_1.CardType.METAL }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Frosty Flapping',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if you have Moltres and Zapdos in play, you may use this Ability. Attach a Basic [W] Energy card from your hand to this Pokémon.'
            }];
        this.attacks = [{
                name: 'Hail',
                cost: [game_1.CardType.WATER, game_1.CardType.WATER, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 30 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Articuno';
        this.fullName = 'Articuno 30C';
        this.FROSTY_FLAPPING_MARKER = 'FROSTY_FLAPPING_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Frosty Flapping
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            let hasMoltres = false;
            let hasZapdos = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList.getPokemonCard() !== card) {
                    return;
                }
                if (card.name === 'Moltres') {
                    hasMoltres = true;
                }
                if (card.name === 'Zapdos') {
                    hasZapdos = true;
                }
            });
            if (!hasMoltres || !hasZapdos) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInHand = player.hand.cards.some(c => c instanceof game_1.EnergyCard
                && c.energyType === game_1.EnergyType.BASIC
                && c.provides.includes(game_1.CardType.WATER));
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.FROSTY_FLAPPING_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            const cardList = game_1.StateUtils.findCardList(state, this);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.hand, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Water Energy' }, { min: 1, max: 1, allowCancel: false }), cards => {
                if (cards && cards.length > 0) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, cardList, { cards: cards, sourceCard: this });
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.FROSTY_FLAPPING_MARKER, this);
        // Hail
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const damageActive = new attack_effects_1.DealDamageEffect(effect, 30);
            damageActive.target = opponent.active;
            store.reduceEffect(state, damageActive);
            opponent.bench.forEach(benched => {
                if (benched.cards.length > 0) {
                    const damage = new attack_effects_1.PutDamageEffect(effect, 30);
                    damage.target = benched;
                    store.reduceEffect(state, damage);
                }
            });
        }
        return state;
    }
}
exports.Articuno = Articuno;
