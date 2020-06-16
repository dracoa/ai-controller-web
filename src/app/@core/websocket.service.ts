import {Injectable} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {BehaviorSubject, Observable, Observer, Subject} from 'rxjs';
import {pluck, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket = webSocket<any>(
    {
      url: 'ws://localhost:7700',
      deserializer: msg => msg,
      serializer: value => JSON.stringify(value)
    }
  );

  public status$ = new BehaviorSubject<any>({connected: false});
  public screen$ = new Subject<Blob>();
  public boxes$ = new Subject<any[]>();
  public input$ = new Subject<any>();

  constructor() {
    this.socket.pipe(pluck('data')).subscribe((data) => {
      if (data instanceof Blob){
        this.screen$.next(data);
      }else{
        const json = JSON.parse(data);
        if (json.type === 'boxes'){
          this.boxes$.next(json.boxes);
        }else {
          this.input$.next(json);
        }
      }
    });
  }

}
