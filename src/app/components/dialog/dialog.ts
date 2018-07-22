import { Component, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'xn-dialog',
    templateUrl: 'dialog.html',
    styleUrls: ['dialog.scss'],
})
export class DialogComponent {

    @Input()
    @HostBinding('class.open')
    public open = true;
}
