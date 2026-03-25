"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tsareena = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tsareena extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Steenee';
        this.cardType = G;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.QUEENLY_REWARD_MARKER = 'TSAREENA_UNM_QUEENLY_REWARD_MARKER';
        this.powers = [{
                name: 'Queenly Reward',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may attach a [G] Energy card from your discard pile to your Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'High Jump Kick',
                cost: [G, C, C],
                damage: 90,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '19';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tsareena';
        this.fullName = 'Tsareena UNM';
    }
    reduceEffect(store, state, effect) {
        // Ability: Queenly Reward
        // Ref: set-phantom-forces/hydreigon.ts (Dark Impulse - attach energy from discard to active)
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            const hasEnergyInDiscard = player.discard.cards.some(c => c instanceof game_1.EnergyCard && c.name === 'Grass Energy');
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.QUEENLY_REWARD_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, name: 'Grass Energy' }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.QUEENLY_REWARD_MARKER, this);
        return state;
    }
}
exports.Tsareena = Tsareena;
