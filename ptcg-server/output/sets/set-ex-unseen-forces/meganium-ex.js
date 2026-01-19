"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meganiumex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Meganiumex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Bayleef';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = G;
        this.hp = 150;
        this.weakness = [{ type: G }, { type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Nurture and Heal',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may attach a [G] Energy card from your hand to 1 of your Pokémon. If you do, remove 1 damage counter from that Pokémon. This power can\'t be used if Meganium ex is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Razor Leaf',
                cost: [C, C, C],
                damage: 50,
                text: ''
            },
            {
                name: 'Power Poison',
                cost: [G, G, C, C, C],
                damage: 90,
                text: 'Discard 1 Energy attached to Meganium ex. The Defending Pokémon is now Poisoned.'
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
        this.name = 'Meganium ex';
        this.fullName = 'Meganium ex UF';
        this.NURTURE_AND_HEAL_MARKER = 'NURTURE_AND_HEAL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            (0, prefabs_1.REMOVE_MARKER)(this.NURTURE_AND_HEAL_MARKER, player, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.NURTURE_AND_HEAL_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            if (!player.hand.cards.some(card => card.superType === card_types_1.SuperType.ENERGY && card.name === 'Grass Energy')) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, name: 'Grass Energy' }, { allowCancel: true, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    (0, prefabs_1.ADD_MARKER)(this.NURTURE_AND_HEAL_MARKER, player, this);
                    (0, prefabs_1.ABILITY_USED)(player, this);
                    //Attaching energy
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    (0, prefabs_1.MOVE_CARD_TO)(state, transfer.card, target);
                    //Heal 30 from target
                    const healEffect = new game_effects_1.HealEffect(player, target, 10);
                    state = store.reduceEffect(state, healEffect);
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.NURTURE_AND_HEAL_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED)(store, state, effect);
        }
        return state;
    }
}
exports.Meganiumex = Meganiumex;
