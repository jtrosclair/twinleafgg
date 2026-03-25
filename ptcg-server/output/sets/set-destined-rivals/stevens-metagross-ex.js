"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StevensMetagrossex = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class StevensMetagrossex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Steven\'s Metang';
        this.tags = [card_types_1.CardTag.STEVENS, card_types_1.CardTag.POKEMON_ex];
        this.cardType = M;
        this.hp = 340;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'X-Boot',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for a Basic [P] Energy card, ' +
                    'a Basic [M] Energy card, or 1 of each and attach them to your [P] Pokémon and [M] Pokémon ' +
                    'in any way you like. Then, shuffle your deck.'
            }];
        this.attacks = [{ name: 'Metal Stomp', cost: [M, C, C], damage: 200, text: '' }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '145';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Steven\'s Metagross ex';
        this.fullName = 'Steven\'s Metagross ex DRI';
        this.X_BOOT_MARKER = 'X_BOOT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(this.X_BOOT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.X_BOOT_MARKER, player, this);
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true, min: 0, max: 2, differentTypes: true, validCardTypes: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.METAL] }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    if (transfers.length > 1) {
                        if (transfers[0].card.name === transfers[1].card.name) {
                            throw new game_1.GameError(game_1.GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
                        }
                    }
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.X_BOOT_MARKER, this);
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.X_BOOT_MARKER, this);
        }
        return state;
    }
}
exports.StevensMetagrossex = StevensMetagrossex;
