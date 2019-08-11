//用户操作
// $("#userForm").on('submit',function(){

// })
var userArr = [];
$.ajax({
    type: 'get',
    url: '/users',
    success: function (res) {
        userArr = res;
        // console.log(res);
        render(userArr);
    }
})

//用于调用template方法 渲染页面
function render(arr) {
    var str = template('userTpl', {
        list: arr
    });
    // console.log(str);
    $('tbody').html(str);
}
//添加用户 
$("#userAdd").on('click', function () {
    console.log('ok');
    console.log($('#userForm').serialize());
    // return;

    $.ajax({
        url: '/users',
        type: 'post',
        data: $('#userForm').serialize(),
        success: function (res) {
            // userArr=res;
            userArr.push(res);
            render(userArr);
        }
    })
})

//添加图片的代码 s上传图片
$("#avatar").on('change', function () {
    // console.log('ok');
    //用户选择的文件是files[0]
    var formData = new FormData();
    formData.append('avatar', this.files[0]);
    console.log('avatar');
    console.log($("#avatar"));

    console.log(this.files[0]);

    // console.log(formData);//这是个表单接受对象
    //this 是当前的 <input id ="avatar" type="file" >
    // console.log(this.files[0]);

    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        //告诉$.ajax方法不要解析请求参数
        processData: false,
        //告诉 不要设置请求参数类型
        contentType: false,
        success: function (response) {
            console.log('ok');
            console.log(response);
            console.log(response[0].avatar);
            console.log(response[0]);
            //实现头像预览
            $('#preview').attr('src', response[0].avatar);
            //将图片的地址添加表单的隐藏域
            $('#hiddenAvatar').val(response[0].avatar)
        }
    })

});

var userId;
//编辑用户功能
$('tbody').on('click', '.edit', function () {

    userId = $(this).parent().attr('data-id');
    //点击修改按钮 --> 添加变修改
    $("#userAdd").hide();
    $("#userEdit").show();


    //获取tr元素
    var trObj = $(this).parents('tr');

    var imgSrc = trObj.children().eq(1).children().attr('src');
    //给emial 传值
    $('#email').val(trObj.children().eq(2).text());
    //给nickName 传值
    $('#nickName').val(trObj.children().eq(3).text());
    console.log(trObj.children());

    var status = trObj.children().eq(4).text();
    var role = trObj.children().eq(5).text();
    if (status == '激活') {
        $('#jh').prop('checked', true)
    } else {
        $('#wjh').prop('checked', true)
    }
    if (role == '超级管理员') {
        $('#admin').prop('checked', true)
    } else {
        $('#normal').prop('checked', true)
    }
})

//完成用户修改功能 
$('#userEdit').on('click', function () {
    console.log('ok');
    console.log($('#userForm').serialize());

    //我们需要发送ajax给服务器是 需要传输Id
    $.ajax({
        type: 'put',
        url: '/users/' + userId,
        data: $('#userForm').serialize(),
        success: function (res) {

            var index = userArr.findIndex(item => item._id == userId);
            //根据这个index找到数组的这个元素 ,将他更新
            userArr[index] = res;
            //调用render方法 重新渲染页面
            render(userArr);
        }
    })
});

//完成用户删除功能 
$('tbody').on('click', '.del', function () {
    // console.log('ok');
    if (window.confirm('真的要删除吗?')) {
        var id = $(this).parent().attr('data-id');
        console.log(id);

        $.ajax({
            type: 'delete',
            url: '/users/' + id,
            success: function (res) {

                var index = userArr.findIndex(item => item._id == userId);
                userArr.splice(index, 1);
                render(userArr);
            }
        })
    }

});

//获取全选按钮
// $('tbody')
$('thead input').on('click', function () {
    //prop()括号里一个参数是获取  两个参数是赋值
    let flag = $(this).prop('checked');
    $('tbody input').prop('checked', flag);

    if(flag){
        $('.btn-sm').show(); 
    }else{
        $('.btn-sm').hide();
    }
})

//check 框点击事件
$('tbody').on('click', 'input', function () {
    //单选选中个数==单选框个数  表示全部都选了 全选框选中
    if ($('tbody input').length == $('tbody input:checked').length) {
        $('thead input').prop('checked', true);
    } else {
        $('tbody thead input').prop('checked', false);
    }

    //个数大于1 显示批量删除按钮
    if ($('tbody input:checked').length > 1) {
        $('.btn-sm').show();
    } else {
        $('.btn-sm').hide();
    }
    // console.log($(' input:checked').length);

});

//给批量删除注册点击事件
$('.btn-sm').on('click',function(){
    // console.log('ok');
    var ids=[];
    
    var checkUser=$('tbody input:checked');
    checkUser.each(function(k,v){
        var id = v.parentNode.parentNode.children[6].getAttribute('data-id');
        ids.push(id);
        console.log(id);
    });

    $.ajax({
        type:'delete',
        url: '/users/' + ids.join('-'),
        success:function(res){

            // location.reload();//1.重新加载页面
            //第2中方法下面是局部刷新页面
            res.forEach(e=>{
                var index=userArr.findIndex(item._id==e.id);
                userArr.splice(index,1);
                render(userArr);
            })
        }
    })

})