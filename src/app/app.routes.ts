import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { GameboardComponent } from './components/gameboard/gameboard';

export const routes: Routes = [
    { component: GameboardComponent, path: '' },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
