//validate greate than less than
$.ValidateFunc = {
    String_NotEmpty:function(val){
        if (val != undefined && val != '')
            return true;
        else
            return false
        ;
    },
    Int_GTZero: function (val) {
        if (val != undefined && val > 0)
            return true;
        else
            return false;
    }
}
function ShowValidateMsg(idPart) {
    var msg = $('#' + idPart + 'Msg');
    if (msg != undefined)
        msg.show();
}
function HideValidateMsg(idPart) {
    var msg = $('#' + idPart + 'Msg');
    if (msg != undefined)
        msg.hide();
}
//id部分  
//htmlType:input select 或者id name
//sucessJudgeFunc 成功判断方法
//successThenFunc 判断成功后执行
//failThenFunc 判断失败后执行
//返回
function ValidateVal(idPart, htmlType, sucessJudgeFunc,successThenFunc,failThenFunc,callback) {
    var v_row = $('#' + idPart + 'Row');
    if (v_row == undefined)
        return false;
    var v_html = v_row.find(htmlType);
    if (v_html == undefined)
        return false;
    var v_value = v_html.val();
    var retFlag = false;
    if (sucessJudgeFunc) {
        if (sucessJudgeFunc(v_value)) {
            HideValidateMsg(idPart);
            if (successThenFunc) {
                successThenFunc();
            }
            retFlag = true;
        } else {
            ShowValidateMsg(idPart);
            if (failThenFunc)
                failThenFunc();
            retFlag = false;
        }
    } else
        retFlag = false;
    if (callback)
        callback();
    return retFlag;
}
//id部分  
//htmlType:input select 或者id name
//attrVal:获取属性值
//sucessJudgeFunc 成功判断方法
//successThenFunc 判断成功后执行
//failThenFunc 判断失败后执行
//返回
function ValidateDataVal(idPart, htmlType,dataKey, sucessJudgeFunc,successThenFunc,failThenFunc,callback) {
    var v_row = $('#' + idPart + 'Row');
    if (v_row == undefined)
        return false;
    var v_html = v_row.find(htmlType);
    if (v_html == undefined)
        return false;
    var v_value = v_html.data(attrVal);
    var retFlag = false;
    if (sucessJudgeFunc) {
        if (sucessJudgeFunc(v_value)) {
            HideValidateMsg(idPart);
            if (successThenFunc) {
                successThenFunc();
            }
            retFlag = true;
        } else {
            ShowValidateMsg(idPart);
            if (failThenFunc)
                failThenFunc();
            retFlag = false;
        }
    } else
        retFlag = false;
    if (callback)
        callback();
    return retFlag;
}