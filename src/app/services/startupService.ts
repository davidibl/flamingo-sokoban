import { Injectable } from '@angular/core';
import { TranslationService } from './translationService';
import { ConfigurationService } from './configurationService';
import { LanguageService } from './languageService';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/of';

@Injectable()
export class StartupService {

    public constructor(private _translationService: TranslationService,
                       private _configurationService: ConfigurationService,
                       private _languageService: LanguageService) {}

    public load(configuration: Object): Promise<any> {
        this._configurationService.addConfiguration(configuration);
        this._languageService.initLanguage();
        this._translationService.initStartupTranslation();
        return Observable.of(1).toPromise();
    }
}
