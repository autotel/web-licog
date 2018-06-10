'use strict'
var count=0;
import SpriteBase from "./SpriteBase";
var LinkSprite=function(global,props){
    this.name="line sprite";
    console.log("link sprite",props);
    console.log("count",count++);
    
    var name=this.name;
    var self=this;
    var mouse=global.renderer.mouse;
    SpriteBase.call(this,props);

    var group = new Konva.Group();
    var line = new Konva.Line({
        x: 0,
        y: 0,
        points: [0,0,0,0],
        stroke: 'black',
        // tension: 0
    });
    var outfset=-30;
    var _tsize=7;
    var triangle = new Konva.Line({
        x: 0,
        y: 0,
        points: [-_tsize+outfset,-_tsize,_tsize+outfset,0,-_tsize+outfset,_tsize],
        fill: 'black',
        stroke:'black',
        closed:true,
        // tension: 0
    });
    group.add(line);
    group.add(triangle);
    global.renderer.layers[3].add(group);

    var startPosition={x:0,y:0}
    var endPosition={x:0,y:0}
    var startSprite=false;
    var startSpriteMoveListener=false;
    this.setOrigin=function(toSprite){
        if(!toSprite.coupler){
            console.warn('LinkSprites node objects need to have a coupler',toSprite);
            return self;
        }
        if(toSprite===startSprite) return self;
        startPosition=toSprite.coupler.vars.position||startPosition;    
        if(startSpriteMoveListener) startSprite.coupler.off(startSpriteMoveListener);
        startSpriteMoveListener=toSprite.coupler.on('change',function(evt){
            if(evt.position){
                startPosition=evt.position;
                self.reposition();
            }
        });
        startSprite=toSprite;
        self.reposition();
        return self;
    }
    var endSprite=false;
    var endSpriteMoveListener=false;
    this.setDestination=function(toSprite){
        if(!toSprite.coupler){
            console.warn('LinkSprites node objects need to have a coupler',toSprite);
            return self;
        }
        if(toSprite===endSprite) return self;
        endPosition=toSprite.coupler.vars.position||endPosition;
        if(endSpriteMoveListener) endSprite.coupler.off(endSpriteMoveListener);
        endSpriteMoveListener=toSprite.coupler.on('change',function(evt){
            
            if(evt.position){
                endPosition=evt.position;
                self.reposition();
            }
        });
        endSprite=toSprite;
        self.reposition();
        return self;
    }

    this.reposition=function(){
        // var trianglePosition={
        //     x:(startPosition.x+endPosition.x)/2,
        //     y:(startPosition.y+endPosition.y)/2,
        // }
        var trianglePosition=endPosition;
        var triangleRotation = Math.atan2(
            endPosition.y - startPosition.y, 
            endPosition.x - startPosition.x
        )*Math.PI*18;

        line.points([startPosition.x,startPosition.y,endPosition.x,endPosition.y]);
        triangle.rotation(triangleRotation);
        triangle.setX(trianglePosition.x);
        triangle.setY(trianglePosition.y);
    }
    this.disable=function(){
        return this;
    }
    this.enable=function(){
        return this;
    }
    if(props.origin) this.setOrigin(props.origin);
    if(props.destination) this.setDestination(props.destination);

    return this;
}
export default LinkSprite;
