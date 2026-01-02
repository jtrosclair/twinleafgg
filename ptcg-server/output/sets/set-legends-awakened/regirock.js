"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regirock = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Regirock extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Regi Cycle',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if you have a [F] Energy card in your discard pile, you may discard 2 cards from your hand. Then, attach a [F] Energy card from your discard pile to Regirock. This power can\'t be used if Regirock is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Stone Edge',
                cost: [F, F, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 40 damage plus 30 more damage.'
            }
        ];
        this.set = 'LA';
        this.setNumber = '38';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Regirock';
        this.fullName = 'Regirock LA';
        this.REGI_CYCLE_MARKER = 'REGI_CYCLE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            prefabs_1.REMOVE_MARKER(this.REGI_CYCLE_MARKER, effect.player, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.REGI_CYCLE_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.REGI_CYCLE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.hand.cards.length < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.name == 'Fighting Energy';
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: true, min: 2, max: 2 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(cards, player.discard);
                prefabs_1.ADD_MARKER(this.REGI_CYCLE_MARKER, player, this);
                prefabs_1.ABILITY_USED(player, this);
                const cardList = game_1.StateUtils.findCardList(state, this);
                const energyCard = player.discard.cards.find(c => c instanceof game_1.EnergyCard && c.name === 'Fighting Energy');
                if (energyCard) {
                    player.discard.moveCardTo(energyCard, cardList);
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
        }
        return state;
    }
}
exports.Regirock = Regirock;
