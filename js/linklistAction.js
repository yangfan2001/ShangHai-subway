// 定义jquery按键控制
// 定义插入表单的submit的控制
$(document).ready(function(){
    $("#insertForm").submit(function(event){
        event.preventDefault();
        let pos = $("#insertPos option:selected").val();
        let val = $("#insertNum ").val();
        if(val.length==0)//不能输入空元素
        {
            event.preventDefault();// 阻止提交表单
            event.stopPropagation();
        }
        if(linklist.exsit)
        {
            linklist.insert(pos, val);
            linklist.draw_linklist();
            str="<div class=\"alert alert-success alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>插入成功!</strong> 图中标记红色的为新插入的节点。</div>";
            $("#messageBox").empty();
            $("#messageBox").append(str);
            linklist.mark_node(Number(pos));//标记新插入的节点
        }
        else
        {
            str="<div class=\"alert alert-danger alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>插入失败!</strong> 请先创建链表。</div>"
            $("#messageBox").empty();
            $("#messageBox").append(str);
        }
        getSelect(linklist.len);//更新按钮的插入位置选项
    });
  });
// 定义创造链表按钮的控制
$(document).ready(function () {
    $("#createButton").click(function (e) { 
        e.preventDefault();
        linklist.draw_linklist();
        linklist.exsit=true;
        getSelect(linklist.len);
    });
});
// 定义清空链表的控制
$(document).ready(function () {
    $("#clearButton").click(function (e) { 
        e.preventDefault();
        linklist.head.next=null;
        linklist.len=0;
        linklist.draw_linklist();
        getSelect(linklist.len);
    });
});
//定义删除表单的控制
$(document).ready(function () {
    $("#deleteForm ").submit(function (e) { 
        e.preventDefault();
        if(linklist.exsit)
        {
            let val = $("#deleteNum ").val(),str;
            let status =linklist.delete(val);
            $("#messageBox").empty();//清空消息框
            if(status==true)
            {
                str="<div class=\"alert alert-success alert-dismissible fade show\">\
                <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
                <strong>删除成功!</strong> 成功删除了所有值为"+val+"的节点。</div>"
                linklist.draw_linklist();//删除成功，显示删除后
            }
            else //删除失败进行提示
            {
                str="<div class=\"alert alert-danger alert-dismissible fade show\">\
                <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
                <strong>删除失败!</strong> 没有在链表中找到值为"+val+"的节点。</div>"
            }
            $("#messageBox").append(str);//显示消息框提醒
            getSelect(linklist.len);//更新选择框
        }
        else
        {
            str="<div class=\"alert alert-danger alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>删除失败!</strong> 请先创建链表。</div>"
            $("#messageBox").empty();
            $("#messageBox").append(str);
        }
    });
});
//定义查询表单的控制
$(document).ready(function () {
    $("#findForm ").submit(function (e) { 
        e.preventDefault();
        if(linklist.exsit)
        {
            let val = $("#findNum ").val(), str;
            let pos = linklist.find(val);
            $("#messageBox").empty();//清空消息框
            if (pos != -1) {
                str = "<div class=\"alert alert-success alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>查询成功!</strong> 其在链表中第一次出现的位置为链表的第"+ pos + "位。图中标记红色的为所查询到的节点。</div>"
                linklist.draw_linklist();
                linklist.mark_node(pos);
            }
            else //查询失败进行提示
            {
                str = "<div class=\"alert alert-danger alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>查询失败!</strong> 没有在链表中找到值为"+ val + "的节点。</div>"
            }
            $("#messageBox").append(str);//显示消息框提醒
            getSelect(linklist.len);//更新选择框
        }
        else
        {
            str="<div class=\"alert alert-danger alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>查询失败!</strong> 请先创建链表。</div>"
            $("#messageBox").empty();
            $("#messageBox").append(str);
        }
    });
});