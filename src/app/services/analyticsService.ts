import { Injectable } from '@angular/core';

declare global {
    interface Window {
        dataLayer: any[];
    }
}

declare interface IPageViewEvent {
    url: string;
}

@Injectable()
export class AnalyticsService {

    public constructor() {
        window.dataLayer = window.dataLayer || [];
    }

    public trackPageView(pageView: IPageViewEvent) {
        window.dataLayer.push({
            'event': 'pageview',
            ...pageView,
        });
    }

    public trackClickEvent(category: string, action: string, value?: string) {
        const dataObject = {
            'event': 'click',
            'xn-category': category,
            'xn-action': action,
        };

        if (value) {
            dataObject['xn-value'] = value;
        }

        window.dataLayer.push(dataObject);
    }

}
