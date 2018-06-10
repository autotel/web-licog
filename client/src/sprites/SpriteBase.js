import CoupledObject from "../CoupledObject"
import Observable from "onhandlers";
var SpriteBase=function(global,props){
    var self=this;
    
    Observable.call(this);
    this.selected=false;
    this.hovered=false;
    this.redraw=function(){};
    
}
export default SpriteBase;