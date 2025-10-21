export interface MapProvider {
  init(apiKey:string):Promise<void>;
  marker(lat:number,lng:number,label?:string):any;
  route(from:{lat:number;lng:number}, to:{lat:number;lng:number}):Promise<number>; // meters
}
