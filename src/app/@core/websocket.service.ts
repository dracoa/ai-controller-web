import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {BehaviorSubject, Subject} from 'rxjs';
import {pluck, throttleTime} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {CursorPos} from './model';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public screen$ = new Subject<Blob>();
  public info$ = new Subject<any[]>();
  public input$ = new Subject<any>();
  public mousePos$ = new Subject<CursorPos>();
  private close$ = new BehaviorSubject(null);
  private socket: WebSocketSubject<any>;

  constructor() {
    this.close$.pipe(throttleTime(1000)).subscribe((v) => {
      this.connect();
    });
  }

  private connect() {
    this.socket = webSocket<any>(
      {
        url: environment.wsEndpoint,
        deserializer: msg => msg,
        serializer: value => JSON.stringify(value),
        closeObserver: this.close$,
      }
    );
    this.socket.pipe(pluck('data')).subscribe((data) => {
      if (data instanceof Blob) {
        console.log('blob');
        this.screen$.next(data);
      } else {
        console.log('text');
        const json = JSON.parse(data);
        if (json.type === 'info') {
          this.info$.next(json);
        } else if (json.type === 'input' && json.event === 'move') {
          this.mousePos$.next(json);
        } else {
          this.input$.next(json);
        }
      }
    });
  }

}
