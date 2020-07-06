import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './canvas.component';
import { LayerComponent } from '../layer/layer.component';


@NgModule({
    declarations: [CanvasComponent, LayerComponent],
    exports: [
        CanvasComponent
    ],
    imports: [
        CommonModule
    ]
})
export class CanvasModule { }
