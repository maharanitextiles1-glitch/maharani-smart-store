export type Floor = { _id:string; name:string; code:string; order:number };
export type Section = {
  _id:string; name:string; code:string; category:string; description?:string;
  floorId: Floor | string;
  mapPosition:{x:number;y:number;width:number;height:number};
  navigationInstructions:string[];
  keywords:string[];
};
export type Product = {
  _id:string; name:string; category:string; subcategory?:string;
  sectionId: Section;
};
