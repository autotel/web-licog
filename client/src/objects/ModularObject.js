var LazyStack = function(properties) {
    var stackLimit = false;
    var stack = [];
    var self=this;
    // this.interval = 1;
    // this.tPerStep=50;
    this.dequeuing=false;
    this.messagePriority=50;
    this.maxStack=false;
    for(var a in properties){
      this[a]=properties[a];
    }
  
  
    this.enq = function(cb) {
      stack.push(cb);
      if(self.maxStack){
        if(stack.length>self.maxStack){
          stack.splice(0,self.maxStack-stack.length);
          // console.log(`stack.splice(0,${self.maxStack-stack.length});`);
        }
      }
      if(!self.dequeuing){
        deq();
      }
    }
    function deq(){
        self.dequeuing=true;
        let count=0;
        while(stack.length && count<self.messagePriority){
            (stack.shift())();
            count++
        }
        if(stack.length){
            setImmediate(deq);
            console.warn("! EVENTS STACK: "+stack.length+"");
    
        }else{
            self.dequeuing=false;
        }
    };
};
var ModularObject=function(global,props){
    var self=this;
    this.outputs=new Set();
    var lazyStack=new LazyStack();
    this.receive=function(message){
    }
    this.output=function(message){
        if(!message.clone){
            console.warn("message needs to be clonable:",message);
            return false;
        }
        self.outputs.forEach(function(output){
            lazyStack.enq(function(){
                // console.log(output);
                if(typeof output.receive !== "function") console.log("!",output);
                output.receive(message.clone());
            });
        });
    }
    this.connectTo=function(what){
        if(! what instanceof ModularObject) console.warn("output not a modular object: ",what);
        
        this.outputs.add(what);
    }
}


'use strict'
var typeNames=["null","clock","trigger","stop","set"]
/**
@example ` myOutput.receive(new EventMessage([0x01,0x40,0x30])) `
*/
var EventMessage=function(inputValue){
    
    var thisEm = this;
    var self = this;
    this.isEventMessage=true;


    this.value=[];
    this.valueNames=[];
    this.print=function(){
    console.log("EventMessage { ");
    for(var a in this.value){
        var str="["+a+"]";
        if(this.valueNames[a]) str+="("+valueNames[a]+") ";
        str+=": "+ this.value[a];
        console.log(" "+str);
    }
    console.log("}");
    }
    this.typeName=function(set=false){
        if(set!==false){
            self.value[0]=typeNames.indexOf(set);
        }
        return typeNames[self.value[0]];
    }
    this.set=function(data){
    for(var a in data){
        if(typeof data[a]!=="function")
        this[a]=JSON.parse(JSON.stringify(data[a]));
    }
    }
    this.clone=function(){
    return new EventMessage(this);
    }
    this.compareTo=function(otherEvent,propertyList){
    function recurse(currentObject,pathArr,level=-1){
        var nextLevel=level+1;
        if(level==pathArr.length-1){
        return currentObject;
        }else if(currentObject[pathArr[nextLevel]]){
        return recurse(currentObject[pathArr[nextLevel]],pathArr,nextLevel);
        }else{
        return;
        }
    }
    for(var a of propertyList){
        var splitVal=a.split('.');
        if(splitVal.length>1){
        let comparableA=recurse(self,splitVal);
        let comparableB=recurse(otherEvent,splitVal);
        if(comparableA!=comparableB){
            return false;
        }
        }else{
        if(JSON.stringify(self[a])!=JSON.stringify(otherEvent[a])){
            return false;
        }else{

        }
        }
    }
    return true;
    }
    this.superImpose=function(otherEvent){
    if(otherEvent.value.indexOf(-1)===-1) return otherEvent;
    for(var a in otherEvent.value){
        if(otherEvent.value[a]!=-1){
        thisEm.value[a]=otherEvent.value[a];
        }
    }
    return thisEm;
    }
    this.underImpose=function(otherEvent){
    if(thisEm.value.indexOf(-1)===-1) return thisEm;
    for(var a in thisEm.value){
        if(thisEm.value[a]==-1){
        thisEm.value[a]=otherEvent.value[a];
        }
    }
    return thisEm;
    }
    this.set(inputValue);
}
EventMessage.from=function(original){
  return new EventMessage(original);
}
EventMessage.test=function(){

  var eM=new EventMessage({value:[0,2,2]});
  function aa (){ return  }

  var scripts=[
    function(){
      return eM
    },
    function(){
      return eM.clone()
    },
    function(){
      return eM.compareTo(eM.clone(),['value'])
    },
    function(){
      return eM.compareTo( new EventMessage({ value:[0,1,2,3] }), ['value'] )
    },
    function(){
      return eM.compareTo(eM.clone(),['value.1'])
    },
    function(){
      return eM.compareTo( new EventMessage({ value:[0,1,2,3] }), ['value.2'] )
    },
    function(){
      return eM.compareTo( new EventMessage({ value:[0,1,2,3] }), ['value.1','value.2'] )
    },
  ];
  for(var scr of scripts){
    console.log(String(scr)+'\n\n>',eval(scr)(),"\n");
  }
}
module.exports=EventMessage;

module.exports={
    ModularObject:ModularObject,
    EventMessage:EventMessage
}