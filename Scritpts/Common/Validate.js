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
//htmlType:input select 或者id name...
function ValidateValGet(idPart, htmlType) {
    var v_row = $('#' + idPart + 'Row');
    if (v_row == undefined)
        return undefined;
    var v_html = v_row.find(htmlType);
    if (v_html == undefined)
        return undefined;
    var v_value = v_html.val();
    return v_value;
}
//id部分  
//htmlType:input select 或者id name...
//dataKey:获取data-属性值
function ValidateValGet_Data(idPart, htmlType, dataKey) {
    var v_row = $('#' + idPart + 'Row');
    if (v_row == undefined)
        return undefined;
    var v_html = v_row.find(htmlType);
    if (v_html == undefined)
        return undefined;
    var v_value = v_html.data(dataKey);
    return v_value;
}
//id部分  
//htmlType:input select 或者id name...
//attrKey:获取属性值
function ValidateValGet_Attr(idPart, htmlType, attrKey) {
    var v_row = $('#' + idPart + 'Row');
    if (v_row == undefined)
        return undefined;
    var v_html = v_row.find(htmlType);
    if (v_html == undefined)
        return undefined;
    var v_value = v_html.attr(attrKey);
    return v_value;
}
//id部分
//sucessJudgeFunc 成功判断方法
//successThenFunc 判断成功后执行
//failThenFunc 判断失败后执行
//返回
function ValidateValJudge(idPart,v_value, sucessJudgeFunc, successThenFunc, failThenFunc, callback) {
    var retFlag = false;
    if (sucessJudgeFunc) {
        if (v_value != undefined && sucessJudgeFunc(v_value)) {
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

//example:
function ValidateAdCount() {
    var value = ValidateValGet('adCount', 'select');
    return ValidateValJudge('adCount', value, $.ValidateFunc.Int_GTZero);
}
function ValidateTitle() {
    var value = ValidateValGet('title', 'input');
    return ValidateValJudge('title', value, $.ValidateFunc.String_NotEmpty);
}
function ValidateLocation() {
    var value = ValidateValGet('location', 'select');
    return ValidateValJudge('location', value, $.ValidateFunc.String_NotEmpty, null, null, ShowPageCity);
}