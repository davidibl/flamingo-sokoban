import { NgModule, Injectable, APP_INITIALIZER } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';

import { ALL_COMPONENTS } from './components/components';
import { ALL_SERVICES } from './services/services';
import { ALL_PIPES } from './pipes/pipes';
import { routing } from './app.routes';
import 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { StartupService } from './services/startupService';
import { ConfigurationService } from './services/configurationService';
import { LanguageService } from './services/languageService';
import { TranslationService } from './services/translationService';
import { ALL_DIRECTIVES } from './directives/directives';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
    events: ['pinch'];
    overrides = <any>{
        'pan': { pointers: 0, threshold: 1 },
        'swipe': { direction: 31 },
    };
}

export function getLocalStorage() {
    return (typeof window !== 'undefined') ? window.localStorage : null;
}

export function startupServiceFactory(startupService: StartupService): Function {
    return () => startupService.load(environment.configuration);
}

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, ...ALL_COMPONENTS, ...ALL_PIPES, ...ALL_DIRECTIVES],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        RouterModule,
        routing,
        ServiceWorkerModule.register('/ngsw-worker.js'),
    ],
    providers: [
        ConfigurationService,
        LanguageService,
        TranslationService,
        StartupService,
        {
            provide: APP_INITIALIZER,
            useFactory: startupServiceFactory,
            deps: [StartupService],
            multi: true
        },
        ...ALL_SERVICES,
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
        { provide: 'LOCALSTORAGE', useFactory: getLocalStorage },
    ],
}, )
export class SokoFlamingoModule {
}
