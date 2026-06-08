"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaGreninjaex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_effects_1 = require("../../game/store/effects/game-effects");
const energy_card_1 = require("../../game/store/card/energy-card");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_error_1 = require("../../game/game-error");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MegaGreninjaex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Frogadier';
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.hp = 350;
        this.cardType = W;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Mortal Shuriken',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if this Pokemon is in the Active Spot, you may discard a Basic [W] Energy card from your hand in order to use this Ability. Place 6 damage counters on 1 of your opponent\'s Pokemon.'
            }];
        this.attacks = [{
                name: 'Ninja Spinner',
                cost: [W, W],
                damage: 120,
                text: 'You may put a [W] Energy attached to this Pokemon into your hand and have this attack do 80 more damage.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.usSetNumber = 'CRI 22';
        this.name = 'Mega Greninja ex';
        this.fullName = 'Mega Greninja ex M4';
        this.MORTAL_SHURIKEN_MARKER = 'MORTAL_SHURIKEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.active.getPokemonCard() !== this) {
                throw new game_error_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const basicWInHand = player.hand.cards.find(c => c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(W));
            if (!basicWInHand) {
                throw new game_error_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasOpponentPokemon = opponent.active.cards.length > 0 || opponent.bench.some(b => b.cards.length > 0);
            if (!hasOpponentPokemon) {
                throw new game_error_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.MORTAL_SHURIKEN_MARKER, this)) {
                throw new game_error_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    player.marker.addMarker(this.MORTAL_SHURIKEN_MARKER, this);
                    return state;
                }
                player.marker.addMarker(this.MORTAL_SHURIKEN_MARKER, this);
                (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards, sourceCard: this, sourceEffect: this.powers[0] });
            });
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.length > 0) {
                    const placeCounters = new game_effects_1.PlaceDamageCountersEffect(player, targets[0], 60, this);
                    store.reduceEffect(state, placeCounters);
                }
                (0, prefabs_1.ABILITY_USED)(player, this);
            });
            return state;
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.MORTAL_SHURIKEN_MARKER, this);
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            effect.player.marker.removeMarker(this.MORTAL_SHURIKEN_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const wEnergies = player.active.cards.filter(c => c instanceof energy_card_1.EnergyCard && c.provides.includes(W));
            if (wEnergies.length === 0) {
                return state;
            }
            const blocked = [];
            player.active.cards.forEach((c, i) => {
                if (!(c instanceof energy_card_1.EnergyCard) || !c.provides.includes(W)) {
                    blocked.push(i);
                }
            });
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.active, {}, { min: 0, max: 1, allowCancel: true, blocked }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    player.active.moveCardTo(cards[0], player.hand);
                    effect.damage += 80;
                }
            });
        }
        return state;
    }
}
exports.MegaGreninjaex = MegaGreninjaex;
