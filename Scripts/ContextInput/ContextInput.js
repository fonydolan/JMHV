$.ContextInput = {
    Example: {
        SearchFuncEx: {
            param: { inputValue: '11', successFunc: function (SuccessData) { } },
            SuccessData: { Data: [{ ID: 0, Name: '123' }] },
        }
    },
    HandlerItemModel:function(){
        this.KeyValueText = { Key: 'ID', Value: 'Name' };
        this.InputItemID='';
        this.Container = undefined;//input所在容器对象
        this.InputItem = undefined;//联想输入的input对象
        this.SearchMinInterval= 500;//查询间隔
        //查询内容的方法 格式：$.ContextInput.Example.SearchFuncEx
        this.SearchFunc= function () { };
        //获取选中项的值
        this.GetSelectedKey = function () {
            if(this.InputItem)
                return this.InputItem.data('ci_key')
        };
        //获取选中项的值
        this.GetSelectedValue = function () {
            if(this.InputItem)
                return this.InputItem.data('ci_value')
        };
        //关闭联想窗口
        this.Close = function () {
            if(!this.Container)
                return false;
            var ul = this.Container.find('.ContextInput');
            if (ul.length > 0)
                ul.remove();
        };
        //全释放
        this.Dispose = function (inputID) {
            this.Close();
            this.InputItem = undefined;
            this.SearchFunc = function () { };
        };
        return this;
    },
    HandlerItems:{},// {inputID:HandlerItemModel}   
    Init: function (inputID, SearchFunc, SearchMinInterval, KeyValueText) {
        var handlerItems = $.ContextInput.HandlerItems;
        var item = null;
        if(handlerItems != null) {
            item = handlerItems[inputID];
        }
        if(item != null && item != undefined){
            delete handlerItems[inputID];
        }
        var handllerItemModel = new $.ContextInput.HandlerItemModel();
        handllerItemModel.InputItemID = inputID;
        if (SearchMinInterval != null && SearchMinInterval > 0)
            handllerItemModel.SearchMinInterval = SearchMinInterval;
        var input = $('#' + inputID);
        if (input == null || input.length == 0)
            return false;
        handllerItemModel.InputItem = input;
        handllerItemModel.Container = input.parent();
        if (SearchFunc)
            handllerItemModel.SearchFunc = SearchFunc;
        else
            return false;
        if (KeyValueText && KeyValueText.Key && KeyValueText.Key != '' && KeyValueText.Value && KeyValueText.Value != '') {
            handllerItemModel.KeyValueText = KeyValueText;
        }
        handllerItemModel.Container.delegate('#' + inputID, 'propertychange input',function(){
            $.ContextInput.PrivateFunc.SearchHandler(handllerItemModel.InputItemID);
        });
        //handllerItemModel.Container.delegate('#' + inputID, 'blur', function () {
        //    $.ContextInput.Close();
        //});
        handllerItemModel.Container.delegate('ul[data-type=ContextInputList] li[data-type=ContextInputItem]', 'click', function () {
            var li = $(this);
            var key = li.data('ci_key');
            var value = li.data('ci_value');
            var inputItem = handllerItemModel.InputItem;
            inputItem.val(value);
            inputItem.data('ci_value', value);
            inputItem.data('ci_key', key);
            handllerItemModel.Close();
        });
        handllerItemModel.Container.delegate('.ContextInput a.ico_close', 'click', function () {
            handllerItemModel.Close();
        });
        $(window).bind('resize',function(){
            handllerItemModel.Close();
        });
        $.ContextInput.HandlerItems[inputID]= handllerItemModel;
    },
    PrivateFunc:{
        SearchMain:function(inputID,TimeOutFlag){
            var handlerItemModel = $.ContextInput.HandlerItems[inputID]
            if(!handlerItemModel)
                return false;
            var value = handlerItemModel.InputItem.val();
            if (value == null || value == undefined || value == '') {
                handlerItemModel.Close();
                return false;
            }
            if(TimeOutFlag){
                var oldValue = handlerItemModel.InputItem.data('CI_LastSearchText');
                if (value === oldValue) {
                    return false;
                }
            }
            var now = new Date().getTime();
            handlerItemModel.InputItem.data('CI_LastSearchTime', now);
            handlerItemModel.InputItem.data('CI_LastSearchText', value);
            handlerItemModel.SearchFunc(value, function (Data) {
                if (Data)
                {
                    Data.Tmpl_KeyValueText = handlerItemModel.KeyValueText;
                }
                var tmpl = _.template($('#ContextInputTemplate').html());
                var html = tmpl(Data);
                handlerItemModel.Close();
                _.each($.ContextInput.HandlerItems,function (item,index,list) {
                    if(item!=null)
                        item.Close();
                });

                handlerItemModel.InputItem.after(html);
                $('.ContextInput').css('left',handlerItemModel.InputItem.position().left);
            });
        },
        SearchHandler: function (inputID) {
            var handlerItemModel = $.ContextInput.HandlerItems[inputID]
            if(!handlerItemModel)
                return false;
            var lastSearchTime = handlerItemModel.InputItem.data('CI_LastSearchTime');
            var now = new Date().getTime();
            var time = 0;
            if (lastSearchTime > 0) {
                time = lastSearchTime + handlerItemModel.SearchMinInterval - now;
            }
            if (time <= 0) {
                $.ContextInput.PrivateFunc.SearchMain(inputID,false);
            } else {
                setTimeout(function(){
                    $.ContextInput.PrivateFunc.SearchMain(inputID,true);
                }, time);
            }
        },
    }
};
