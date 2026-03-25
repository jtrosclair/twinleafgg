"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Barbaracle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Barbaracle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Binacle';
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Stone Arms',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may attach a Basic [F] Energy from your hand to 1 of your [F] Pokémon.'
            }];
        this.attacks = [{
                name: 'Hammer In',
                cost: [F, F, C],
                damage: 80,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Barbaracle';
        this.fullName = 'Barbaracle M3';
        this.STONE_ARMS_MARKER = 'STONE_ARMS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.STONE_ARMS_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.STONE_ARMS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.cardType !== card_types_1.CardType.FIGHTING) {
                    blocked2.push(target);
                }
            });
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { allowCancel: false, min: 0, max: 1, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                (0, prefabs_1.ABILITY_USED)(player, this);
                player.marker.addMarker(this.STONE_ARMS_MARKER, this);
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                }
            });
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.STONE_ARMS_MARKER, this)) {
            effect.player.marker.removeMarker(this.STONE_ARMS_MARKER, this);
        }
        return state;
    }
}
exports.Barbaracle = Barbaracle;
