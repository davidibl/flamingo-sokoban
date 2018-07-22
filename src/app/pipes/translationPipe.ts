import { Observable } from 'rxjs/Observable';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translationService';

@Pipe({
    name: 'translate',
    pure: false,
})
export class TranslationPipe implements PipeTransform {

    constructor(private _translationService: TranslationService) {
    }

    public transform(key: string, defaultValue?: string, tokens?: Object): Observable<string> {
        return this._translationService.translateDefault(key, defaultValue, tokens);
    }
}
