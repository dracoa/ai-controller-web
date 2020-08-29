import {Component, OnInit, ViewChild} from '@angular/core';
import {WebsocketService} from '../../@core/websocket.service';
import {combineLatest, Observable, Observer} from 'rxjs';
import {concatMap, tap} from 'rxjs/operators';
import {LayerComponent} from '../layer/layer.component';
import {CursorPos} from '../../@core/model';

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

  @ViewChild('base', {static: true})
  baseLayer: LayerComponent;
  @ViewChild('info', {static: true})
  infoLayer: LayerComponent;

  blob$: Observable<Blob>;
  info$: Observable<any[]>;
  cursor$: Observable<any>;
  draw$: Observable<any>;

  constructor(private ws: WebsocketService) {
  }

  ngOnInit(): void {
    this.info$ = this.ws.info$;
    this.cursor$ = this.ws.mousePos$.pipe(tap((info) => this.drawCursor(info)));
    this.blob$ = this.ws.screen$.pipe(
      concatMap(b => loadBlob(b)),
      tap((img) => this.drawScreen(img))
    );
    // this.draw$ = combineLatest([this.blob$])
    //   .pipe(tap(([img, info]) => this.drawScreen(img, info)));
  }

  drawCursor(pos: CursorPos) {
    this.infoLayer.clearAll();
    this.infoLayer.context.fillRect(pos.x, pos.y, 10, 10);
  }

  drawScreen(dataURL: any) {
    const img = new Image();
    img.onload = () => {
      this.baseLayer.context.drawImage(img, 0, 0);
    };
    img.src = dataURL;
  }

}
