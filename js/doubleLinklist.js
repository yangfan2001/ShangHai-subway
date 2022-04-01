
// 定义基本的画图参数
const size = 50  //定义小矩形框的长度
const empty = 70  //定义空格的长度
const row_num = 3  //定义 每行最多的节点数量
const width = 3  //定义边框宽度
const boarderXdis = 150 // 定义与边框之间的宽度
const boarderYdis = 80 // 定义与边框之间的高度
const arrowAngle = (30* Math.PI / 180);
const arrowLen = 15;//箭头的斜长度
const arrowX = Math.cos(arrowAngle)*arrowLen;//箭头X方向偏移量
const arrowY = Math.sin(arrowAngle)*arrowLen;//箭头Y方向偏移量
// 定义节点类
class node{
    constructor(val=null,next=null)
    {
        this.val = val;
        this.next = next;
        this.mark = false;
    }
}
// 定义单链表类(单链表类包括了链表的基本数据结构，增添删改操作，以及canvas画布操作)
class Single_linklist{
    constructor()
    {
        this.len = 0; // 链表长度
        this.head = new node(); // 头结点定义
        this.exist = false; // 代表链表是否创建
        this.canvas = $("#canvas")[0]; // 获取画布
        this.ctx=canvas.getContext("2d"); //2d绘图
    }
    // 实现在第pos位置后插入数值为val的节点(头结点当作pos为0的位置)
    insert(pos,val){
        let new_node = new node(val,null);
        let count=0,p=this.head;
        while(p!=null)
        {
           // p.mark=true;
            // 这里进行延时和动画添加
            if(count==pos)
            {
                new_node.next = p.next;
                p.next = new_node;
                this.len++;
                return true;
            }
            count+=1;
            //p.mark = false;//还原标记位
            p = p.next;
       }
       return false;
    }
    // 实现删除链表中所有数值为val的节点
    delete(val)
    {
        let p=this.head;
        let status = false;
        while(p.next!=null)
        {
            //p.mark=true;
            // 这里进行延时和动画添加
            if(p.next.val==val)
            {
                p.next = p.next.next;//删除对应的节点
                status = true;
                this.len--;
            }
            else
            {
                //p.mark=false;
                p = p.next;// 没有删除操作，指针移动
            }
        }
        return status; // 返回是否删除成功的状态status
    }
    // 实现查找数值为val的节点在链表中第一次出现的位置
    find(val)
    {
        let p=this.head.next;
        let count = 0;
        while(p!=null)
        {
            //p.mark=true;
            // 这里进行延时和动画添加
            if(p.val==val)
            {
                return count;//找到，返回count
            }
            //p.mark=false;//标记还原
            p = p.next;
            count++;
        }
        return -1;
    }
    // 实现根据节点的编号获取在canvas画布上的坐标位置
    get_pos(num)
    {
        console.log("getPosNum=",num);
        let x_pos = boarderXdis + (num % row_num) * (empty + size * 3);//获得横坐标
        let y_pos = boarderYdis + parseInt(num / row_num) * (empty + size);//获得纵坐标
        return [x_pos, y_pos];
    }
    // 实现画一个节点，其值为val
    draw_node(num, val) 
    {
        let x, y, text;
        text = val == null ? "head" : val;//打印头结点
        [x, y] = this.get_pos(num); //获取坐标
        this.ctx.strokeRect(x, y, size, size); //两个正方形
        this.ctx.fillText("pre", x + size / 5, y + size / 2 + 5) //标记next节点
        this.ctx.strokeRect(x+size, y, size, size); 
        this.ctx.fillText(text, x + +size+size / 5, y + size / 2 + 5)
        this.ctx.strokeRect(x + 2*size, y, size, size);
        this.ctx.fillText("next", x + 2*size + size / 5, y + size / 2 + 5) //标记next节点
    }
    // 实现标记一个点
    mark_node(num)
    {
        let x,y;
        [x,y] = this.get_pos(num+1);
        console.log("mark_x=",x,"mark_y=",y);
        this.ctx.strokeStyle="#FF0000";
        this.ctx.strokeRect(x, y, size, size);
        this.ctx.strokeRect(x + size, y, size, size);
        this.ctx.strokeRect(x + 2*size, y, size, size);
        this.ctx.strokeStyle="#000000";
    }
    //实现画一个next的箭头
    draw_arrowLine(x, y, nx, ny,float_dis=0) {
        y = y + float_dis;
        ny = ny + float_dis;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(nx, ny);
        this.ctx.stroke();
        //下面实现画箭头
        if(float_dis>=0) //next的指向的线的话
        {
            this.ctx.beginPath();
            this.ctx.moveTo(nx - arrowX, ny - arrowY);
            this.ctx.lineTo(nx, ny);
            this. ctx.lineTo(nx - arrowX, ny + arrowY);
            this.ctx.stroke();
        }
        else   // pre的指向的线的话
        {
            this.ctx.beginPath();
            this.ctx.moveTo(x + arrowX, y - arrowY);
            this.ctx.lineTo(x, y);
            this. ctx.lineTo(x + arrowX, y + arrowY);
            this.ctx.stroke();
        }
    }
    // 实现画一条折现从坐标（x,y）->(nx,ny)
    draw_twistLine(x, y, nx, ny,float_dis_x=0,float_dis_y=0) {
        y+=float_dis_y;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        let tempX, tempY;
        [tempX, tempY] = [x + size / 2-float_dis_x, y];
        this.ctx.lineTo(tempX, tempY);
        [tempX, tempY] = [x + size / 2-float_dis_x, y + empty / 2 + size / 2-float_dis_y*2];
        this.ctx.lineTo(tempX, tempY);
        [tempX, tempY] = [nx - empty, y + empty / 2 + size / 2-float_dis_y*2];
        this.ctx.lineTo(tempX-float_dis_x, tempY);
        [tempX, tempY] = [nx - empty, ny];
        this.ctx.lineTo(tempX-float_dis_x, tempY+float_dis_y);
        if(float_dis_y>=0)
        {
            this.ctx.stroke();
            this.draw_arrowLine(tempX-float_dis_x, tempY, nx, ny,float_dis_y)//最后画一条箭头线
        }
        else{
            this.ctx.lineTo(nx, ny+float_dis_y);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(x + arrowX, y - arrowY);
            this.ctx.lineTo(x, y);
            this. ctx.lineTo(x + arrowX, y + arrowY);
            this.ctx.stroke();
        }
    }
    // 实现根据布局画链表的第num个节点对应的后序节点之间的连线
    draw_line(num) {
        let [x, y] =  this.get_pos(num);
        [x, y] = [x + 3 * size, y + size / 2];
        let [next_x, next_y] =  this.get_pos(num + 1);
        next_y += size / 2;
        if (y == next_y) {
            this.draw_arrowLine(x, y, next_x, next_y,10); //画一条next的有向线
            this.draw_arrowLine(x, y, next_x, next_y,-10); //画一条pre的有向线
        }
        else {
            this.draw_twistLine(x, y, next_x, next_y,10,10) //先画next到下一行的线
            this.draw_twistLine(x, y, next_x, next_y,-10,-10)
            return;
        }
    }
    //实现将链表在canvas画布上画出来
    draw_linklist() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height); 
        canvas.height = (parseInt(this.len / row_num) + 1) * (size + empty) + 2 * boarderYdis;
        this.ctx.font = "15px sans-serif"
        let p = this.head;
        let count = 0;
        while (p != null) {
            this.draw_node(count, p.val);
            if (p.next != null) {
               this.draw_line(count);
            }
            p = p.next;
            count++;
        }
        console.log("success");
    }
}
// 生成全局变量linklist类
let linklist = new Single_linklist();


