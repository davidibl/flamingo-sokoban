import { Component, OnInit } from '@angular/core';
import { LevelState } from './model/levelState';
import { LevelService } from './services/levelService';
import { GameService } from './services/gameService';
import { Observable } from 'rxjs/Observable';
import { StateService } from './services/stateService';
import { AnalyticsService } from './services/analyticsService';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'xn-app',
    templateUrl: 'app.html',
})
export class AppComponent implements OnInit {

    public brandLogoSource = 'assets/img/xn_logo_symbol_gray.png';
    public brandName = 'xnoname';

    public currentLevelState$: Observable<LevelState>;
    public currentLevel$: Observable<number>;
    public localProfile$: Observable<any>;

    public constructor(private _gameService: GameService,
                       private _stateService: StateService,
                       private _router: Router,
                       private _analytics: AnalyticsService,
                       private _levelService: LevelService) {
    }

    public ngOnInit(): void {
        this._router
            .events
            .subscribe((event: NavigationEnd) => {
                if (event instanceof NavigationEnd) {
                    this._analytics.trackPageView({url: event.urlAfterRedirects});
                }
            });
        this.currentLevelState$ = this._gameService.levelState;
        this.currentLevel$ = this._levelService.currentLevel;
        this.getLocalProfile();
    }

    public nextLevel() {
        this._levelService.nextLevel();
    }

    public restartGame() {
        this._levelService.setLevel(1);
    }

    public replay() {
        this._gameService.replayLevel();
    }

    public acknowledgeTutorial() {
        this._stateService.writeState('firstTime', false);
        this.getLocalProfile();
    }

    private getLocalProfile() {
        this.localProfile$ = this._stateService
            .getStoredData('firstTime')
            .map(firsttime => {
                return {firstTime: !!firsttime}; });
    }

}
