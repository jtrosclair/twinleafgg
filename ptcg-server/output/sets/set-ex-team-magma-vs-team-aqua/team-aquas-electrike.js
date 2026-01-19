"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAquasElectrike = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamAquasElectrike extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_AQUA];
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Self Charge',
                cost: [C],
                damage: 0,
                text: 'Attach an Energy card from your hand to Team Aqua\'s Electrike.'
            },
            {
                name: 'Tackle',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Team Aqua\'s Electrike';
        this.fullName = 'Team Aqua\'s Electrike MA';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.TeamAquasElectrike = TeamAquasElectrike;
