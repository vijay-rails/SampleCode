ChequeRequest.addNewLine = function () {
    var postData = {};
    postData["cheque_request_line"] = {payee: "payee", description: "description", amount: 0};

    jQuery.ajax({
        url: '/cheque_request_line/create/',
        type: 'POST',
        dataType: 'json',
        data: postData,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            jQuery.prompt('Error!! ' + XMLHttpRequest + ' ' + textStatus + ' ' + errorThrown);
        },
        success: function(data) {
            jQuery("#cheque_req_view").html(data.html); //load cheque request table with selected data
            ChequeRequest.reloadInlineResets();
        }
    });
};

ChequeRequest.updateLineOrder = function(table) {
    var postData = {};
    for (var i = 2; i < table.rows.length-2; i++) {
        postData["orders[" + table.rows[i].id + "]"] = i;
    }

    jQuery.ajax({
        type: "PUT",
        url: '/cheque_request_line/reorder',
        data: postData,
        dataType: "json",
        success: function(returnData){
        },
        error: function(){
            jQuery.prompt('Unable to change line order.');
        }
    });
};

ChequeRequest.deleteLine = function (argId){
    jQuery.prompt('Are you sure you want to delete this line?',
        {callback:
            function(v,m) {
                if(v){
                    jQuery.ajax({
                        url: '/cheque_request_line/destroy/' + argId,
                        type: 'DELETE',
                        dataType: 'json',
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            jQuery.prompt('Error!! ' + XMLHttpRequest + ' ' + textStatus + ' ' + errorThrown);
                        },
                        success: function(data) {
                            jQuery("#cheque_req_view").html(data.html); //load cheque request table with selected data
                            ChequeRequest.reloadInlineResets();
                        }
                    });
                }
            }, buttons: {Yes: true, No: false}});
};