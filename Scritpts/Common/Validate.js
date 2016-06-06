//validate
function ShowValidateMsg(idPart) {
    var msg = $('#' + id + 'Msg');
    if (msg != undefined)
        msg.show();
}
function HideValidateMsg(idPart) {
    var msg = $('#' + id + 'Msg');
    if (msg != undefined)
        msg.hide();
}
//id部分  
//htmlType:input select 
//sucessFunc 成功方法
//返回
function ValidateVal(idPart, htmlType, sucessFunc) {
    var v_row = $('#' + idPart + 'Row');
    var v_html = v_row.find(htmlType);
    if (v_html == undefined)
        return false;
    var v_value = v_html.val();
    if (sucessFunc) {
        if (sucessFunc(v_value)) {
            HideValidateMsg(idPart);
            return true;
        } else {
            ShowValidateMsg(idPart);
            return false;
        }
    } else
        return false;
}