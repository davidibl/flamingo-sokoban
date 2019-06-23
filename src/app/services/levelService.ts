import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { StateService } from './stateService';

@Injectable()
export class LevelService {

    private static STARTLEVEL = 1;
    private _levelSubject = new ReplaySubject<number>(1);

    public constructor(private _stateService: StateService) {
        this._stateService
            .getStoredData('level')
            .pipe(
                map(storedLevel => !!storedLevel ? storedLevel : LevelService.STARTLEVEL)
            )
            .subscribe(level => this._levelSubject.next(level));
        this._stateService.addStateEvent('level', this._levelSubject.asObservable());
    }

    public get currentLevel(): Observable<number> {
        return this._levelSubject.asObservable();
    }

    public setLevel(level: number) {
        this._levelSubject.next(level);
    }

    public nextLevel() {
        this._levelSubject
            .pipe(
                map(level => ++level),
                take(1)
            )
            .subscribe(level => this._levelSubject.next(level));
    }
}
