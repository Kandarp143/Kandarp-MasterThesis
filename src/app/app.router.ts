import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {VarOverlapComponent} from './var-overlap/var-overlap.component';
import {VarOpenboxComponent} from './var-openbox/var-openbox.component';
import {VarWallComponent} from './var-wall/var-wall.component';
import {VarRegionComponent} from './var-region/var-region.component';

export const router: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'var1', component: VarOverlapComponent},
  {path: 'var2', component: VarOpenboxComponent},
  {path: 'var3', component: VarWallComponent},
  {path: 'var4', component: VarRegionComponent}
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
