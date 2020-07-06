import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerComponent implements OnInit {

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;
  @Input()
  stroke = '#ff00ff';
  private canvasElm: HTMLCanvasElement;

  constructor() {
  }

  ngOnInit(): void {
    this.canvasElm = this.canvas.nativeElement;
    this.context = this.canvasElm.getContext('2d');

    this.context.strokeStyle = this.stroke;
    this.context.lineWidth = 5;
    this.context.fillStyle = this.stroke;
    this.context.font = '40px Arial';
  }

  clearAll() {
    this.context.clearRect(0, 0, this.canvasElm.width, this.canvasElm.height);
  }

}
