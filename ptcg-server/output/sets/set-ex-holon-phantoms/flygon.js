"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flygon = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Flygon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = G;
        this.additionalCardTypes = [M];
        this.stage = game_1.Stage.BASIC;
        this.evolvesFrom = 'Vibrava';
        this.tags = [game_1.CardTag.DELTA_SPECIES];
        this.hp = 110;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: L, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Delta Supply',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may attach a basic Energy card or a Delta Rainbow Energy card from your hand to 1 of your Pokémon that has Delta on its card. This power can\'t be used if Flygon is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Swift',
                cost: [G, M, C],
                damage: 60,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.'
            }];
        this.set = 'HP';
        this.setNumber = '7';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Flygon';
        this.fullName = 'Flygon HP';
        this.DELTA_SUPPLY_MARKER = 'DELTA_SUPPLY_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.DELTA_SUPPLY_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard && (c.energyType === game_1.EnergyType.BASIC || c.name === 'Delta Rainbow Energy');
            });
            if (prefabs_1.HAS_MARKER(this.DELTA_SUPPLY_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            const blocked = [];
            player.hand.cards.forEach((card, index) => {
                if (card instanceof game_1.EnergyCard && (card.energyType === game_1.EnergyType.BASIC || card.name === 'Delta Rainbow Energy')) {
                }
                else {
                    blocked.push(index);
                }
            });
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(game_1.CardTag.DELTA_SPECIES)) {
                    blocked2.push(target);
                }
            });
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1, blocked, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                }
            });
            prefabs_1.ADD_MARKER(this.DELTA_SUPPLY_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 60);
        }
        return state;
    }
}
exports.Flygon = Flygon;
