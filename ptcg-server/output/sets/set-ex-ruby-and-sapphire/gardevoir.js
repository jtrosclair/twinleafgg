"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gardevoir = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Gardevoir extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.cardType = P;
        this.hp = 10;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Psy Shadow',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may search your deck for a [P] Energy card and attach it to 1 of your Pokémon. Put 2 damage counters on that Pokémon. Shuffle your deck afterward. This power can\'t be used if Gardevoir is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Energy Burst',
                cost: [P],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the total amount of Energy attached to Gardevoir and the Defending Pokémon.'
            }];
        this.set = 'RS';
        this.name = 'Gardevoir';
        this.fullName = 'Gardevoir RS';
        this.setNumber = '7';
        this.cardImage = 'assets/cardback.png';
        this.PSY_SHADOW_MARKER = 'PSY_SHADOW_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            if ((0, prefabs_1.HAS_MARKER)(this.PSY_SHADOW_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.PSY_SHADOW_MARKER, player, this);
            store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, name: 'Psychic Energy' }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                    target.damage += 20; // Add 2 damage counters
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.PSY_SHADOW_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            const player = effect.player;
            const checkProvidedEnergyOpponent = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
            const checkProvidedEnergyPlayer = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyOpponent);
            store.reduceEffect(state, checkProvidedEnergyPlayer);
            const totalEnergy = checkProvidedEnergyOpponent.energyMap.length + checkProvidedEnergyPlayer.energyMap.length;
            const damagePerEnergy = 10;
            effect.damage = totalEnergy * damagePerEnergy;
        }
        return state;
    }
}
exports.Gardevoir = Gardevoir;
