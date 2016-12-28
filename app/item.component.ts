import {
  Component, Input, Output,
  ElementRef, ViewChild, EventEmitter
} from '@angular/core';
import {ItemModel, ItemEvent} from "./models";

@Component({
  selector: 'item',
  template: `
    <div class="outline" #outline
      [style.borderWidth.px]="outlineBorderWidth"
      [style.left.px]="outlineLeft" [style.top.px]="outlineTop"
      [style.width.px]="outlineWidth" [style.height.px]="outlineHeight">
    </div>
    <div class="visible" #visible
      [style.width.px]="item.dimension.width"
      [style.height.px]="item.dimension.height"
      [style.backgroundColor]="item.color"
      [style.transform]="rotate"
      (mousedown)="onMouseDown($event, 'drag')">
      <div class="scale-handle" #scaleHandle (mousedown)="onMouseDown($event, 'scale')"></div>
      <div class="rotate-handle" #rotateHandle (mousedown)="onMouseDown($event, 'rotate')"></div>
    </div>
  `,
  styles: [
    `
        :host {
            display: inline-block;
            position: absolute;
        }
        div.visible {
            cursor: move;
            z-index: 10;
        }
        div.scale-handle {
            cursor: pointer;
            background-color: #eecc00;
            border: 1px solid #ccaa00;
            border-radius: 50%;
            display: inline-block;
            position: absolute;
            width: 10px;
            height: 10px;
            right: -5px;
            bottom: -5px;
            z-index: 20;
        }
        div.rotate-handle {
            cursor: pointer;
            background-color: #eecc00;
            border: 1px solid #ccaa00;
            border-radius: 50%;
            display: inline-block;
            position: absolute;
            width: 10px;
            height: 10px;
            left: calc(50% - 5px);
            top: -5px;
        }
        div.outline {
            border: dotted #0099cc;
            display: inline-block;
            position: absolute;
            z-index: 0;
        }
    `
  ]
})
export class ItemComponent {
  @Input() item:ItemModel;
  @Output() mouseStart:EventEmitter<ItemEvent> = new EventEmitter<ItemEvent>();
  @ViewChild('visible') visible:ElementRef;
  @ViewChild('outline') outline:ElementRef;

  constructor(private elementRef:ElementRef) {
  }

  private get rotate():string {
    return 'rotate(' + this.item.rotation + 'deg)';
  }

  private outlineBorderWidth = 1;

  private get outlineLeft():number {
    return (this.item.dimension.width - this.outlineWidth) / 2 - this.outlineBorderWidth;
  }
  private get outlineTop():number {
    return (this.item.dimension.height - this.outlineHeight) / 2 - this.outlineBorderWidth;
  }

  private get outlineWidth():number {
    let rad = this.item.rotation / 180 * Math.PI;
    return Math.abs(Math.sin(rad) * this.item.dimension.height) + Math.abs(Math.cos(rad) * this.item.dimension.width);
  }
  private get outlineHeight():number {
    let rad = this.item.rotation / 180 * Math.PI;
    return Math.abs(Math.sin(rad) * this.item.dimension.width) + Math.abs(Math.cos(rad) * this.item.dimension.height);
  }

  private onMouseDown(event:MouseEvent, type:string) {
    event.preventDefault();

    this.mouseStart.emit(
        new ItemEvent(this.item, event, type)
    );
  }
}
