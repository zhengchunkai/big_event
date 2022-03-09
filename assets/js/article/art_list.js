var layer = layui.layer
var form = layui.form
var laypage = layui.laypage
var q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
}
template.defaults.imports.dataFormat = function (date) {
    var dt = new Date(date)
    var y = addZero(dt.getFullYear())
    var m = addZero(dt.getMonth() + 1)
    var d = addZero(dt.getDate())
    var hh = addZero(dt.getHours())
    var mm = addZero(dt.getMinutes())
    var ss = addZero(dt.getSeconds())
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}
function addZero(n) {
    return n < 10 ? '0' + n : n
}
function initTable() {
    $.ajax({
        method: 'get',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取列表数据失败')
            }
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            renderPage(res.total)
        }
    })
}
initTable()
function initCate() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取列表失败')
            }
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
            form.render()
        }
    })
}
initCate()
$('#form-search').on('submit', function (e) {
    e.preventDefault()
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    q.cate_id = cate_id
    q.state = state
    initTable()
})
function renderPage(total) {
    laypage.render({
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        elem: 'page',
        count: total,
        limit: q.pagesize,
        curr: q.pagenum,
        jump: function (obj, first) {
            q.pagenum = obj.curr
            q.pagesize = obj.limit
            if (!first) {
                initTable()
            }
        }

    })
}
$('tbody').on('click', '.btn-Edit', function () {
    location.href = '/article/art_pub.html'
    var id = $(this).attr('data-Id')
    localStorage.setItem('id',id)
})
$('tbody').on('click', '.btn-delete', function () {
    var len = $('.btn-delete').length;
    var id = $(this).attr('data-id')
    layer.confirm('是否确认删除?', {
        icon: 3,
        title: '提示'
    }, function (index) {
        $.ajax({
            method: 'get',
            url: '/my/article/delete/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('删除失败')
                }
                layer.msg('删除成功')
                if (len === 1) {
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                }
                initTable()
            }
        })
        layer.close(index);
    });
})