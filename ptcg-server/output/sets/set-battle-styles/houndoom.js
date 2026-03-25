"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Houndoom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Houndoom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Houndour';
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.cardType = D;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Single Strike Roar',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for a Single Strike Energy card and attach it to 1 of your Single Strike Pokémon. Then, shuffle your deck. If you attached Energy to a Pokémon in this way, put 2 damage counters on that Pokémon.'
            }];
        this.attacks = [{
                name: 'Darkness Fang',
                cost: [D, C],
                damage: 50,
                text: ''
            }];
        this.regulationMark = 'E';
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Houndoom';
        this.fullName = 'Houndoom BST';
        this.SINGLE_STRIKE_ROAR_MARKER = 'SINGLE_STRIKE_ROAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SINGLE_STRIKE_ROAR_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.SINGLE_STRIKE_ROAR_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(card_types_1.CardTag.SINGLE_STRIKE)) {
                    blocked2.push(target);
                }
            });
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL, name: 'Single Strike Energy' }, { allowCancel: false, min: 0, max: 1, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                (0, prefabs_1.ABILITY_USED)(player, this);
                // cancelled by user
                if (transfers.length === 0) {
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    return;
                }
                player.marker.addMarker(this.SINGLE_STRIKE_ROAR_MARKER, this);
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    target.damage += 20;
                }
            });
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SINGLE_STRIKE_ROAR_MARKER, this)) {
            effect.player.marker.removeMarker(this.SINGLE_STRIKE_ROAR_MARKER, this);
        }
        return state;
    }
}
exports.Houndoom = Houndoom;
