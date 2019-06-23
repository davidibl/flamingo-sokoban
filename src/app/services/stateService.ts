import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class StateService {

    public constructor(@Inject('LOCALSTORAGE') private _localStorage: any) {}

    public getStoredData(key: string): Observable<number> {
        return of(this._localStorage[key]);
    }

    public addStateEvent(key: string, event: Observable<any>) {
        event.subscribe(data => this._localStorage[key] = data);
    }

    public writeState(key: string, data: any) {
        this._localStorage[key] = data;
    }
}
