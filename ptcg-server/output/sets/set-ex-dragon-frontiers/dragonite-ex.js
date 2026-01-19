"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragoniteex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Dragoniteex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dragonair';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = G;
        this.hp = 150;
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Deafen',
                cost: [C, C],
                damage: 40,
                text: 'Your opponent can\'t play any Trainer cards (except for Supporter cards) from his or her hand during your opponent\'s next turn.',
            },
            {
                name: 'Dragon Roar',
                cost: [G, G, C, C],
                damage: 0,
                text: 'Put 8 damage counters on the Defending Pokémon. If that Pokémon would be Knocked Out by this attack, put any damage counters not necessary to Knock Out the Defending Pokémon on your opponent\'s Benched Pokémon in any way you like.',
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Dragonite ex';
        this.fullName = 'Dragonite ex DF';
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
            const opponent = effect.opponent;
            const defending = opponent.active;
            // Check current HP and current damage on the defending Pokémon
            const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, defending);
            store.reduceEffect(state, checkHpEffect);
            // Calculate total damage already on the defending Pokémon
            const currentDamage = defending.damage;
            // If the Pokémon would be Knocked Out by this attack, only put enough to KO
            const damageToKO = Math.max(0, checkHpEffect.hp - currentDamage);
            const damageToPlace = Math.min(80, damageToKO);
            // Place damage counters on the Defending Pokémon
            if (damageToPlace > 0) {
                (0, attack_effects_2.PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON)(damageToPlace / 10, store, state, effect);
            }
            // Put the rest wherever you want
            const remainingDamage = 80 - damageToPlace;
            if (remainingDamage > 0) {
                const opponentBench = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
                if (opponentBench === 0) {
                    return state;
                }
                const maxAllowedDamage = [];
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                    maxAllowedDamage.push({ target, damage: card.hp + (cardList.damage || 0) });
                });
                return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], remainingDamage, maxAllowedDamage, { allowCancel: false }), targets => {
                    const results = targets || [];
                    const player = effect.player;
                    for (const result of results) {
                        const target = game_1.StateUtils.getTarget(state, player, result.target);
                        const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
                        putCountersEffect.target = target;
                        store.reduceEffect(state, putCountersEffect);
                    }
                });
            }
        }
        return state;
    }
}
exports.Dragoniteex = Dragoniteex;
