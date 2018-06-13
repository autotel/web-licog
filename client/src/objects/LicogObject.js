import CoupledObject from "../CoupledObject"
import Observable from "onhandlers";
import {ModularObject, EventMessage} from "./ModularObject";

var licogBus=new(function(){
    ModularObject.call(this);
    var self=this;
    var baseMessage=new EventMessage();
    baseMessage.typeName("clock");
    baseMessage.value[1]=12;
    baseMessage.value[2]=0;
    setInterval(function(){
        baseMessage.value[2]++;
        baseMessage.value[2]%=12;
        self.output(baseMessage);
    },20);
})();

var uniqueToModule={};

var LicogModule=function(global,props){
    var self=this;
    licogBus.connectTo(this);
    ModularObject.call(this);
    
    var coupler=false;
    var baseMessage=new EventMessage()
    baseMessage.typeName("trigger");
    this.couple=function(icoupler){
        coupler=icoupler
        uniqueToModule[coupler.unique]=self;
        coupler.on('change',function(evt){
            var trackList=['type','triggered'];
            for(var vname of trackList){
                if(evt[vname]){
                    console.log("Licog",vname,"changed to",evt[vname]);
                    self[vname]=evt[vname];
                }
            }
            if(evt.outputs){
                for(var outputUnique of evt.outputs){
                    if(!self.outputs.has(uniqueToModule[outputUnique])){
                        console.log("add new output",uniqueToModule[outputUnique]);
                        self.connectTo(uniqueToModule[outputUnique]);
                    }else{
                        console.log("already there");   
                    }
                }
            }
            console.log(coupler.unique,"trigger?",self.triggered);

        });
    }
    var clock={
        microStep:0,
        microSteps:12,
        subStep:0,
        subSteps:1
    }
    var clockAbsolute=true;
    function microStep(base,number){
        clock.microSteps=base;
        if(clockAbsolute){
            clock.microStep=number;
        }else{
            clock.microStep+=1;
        }
        if(base%number==0){
            subStep(1);
        }
    }
    function subStep(increment=1){
        //TODO: case of negative increments
        clock.subStep+=increment;
        if(clock.subStep>=clock.microSteps){
            clock.subStep=0;
            step();
        }
    }
    function step(){
        if(self.triggered===true){
            self.output(baseMessage);
            self.triggered=false;
            if(coupler){
                coupler.update({triggered:false});
            }
        }
    }
    this.receive=function(message){
        switch (message.typeName()) {
            case "clock":
                microStep(message.value[1],message.value[2]);
                // self.output(message);
            break;
            case "trigger":
                //TODO: study clock up and downstream...
                if(coupler){
                    coupler.update({triggered:true});
                }
            break;
            default:
                break;
        }
    }
}
export default LicogModule;