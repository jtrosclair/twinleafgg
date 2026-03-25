"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasBellsprout = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ErikasBellsprout extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.tags = [game_1.CardTag.ERIKAS];
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Soak Up',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'Once during your turn (before your attack), you may take up to 2 [G] Energy cards attached to your other Pokémon and attach them to Erika\'s Bellsprout. This power can\'t be used if Erika\'s Bellsprout is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Stretch Vine',
                cost: [G],
                damage: 10,
                text: 'Choose 1 of your opponent\'s Benched Pokémon, and this attack does 10 damage to it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'G2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
        this.name = 'Erika\'s Bellsprout';
        this.fullName = 'Erika\'s Bellsprout G2';
        this.ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Soak Up
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.ABILITY_USED_MARKER, this);
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            (0, prefabs_1.REMOVE_MARKER)(this.ABILITY_USED_MARKER, player, this);
            return state;
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_ASLEEP_CONFUSED_PARALYZED)(player, this);
            if ((0, prefabs_1.HAS_MARKER)(this.ABILITY_USED_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            let grassEnergyCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.cards.some(card => card.superType === game_1.SuperType.ENERGY && card.name === 'Grass Energy')) {
                    grassEnergyCount++;
                }
            });
            if (grassEnergyCount === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.ABILITY_USED_MARKER, player, this);
            return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, name: 'Grass Energy' }, { allowCancel: true, min: 1, max: 2 }), transfers => {
                transfers = transfers || [];
                if (transfers.length > 0) {
                    for (const transfer of transfers) {
                        if (game_1.StateUtils.getTarget(state, player, transfer.to) !== game_1.StateUtils.findCardList(state, this)) {
                            throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
                        }
                        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        source.moveCardTo(transfer.card, target);
                    }
                }
            });
        }
        // Stretch Vine
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON)(10, effect, store, state, 1, 1);
        }
        return state;
    }
}
exports.ErikasBellsprout = ErikasBellsprout;
