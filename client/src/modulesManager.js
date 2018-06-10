
import CoupledObject from "./CoupledObject";
var ModulesManager=function(global){
    var availableModules= {
    };

    var instancedModules=[];
    this.createModule=function(name,props={}){
        var coupleList=[];
        for(var a in availableModules[name]){
            console.log("c",availableModules[name][a]);
            
            coupleList.push(new availableModules[name][a](global,props));
        }
        var newModule=new CoupledObject(coupleList);
        instancedModules.push(newModule);
        return newModule;
    }
    this.useModule=function(name,constructor){
        console.log(name,constructor);
        availableModules[name]=[constructor];
    };
    this.couple=function(name,constructor){
        console.log(name,constructor);        
        availableModules[name].push(constructor);
    }
    return this;
};

export default ModulesManager