export interface ItemModel {
  type:string;
  color:string;
  rotation:number;
  dimension:GeometricDimension;
  position:GeometricPosition;
}

export class ItemEvent {
  constructor(public item:ItemModel, public event:MouseEvent, public type:string) {
  }
}

export interface GeometricDimension {
  width:number;
  height:number;
}

export interface GeometricPosition {
  left:number;
  top:number;
}
