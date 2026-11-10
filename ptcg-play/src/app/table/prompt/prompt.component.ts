import { AnimationEvent } from '@angular/animations';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Prompt } from 'ptcg-server';

import { GameService } from '../../api/services/game.service';
import { LocalGameState } from '../../shared/session/session.interface';
import { ptcgPromptAnimations } from './prompt.animations';

@Component({
  selector: 'ptcg-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
  animations: [ptcgPromptAnimations.promptContent, ptcgPromptAnimations.selectorFade],
  encapsulation: ViewEncapsulation.None
})
export class PromptComponent implements OnChanges, OnDestroy {

  @Input() gameState: LocalGameState;
  @Input() clientId: number;

  public isPromptVisible = false;
  public animationState: 'void' | 'enter' | 'exit' = 'void';
  public prompt: Prompt<any>;
  public minimized = false;
  private promptUpdate = 0;

  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const update = ++this.promptUpdate;
    if (!this.gameState || !this.clientId) {
      this.prompt = undefined;
      return this.toggle(false);
    }

    let differentGame = false;
    if (changes.gameState) {
      const previousState: LocalGameState = changes.gameState.previousValue;
      differentGame = !previousState || previousState.localId !== this.gameState.localId;
    }

    const prompt = this.gameState.state.prompts.find(p => {
      return p.playerId === this.clientId && p.result === undefined;
    });

    // A reset can arrive while the next prompt's enter callback is queued.
    // Clear it immediately and invalidate that callback before it can reappear.
    if (!prompt) {
      this.prompt = undefined;
      this.minimized = false;
      return this.toggle(false);
    }

    const promptId = prompt ? prompt.id : -1;
    const currentId = this.prompt ? this.prompt.id : -1;

    if (currentId !== promptId || this.prompt?.type !== prompt.type || differentGame) {
      this.prompt = undefined;
      // setTimeout, because we would like the new prompt animate before displaying
      window.setTimeout(() => {
        if (update !== this.promptUpdate) { return; }
        this.prompt = prompt;
        this.minimized = false;
        this.maximize();
        this.toggle(prompt !== undefined);
        this.cdr.detectChanges();
      });
    } else if (this.minimized !== this.gameState.promptMinimized) {
      this.minimized = this.gameState.promptMinimized;
      this.toggle(prompt !== undefined && !this.minimized);
    }
  }

  ngOnDestroy(): void { this.promptUpdate++; }

  public maximize() {
    if (this.gameState.promptMinimized) {
      this.gameService.setPromptMinimized(this.gameState.localId, false);
    }
  }

  /** Callback, invoked whenever an animation on the host completes. */
  public onAnimationEnd(event: AnimationEvent) {
    const toExitState = event.toState === 'exit' || event.toState === 'void';
    const isNotVisible = this.prompt === undefined || this.minimized;
    if (toExitState && isNotVisible) {
      this.isPromptVisible = false;
    }
  }

  /** Starts the dialog enter animation. */
  private toggle(value: boolean): void {
    if (this.animationState !== 'enter' && value === true) {
      this.isPromptVisible = true;
      this.animationState = 'enter';
    } else if (this.animationState !== 'exit' && value === false) {
      this.animationState = 'exit';
    }
  }

  public cannotBeMinimized(): boolean {
    // Add all prompt types you want to NEVER be minimized here
    return this.prompt?.type === 'Choose pokemon' || this.prompt?.type === 'WaitPrompt';
  }

  public isFullScreenPrompt(): boolean {
    return this.prompt?.type === 'Choose pokemon' || this.prompt?.type === 'WaitPrompt' || this.prompt?.type === 'Choose prize' || this.prompt?.type === 'Choose cards';
  }
}
