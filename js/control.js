//实现根据单链表的长度添加选择插入位置的数值
function getSelect(len)
{
    $("#insertPos").empty();
    for(let i=0;i<=len;i++)
    {
        let str = "<option>"+i+"</option>"
        $("#insertPos").append(str);
    }
}

function millertoXY(lon,lat)
{
    // lon 经度 lat 纬度
    let L = 6381372 * Math.PI * 2  //地球周长
    let W = L  // 平面展开，将周长视为X轴
    let H = L / 2  // Y轴约等于周长一般
    let mill = 2.3  // 米勒投影中的一个常数，范围大约在正负2.3之间
    let x = lon * Math.PI / 180 // 将经度从度数转换为弧度
    let y = lat * Math.PI / 180
    //将纬度从度数转换为弧度
    y = 1.25 * Math.log(Math.tan(0.25 * Math.PI + 0.4 * y))  //这里是米勒投影的转换

    // 这里将弧度转为实际距离 ，转换结果的单位是公里
    x = (W / 2) + (W / (2 * Math.PI)) * x
    y = (H / 2) - (H / (2 * mill)) * y
    return [x,y]
}

function xy_to_coor(x,y)
{
    let L = 6381372 * Math.PI * 2  //地球周长
    let W = L  // 平面展开，将周长视为X轴
    let H = L / 2  // Y轴约等于周长一般
    let mill = 2.3  // 米勒投影中的一个常数，范围大约在正负2.3之间
    let lat = ((H/2-y)*2*mill)/(1.25*H)
    lat = ((Math.atan(Math.exp(lat))-0.25*Math.PI)*180)/(0.4*Math.PI)
    lon = (x-W/2)*360/W
    lat = lat.toFixed(6)
    lon = lon.toFixed(6)
    return [lon,lat]
}
// 显示地图经纬度的长度
function show_range(){
    let str=`<div class="alert alert-dark" style="margin-bottom:0px" role="alert">
地铁图的经度范围和纬度范围分别为:<strong>[${lon_range[0]},${lon_range[1]}]
[${lat_range[0]},${lat_range[1]}]</strong></div>`
    $("#Node").append(str);
}
// 根据线路字典返回线路名称
function update_line_select(arr)
{
    $("#LineSelect").empty();
    for(let item of arr)
    {
        let str = "<option>"+item+"</option>"
        $("#LineSelect").append(str);
    }
}
// 比较两个集合 
function compare_set(set1,set2)
{
     for(let each of set1)
     {
          if(!set2.has(each))
          {
               return false
          }
     }
     return true
}
// 返回set转化为String的形式
function set_to_string(my_set)
{
    return Array.from(my_set).toString()
}
