//获取URL中的参数值
//name为URL中参数名，返回相应的参数值
function getURLPara(name)
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

//设置前台当前页链接高亮
function setActionHref(path) {
    $("#navbar a").each(function () {
        var _href = $(this).attr('href');
        if(path===_href)
        {
            $(this).parent().addClass('active');
        }
    });

    $("#right-nav a").each(function () {
        var _href = $(this).attr('href');
        if(path===_href)
        {
            $(this).addClass('active');
        }
    });
}

//设置后台当前页链接高亮
function setManageActionHref(path) {
    $(".sidebar a").each(function () {
        var _href = $(this).attr('href');
        if(path===_href)
        {
            $(this).parent().addClass('active');
        }
    });

    $(".navbar-right a").each(function () {
        var _href = $(this).attr('href');
        if(path===_href)
        {
            $(this).parent().addClass('active');
        }
    });
}


/* Back top*/
$(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
        $('.sidebar,.BackToTop').fadeIn(200);
    } else {
        $('.sidebar,.BackToTop').fadeOut(200);
    }
});
// Animate the scroll to top
$('.BackToTop').click(function (event) {
    event.preventDefault();
    $('html, body').animate({scrollTop: 0}, 300);
})
