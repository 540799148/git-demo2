//创建一个新数组用来存放读取过来的数据
var categoriesArr = new Array();

// 为表单添加提交事件
$('#addC').on('click', function () {
    // 获取到表单提交过来的所有数据
    var formdata = $('#addCategories').serialize();
    // 发送添加分类的ajax
    $.ajax({
        type: 'post',
        url: '/categories',
        data: formdata,
        success: function (res) {
            // 将数据存到数组
            categoriesArr.push(res);
            render(categoriesArr);
        }
    })
})

// 封装模板渲染函数
function render(arr) {
    var html = template('temp', { list: arr });
    $('tbody').html(html)
}

// 发送添加分类的ajax
$.ajax({
    type: 'get',
    url: '/categories',
    success: function (res) {
        categoriesArr = res;
        render(categoriesArr);
    }
})


// 获取id
var userId;

// 添加编辑事件
$('tbody').on('click', '.edit', function () {
    userId = $(this).parent().attr('data-id');

    var trObj = $(this).parents('tr');

    $('#title').val(trObj.children().eq(1).text());
    $('#className').val(trObj.children().eq(2).text());

    $('#addC').hide();
    $('#editC').show();

    $('#addCategories h2').text('修改分类');
})

// 点击修改按钮，修改数据
$('#editC').on('click', function () {
    $.ajax({
        type: 'put',
        url: '/categories/' + userId,
        data: $('#addCategories').serialize(),
        success: function (res) {
            var index = categoriesArr.findIndex(item => item._id == userId);
            categoriesArr[index] = res;
            render(categoriesArr);
        }
    })
})

// 删除分类功能
$('tbody').on('click', '.del', function () {
    if (window.confirm('确定删除吗?')) {
        var id = $(this).parent().attr('data-id');
        $.ajax({
            type: 'delete',
            url: '/categories/' + id,
            success: function (res) {
                var index = categoriesArr.findIndex(item => item._id == res._id);
                categoriesArr.splice(index, 1);
                render(categoriesArr);
            }
        })
    }
})
