import { Component, OnInit, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TimerComponent } from '../timer/timer';
import { Field } from '../../model/field';
import { GameService } from '../../services/gameService';
import { LevelService } from '../../services/levelService';
import 'rxjs/add/operator/switchMap';
import { LevelState } from '../../model/levelState';

@Component({
    selector: 'xn-gameboard',
    templateUrl: 'gameboard.html',
    styleUrls: ['gameboard.scss'],
})
export class GameboardComponent implements OnInit, AfterViewInit {

    @ViewChild(TimerComponent, { static: false })
    private _timer: TimerComponent;

    public gameboard$: Observable<Field[][]>;
    public levelState$: Observable<LevelState>;
    public level$: Observable<number>;

    @HostListener('document:keydown', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        if (!this.move(event.key)) {
            return;
        }
        event.preventDefault();
    }

    public constructor(private _levelService: LevelService,
                       private _gameService: GameService) {}

    public ngOnInit(): void {
        this.level$ = this._levelService.currentLevel;
        this.gameboard$ = this.level$
            .switchMap(level => this._gameService.getLevel(level));

        this.levelState$ = this._gameService.levelState;
    }

    public ngAfterViewInit() {
        this.level$.do(level => this._timer.stopAndResetTimer()).subscribe();
    }

    public nextLevel() {
        this._levelService.nextLevel();
    }

    public restartLevel() {
        this.level$
            .take(1)
            .subscribe(current => this._levelService.setLevel(current));
    }

    public restartGame() {
        this._levelService.setLevel(1);
    }

    public move(command: string) {
        this._timer.startTimer();
        return this._gameService.move(command);
    }
}
