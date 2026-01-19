"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rayquazaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Rayquazaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: W, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Spiral Growth',
                cost: [C],
                damage: 0,
                text: 'Flip a coin until you get tails. For each heads, search your discard pile for a basic Energy card and attach it to Rayquaza ex.'
            },
            {
                name: 'Dragon Burst',
                cost: [R, L],
                damage: 40,
                damageCalculation: 'x',
                text: 'Discard either all [R] Energy or all [L] Energy attached to Rayquaza ex. This attack does 40 damage times the amount of [R] or [L] Energy discarded.'
            }];
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.name = 'Rayquaza ex';
        this.fullName = 'Rayquaza ex DR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const flipCoin = (heads = 0) => {
                return store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        return flipCoin(heads + 1);
                    }
                    state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: heads }), transfers => {
                        transfers = transfers || [];
                        // cancelled by user
                        if (transfers.length === 0) {
                            return;
                        }
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.attacks[0] });
                        }
                    });
                });
            };
            return flipCoin();
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const options = [
                {
                    message: game_message_1.GameMessage.ALL_FIRE_ENERGIES,
                    action: () => {
                        // Discard all [R]
                        const player = effect.player;
                        const cardList = game_1.StateUtils.findCardList(state, this);
                        if (!(cardList instanceof game_1.PokemonCardList))
                            throw new game_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
                        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
                        state = store.reduceEffect(state, checkProvidedEnergy);
                        // Only discard cards that provide R or ANY energy
                        const cards = checkProvidedEnergy.energyMap
                            .filter(e => e.provides.includes(card_types_1.CardType.FIRE) || e.provides.includes(card_types_1.CardType.ANY))
                            .map(e => e.card);
                        effect.damage = 40 * cards.length;
                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        discardEnergy.target = cardList;
                        store.reduceEffect(state, discardEnergy);
                    }
                },
                {
                    message: game_message_1.GameMessage.ALL_LIGHTNING_ENERGIES,
                    action: () => {
                        // Discard all [L]
                        const player = effect.player;
                        const cardList = game_1.StateUtils.findCardList(state, this);
                        if (!(cardList instanceof game_1.PokemonCardList))
                            throw new game_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
                        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
                        state = store.reduceEffect(state, checkProvidedEnergy);
                        // Only discard cards that provide LIGHTNING or ANY energy
                        const cards = checkProvidedEnergy.energyMap
                            .filter(e => e.provides.includes(card_types_1.CardType.LIGHTNING) || e.provides.includes(card_types_1.CardType.ANY))
                            .map(e => e.card);
                        effect.damage = 40 * cards.length;
                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        discardEnergy.target = cardList;
                        store.reduceEffect(state, discardEnergy);
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_message_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.Rayquazaex = Rayquazaex;
