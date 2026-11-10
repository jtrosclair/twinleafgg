"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_2 = require("../../game/store/effects/game-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_actions_1 = require("../../game/store/actions/game-actions");
const card_test_helpers_1 = require("./card-test-helpers");
const test_helpers_1 = require("./test-helpers");
const grand_tree_1 = require("../set-stellar-crown/grand-tree");
const windup_arm_1 = require("../set-lost-origin/windup-arm");
describe('Integrated safe-fix boundary simulations', () => {
    it('allows a Trainer play while Whismur has not applied its marker', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: { active: { card: 'Whismur CES' }, deck: (0, test_helpers_1.padDeck)(10) },
            player2: { active: { card: 'Ralts SIT' }, deck: (0, test_helpers_1.padDeck)(10) }
        });
        const whismur = game.player1.active.getPokemonCard();
        const trainer = {};
        expect(() => whismur.reduceEffect(game.store, game.state, new play_card_effects_1.PlayItemEffect(game.player2, trainer))).not.toThrow();
    });
    it('lets Grand Tree evolve an eligible Basic that was not played this turn', () => {
        var _a;
        const game = (0, test_helpers_1.setupGame)({
            turn: 4,
            player1: {
                active: { card: 'Ralts SIT' },
                deck: ['Kirlia SIT', ...(0, test_helpers_1.padDeck)(9)]
            },
            player2: { active: { card: 'Ralts SIT' }, deck: (0, test_helpers_1.padDeck)(10) }
        });
        const grandTree = new grand_tree_1.GreatTree();
        game.player1.stadium.cards.push(grandTree);
        game.overridePrompt(choose_pokemon_prompt_1.ChoosePokemonPromptType, (prompt) => {
            const activeTarget = { player: play_card_action_1.PlayerType.BOTTOM_PLAYER, slot: play_card_action_1.SlotType.ACTIVE, index: 0 };
            expect(prompt.options.blocked).not.toContain(activeTarget);
            return [activeTarget];
        });
        const chooseKirlia = (prompt) => {
            game.overridePrompt(choose_cards_prompt_1.ChooseCardsPromptType, chooseKirlia);
            const index = prompt.cards.cards.findIndex((card) => card.fullName === 'Kirlia SIT');
            return index === -1 ? null : [index];
        };
        game.overridePrompt(choose_cards_prompt_1.ChooseCardsPromptType, chooseKirlia);
        game.store.dispatch(new game_actions_1.UseStadiumAction(game.player1.id));
        expect((_a = game.player1.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.fullName).toBe('Kirlia SIT');
    });
    it('does no Gadget Show damage when no Tools are attached', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: {
                    card: 'Heat Rotom DRI',
                    energy: ['Fire Energy SVE', 'Fire Energy SVE']
                },
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: { active: { card: 'Ralts SIT' }, deck: (0, test_helpers_1.padDeck)(10) }
        });
        (0, card_test_helpers_1.useAttack)(game.store, game.state, 0, 'Gadget Show');
        expect(game.player2.active.damage).toBe(0);
    });
    it('does not emit a MoveCardsEffect when Mow Rotom has no Stadium to discard', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: { active: { card: 'Mow Rotom DRI' }, deck: (0, test_helpers_1.padDeck)(10) },
            player2: { active: { card: 'Ralts SIT' }, deck: (0, test_helpers_1.padDeck)(10) }
        });
        const mowRotom = game.player1.active.getPokemonCard();
        const reduceEffect = spyOn(game.store, 'reduceEffect').and.callThrough();
        mowRotom.reduceEffect(game.store, game.state, new game_effects_2.AttackEffect(game.player1, game.player2, mowRotom.attacks[0]));
        expect(reduceEffect.calls.allArgs().some(([, effect]) => effect instanceof game_effects_1.MoveCardsEffect)).toBe(false);
    });
    it("burns Heat Rotom's opponent Active without burning its controller's Active", () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Heat Rotom DRI', energy: ['Fire Energy SVE'] },
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: { active: { card: 'Ralts SIT' }, deck: (0, test_helpers_1.padDeck)(10) }
        });
        const heatRotom = game.player1.active.getPokemonCard();
        heatRotom.reduceEffect(game.store, game.state, new game_effects_2.AttackEffect(game.player1, game.player2, heatRotom.attacks[0]));
        expect(game.player1.active.specialConditions).not.toContain(card_types_1.SpecialCondition.BURNED);
        expect(game.player2.active.specialConditions).toContain(card_types_1.SpecialCondition.BURNED);
    });
    it('limits Windup Arm status immunity to the UseAttackEffect that it handles', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: { active: { card: 'Ralts SIT' }, deck: (0, test_helpers_1.padDeck)(10) }
        });
        const windupArm = new windup_arm_1.WindupArm();
        const attack = game.player1.active.getPokemonCard().attacks[0];
        const useAttackEffect = new game_effects_2.UseAttackEffect(game.player1, attack);
        const attackEffect = new game_effects_2.AttackEffect(game.player1, game.player2, attack);
        game.player1.active.tools.push(windupArm);
        windupArm.reduceEffect(game.store, game.state, useAttackEffect);
        windupArm.reduceEffect(game.store, game.state, attackEffect);
        expect(useAttackEffect.ignoreStatusConditions).toBe(true);
        expect(attackEffect.ignoreStatusConditions).toBeUndefined();
    });
    it('preserves incoming Active markers while clearing effects from the leaver', () => {
        const game = (0, test_helpers_1.setupGame)({
            player1: {
                active: { card: 'Ralts SIT' },
                bench: [{ card: 'Manaphy BRS' }],
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: { active: { card: 'Ralts SIT' }, deck: (0, test_helpers_1.padDeck)(10) }
        });
        const leavingActive = game.player1.active;
        const incomingActive = game.player1.bench[0];
        const leavingCard = leavingActive.getPokemonCard();
        const incomingCard = incomingActive.getPokemonCard();
        leavingActive.marker.addMarker('leaver-effect', leavingCard, 'ability');
        incomingActive.marker.addMarker('incoming-effect', incomingCard, 'ability');
        game.player1.switchPokemon(incomingActive);
        expect(game.player1.active.marker.markers.some(marker => marker.name === 'incoming-effect')).toBe(true);
        expect(game.player1.bench[0].marker.markers).toEqual([]);
    });
    it('does not bench a Basic Fire Pokémon from hand for Chandelure Spirit Burner', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Chandelure UNM', energy: ['Fire Energy SVE'] },
                hand: ['Charmander MEW'],
                deck: (0, test_helpers_1.padDeck)(5)
            },
            player2: { active: { card: 'Ralts SIT' }, deck: (0, test_helpers_1.padDeck)(10) }
        });
        (0, card_test_helpers_1.useAttack)(game.store, game.state, 0, 'Spirit Burner');
        expect(game.player1.hand.cards.some(card => card.fullName === 'Charmander MEW')).toBe(true);
        expect(game.player1.bench.some(slot => { var _a; return ((_a = slot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.fullName) === 'Charmander MEW'; })).toBe(false);
    });
});
