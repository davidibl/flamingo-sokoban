import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { StateService } from './stateService';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';

@Injectable()
export class LevelService {

    private static STARTLEVEL = 1;
    private _levelSubject = new ReplaySubject<number>(1);

    public constructor(private _stateService: StateService) {
        this._stateService
            .getStoredData('level')
            .map(storedLevel => !!storedLevel ? storedLevel : LevelService.STARTLEVEL)
            .subscribe(level => this._levelSubject.next(level));
        this._stateService.addStateEvent('level', this._levelSubject.asObservable());
    }

    public get currentLevel(): Observable<number> {
        return this._levelSubject;
    }

    public setLevel(level: number) {
        this._levelSubject.next(level);
    }

    public nextLevel() {
        this._levelSubject
            .map(level => ++level)
            .take(1)
            .subscribe(level => this._levelSubject.next(level));
    }
}
