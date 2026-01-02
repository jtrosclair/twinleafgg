"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsCrobatex = void 0;
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsCrobatex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Team Rocket\'s Golbat';
        this.tags = [game_1.CardTag.TEAM_ROCKET, game_1.CardTag.POKEMON_ex];
        this.cardType = D;
        this.hp = 310;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Bite About',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put 2 damage counters on 2 of your opponent\'s Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Assassin\'s Return',
                cost: [D, D],
                damage: 120,
                text: 'You may put this Pokémon into your hand. (Discard all attached cards.)'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '122';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Crobat ex';
        this.fullName = 'Team Rocket\'s Crobat ex DRI';
        this.usedAssassinsReturn = false;
    }
    reduceEffect(store, state, effect) {
        // Bite About
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (!result) {
                    return state;
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 2, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    target.damage += 20;
                });
            });
        }
        // Assassin's Return
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            this.usedAssassinsReturn = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedAssassinsReturn) {
            const player = effect.player;
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    const pokemons = player.active.getPokemons();
                    const otherCards = player.active.cards.filter(card => !(card instanceof game_1.PokemonCard));
                    player.active.clearEffects();
                    // Move other cards to discard
                    if (otherCards.length > 0) {
                        prefabs_1.MOVE_CARDS(store, state, player.active, player.discard, { cards: otherCards });
                    }
                    // Move Pokémon to hand
                    if (pokemons.length > 0) {
                        prefabs_1.MOVE_CARDS(store, state, player.active, player.hand, { cards: pokemons });
                    }
                    this.usedAssassinsReturn = false;
                }
            });
        }
        return state;
    }
}
exports.TeamRocketsCrobatex = TeamRocketsCrobatex;
