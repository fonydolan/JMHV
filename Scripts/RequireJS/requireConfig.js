
(function () {
    var baseUrl = "/JMHV/Scripts/";
    var isDebug = typeof location != 'undefined' && location.search.indexOf('debug=1') != -1;
    var nocache = typeof location != 'undefined' && location.search.indexOf('nocache=true') != -1;

    var config = {
        baseUrl: baseUrl,
        paths: {
            "jquery": "jquery-2.2.4.min",
　　　　　　  "underscore": "Underscore/Underscore_1.8.2",
　　　　　　  "backbone": "Backbone/backbone-min",
             "domReady":"RequireJS/domReady",
             "template":"Common/template",

        },
        /*
        加载非规范的模块 
        shim属性，专门用来配置不兼容的模块。具体来说，每个模块要定义
        （1）exports值（输出的变量名），表明这个模块外部调用时的名称；
        （2）deps数组，表明该模块的依赖性。
        */
        shim: {
　　　　　　/*
            'underscore':{
　　　　　　　　exports: '_'
　　　　　　},
　　　　　　'backbone': {
　　　　　　　　deps: ['underscore', 'jquery'],
　　　　　　　　exports: 'Backbone'
　　　　　　}
            */
            'template':{
                deps:['underscore']
            }
　　　　}
        //text和image插件，则是允许require.js加载文本和图片文件。 
        //类似的插件还有json和mdown，用于加载json文件和markdown文件
    }

    if (nocache) {
        config.urlArgs = Date.now();
    }

    require.config(config);

   
});