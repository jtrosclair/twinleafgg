"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lugiaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Lugiaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Silver Sparkle',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If Lugia ex is your Active Pokémon and is damaged by an opponent\'s attack (even if Lugia ex is Knocked Out), flip a coin. If heads, choose an Energy card attached to the Attacking Pokémon and return it to your opponent\'s hand.'
            }];
        this.attacks = [{
                name: 'Elemental Blast',
                cost: [R, W, L],
                damage: 200,
                text: 'Discard a [R] Energy, [W] Energy, and [L] Energy attached to Lugia ex.'
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Lugia ex';
        this.fullName = 'Lugia ex UF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (state.phase === state_1.GamePhase.ATTACK) {
                (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, targetPlayer, result => {
                    if (result) {
                        const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
                        store.reduceEffect(state, opponentProvidedEnergy);
                        const opponentEnergyCount = opponentProvidedEnergy.energyMap
                            .reduce((left, p) => left + p.provides.length, 0);
                        if (opponentEnergyCount === 0) {
                            return state;
                        }
                        store.prompt(state, new game_1.ChooseCardsPrompt(targetPlayer, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_HAND, player.active, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false }), selected => {
                            player.active.moveCardsTo(selected, player.hand);
                        });
                    }
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.FIRE, card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Lugiaex = Lugiaex;
