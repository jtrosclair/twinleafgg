"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const player_1 = require("../../game/store/state/player");
const state_1 = require("../../game/store/state/state");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
const card_manager_1 = require("../../game/cards/card-manager");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const ralts_1 = require("../set-scarlet-and-violet/ralts");
const kirlia_1 = require("../set-scarlet-and-violet/kirlia");
const grand_tree_1 = require("../set-stellar-crown/grand-tree");
const rotom_1 = require("../set-ascended-heroes/rotom");
const heat_rotom_1 = require("../set-destined-rivals/heat-rotom");
const mow_rotom_1 = require("../set-destined-rivals/mow-rotom");
const rotom_2 = require("../set-destined-rivals/rotom");
const wash_rotom_1 = require("../set-destined-rivals/wash-rotom");
const whismur_1 = require("../set-celestial-storm/whismur");
describe('June safe existing-card fixes', () => {
    it('blocks Item, Supporter, Stadium, and Tool play while Whismur CES lock is active', () => {
        const state = new state_1.State();
        const whismurPlayer = new player_1.Player();
        const lockedPlayer = new player_1.Player();
        state.players = [whismurPlayer, lockedPlayer];
        const whismur = new whismur_1.Whismur();
        whismurPlayer.marker.addMarker(whismur.SUDDEN_SHRIEK_MARKER, whismur);
        const trainer = {};
        const lockedEffects = [
            new play_card_effects_1.PlayItemEffect(lockedPlayer, trainer),
            new play_card_effects_1.PlaySupporterEffect(lockedPlayer, trainer),
            new play_card_effects_1.PlayStadiumEffect(lockedPlayer, trainer),
            new play_card_effects_1.AttachPokemonToolEffect(lockedPlayer, trainer, lockedPlayer.active)
        ];
        lockedEffects.forEach(effect => {
            expect(() => whismur.reduceEffect({}, state, effect)).toThrow();
        });
    });
    it('blocks a Basic played this turn from Grand Tree selection', () => {
        const state = new state_1.State();
        state.turn = 4;
        const player = new player_1.Player();
        const opponent = new player_1.Player();
        state.players = [player, opponent];
        player.bench = [new pokemon_card_list_1.PokemonCardList()];
        const grandTree = new grand_tree_1.GreatTree();
        player.stadium.cards.push(grandTree);
        const playedThisTurn = new ralts_1.Ralts();
        player.active.cards.push(playedThisTurn);
        player.active.pokemonPlayedTurn = state.turn;
        player.bench[0].cards.push(new ralts_1.Ralts());
        player.deck.cards.push(new kirlia_1.Kirlia());
        card_manager_1.CardManager.getInstance().defineSet([playedThisTurn, new kirlia_1.Kirlia()]);
        let choosePokemonPrompt;
        const store = {
            reduceEffect: (_state, effect) => effect,
            prompt: (_state, prompt) => {
                choosePokemonPrompt = prompt;
                return state;
            }
        };
        grandTree.reduceEffect(store, state, new game_effects_1.UseStadiumEffect(player, grandTree));
        expect(choosePokemonPrompt.options.blocked).toContain({ player: play_card_action_1.PlayerType.BOTTOM_PLAYER, slot: 1, index: 0 });
    });
    it('burns the opponent Active once even when Heat Rotom player has a Bench', () => {
        const state = new state_1.State();
        const player = new player_1.Player();
        const opponent = new player_1.Player();
        state.players = [player, opponent];
        player.bench = [new pokemon_card_list_1.PokemonCardList()];
        player.active.cards.push(new ralts_1.Ralts());
        player.bench[0].cards.push(new ralts_1.Ralts());
        opponent.active.cards.push(new ralts_1.Ralts());
        const applied = [];
        const store = {
            reduceEffect: (_state, effect) => {
                if (effect instanceof attack_effects_1.AddSpecialConditionsEffect)
                    applied.push(effect);
                return state;
            }
        };
        const heatRotom = new heat_rotom_1.HeatRotom();
        heatRotom.reduceEffect(store, state, new game_effects_1.AttackEffect(player, opponent, heatRotom.attacks[0]));
        expect(applied.length).toBe(1);
        expect(applied[0].target).toBe(opponent.active);
        expect(applied[0].specialConditions).toEqual([card_types_1.SpecialCondition.BURNED]);
    });
    it('uses attached Tool lists for every Gadget Show multiplier', () => {
        const state = new state_1.State();
        const player = new player_1.Player();
        const opponent = new player_1.Player();
        state.players = [player, opponent];
        player.bench = [new pokemon_card_list_1.PokemonCardList()];
        player.active.cards.push(new ralts_1.Ralts());
        player.bench[0].cards.push(new ralts_1.Ralts());
        player.active.tools.push({});
        player.bench[0].tools.push({});
        const gadgetShowCards = [
            { card: new rotom_1.Rotom(), attackIndex: 1 },
            { card: new heat_rotom_1.HeatRotom(), attackIndex: 1 },
            { card: new mow_rotom_1.MowRotom(), attackIndex: 1 },
            { card: new rotom_2.Rotom(), attackIndex: 1 },
            { card: new wash_rotom_1.WashRotom(), attackIndex: 1 }
        ];
        gadgetShowCards.forEach(({ card, attackIndex }) => {
            const attack = card.attacks[attackIndex];
            const effect = new game_effects_1.AttackEffect(player, opponent, attack);
            card.reduceEffect({}, state, effect);
            expect(attack.damageCalculation).toBe('x');
            expect(effect.damage).toBe(60);
        });
    });
    it('discards Mow Rotom Stadium targets through MoveCardsEffect', () => {
        const state = new state_1.State();
        const player = new player_1.Player();
        const opponent = new player_1.Player();
        state.players = [player, opponent];
        const stadium = new grand_tree_1.GreatTree();
        player.stadium.cards.push(stadium);
        const movementEffects = [];
        const store = {
            reduceEffect: (_state, effect) => {
                if (effect instanceof game_effects_1.MoveCardsEffect) {
                    movementEffects.push(effect);
                }
                return state;
            }
        };
        const mowRotom = new mow_rotom_1.MowRotom();
        mowRotom.reduceEffect(store, state, new game_effects_1.AttackEffect(player, opponent, mowRotom.attacks[0]));
        expect(movementEffects.length).toBe(1);
        expect(movementEffects[0].cards).toEqual([stadium]);
    });
});
