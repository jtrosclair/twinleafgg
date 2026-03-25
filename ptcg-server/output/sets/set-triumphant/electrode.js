"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electrode = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Electrode extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Voltorb';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Energymite',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may use this power. If you do, Electrode is Knocked Out. Look at the top 7 cards of your deck. Choose as many Energy cards as you like and attach them to your Pokémon in any way you like. Discard the other cards. This power can\'t be used if Electrode is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Gigashock',
                cost: [L, C],
                damage: 30,
                text: 'Does 10 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Electrode';
        this.fullName = 'Electrode TM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            const thisCardList = game_1.StateUtils.findCardList(state, effect.card);
            thisCardList.damage += 9990;
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 7);
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card.superType === game_1.SuperType.ENERGY;
            });
            // If no energy cards were drawn, move all cards to deck & shuffle
            if (energyCardsDrawn.length == 0) {
                store.prompt(state, [new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, temp.cards)], () => {
                    temp.cards.forEach(card => {
                        (0, prefabs_1.MOVE_CARDS)(store, state, temp, player.discard, { cards: [card] });
                        return state;
                    });
                    return state;
                });
            }
            if (energyCardsDrawn.length >= 1) {
                // Prompt to attach energy if any were drawn
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, temp, // Only show drawn energies
                game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY }, { min: 0, max: energyCardsDrawn.length }), transfers => {
                    // Attach energy based on prompt selection
                    if (transfers) {
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            temp.moveCardTo(transfer.card, target); // Move card to target
                        }
                        temp.cards.forEach(card => {
                            (0, prefabs_1.MOVE_CARDS)(store, state, temp, player.discard, { cards: [card] });
                        });
                    }
                    return state;
                });
            }
        }
        return state;
    }
}
exports.Electrode = Electrode;
