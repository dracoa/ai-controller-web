import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WebsocketService} from '../../@core/websocket.service';
import {combineLatest, Observable, Observer} from 'rxjs';
import {concatMap, tap} from 'rxjs/operators';

export const loadBlob = (blob: Blob): Observable<any> => {
  return new Observable((obs: Observer<any>) => {
    const fr = new FileReader();
    fr.onload = (e) => {
      obs.next(e.target.result);
      obs.complete();
    };
    fr.onerror = (e) => obs.error(e);
    fr.readAsDataURL(blob);
  });
};

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;
  canvasElm: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  blob$: Observable<Blob>;
  boxes$: Observable<any[]>;
  draw$: Observable<any>;

  constructor(private ws: WebsocketService) { }

  ngOnInit(): void {
    this.canvasElm = this.canvas.nativeElement;
    this.setContext();
    this.boxes$ = this.ws.boxes$;
    this.blob$ = this.ws.screen$.pipe(concatMap(b => loadBlob(b)));
    this.draw$ = combineLatest([this.blob$, this.boxes$])
      .pipe(tap(([img, boxes]) => this.drawScreen(img, boxes)));
  }

  setContext(){
    this.context = this.canvasElm.getContext('2d');
    this.context.strokeStyle = '#ff00ff';
    this.context.lineWidth = 5;
    this.context.fillStyle = this.context.strokeStyle;
    this.context.font = '40px Arial';
  }

  drawScreen(dataURL: any, boxes: any[]){
    const img = new Image();
    //  var img = document.createElement("img");
    img.onload = () => {
      this.context.drawImage(img, 0, 0);
      boxes.forEach(box => {
        this.context.fillText(box.class, box.x + 20, box.y + 40);
        this.context.strokeRect(box.x, box.y, box.w, box.h);
      });
    };
    img.src = dataURL;
  }

}
