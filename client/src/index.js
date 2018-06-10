var global={}

import KonvaRenderer from './konvaRenderer';
import ModulesManager from './modulesManager';

var konvaRenderer=new KonvaRenderer(global);
var modulesManager=new ModulesManager(global);


global.renderer=konvaRenderer;
global.modulesManager=modulesManager;

modulesManager.useModule("licog",require('./objects/LicogObject.js').default);
modulesManager.couple("licog",require('./sprites/LicogSprite.js').default);

var testSet=[
    {position:{x:window.innerWidth/2,y:window.innerWidth/2}},
];
for(var a in testSet){
    modulesManager.createModule('licog',testSet[a]);

}