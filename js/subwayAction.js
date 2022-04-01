// 定义jquery对前端页面的控制
/*定义四个基本功能按钮的点击事件*/
$(document).ready(function ()
{
    // 定义放大按钮点击事件
  $('#ZoomInButton').click(function (e) { 
    e.preventDefault()
    zoom.scaleBy(svg, 1.1) // 执行该方法后 会触发zoom事件
    d3.zoomTransform(svg.node())
  })
  // 定义缩小按钮点击事件
  $('#ZoomOutButton').click(function (e) { 
    e.preventDefault() 
    zoom.scaleBy(svg, 0.9) // 执行该方法后 会触发zoom事件
    d3.zoomTransform(g.node())
  })
  // 定义清空地图的按钮点击事件
  $('#EmptyButton').click(function (e) { 
      e.preventDefault();
      sh_subway.clear()
      draw_map()
  });
  // 定义加载上海地图data点击事件
  $('#LoadButton').click(function (e) { 
      e.preventDefault();
      sh_subway.clear() // 清空地图
      sh_subway.load_data() // 读取本地数据
      draw_map() // svg渲染图案
  });
})
show_range()

/*定义节点相关表单的提交事件*/
$(document).ready(function () {
    //定义删除站点表单的提交事件响应
    $('#deleteNodeForm').submit(function (e) { 
        e.preventDefault();
        let key = $('#DeleteNodeName').val()
        $('#messageBox').empty()
        // 删除成功
        if(sh_subway.delete_node(key)==true)
        {
            draw_map()
            let str=`<div class=\"alert alert-success alert-dismissible fade show\">\
                <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
                <strong>删除成功✅</strong>，删除了ID为${key}的站点。</div>`
            $('#messageBox').append(str)
        }
        else // 删除失败，提示输入的ID不存在
        {
            let str=`<div class=\"alert alert-danger alert-dismissible fade show\">\
                <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
                <strong>删除失败❌</strong>，不存在ID为${key}的站点。</div>`
            $('#messageBox').append(str)
        }
    });
    //定义添加站点表单的提交时间响应
    $('#addNodeForm').submit(function (e) { 
        e.preventDefault();
        let lon = $('#AddLongtitude').val()
        let lat = $('#AddLatitude').val()
        let key = $('#AddNodeName').val()
        $("#messageBox").empty()
        if(lon>=lon_range[0]&&lon<=lon_range[1]&&lat>=lat_range[0]&&lat<=lat_range[1])
        {
            let x,y
            [x,y] =millertoXY(lon,lat)
            if(sh_subway.add_node(key,x,y,[]))
            { // 添加成功，更新图片
                draw_map()
                let str=`<div class=\"alert alert-success alert-dismissible fade show\">\
                <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
                <strong>添加成功✅</strong>，添加了ID为${key}的站点</div>`
                $('#messageBox').append(str)
            }
            else
            { // 添加失败，ID存在相同的
                let str=`<div class=\"alert alert-danger alert-dismissible fade show\">\
                <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
                <strong>添加失败❌</strong>，已存在ID为${key}的站点。</div>`
                $('#messageBox').append(str)
            }
        }
        else
        {  // 输入的数据不合法
            let str=`<div class=\"alert alert-danger alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>添加失败❌</strong>，输入的经纬度不在规定范围内。</div>`
            $('#messageBox').append(str)
        }
    });
});
/*------------------------- */
/*定义寻路对应按钮表单的事件响应*/
$(document).ready(function () {
    // 定义寻路表单的事件响应
    $('#FindPathForm').submit(function (e) { 
        e.preventDefault();
        let start = $('#StartStation').val()
        let end = $('#EndStation').val()
        if(sh_subway.check_key(start,end))
        {
            // 寻路成功
            sh_subway.get_shortest_path(start,end)
            let str=`<div class=\"alert alert-success alert-dismissible fade show\">\
                <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
                <strong>寻路成功✅</strong>，请点击其他按钮查看路线以及换乘指南。</div>`
            $("#messageBox").empty()
            $('#messageBox').append(str)
        }
        else
        {
            // 输入的ID不存在数据结构中
            let str=`<div class=\"alert alert-danger alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>寻路失败❌</strong>，请检查输入的是否为地图内的站点名称。</div>`
            $("#messageBox").empty()
            $('#messageBox').append(str)
        }
    });
    // 定义显示局部的地铁路线的按钮点击事件
    $("#ShowPartMapButton").click(function (e) { 
        e.preventDefault();
        if(sh_subway.array.length==0)
        {
            // 数组为空
            let str=`<div class=\"alert alert-danger alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>显示失败❌</strong>，请先进行换乘寻路操作。</div>`
            $("#messageBox").empty()
            $('#messageBox').append(str)
        }
        else
        {
            draw_part_map(sh_subway.array)
            let str=`<div class=\"alert alert-success alert-dismissible fade show\">\
                <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
                <strong>已显示在左侧的可视化框架内</strong>，请查看。</div>`
            $("#messageBox").empty()
            $('#messageBox').append(str)
        }
    });
    // 定义显示换乘指南按钮的点击事件
    $("#PathButton").click(function (e) { 
        e.preventDefault();
        
        if(sh_subway.array.length==0)
        {
            // 数组为空
            let str=`<div class="alert alert-danger" style="margin-bottom:0px" role="alert">
            <strong>显示失败❌</strong>，请先进行换乘寻路操作。</div>`
            $("#FindPathModalBody").empty()
            $('#FindPathModalBody').append(str)
        }
        else
        {
            str=`<div class="alert alert-dark" style="margin-bottom:0px" role="alert">
            ${sh_subway.get_path_info(sh_subway.array)}</div>`
            $("#FindPathModalBody").empty()
            $('#FindPathModalBody').append(str)
        }
    });
    // 定义还原显示地图按钮的点击事件
    $('#ShowMapButton').click(function (e) { 
        e.preventDefault();
        draw_map()
    });
});
/*------------------------- */
/* 定义线路管理功能相关的事件响应*/
//在html加载的时候执行一次
update_line_select(sh_subway.line_map.keys())
$(document).ready(function () {
    // 定义提交线路
    $('#AddLineForm').submit(function (e) { 
        e.preventDefault();
        let id = $('#AddLineName').val()
        let color = $('#AddLineColor').val().slice(1);
        if(sh_subway.line_map.has(id))
        {
            // 存在同名线路，那么提示重新插入线路
            let str=`<div class=\"alert alert-danger alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>添加失败！❌</strong>存在相同ID的线路</div>`
            $("#messageBox").empty()
            $('#messageBox').append(str)
        }
        else
        {
            sh_subway.add_line(id,id,color)
            // 插入新线路，新线路插入成功
            let str=`<div class=\"alert alert-success alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>添加成功！✅</strong>成功添加了${id}</div>`
            $("#messageBox").empty()
            $('#messageBox').append(str)
            update_line_select(sh_subway.line_map.keys()) //添加后，更新所有选择框
        }
    });
    // 查看地铁线路表按钮点击事件
    $('#LineListButton').click(function (e) { 
        e.preventDefault();
        $('#LineListModalBody').empty();
        str=`<div class="alert alert-dark" style="margin-bottom:0px" role="alert">
        ${sh_subway.get_line_list()}</div>`
        $('#LineListModalBody').append(str);
    });
    // 向地铁线路添加边表单提交事件响应
    $('#AddVertexForm').submit(function (e) { 
        e.preventDefault();
        let key1 = $('#StationOne').val()
        let key2 = $('#StationTwo').val()
        if(!sh_subway.vertex_map.has(key1)||!sh_subway.vertex_map.has(key2))
        {
            // 输入的站点不存在
            let str=`<div class=\"alert alert-danger alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>添加失败！❌</strong>请检查输入的站点名是否在地图中</div>`
            $("#messageBox").empty()
            $('#messageBox').append(str)
        }
        else if(key1==key2)
        {
            // 输入的站点名称相同
            let str=`<div class=\"alert alert-danger alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>添加失败！❌</strong>不能在同一个站点间添加边</div>`
            $("#messageBox").empty()
            $('#messageBox').append(str)
        }
        else
        {
            // 输入合法，更新数据结构，更新地图
            let line_id = $('#LineSelect').val();
            sh_subway.add_edge_to_line(key1,key2,line_id)
            draw_map() // 更新地图
            let str=`<div class=\"alert alert-success alert-dismissible fade show\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\
            <strong>添加成功！✅</strong>请在左侧图形界面查看新添加的边</div>`
            $("#messageBox").empty()
            $('#messageBox').append(str)
        }
    });
});