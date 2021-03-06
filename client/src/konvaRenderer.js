var Observable=require('onhandlers');

var KonvaRenderer=function(global){
    var self=this;
    this.Konva=require("Konva");
    this.mouse=new(function(){
        this.dragging=new Set();
        this.hovered=new Set();
        this.tracked=new Set();
        this.position={x:0,y:0};
        Observable.call(this);
        var self=this;
        document.addEventListener('mousemove',function(evt){
            self.position.x=evt.layerX;
            self.position.y=evt.layerY;
            self.handle('move',evt);
        });
        document.addEventListener('mousedown',function(evt){
            self.handle('down',evt);
        });
        document.addEventListener('mouseup',function(evt){
            self.handle('up',evt);
        });
        this.getEveryUnder=function(coords=false){
            if(coords==false) coords=self.position;
            self.tracked.forEach(function(trackedElement){
                if(trackedElement.isUnder(self.position)){
                    console.log("isunder");
                    self.hovered.add(trackedElement);
                }
            });
            return self.hovered;
        }
    });
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    var stage = new Konva.Stage({
      container: 'konva',
      width: width,
      height: height
    });
    
    
    this.layers=[];
    for(var ln=0; ln<5; ln++){
        var layer = new Konva.Layer();
        stage.add(layer);
        this.layers.push(layer);
    }

    this.layer=this.layers[0];
    var circle = new Konva.Circle({
      x: stage.getWidth(),
      y: stage.getHeight(),
      radius: 10,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4
    });
    
    // add the shape to the layer
    this.layer.add(circle);
    
    var anim = new Konva.Animation(function(frame) {
        var time = frame.time,
            timeDiff = frame.timeDiff,
             frameRate = frame.frameRate;

    }, stage);
    anim.start();
    return this;
};

export default KonvaRenderer;