import { Directive, Input, HostListener } from '@angular/core';
import { AnalyticsService } from '../services/analyticsService';
import { IAnalyticsEvent } from '../model/analyticsEvent';

@Directive({
    selector: '[xnAnalytics]',
})
export class AnalyticsDirective {

    @Input()
    public xnAnalytics: IAnalyticsEvent;

    @HostListener('click')
    public onClick() {
        this._analytics.trackClickEvent(
            this.xnAnalytics.category,
            this.xnAnalytics.action,
            this.xnAnalytics.value);
    }

    public constructor(private _analytics: AnalyticsService) {
    }
}
