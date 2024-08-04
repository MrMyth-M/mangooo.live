import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppComponent} from "./app.component";
import {FormsModule} from "@angular/forms";
import {TextDisplayService} from "../service/text-display.service";
import {GameService} from "../service/game.service";
import {ItemService} from "../service/item.service";
import {TempColliderService} from "../service/temp-collider.service";

@NgModule({
  imports: [
    BrowserModule, // Add BrowserModule here
    CommonModule,
    RouterModule,
    FormsModule,
    // other modules
  ],
  declarations: [
    AppComponent
    // other components
  ],
  bootstrap: [AppComponent],
  providers: [
    TextDisplayService,
    GameService,
    ItemService,
    TempColliderService
  ]
})
export class AppModule {
}
