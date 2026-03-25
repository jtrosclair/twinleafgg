"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chandelure = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Chandelure extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Lampent';
        this.cardType = R;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Flare Navigate',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may search your deck for a [R] Energy card and attach it to 1 of your Pokémon. If you do, put 1 damage counter on that Pokémon. Shuffle your deck afterward.'
            }];
        this.attacks = [
            {
                name: 'Absorb Life',
                cost: [R, R, C],
                damage: 70,
                text: 'Heal 30 damage from this Pokémon.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '16';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Chandelure';
        this.fullName = 'Chandelure PLF';
        this.FLARE_NAVIGATE_MARKER = 'FLARE_NAVIGATE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Ability: Flare Navigate
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            (0, prefabs_1.BLOCK_IF_DECK_EMPTY)(player);
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.FLARE_NAVIGATE_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            // Build blocked list: only allow [R] Energy cards
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                if (c.superType !== card_types_1.SuperType.ENERGY || c.energyType !== card_types_1.EnergyType.BASIC || !c.provides.includes(card_types_1.CardType.FIRE)) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: true, blocked }), selected => {
                if (!selected || selected.length === 0) {
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    return;
                }
                const energyCard = selected[0];
                // Choose a Pokemon to attach the energy to
                store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                    if (!targets || targets.length === 0) {
                        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                        return;
                    }
                    const target = targets[0];
                    player.deck.moveCardTo(energyCard, target);
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    // Put 1 damage counter on that Pokemon
                    target.damage += 10;
                });
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.FLARE_NAVIGATE_MARKER, this);
        // Attack: Absorb Life
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 30);
        }
        return state;
    }
}
exports.Chandelure = Chandelure;
