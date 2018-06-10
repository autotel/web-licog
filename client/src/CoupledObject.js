
/*
gives a set of objects the ability to bind data.
itr makes it easier to bind, for example a sprite, with an abstract object, with a websocket node.
it requires all the bound objects to have a "bind" function, where they receive the bindibject. Then the objects can listen and cast their changes to that object

*/
var refList=[];
import Observable from "onhandlers";
import { log } from "util";
var getUnique=function(what){
    var n= refList.length;
    refList.push(what);
    return n;
}
var CoupledObject=function(objectList=false){
    var self=this;
    this.unique=getUnique(this);
    Observable.call(this);
    var couplings=new Set();
    this.vars={};
    this.update=function(evt){
        for(var a in evt){
            self.vars[a]=evt[a];
        }
        self.handle('change',evt);
    }
    this.couple=function(object){
        //option B, keeping clearner scope by replacing the same fn?
        couplings.add(object);
        if(object.couple){
            object.couple(self);
        }else{
            console.warn("an object without cpuple() function was added to a coupler",object);
            
        }
        //or maybe not doing this, allowing each object to manage the coupler however
        //object.coupler=self;
    }
    if(objectList){
        for(var a in objectList){
            self.couple(objectList[a]);
        }
    }
}
export default CoupledObject