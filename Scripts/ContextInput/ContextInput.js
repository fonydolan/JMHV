$.ContextInput = {
    Example: {
        SearchFuncEx: {
            param: { inputValue: '11', successFunc: function (SuccessData) { } },
            SuccessData: { Data: [{ ID: 0, Name: '123' }] },
        }
    },
    KeyValueText: { Key: 'Key', Value: 'Name' },
    Container: undefined,//input所在容器对象
    InputItem: undefined,//联想输入的input对象
    SearchFunc: function () { },//查询内容的方法 格式：$.ContextInput.Example.SearchFuncEx
    SearchMinInterval: 500,//查询间隔
    Init: function (inputID, SearchFunc, SearchMinInterval, KeyValueText) {
        if (SearchMinInterval != null && SearchMinInterval > 0)
            $.ContextInput.SearchMinInterval = SearchMinInterval;
        var input = $('#' + inputID);
        if (input == null || input.length == 0)
            return false;
        $.ContextInput.InputItem = input;
        $.ContextInput.Container = input.parent();
        if (SearchFunc)
            $.ContextInput.SearchFunc = SearchFunc;
        else
            return false;
        if (KeyValueText && KeyValueText.Key && KeyValueText.Key != '' && KeyValueText.Value && KeyValueText.Value != '') {
            $.ContextInput.KeyValueText = KeyValueText;
        }
        $.ContextInput.Container.delegate('#' + inputID, 'propertychange input',$.ContextInput.PrivateFunc.SearchHandler);
        //$.ContextInput.Container.delegate('#' + inputID, 'blur', function () {
        //    $.ContextInput.Close();
        //});
        $.ContextInput.Container.delegate('ul[data-type=ContextInputList] li[data-type=ContextInputItem]', 'click', function () {
            var li = $(this);
            var id = li.data('id');
            var name = li.data('name');
            var inputItem = $.ContextInput.InputItem;
            inputItem.val(name);
            inputItem.data('id', id);
            $.ContextInput.Close();
        });
        $.ContextInput.Container.delegate('ul[data-type=ContextInputList] li[data-type=Close]', 'click', function () {
            $.ContextInput.Close();
        });
    },
    Close: function () {
        if(!$.ContextInput.Container)
            return false;
        var ul = $.ContextInput.Container.find('ul[data-type=ContextInputList]');
        if (ul.length > 0)
            ul.remove();
    },
    Dispose: function () {
        $.ContextInput.Close();
        $.ContextInput.InputItem = undefined;
        $.ContextInput.SearchFunc = function () { };
    },
    PrivateFunc:{
        SearchMain:function(TimeOutFlag){
            if(!$.ContextInput.InputItem)
                return false;
            var value = $.ContextInput.InputItem.val();
            if (value == null || value == undefined || value == '') {
                return false;
            }
            if(TimeOutFlag){
                var oldValue = $.ContextInput.InputItem.data('CI_LastSearchText');
                if (value === oldValue) {
                    return false;
                }
            }
            var now = new Date().getTime();
            $.ContextInput.InputItem.data('CI_LastSearchTime', now);
            $.ContextInput.InputItem.data('CI_LastSearchText', value);
            $.ContextInput.SearchFunc(value, function (Data) {
                if (Data)
                {
                    Data.Tmpl_KeyValueText = $.ContextInput.KeyValueText;
                }
                var html = $('#ContextInputTemplate').tmpl(Data);
                $.ContextInput.Close();
                $.ContextInput.InputItem.after(html);
            });
        },
        SearchHandler: function () {
            if(!$.ContextInput.InputItem)
                return false;
            var lastSearchTime = $.ContextInput.InputItem.data('CI_LastSearchTime');
            var now = new Date().getTime();
            var time = 0;
            if (lastSearchTime > 0) {
                time = lastSearchTime + $.ContextInput.SearchMinInterval - now;
            }
            if (time <= 0) {
                $.ContextInput.PrivateFunc.SearchMain(false);
            } else {
                setTimeout(function(){
                    $.ContextInput.PrivateFunc.SearchMain(true);
                }, time);
            }
        },
    }
};
