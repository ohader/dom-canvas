import {Component} from '@angular/core';
import {ItemModel, ItemEvent, GeometricPosition} from './models';

@Component({
  selector: 'dom-canvas',
  template: `
    <div class="canvas" (mouseup)="onMouseUp($event)" (mousemove)="onMouseMove($event)">
      <item *ngFor="let item of items" [item]="item"
        [style.left.px]="item.position.left" [style.top.px]="item.position.top" (mouseStart)="mouseStart($event)">
      </item>
    </div>
    <div class="debug">
      <p *ngFor="let item of items">
        position: [{{item.position.left}}, {{item.position.top}}]<br>
        dimension: [{{item.dimension.width}} x {{item.dimension.height}}]<br>
        rotation: {{item.rotation}}°
      </p>
    </div>
  `,
  styles: [
    `
        .canvas {
            width: 500px;
            height: 500px;
            border: 1px dotted grey;
            display: inline-block;
        }
        div.debug {
            margin-top: 1em;
            font-family: Consolas, "Liberation Mono", Courier, monospace;
            font-size: 10px;
        }
    `
  ]
})
export class AppComponent  {
  items:ItemModel[] = [
    {
      type:'rect',
      color: '#99bb00',
      rotation:0,
      dimension:{
        width:50,
        height:50
      },
      position: {
        left: 50,
        top: 50
      }
    },
    {
      type:'rect',
      color: '#cc0000',
      rotation:0,
      dimension:{
        width:50,
        height:50
      },
      position: {
        left: 200,
        top: 200
      }
    }
  ];

  private mouseEvent:ItemEvent = null;

  mouseStart(event:ItemEvent) {
    if (this.mouseEvent !== null) {
      return;
    }
    this.mouseEvent = event;
  }

  onMouseUp(event:MouseEvent) {
    event.preventDefault();
    if (this.mouseEvent === null) {
      return;
    }
    this.mouseEvent = null;
  }

  onMouseMove(event:MouseEvent) {
    event.preventDefault();
    if (this.mouseEvent === null) {
      return;
    }

    let item = this.mouseEvent.item;

    switch (this.mouseEvent.type) {
      case 'drag':
        this.onDrag(event, item);
        break;
      case 'scale':
        this.onScale(event, item);
        break;
      case 'rotate':
        this.onRotate(event, item);
        break;
      default:
        console.error('Undefined event type ' + this.mouseEvent.type);
    }
  }

  private onDrag(event:MouseEvent, item:ItemModel) {
    item.position.left += event.movementX;
    item.position.top += event.movementY;
  }

  private onScale(event:MouseEvent, item:ItemModel) {
    let ratio = item.dimension.width / item.dimension.height;
    item.dimension.width += event.movementX;
    item.dimension.height = item.dimension.width * ratio;
  }

  private onRotate(event:MouseEvent, item:ItemModel) {
    let center = <GeometricPosition>{
      left: this.mouseEvent.event.screenX,
      top: this.mouseEvent.event.screenY + (item.dimension.height / 2)
    };
    let point = <GeometricPosition>{
      left: event.screenX,
      top: event.screenY
    };

    let adjacent = center.left - point.left;
    let opposite = center.top - point.top;
    let rotation = Math.atan(opposite/adjacent) / Math.PI * 180;

    // Q1 & Q2
    if (adjacent < 0) {
      rotation += 90;
    // Q3 & Q4
    } else if (adjacent >= 0) {
      rotation = 270 + rotation;
    }

    item.rotation = rotation;
  }
}
