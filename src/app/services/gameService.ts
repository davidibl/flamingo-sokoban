import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Field } from '../model/field';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/take';
import { Fieldtype } from '../model/fieldtyp';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LevelState } from '../model/levelState';
import { IPosition } from '../model/position';
import { LevelService } from './levelService';
import { Command } from '../model/command';

@Injectable()
export class GameService {

    private static readonly LEVEL_COUNT = 12;
    private static readonly START_STATE = new LevelState(0, false);

    private _gameCache: { [key: number]: ReplaySubject<Field[][]> } = {};
    private _levelCache = new ReplaySubject<Field[][]>(1);
    private _levelState = new BehaviorSubject<LevelState>(GameService.START_STATE);
    private _currentLevel: number;

    public constructor(private _httpClient: HttpClient,
                       private _levelService: LevelService) {
        this._levelService
            .currentLevel
            .subscribe(level => this.loadLevel(level));
    }

    public getLevel(level: number): Observable<Field[][]> {
        return this._levelCache.asObservable();
    }

    public get levelState() {
        return this._levelState.asObservable();
    }

    public get gameState() {
        return null;
    }

    public move(command: string) {
        if (!Command[command]) {
            return false;
        }
        this.createNewGameState(Command[command]);
        return true;
    }

    private createNewGameState(vector: (position: IPosition, value: number) => IPosition) {
        this._levelCache
            .take(1)
            .map(gameboard => this.nextState(gameboard, vector))
            .subscribe(gameboard => this._gameCache[`${this._currentLevel}`].next(gameboard));
    }

    private nextState(gameboard: Field[][], vector: (position: IPosition, value: number) => IPosition) {
        const playerPosition = this.getPlayposition(gameboard);
        const nextPosition = vector(playerPosition, 1);
        const nextNextPosition = vector(playerPosition, 2);
        if (!this.canMove(gameboard, nextPosition, nextNextPosition)) {
            return gameboard;
        }

        const whatIs = this.nextIs()(gameboard);
        const nextIs = whatIs(nextPosition);
        const currentIs = whatIs(playerPosition);
        const nextNextIs = whatIs(nextNextPosition);

        const newPlayer = (nextIs(Fieldtype.GRAVE) || nextIs(Fieldtype.GRAVE_DONE)) ?
            new Field(Fieldtype.FLAMINGO_GRAVE) :
            new Field(Fieldtype.FLAMINGO);
        const currentPlayer = (currentIs(Fieldtype.FLAMINGO_GRAVE)) ?
            new Field(Fieldtype.GRAVE) :
            new Field(Fieldtype.EMPTY);
        const nextField = (nextIs(Fieldtype.CONTRACT) || nextIs(Fieldtype.GRAVE_DONE)) ?
            (nextNextIs(Fieldtype.GRAVE)) ?
            new Field(Fieldtype.GRAVE_DONE) :
            new Field(Fieldtype.CONTRACT) :
            gameboard[nextNextPosition.y][nextNextPosition.x];

        gameboard[playerPosition.y].splice(playerPosition.x, 1, currentPlayer);
        gameboard[nextPosition.y].splice(nextPosition.x, 1, newPlayer);
        gameboard[nextNextPosition.y].splice(nextNextPosition.x, 1, nextField);

        const won = !(gameboard.filter(line =>
            line.filter(field => field.typ === Fieldtype.GRAVE || field.typ === Fieldtype.FLAMINGO_GRAVE).length > 0).length > 0);

        this._levelState
            .map(state => new LevelState(state.moveCount + 1, won, this._currentLevel === GameService.LEVEL_COUNT))
            .take(1)
            .subscribe(newState => this._levelState.next(newState));

        return gameboard;
    }

    private canMove(gameboard: Field[][], nextPosition: IPosition, nextNextPosition: IPosition) {
        const nextInGameboard = this.nextIs()(gameboard);
        const nextIs = nextInGameboard(nextPosition);
        const nextNextIs = nextInGameboard(nextNextPosition);
        return nextIs(Fieldtype.EMPTY) ||
                nextIs(Fieldtype.GRAVE) ||
                (nextIs(Fieldtype.CONTRACT) && (nextNextIs(Fieldtype.EMPTY) || nextNextIs(Fieldtype.GRAVE))) ||
                (nextIs(Fieldtype.GRAVE_DONE) && (nextNextIs(Fieldtype.EMPTY) || nextNextIs(Fieldtype.GRAVE)));
    }

    private nextIs() {
        return (gameboard: Field[][]) => {
            return (nextPosition: IPosition) => {
                return (type: Fieldtype) => (gameboard[nextPosition.y][nextPosition.x].typ === type);
            };
        };
    }

    private getPlayposition(gameboard: Field[][]): IPosition {
        for (let line = 0; line < gameboard.length; line++) {
            for (let field = 0; field < gameboard[line].length; field++) {
                const typ = gameboard[line][field].typ;
                if (typ === Fieldtype.FLAMINGO || typ === Fieldtype.FLAMINGO_GRAVE) {
                    return { y: line, x: field };
                }
            }
        }
    }

    private loadLevel(level: number) {
        this._currentLevel = level;
        this._gameCache[level] = new ReplaySubject<Field[][]>(1);
        this._levelState.next(GameService.START_STATE);
        this._httpClient
            .get(`/assets/level/level${level}.txt`, {responseType: 'text'})
            .subscribe(felder => this._levelCache.next(this.createFields(felder)));

    }

    private createFields(text: string): Field[][] {
        return text.split('\n')
            .map(line => line.replace('\r', ''))
            .map(line => line.split(''))
            .map(line => line
                .map(this.translateFieldSign)
                .map(Field.fromSign));
    }

    private translateFieldSign(sign: string): Fieldtype {
        switch (sign) {
            case 'l':
                return Fieldtype.GRAVE;
            case 'z':
                return Fieldtype.FLAMINGO;
            case 'f':
                return Fieldtype.CONTRACT;
            case 'x':
                return Fieldtype.WALL;
            case 'n':
                return Fieldtype.GRAVE_DONE;
            default:
                return Fieldtype.EMPTY;
        }
    }

}
