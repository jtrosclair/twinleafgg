"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flygonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Flygonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Vibrava';
        this.cardType = C;
        this.hp = 150;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: L, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Emerge Charge',
                powerType: game_2.PowerType.POKEPOWER,
                text: 'Once during your turn, when you play Flygon ex from your hand to evolve 1 of your Pokémon, you may search your discard pile for up to 2 Energy cards and attach them to Flygon ex.'
            }];
        this.attacks = [{
                name: 'Reactive Blast',
                cost: [L, C],
                damage: 40,
                damageCalculation: '+',
                text: 'You may discard any number of React Energy cards attached to Flygon ex. If you do, this attack does 40 damage plus 30 more damage for each Energy card you discarded.'
            },
            {
                name: 'Dragon Claw',
                cost: [G, L, C, C, C],
                damage: 100,
                text: ''
            }];
        this.set = 'LM';
        this.setNumber = '87';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Flygon ex';
        this.fullName = 'Flygon ex LM';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.JUST_EVOLVED(effect, this)) {
            const player = effect.player;
            if (prefabs_1.IS_POKEPOWER_BLOCKED(store, state, player, this)) {
                return state;
            }
            const blockedTo = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() !== this) {
                    blockedTo.push({
                        player: game_1.PlayerType.BOTTOM_PLAYER,
                        slot: cardList === player.active ? game_1.SlotType.ACTIVE : game_1.SlotType.BENCH,
                        index: cardList === player.active ? 0 : player.bench.indexOf(cardList)
                    });
                }
            });
            store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_2.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, {
                min: 0,
                max: 2,
                allowCancel: false,
                blockedTo
            }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    prefabs_1.MOVE_CARDS(store, state, player.deck, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.powers[0] });
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            // See if there is holon energy attached
            const reactEnergy = player.active.cards.filter(card => card.name === 'React Energy');
            if (reactEnergy.length > 0) {
                state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_2.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { name: 'React Energy' }, { min: 0, max: reactEnergy.length, allowCancel: false }), selected => {
                    const cards = selected || [];
                    if (cards.length > 0) {
                        const discardEffect = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        discardEffect.target = player.active;
                        store.reduceEffect(state, discardEffect);
                        effect.damage += 30 * cards.length;
                    }
                });
            }
        }
        return state;
    }
}
exports.Flygonex = Flygonex;
