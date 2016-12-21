define([
    'templateC'
], function(templateC) {
    'use strict';
    var PrivateFunc = {
        init:function (doms,ImageDataArray,PageType) {
            var that = PrivateFunc;
            that.doms.MainDiv = doms;
            that.Cache.ImageDataArray = ImageDataArray||[];
            that.Cache.PageType = PageType||"DETAIL";
            that.BindEvent();
            that.BindImageShowPage();
        },
        doms:{
            MainDiv:null
        },
        Cache:{
            InitImageUrlArray:[],
            PageType:"DETAIL",//EDIT DETAIL
            ImageDataArray:[]//{Index:1,ImageUrl:""}
        },
        urls:{
            UploadFileUrl:AP_ROOT+"ImageFile/ImageUpload",
        },
        tmplUrls:{
            TemplUrl:AP_ROOT+"Scripts/Common/templUploadImage.html"
        },
        BindEvent:function () {
            var that = PrivateFunc;
            that.doms.MainDiv.delegate('div[data-type=uploadimage_show] i.btn_left','click',function(){
                 var index = $(this).data('index');
                that.ImageDataLeft(index);

            });
            that.doms.MainDiv.delegate('div[data-type=uploadimage_show] i.btn_right','click',function(){
                var index = $(this).data('index');
                that.ImageDataRight(index);
            });
            that.doms.MainDiv.delegate('div[data-type=uploadimage_show] i.btn_close','click',function(){
                var url = $(this).data('url');
                that.ImageDataRemove(url);
            });
            
            that.doms.MainDiv.delegate('div[data-type=uploadimage_upload] input[type=file]','change',function(){
                that.UploadFilePost();
            });

        },
        BindImageShowPage:function(){
            var that = PrivateFunc;
            var tmplData = new templateC.dataTempl();
            tmplData.url = that.tmplUrls.TemplUrl;
            tmplData.callback = function () { };
            tmplData.dom = that.doms.MainDiv;
            tmplData.uniqueID = "ImageUploadMainPage";
            tmplData.datas = {
                Data: that.Cache.ImageDataArray,
                PageType:that.Cache.PageType
            };
            templateC.load(tmplData);
        },
        ImageDataAdd:function (imageUrl) {
            var that = PrivateFunc;
            that.Cache.ImageDataArray = that.Cache.ImageDataArray || [];
            if(imageUrl &&imageUrl.length>0){
                that.Cache.ImageDataArray.push(imageUrl);
                that.BindImageShowPage();
            }
        },
        ImageDataRemove:function (imageUrl) {
            var that = PrivateFunc;
            that.Cache.ImageDataArray = that.Cache.ImageDataArray || [];
            if(imageUrl &&imageUrl.length>0){
                that.Cache.ImageDataArray = _.filter(that.Cache.ImageDataArray,function(item){
                    if(item == imageUrl)
                        return false;
                    else
                        return true;
                });
                that.BindImageShowPage();
            }
        },
        ImageDataRight:function (index) {
            var that = PrivateFunc;
            that.Cache.ImageDataArray = that.Cache.ImageDataArray || [];
            if(that.Cache.ImageDataArray &&that.Cache.ImageDataArray.length>0){
               if(index < 0 || index >= that.Cache.ImageDataArray.length -1){
                   return false;
               }
               var url =that.Cache.ImageDataArray[index];
               that.Cache.ImageDataArray[index] = that.Cache.ImageDataArray[index+1];
               that.Cache.ImageDataArray[index+1] = url;
               
                that.BindImageShowPage();
            }
        },
        ImageDataLeft:function (index) {
            var that = PrivateFunc;
            that.Cache.ImageDataArray = that.Cache.ImageDataArray || [];
            if(that.Cache.ImageDataArray &&that.Cache.ImageDataArray.length>0){
               if(index > that.Cache.ImageDataArray.length -1 || index <= 0){
                   return false;
               }
               var url =that.Cache.ImageDataArray[index];
               that.Cache.ImageDataArray[index] = that.Cache.ImageDataArray[index-1];
               that.Cache.ImageDataArray[index-1] = url;
               
                that.BindImageShowPage();
            }
        },
        UploadFilePost:function(){
            var that = PrivateFunc;
            var inputFile = that.doms.MainDiv.find('div[data-type=uploadimage_upload] input[type=file]');
            var formData = new FormData();
            var imageFile = inputFile.prop('files')[0];
            formData.append('img_upload_input', imageFile)
             $.ajax({
                url: that.urls.UploadFileUrl,  //Server script to process data
                type: 'POST',
                xhr: function () {  // Custom XMLHttpRequest
                    var myXhr = $.ajaxSettings.xhr();
                    return myXhr;
                },
                success: function (result) {
                    result = JSON.parse(result);
                    if (result != null ) {
                        if(result.IsSuccess)
                        {
                            var imageUrl = result.Data;
                            if(imageUrl && imageUrl.length>0){
                                that.ImageDataAdd(imageUrl);
                            }else {
                                $.showMessageBox("上传图片", "上传图片失败！");
                            }
                        }else{
                            if(result.Message)
                                $.showMessageBox("上传图片", result.Message);
                            else {
                                $.showMessageBox("上传图片", "上传图片失败！");
                            }
                        }
                    } else {
                        $.showMessageBox("上传图片", "上传图片失败！");
                    }
                },
                error: function (evc) { PopShowMessageBox(evc, "", false); },
                // Form data
                data: formData,
                //Options to tell jQuery not to process data or worry about content-type.
                cache: false,
                contentType: false,
                processData: false
            });
        },

    };
    var privateKey = Symbol();
    var UploadImage = {
        //dom 
        //imgUrlArray
        //pageType EDIT DETAIL
        init:function (dom,imgUrlArray,pageType) {
            this[privateKey] = PrivateFunc;
            this[privateKey].init (dom,imgUrlArray,pageType);
        },
        GetImageUrlArray:function(){
            var that =this[privateKey];
            return that.Cache.ImageDataArray;
        }
    };
    return UploadImage;
});