"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gumshoos = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gumshoos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yungoos';
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Gather Evidence',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may use this Ability. Switch a card from your hand with the top card of your deck.'
            }];
        this.attacks = [{
                name: 'Bite',
                cost: [C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'MEG';
        this.setNumber = '110';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gumshoos';
        this.fullName = 'Gumshoos M1L';
        this.regulationMark = 'I';
        this.GATHER_EVIDENCE_MARKER = 'GATHER_EVIDENCE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.GATHER_EVIDENCE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0 || player.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.GATHER_EVIDENCE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.hand, {}, { min: 1, max: 1, allowCancel: true }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    player.deck.moveTo(player.hand, 1);
                    const index = player.hand.cards.indexOf(cards[0]);
                    if (index !== -1) {
                        player.hand.cards.splice(index, 1);
                        player.deck.cards.unshift(cards[0]);
                    }
                    player.marker.addMarker(this.GATHER_EVIDENCE_MARKER, this);
                    (0, prefabs_1.ABILITY_USED)(player, this);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.GATHER_EVIDENCE_MARKER, this);
        }
        return state;
    }
}
exports.Gumshoos = Gumshoos;
