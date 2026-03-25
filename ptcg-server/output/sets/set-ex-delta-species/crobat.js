"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crobat = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Crobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Golbat';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = G;
        this.additionalCardTypes = [M];
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [];
        this.attacks = [{
                name: 'Radar Jam',
                cost: [C, C],
                damage: 30,
                text: 'Your opponent can\'t play any Trainer cards (except for Supporter cards) from his or her hand during your opponent\'s next turn.'
            },
            {
                name: 'Target Attack',
                cost: [G, M, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 40 damage to that Pokémon. If that Pokémon already has damage counters on it, this attack does 60 damage instead. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Crobat';
        this.fullName = 'Crobat DS';
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
            const player = effect.player;
            const opponent = effect.opponent;
            const targets = opponent.getPokemonInPlay();
            if (targets.length === 0)
                return state;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE]), selected => {
                const target = selected[0];
                const damage = target.damage > 0 ? 50 : 30;
                let damageEffect;
                if (target === opponent.active) {
                    damageEffect = new attack_effects_1.DealDamageEffect(effect, damage);
                }
                else {
                    damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
                }
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Crobat = Crobat;
