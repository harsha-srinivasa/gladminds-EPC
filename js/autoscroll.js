
function highlight_data ( _this, e, bgcolor ) {
        sClass = $(_this).attr('class').split(' ')[1];
        if(sClass==undefined){
                sClass = $(_this).attr("rel");
        }

        // myID = '#squidhead-'+sClass;
        relSel = '[rel="'+sClass+'"]';
        $("."+sClass).css({"background" : bgcolor});
        $("."+sClass).css({"color" : "#000"});

        if($(_this).attr('class').split(' ')[1])
                $(relSel).mouseover();
}


function remove_highlight_data ( _this, e ) {
        sClass = $(_this).attr('class').split(' ')[1];

        if(sClass==undefined){
                sClass = $(_this).attr("rel");
        }

        $("."+sClass).css("background","none");
        $("."+sClass).css("color","#000");

        myID = '#squidhead-'+sClass;
        relSel = '[rel="'+sClass+'"]';

        if($(_this).attr('class').split(' ')[1])
                $(relSel).mouseout();
}

function scroll_if_not_visible ( className ) {
        var element = $('.'+className);
        var offset = element.offset().top - $('.table tbody tr').offset().top;
        $( '.tabData_body' ).animate({ scrollTop: offset }, 'slow' );
        $( '.st-body-scroll' ).animate({ scrollTop: offset }, 'slow' );
}


