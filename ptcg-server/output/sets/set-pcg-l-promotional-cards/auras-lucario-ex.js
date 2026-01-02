"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AurasLucarioex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class AurasLucarioex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.AURAS, card_types_1.CardTag.POKEMON_ex];
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Aura\'s Guidance',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn, if Aura\'s Lucario ex is your Active Pokémon, you may use this Power. If your opponent used a Supporter card last turn, you may use the effect of that card as the effect of this Power(the Supporter card remains in your opponent\'s discard pile). This Power can\'t be used if Aura\'s Lucario ex is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Battle Blast',
                cost: [M, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'Does 50 damage plus 10 more damage for each [F] Energy attached to Aura\'s Lucario ex.'
            }];
        this.set = 'PCGL';
        this.setNumber = '6';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Aura\'s Lucario ex';
        this.fullName = 'Aura\'s Lucario ex PCGL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlaySupporterEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!opponent.supportersForDetour.cards.includes(effect.trainerCard)) {
                opponent.supportersForDetour.cards.push(effect.trainerCard);
            }
        }
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.supportersForDetour.cards.length == 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_COPY_EFFECT, player.supportersForDetour, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { allowCancel: false, min: 1, max: 1 }), cards => {
                const trainerCard = cards[0];
                player.supporterTurn -= 1;
                const playTrainerEffect = new play_card_effects_1.TrainerEffect(player, trainerCard);
                store.reduceEffect(state, playTrainerEffect);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.FIGHTING) || em.provides.includes(card_types_1.CardType.ANY)) {
                    energyCount += em.provides.length;
                }
            });
            for (let i = 0; i < energyCount; i++) {
                effect.damage += 10;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.supportersForDetour.cards = [];
        }
        return state;
    }
}
exports.AurasLucarioex = AurasLucarioex;
