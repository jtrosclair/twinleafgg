"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiqueSkullFossil = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_1 = require("../../game/store/state/state");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AntiqueSkullFossil extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.cardTypez = card_types_1.CardType.COLORLESS;
        this.movedToActiveThisTurn = false;
        this.pokemonType = card_types_1.PokemonType.NORMAL;
        this.evolvesFrom = '';
        this.cardTag = [];
        this.tools = [];
        this.evolvesTo = ['Cranidos'];
        this.evolvesToStage = [];
        this.archetype = [];
        this.hp = 60;
        this.weakness = [];
        this.retreat = [];
        this.resistance = [];
        this.attacks = [];
        this.maxTools = 1;
        this.evolvesFromBase = [];
        this.powers = [{
                name: 'Spiky Skull',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in the Active Spot and takes damage from an attack from your opponent\'s Pokémon, put 3 damage counters on the attacking Pokémon.',
            },
            {
                name: 'Antique Skull Fossil',
                text: `Play this card as if it were a 60-HP Basic [C] Pokémon. This card can't be affected by any Special Conditions and can't retreat. At any time during your turn, you may discard this card from play.`,
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                isFossil: true,
                powerType: game_1.PowerType.TRAINER_ABILITY,
            }];
        this.set = 'M5';
        this.setNumber = '71';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Antique Skull Fossil';
        this.fullName = 'Antique Skull Fossil M5';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.target.getPokemonCard() === this) {
            effect.preventDefault = true;
        }
        // Ref: set-rebel-clash/sigilyph.ts (Counterattack)
        if (effect instanceof attack_effects_1.AfterDamageEffect
            && effect.target.cards.includes(this)
            && effect.target.getPokemonCard() === this) {
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            const attackingPlayer = effect.player;
            if (effect.damage > 0
                && attackingPlayer !== targetPlayer
                && targetPlayer.active === effect.target
                && state.phase === state_1.GamePhase.ATTACK) {
                try {
                    store.reduceEffect(state, new game_effects_1.PowerEffect(targetPlayer, this.powers[0], this));
                }
                catch (_a) {
                    return state;
                }
                effect.source.damage += 30;
            }
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 1, this)) {
            const player = effect.player;
            store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: this.name, effect: this.powers[1].name });
            const cardList = game_1.StateUtils.findCardList(state, this);
            cardList.moveCardTo(this, player.discard);
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect && effect.trainerCard === this) {
            const player = effect.player;
            const emptySlots = player.bench.filter(b => b.cards.length === 0);
            if (emptySlots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const playPokemonEffect = new play_card_effects_1.PlayPokemonEffect(player, this, emptySlots[0]);
            store.reduceEffect(state, playPokemonEffect);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.getPokemonCard() === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_RETREAT);
        }
        return state;
    }
}
exports.AntiqueSkullFossil = AntiqueSkullFossil;
