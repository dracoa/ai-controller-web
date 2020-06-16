import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import {CanvasModule} from './canvas/canvas.module';



@NgModule({
  declarations: [MainComponent],
    imports: [
        CommonModule,
        CanvasModule
    ]
})
export class MainModule { }
