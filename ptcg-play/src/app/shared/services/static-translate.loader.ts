import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of, throwError } from 'rxjs';
import { simulatorStaticBundle } from './simulator-static';

/** All supported translations are part of the initial static payload. */
export class StaticTranslateLoader implements TranslateLoader {
  public getTranslation(language: string): Observable<any> {
    const path = `assets/i18n/${language}.json`;
    const bundle = simulatorStaticBundle();
    if (bundle) {
      // A missing locale can use ngx-translate's default-language fallback
      // without a new request after the simulator has become ready.
      return of(bundle.json[path] || {});
    }
    return throwError(new Error('The simulator presentation payload did not finish loading. Reload this page and retry.'));
  }
}
