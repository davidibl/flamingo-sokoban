import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from './languageService';
import { ConfigurationService } from './configurationService';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/zip';

const REGEX_TOKEN = /{(.+?)}/g;

@Injectable()
export class TranslationService {

    private _registeredTranslations = new Map<string, string>();
    private _registeredTranslationsSubject = new ReplaySubject<Map<string, string>>(1);

    public constructor(private _languageService: LanguageService,
                       private _http: HttpClient) { }

    public initStartupTranslation() {
        this._languageService
            .getCurrentLanguage()
            .switchMap(language => this.queryCurrentTranslations(language))
            .subscribe(translations => this.setupTranslations(translations));
    }

    public translateDefault(key: string, defaultValue?: string, tokens?: Object): Observable<string> {
        return this._registeredTranslationsSubject
            .asObservable()
            .map(trans => {
                return trans[key] ? trans[key] : defaultValue;
            })
            .map(trans => this.replaceTokens(trans, tokens));
    }

    private setupTranslations(translationObject: Object) {
        this._registeredTranslations = new Map<string, string>();
        this.addTranslations(translationObject);
        this._registeredTranslationsSubject.next(this._registeredTranslations);
    }

    private addTranslations(translationObject: Object, prefix?: string) {
        prefix = (prefix) ? prefix : '';
        this.addTranslationValue(this._registeredTranslations, translationObject, prefix);
    }

    private replaceTokens(translation: string, tokens: Object) {
        if (tokens) {
            translation = translation.replace(REGEX_TOKEN, (match, key) => {
                return tokens[key] || key;
            });
        }
        return translation;
    }

    private addTranslationValue(translations: Map<string, string>, translationObject: Object, prefix: string) {
        for (const key in translationObject) {
            if (translationObject.hasOwnProperty(key)) {
                const value = translationObject[key];
                if (typeof value === 'string') {
                    translations[prefix + key] = value;
                } else {
                    this.addTranslationValue(translations, value, prefix + key + '.');
                }
            }
        }
    }

    private queryCurrentTranslations(currentLanguage: string): Observable<Object> {

        return this._http.get<Object>(`/translations/${currentLanguage.toLowerCase()}.json`);
    }


}
