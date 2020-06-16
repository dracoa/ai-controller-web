import { Component, OnInit } from '@angular/core';
import {WebsocketService} from '../@core/websocket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private ws: WebsocketService) { }

  ngOnInit(): void {
  }

  send(){
  }

}
