"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMagmasCamerupt = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamMagmasCamerupt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Magma\'s Numel';
        this.tags = [card_types_1.CardTag.TEAM_MAGMA];
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Overheat',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may search your discard pile for a basic Energy card and attach it to Team Magma\'s Camerupt. Put 2 damage counters on Team Mamga\'s Camerupt. This power can\'t be used if Team Magma\'s Camerupt is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Flame Ball',
                cost: [R, C, C],
                damage: 50,
                text: 'You may move a [R] Energy card attached to Team Magma\'s Camerupt to 1 of your Benched Pokémon.'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Team Magma\'s Camerupt';
        this.fullName = 'Team Magma\'s Camerupt MA';
        this.OVERHEAT_MARKER = 'OVERHEAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.OVERHEAT_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            //Once per turn
            if (prefabs_1.HAS_MARKER(this.OVERHEAT_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            //Must have basic energy in discard
            if (!player.discard.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ENERGY_FROM_DISCARD, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 1, allowCancel: false }), selected => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        prefabs_1.MOVE_CARDS(store, state, player.discard, cardList, { cards: selected });
                        cardList.damage += 20;
                    }
                });
                prefabs_1.ADD_MARKER(this.OVERHEAT_MARKER, player, this);
                prefabs_1.ABILITY_USED(player, this);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, name: 'Fire Energy' }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    prefabs_1.MOVE_CARD_TO(state, transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.TeamMagmasCamerupt = TeamMagmasCamerupt;
