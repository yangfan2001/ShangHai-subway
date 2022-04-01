
// 程序运行中基本对象的声明
let sh_subway = new Graph() //生成类
load_data() // 加载数据
console.log(sh_subway) 
// 定义站点的数据
const station_r = 3
const station_stroke_w = 1
// 定义基本的svg画布的长宽高
const width = 1200
const height = 750
// 设置svg，选择svg
const svg = d3.select('#subwayMap').append('svg').attr("width", width).attr("height", height) // 选中画布
// 画地铁线路展示框的边框
svg.append('rect').attr('width',width).attr('x',0).attr('y',0)
.attr('height',height).attr('fill','None').attr('stroke','black')
.attr('stroke-width',3).attr('stroke-opacity',0.5)
//svg.append('text').text('上海地铁图线路图').attr('x',25).attr('y',25).attr('font-size',25)
// 设置内边距margin
const margin = {top:30,left:30,bottom:30,right:30}
const innerWidth = width-margin.left-margin.right
const innerHeight = height-margin.top-margin.bottom
// 数据操作
let x_arr = Array.from(sh_subway.vertex_map.values()).map(item=>parseInt(item.x)) // 获得x坐标集合
let y_arr = Array.from(sh_subway.vertex_map.values()).map(item=>parseInt(item.y)) // 获得y坐标集合
let x_max = Math.max(...x_arr),x_min = Math.min(...x_arr)    // 获得x坐标，y坐标的上下限
let y_max = Math.max(...y_arr),y_min = Math.min(...y_arr)
// 定义经纬度范围
let x_range = [x_min,x_max]
let y_range = [y_min,y_max]
let lon_range = [xy_to_coor(x_min,0)[0],xy_to_coor(x_max,0)[0]]
let lat_range = [xy_to_coor(0,y_max)[1],xy_to_coor(0,y_min)[1]]
// 获得坐标转换，得到范围转换
const xScale = d3.scaleLinear().domain([x_min, x_max]).range([10, innerWidth-10])
const yScale = d3.scaleLinear().domain([y_min, y_max]).range([10, innerHeight-10])
// 添加group
const yAxis = d3.axisLeft(yScale)
let g = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`)
g.attr('transform','scale(1)')
// 定义zoom
const zoom = d3.zoom().scaleExtent([1, 40]).on("zoom", zoomed);
svg.call(zoom)

function zoomed(event)
{
    const {transform} = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
}
// 站点的设置

// 实现在key1，key2之间画一条线
function draw_line(key1,key2)
{
    start = sh_subway.vertex_map.get(key1)
    end = sh_subway.vertex_map.get(key2)
    let start_x = xScale(start.x) ,start_y = yScale(start.y)
    let end_x = xScale(end.x) ,end_y = yScale(end.y)
    let float_pos = 0
    let color_set = sh_subway.get_vertex_color(key1,key2)
    for(color of color_set)
    {   // 渲染边
        let line_name = set_to_string(sh_subway.get_vertex_number(key1,key2))
        let mid_x = (start_x+end_x+2*float_pos)/2
        let mid_y = (start_y+end_y+2*float_pos)/2 -4
        g.append('line').attr('x1',start_x+float_pos).attr('y1',start_y+float_pos)
        .attr('x2',end_x+float_pos).attr('y2',end_y+float_pos).attr('stroke',`#${color}`)
        .attr('stroke-width','2')
        .on("mouseover",function(){
            let new_g = g.append('g')
            new_g.append('text').text(line_name)
            .attr('x',mid_x).attr('y',mid_y).attr('font-size',10).attr('text-anchor','middle')
        })
        .on("mouseout",function(){
            g.selectAll('g').remove()
        })
        float_pos+=2
    }

}
// 实现根据key画一个节点
function draw_node(key)
{
    let station = sh_subway.vertex_map.get(key)
    let start_x = xScale(station.x)
    let start_y = yScale(station.y)
    g.append('circle').attr('cx',start_x).attr('cy',start_y).attr('stroke-opacity',0.5) //渲染点
    .attr('r',station_r).attr('fill','white').attr('stroke','grey').attr('stroke-width',station_stroke_w)
    .on("mouseover",function(){
        d3.select(this)
            .attr("stroke","red");
    })
    .on("mouseout",function(){
        d3.select(this)
        .attr('stroke','grey')
    });
}
// 根据key渲染节点的文字
function draw_text(key)
{
    let d = sh_subway.vertex_map.get(key)
    let start_x = xScale(d.x)
    let start_y = yScale(d.y)
    g.append('text').text(d.id).attr('x',start_x+d.float_x).attr('y',start_y+d.float_y).attr('font-size',4)
    .attr('opacity',0.5)
    .on("mouseover",function(){
        d3.select(this)
        .attr('opacity',1)
    })
    .on("mouseout",function(){
        d3.select(this)
        .attr('opacity',0.5)
    });
}
// 实现根据全局的对象sh_subway来生成对应的d3 svg图形
function draw_map()
{
    clear_map()
    paint_map = new Map([]) //记录当前画的边是否被画过，因为储存的是有向图
    for(d of sh_subway.vertex_map.values())
    {
        // 先渲染边
        for(station of d.map.keys())
        {
            color_set = sh_subway.get_vertex_color(d.id,station)
            if(paint_map.has(d.id+station))
            {
                continue
            }
            draw_line(d.id,station)
            paint_map.set(d.id+station,true)
            paint_map.set(station+d.id,true)
        }
        // 再渲染节点
        draw_node(d.id)
    }
    // 渲染文字
    for(d of sh_subway.vertex_map.values())
    {
        draw_text(d.id)
    }
}
// 清空地图(清空map中的元素)
function clear_map(){
    d3.select('g').selectAll('*').remove()
}
// 实现画部分的地图（用于展示找到的最短路径）
function draw_part_map(array){
    clear_map()
    let len = array.length
    // 先渲染边
    for(let i=0;i<len-1;i++)
    {
        draw_line(array[i],array[i+1])
    }
    // 再渲染节点
    for(let i=0;i<len;i++)
    {
        draw_node(array[i])
    }
    // 然后渲染文字
    for(let i=0;i<len;i++)
    {
        draw_text(array[i])
    }
}
draw_map()
