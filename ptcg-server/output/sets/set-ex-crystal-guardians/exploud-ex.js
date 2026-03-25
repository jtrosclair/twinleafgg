"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exploudex = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Exploudex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Loudred';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = C;
        this.hp = 150;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Extra Noise',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Exploud ex is your Active Pokémon, put 1 damage counter on each of your opponent\'s Pokémon-ex between turns.',
            }];
        this.attacks = [{
                name: 'Derail',
                cost: [C, C],
                damage: 40,
                text: 'Discard a Special Energy card, if any, attached to the Defending Pokémon.'
            },
            {
                name: 'Hyper Tail',
                cost: [C, C, C],
                damage: 60,
                text: 'If the Defending Pokémon has any Poké-Powers or Poké-Bodies, this attack does 60 damage plus 20 more damage.'
            }];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Exploud ex';
        this.fullName = 'Exploud ex CG';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    const placeCountersEffect = new game_effects_1.PlaceDamageCountersEffect(opponent, cardList, 10, this);
                    state = store.reduceEffect(state, placeCountersEffect);
                }
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const oppActive = opponent.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, oppActive);
            store.reduceEffect(state, checkEnergy);
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard.superType === card_types_1.SuperType.ENERGY && energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
                    let cards = [];
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, oppActive, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected;
                    });
                    (0, prefabs_1.MOVE_CARDS)(store, state, oppActive, opponent.discard, { cards: cards, sourceCard: this, sourceEffect: this.attacks[0] });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActivePokemon = opponent.active.getPokemonCard();
            if (opponentActivePokemon) {
                const powersEffect = new check_effects_1.CheckPokemonPowersEffect(opponent, opponentActivePokemon);
                state = store.reduceEffect(state, powersEffect);
                if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.POKEBODY || power.powerType === game_1.PowerType.POKEPOWER)) {
                    (0, prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE)(effect, store, state, 20);
                }
            }
        }
        return state;
    }
}
exports.Exploudex = Exploudex;
