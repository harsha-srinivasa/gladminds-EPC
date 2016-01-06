function show_version ( url ) {
console.log('version');
    $.ajax({
        type: 'GET', 
        dataType: 'jsonp',
        url: url+ 'version.json',
        data: { get_param: 'value' }, 
        dataType: 'json',
        success: function(version) {
            create_footer(version);
        },
        error: function(e){
            console.log(e);
        }
    });
}


function create_footer(version) {
    var footer = '<footer class="bajaj-footer"><span>All rights reserved by Bajaj Auto. Ltd.</span><br><span>Powered by GladMinds Connect Platform</span><br><span>Version '+version.version_no+'</span></footer>';

    $(".footer").append(footer);
}

