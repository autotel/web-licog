'use strict'
import SpriteBase from "./SpriteBase";
import LinkSprite from "./LinkSprite";
var uniqueToSprite={};
var LicogSprite=function(global,props){
    this.name="licog sprite";
    var name=this.name;
    var self=this;
    var radius=30;
    var mouse=global.renderer.mouse;
    this.coupler=false;
    mouse.tracked.add(this);
    SpriteBase.call(this,props);
    var group = new Konva.Group({draggable:true});
    var creatorLine = new Konva.Line({
        x: 0,
        y: 0,
        points: [0,0,0,0],
        stroke: 'black',
        tension: 1
    });
    var color=0xCCCCCC;
    var inCircle = new Konva.Circle({
        x: 0,
        y: 0,
        radius: radius*0.65,
        fill: "#"+color.toString(16),
        strokeWidth: 4
    });
    var outCircle = new Konva.Circle({
        x: 0,
        y: 0,
        radius: radius,
        fill: 'black',
        strokeWidth: 4,
        draggable:true
    });
    var idText = new Konva.Text({
        text:"tste",
        fill:"crimson",
        'pointer-events':"none",
    });
    group.add(creatorLine);
    group.add(outCircle);
    group.add(inCircle);
    group.add(idText);
    
    var creatorDragging=false;
    
    this.releasedOver=function(what){
        console.log("released over",what);
    }
    this.isUnder=function(pos){
        return (Math.hypot(pos.x-group.x(), pos.y-group.y())<radius)
    }

    this.refreshPosition=function(){
        if(self.coupler){
            var pos = self.coupler.vars.position;
            group.setX(pos.x);
            group.setY(pos.y);
        }
        
    }
    this.representTrigger=function(value){
        if(value){
            inCircle.fill("#FFF");
        }else{
            inCircle.fill("#"+color.toString(16));
            // inCircle.fill("black");
        }
    }
    this.produceTrigger=function(){
        if(self.coupler){
            self.coupler.update({triggered:true});
            console.log(self.coupler.unique,"UI produce trigger");
            
        }
    }
    group.on('mouseenter',function(evt){
        //console.log(name,evt);
        inCircle.setFill("#DDD");
        mouse.hovered.add(self);
    });
    group.on('mouseleave',function(evt){
        //console.log(name,evt);
        inCircle.setFill("#"+color.toString(16));
        
        mouse.hovered.delete(self);
    });
    var groupDragListener=false;
    inCircle.on('dblclick',function(evt){
        console.log(evt);
        self.produceTrigger();
    });
    inCircle.on('dragstart mousedown',function(evt){
        
        if(!groupDragListener) groupDragListener=mouse.on('move',function(evt){
            var pos={
                x:group.x(),y:group.y()
            }
            if(self.coupler) self.coupler.update({
                position:pos,
                originUnique:self.coupler.unique
            })
        });
        mouse.dragging.add(self);
    });
    group.on('dragend',function(evt){
        if(groupDragListener){ 
            mouse.off(groupDragListener);
            groupDragListener=false;
        }
    });

    outCircle.on('dragstart mousedown',function(evt){
        if(!creatorDragging) creatorDragging=mouse.on('move',function(evt){
            var position={
                x:evt.layerX-group.x(),y:evt.layerY-group.y()
            }
            creatorLine.points([0,0,position.x,position.y]);
        });
        mouse.dragging.add(self);

        var tween = new Konva.Tween({
            node: outCircle,
            offsetX: group.x()-evt.evt.layerX,
            offsetY: group.y()-evt.evt.layerY,
            radius: 10,
            duration: 0.4,
            easing: Konva.Easings.BounceEaseOut
        });
        tween.play()
    });
    var trackedOutputs=[];

    this.createConnectionTo=function(licogUniqueList){
        trackedOutputs=trackedOutputs.concat(licogUniqueList);
        console.log("set combination",trackedOutputs);
        if(self.coupler){
            self.coupler.update({
                outputs:trackedOutputs
            });
        }
    }

    outCircle.on('dragend',function(evt){
        var allModulesUnder=mouse.getEveryUnder();
        allModulesUnder.delete(self);
        
        if(allModulesUnder.size>0){
            var moduleUniquesArray=Array.from(allModulesUnder).map(function(cv,i){
                return cv.coupler.unique
            });
            self.createConnectionTo(moduleUniquesArray);
        }else{
            var newModule=global.modulesManager.createModule('licog',{position:mouse.position});
            self.createConnectionTo([newModule.unique]);
        }
        mouse.off(creatorDragging);
        creatorDragging=false;
        creatorLine.points([0,0,0,0]);

        var tween = new Konva.Tween({
            node: outCircle,
            offsetX: 0,
            X:0,
            y:0,
            offsetY: 0,
            radius: radius,
            duration: 0.4,
            easing: Konva.Easings.StrongEaseOut
        });
        tween.play()
    });
    
    global.renderer.layers[4].add(group);
    var linkSprites=[];
    this.couple=function(coupler){
        idText.text(coupler.unique);
        self.coupler=coupler;
        self.unique=coupler.unique;
        uniqueToSprite[coupler.unique]=self;
        coupler.on('change',function(evt){
            if(evt.outputs!==undefined){
                for(var num in coupler.vars.outputs){
                    console.log("iterate output",num);
                    var destinationUnique=coupler.vars.outputs[num];
                    var linkSprite=linkSprites[num];
                    if(linkSprite){
                        linkSprite.setDestination(uniqueToSprite[destinationUnique]).enable();
                    }else{
                        linkSprite=linkSprites[num]=new LinkSprite(global,{
                            origin:self,
                            destination:uniqueToSprite[destinationUnique]
                        });
                    }
                }
            }
            if(evt.position!==undefined){
                self.refreshPosition();
            }
            if(evt.triggered!==undefined){
                self.representTrigger(evt.triggered);
            }
        })
        coupler.update(props);
    }
    this.redraw=function(delta){
    }

}
export default LicogSprite;

function newFunction() {
    return console.log;
}
