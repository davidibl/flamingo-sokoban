import { Injectable } from '@angular/core';
import { ConfigurationService } from './configurationService';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LanguageService {

    private _currentLanguage = new ReplaySubject<string>(1);

    public constructor(private _configurationService: ConfigurationService) {
    }

    public initLanguage() {
        let language: string = (<any>window.navigator).userLanguage || window.navigator.language;

        if (language && language.length > 2) {
            language = language.substr(0, 2);
        }

        if (language) {
            language = language.toUpperCase();
        }

        const supportedLanguages = this._configurationService.getConfigValue<string>('language.supported');
        const defaultLanguage = this._configurationService.getConfigValue<string>('language.default');

        if (!language || supportedLanguages.indexOf(language) < 0) {
            language = defaultLanguage;
        }

        this.setCurrentLanguage(language);
    }

    public getCurrentLanguage(): Observable<string> {
        return this._currentLanguage.asObservable();
    }

    private setCurrentLanguage(language: string) {
        this._currentLanguage.next(language);
    }

}
