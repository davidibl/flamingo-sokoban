import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/Observable/timer';

@Component({
    selector: 'xn-timer',
    templateUrl: 'timer.html',
})
export class TimerComponent {

    private currentTimer: Subscription;
    public currentTime = 0;

    public startTimer() {
        if (this.currentTimer) { return; }
        this.currentTimer = Observable.timer(0, 1000)
            .subscribe(t => this.currentTime = t);
    }

    public stopTimer() {
        if (!this.currentTimer) { return; }
        this.currentTimer.unsubscribe();
        this.currentTimer = null;
    }

    public stopAndResetTimer() {
        if (!this.currentTimer) { return; }
        this.stopTimer();
        this.resetTimer();
    }

    public getTime(): number {
        return this.currentTime;
    }

    public resetTimer() {
        if (!this.currentTimer) { return; }
        this.currentTime = 0;
    }
}
