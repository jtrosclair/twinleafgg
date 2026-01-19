"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manectricex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Manectricex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Electrike';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = L;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Disconnect',
                cost: [L, C],
                damage: 40,
                text: 'Your opponent can\'t play any Trainer cards (except for Supporter cards) from his or her hand during your opponent\'s next turn.',
            },
            {
                name: 'Mega Shot',
                cost: [L, L, C],
                damage: 0,
                text: 'Discard all [L] Energy attached to Manectric ex and then choose 1 of your opponent\'s Pokémon. This attack does 80 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
            }];
        this.set = 'DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.name = 'Manectric ex';
        this.fullName = 'Manectric ex DX';
        this.OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            (0, prefabs_1.ADD_MARKER)(this.OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER, opponent, this);
        }
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard.trainerType !== card_types_1.TrainerType.SUPPORTER) {
            const player = effect.player;
            if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            // Discard all [L]
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (!(cardList instanceof game_1.PokemonCardList))
                throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            // Only discard cards that provide LIGHTNING or ANY energy
            const cards = checkProvidedEnergy.energyMap
                .filter(e => e.provides.includes(card_types_1.CardType.LIGHTNING) || e.provides.includes(card_types_1.CardType.ANY))
                .map(e => e.card);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = cardList;
            store.reduceEffect(state, discardEnergy);
            // Deal damage to opponent's Pokémon
            (0, attack_effects_2.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(80, effect, store, state);
        }
        return state;
    }
}
exports.Manectricex = Manectricex;
