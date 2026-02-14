"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersianGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PersianGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Meowth';
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Cat Walk',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if 1 of your Pokémon-GX or Pokémon-EX was Knocked Out during your opponent\'s last turn, you may search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck. You can\'t use more than 1 Cat Walk Ability each turn.'
            }];
        this.attacks = [
            {
                name: 'Vengeance',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each Pokémon in your discard pile. You can\'t add more than 180 damage in this way.'
            },
            {
                name: 'Slash Back-GX',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '149';
        this.name = 'Persian-GX';
        this.fullName = 'Persian-GX UNB';
        this.CAT_WALK_MARKER = 'CAT_WALK_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Remove Cat Walk marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CAT_WALK_MARKER)) {
            effect.player.marker.removeMarker(this.CAT_WALK_MARKER, this);
        }
        // Cat Walk ability
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.CAT_WALK_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check if a GX or EX was knocked out during opponent's last turn
            // This requires checking the game state for knocked out Pokemon from the previous turn
            // For now, we'll implement the basic search functionality
            // TODO: Add check for knocked out GX/EX during opponent's last turn
            player.marker.addMarker(this.CAT_WALK_MARKER, this);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 2, allowCancel: false }), cards => {
                cards = cards || [];
                player.deck.moveCardsTo(cards, player.hand);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        // Vengeance attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let pokemonCount = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof pokemon_card_1.PokemonCard) {
                    pokemonCount += 1;
                }
            });
            const additionalDamage = Math.min(pokemonCount * 20, 180);
            effect.damage += additionalDamage;
        }
        // Slash Back-GX attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    const target = targets[0];
                    player.switchPokemon(target);
                }
            });
        }
        return state;
    }
}
exports.PersianGX = PersianGX;
