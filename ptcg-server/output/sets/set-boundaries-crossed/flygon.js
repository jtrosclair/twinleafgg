"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flygon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Flygon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Vibrava';
        this.cardType = N;
        this.hp = 140;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.powers = [{
                name: 'Sand Slammer',
                powerType: game_1.PowerType.ABILITY,
                text: 'At any time between turns, if this Pokémon is your Active Pokémon, put 1 damage counter on each of your opponent\'s Pokémon.'
            }];
        this.attacks = [{
                name: 'Flying Beatdown',
                cost: [G, F, C, C],
                damage: 80,
                text: 'You may discard a [G] Energy and a [F] Energy attached to this Pokémon. If you do, the Defending Pokémon is now Paralyzed.'
            }];
        this.set = 'BCR';
        this.setNumber = '99';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Flygon';
        this.fullName = 'Flygon BCR';
    }
    reduceEffect(store, state, effect) {
        // Sand Damage
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const damageEffect = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, cardList);
                store.reduceEffect(state, damageEffect);
                if (damageEffect.target) {
                    damageEffect.target.damage += 10;
                }
            });
        }
        // Flying Beatdown
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
                    state = store.reduceEffect(state, checkProvidedEnergy);
                    state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.GRASS, card_types_1.CardType.FIGHTING], { allowCancel: false }), energy => {
                        const cards = (energy || []).map(e => e.card);
                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        discardEnergy.target = player.active;
                        store.reduceEffect(state, discardEnergy);
                    });
                    attack_effects_2.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
                }
            }, game_1.GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
        }
        return state;
    }
}
exports.Flygon = Flygon;
