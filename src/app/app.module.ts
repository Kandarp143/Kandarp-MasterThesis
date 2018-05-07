import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routes } from './app.router';
import { AppComponent } from './app.component';
import { VarOverlapComponent } from './var-overlap/var-overlap.component';
import { VarOpenboxComponent } from './var-openbox/var-openbox.component';
import { VarWallComponent } from './var-wall/var-wall.component';
import { VarRegionComponent } from './var-region/var-region.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    VarOverlapComponent,
    VarOpenboxComponent,
    VarWallComponent,
    VarRegionComponent,
    AboutComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    routes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
