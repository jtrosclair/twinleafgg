"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiqueShieldFossil = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_1 = require("../../game/store/state/state");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AntiqueShieldFossil extends game_1.TrainerCard {
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
        this.evolvesTo = ['Shieldon'];
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
                name: 'Armor Protection',
                powerType: game_1.PowerType.ABILITY,
                text: 'While this Pokémon is in the Active Spot, all of your Pokémon take 10 less damage from attacks from your opponent\'s Pokémon.',
            },
            {
                name: 'Antique Shield Fossil',
                text: `Play this card as if it were a 60-HP Basic [C] Pokémon. This card can't be affected by any Special Conditions and can't retreat. At any time during your turn, you may discard this card from play.`,
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                isFossil: true,
                powerType: game_1.PowerType.TRAINER_ABILITY,
            }];
        this.set = 'M5';
        this.setNumber = '72';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Antique Shield Fossil';
        this.fullName = 'Antique Shield Fossil M5';
    }
    armorProtectionActive(store, state, defenderOwner) {
        const activeCard = defenderOwner.active.getPokemonCard();
        if (activeCard !== this) {
            return false;
        }
        try {
            store.reduceEffect(state, new game_effects_1.PowerEffect(defenderOwner, this.powers[0], this));
        }
        catch (_a) {
            return false;
        }
        return true;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.target.getPokemonCard() === this) {
            effect.preventDefault = true;
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && state.phase === state_1.GamePhase.ATTACK) {
            const defenderOwner = game_1.StateUtils.findOwner(state, effect.target);
            const attackerOwner = game_1.StateUtils.findOwner(state, effect.source);
            if (defenderOwner !== attackerOwner
                && attackerOwner === game_1.StateUtils.getOpponent(state, defenderOwner)
                && this.armorProtectionActive(store, state, defenderOwner)) {
                effect.damage = Math.max(0, effect.damage - 10);
            }
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && state.phase === state_1.GamePhase.ATTACK) {
            const defenderOwner = game_1.StateUtils.findOwner(state, effect.target);
            const attackerOwner = game_1.StateUtils.findOwner(state, effect.source);
            if (defenderOwner !== attackerOwner
                && attackerOwner === game_1.StateUtils.getOpponent(state, defenderOwner)
                && this.armorProtectionActive(store, state, defenderOwner)) {
                effect.reduceDamage(10, this.powers[0].name);
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
exports.AntiqueShieldFossil = AntiqueShieldFossil;
