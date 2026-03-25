"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magearna = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magearna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.CHANGE_CLOTHES_MARKER = 'MAGEARNA_UPR_CHANGE_CLOTHES_MARKER';
        this.powers = [{
                name: 'Change Clothes',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may put a Pokémon Tool card attached to 1 of your Pokémon into your hand.'
            }];
        this.attacks = [
            {
                name: 'Rolling Attack',
                cost: [M, C, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'UPR';
        this.setNumber = '91';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magearna';
        this.fullName = 'Magearna UPR';
    }
    reduceEffect(store, state, effect) {
        // Ability: Change Clothes
        // Ref: set-fates-collide/genesect-ex.ts (Drive Change - tool to hand)
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            // Check if any of your Pokemon have a tool attached
            let hasToolPokemon = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.tools.length > 0) {
                    hasToolPokemon = true;
                }
            });
            if (!hasToolPokemon) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.CHANGE_CLOTHES_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            // Choose a Pokemon with a tool
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const target = selected[0];
                if (target.tools.length > 0) {
                    const tool = target.tools[0];
                    target.moveCardTo(tool, player.hand);
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.CHANGE_CLOTHES_MARKER, this);
        return state;
    }
}
exports.Magearna = Magearna;
