---
title: vue瀑布流
icon: config
date: 2022-11-17
category:
  - 记录
  - 挖坑
  - vue
  - 日记
---


添一个仓库链接
[https://github.com/huamurui/vue-biu-waterfall]

还有demo的链接
[https://biubiubiu.huamurui.me/]

>update:12.21.\
现在看这真是...绕了一个太大太无用的圈了。\
css3有专门支持瀑布流动属性了，是的，不是有各种缺陷（[有缺陷的](vue-waterfall.md/#csss-flex--grid-layout)）仍要js帮忙的，而是直接就可以实现。是grid布局下的一个标签masonry（grid-template-rows:masonry），只不过大部分浏览器或者说谷歌的浏览器还没支持，现在只在火狐的测试模式里有，要专门去打开一下才能用。\
真要实现支持可能还要等好久吧...到那时候就随便做了。\
想想看css真是把一大票活都干了，h5加上css3好厉害...\
好棒...但是感觉...好像没什么事可做了一样，好玩的东西别人都玩遍了拿来就能用，需要动手花精力的只剩那些无聊的对接工作...

## 瀑布流，计算部分

1.基础的版本,或者说实现核心主要是维护一个数组，数组存的是每一列的高度，根据现有高度选择新增元素会插到哪里，最简单的就是每次新增在高度最小的那一列填。\
2.有关列数，如果是平常简单的设计...直接把元素宽度或者说列宽固定，拿到窗口大小后两个做个除法得到一个变量就可以了，得到这个值就是要排的列数。或者更懒一点直接把列数写死也没问题。而有关元素高度，常见的做法有等比放缩一下。

::: details 1.2.基础版算列数，等比放缩..

这部分代码来自[myst729/Waterfall](https://github.com/myst729/Waterfall)...
不得不说组织的好棒...也不长，改用新的写法200行js加上css就能把功能做的很好。

害...我今天才知道原来单纯的js就有这么多在dom上的方法了，

>let cellsContainer = document.getElementById('cells')\
document.createDocumentFragment\
document.createElement\
document.body.children;  那parent肯定也有对吧...\
className不是自己起的名字...而真的是html-css-js里有的属性，可以在js中调用的。

```js
  //算列数
  const getColumnCount = () => Math.max(Math.floor((window.innerWidth - 20) / COLUMN_WIDTH), MIN_COLUMN_COUNT)
```

```js
//初始化columnHeights
  const resetHeights = (count) => {
    columnHeights = new Array(count).fill(0);
    cellsContainer.style.width = (count * (COLUMN_WIDTH + GAP_WIDTH) - GAP_WIDTH) + 'px';
  }
```

```js
  const adjustCells = (cells, reflow) => {
    let columnIndex = getMinKey(columnHeights);
    let columnHeight;
    for (let j = 0; j < cells.length; j++) {
      // Place the cell to column with the minimal height.
      columnIndex = getMinKey(columnHeights);
      columnHeight = columnHeights[columnIndex];//columnHeights就是需要维护的数组
      cells[j].style.height = (cells[j].offsetHeight - CELL_PADDING) + 'px';
      cells[j].style.left = columnIndex * (COLUMN_WIDTH + GAP_WIDTH) + 'px';
      cells[j].style.top = columnHeight + 'px';
      columnHeights[columnIndex] = columnHeight + GAP_HEIGHT + cells[j].offsetHeight;
      if (!reflow) {
        cells[j].className = 'cell ready';
      }
    }
    cellsContainer.style.height = getMaxVal(columnHeights) + 'px';
    manageCells();
  }
```

:::

3.但...看了这么久会觉得不多写点就有点对不住，所以有了第三种，根据窗口宽度与提供的默认列宽算出一个列数，然后根据这个列数去重定义列宽达到更好的填充效果。

::: details 3.为了更好填充而做的计算
  
  [MopTym/vue-waterfall](https://github.com/MopTym/vue-waterfall)
  
  这部分代码来自这个仓库，原作者还写了很多功能...只不过好大一部分并不是我想要的，过程把我看的麻麻的。

```ts

  //综下所述，我觉得，叫getCellsWidthAndColumCount更好
  //这个策略是算列数和每列的宽度，主要变量有...有好多。抄了！
  function getRowStrategy(width: number, options: WaterfallConfig) {
    let count = width / options.lineGap
    // 列数，利用默认值计算的，向下取整
    let slotWidth
    if (options.singleMaxWidth >= width) {
      count = 1
      slotWidth = Math.max(width, options.minLineGap)
      //如果元素宽度比窗口还大，直接一列，让元素宽取可以取到的最大
    } else {
      let maxContentWidth = options.maxLineGap *~~count
let minGreedyContentWidth = options.minLineGap* ~~(count + 1)
      //~~应该是取整的意思，这里计算出两个变量，最大最小的整体宽度
      let canFit = maxContentWidth >= width
      let canFitGreedy = minGreedyContentWidth <= width
      //...greedy，...做两个布尔值，然后是判断。
      if (canFit && canFitGreedy) {
        count = Math.round(count)//round四舍五入
        slotWidth = width / count//单元素宽度...再次赋值
      } else if (canFit) {
        count = ~~count
        slotWidth = width / count
      } else if (canFitGreedy) {
        count = ~~(count + 1)
        slotWidth = width / count
        //这两个else if，count取整一个向上一个向下，然后和上面一样计算单元素宽度
      } else {
        //最后这种...向下取整，宽度取最大
        count = ~~count
        slotWidth = options.maxLineGap
      }
      if (count === 1) {
        //如果算完了还是一列，那么宽度取最大
        slotWidth = Math.min(width, options.singleMaxWidth)
        slotWidth = Math.max(slotWidth, options.minLineGap)
      }
    }
    return {
      width: getArrayFillWith(slotWidth, count),//元素宽度...也许是为了grow的时候方便用的，也是可以删掉...
      count: count,//列数...重命名以下，columnCount
      left: 0,//如果你不用的话...把这个删了吧。
    }
  }

```

:::

## 瀑布流，web实现

是的...计算部分也没多少麻烦，但想要做成成品还要好大一段路...除了把计算后的数值塞回到节点style里，还有好多问题。\
就，比如，滚动懒加载，用户改变窗口大小......这些重新组织UI的过程可以做成动画，动画又怎么绑定...
>ps:而我现在在vue里做的时候...绝大部分时间都花在了代码拆分后重新组织通信上，毕竟我没那么熟悉这些...一路上踩了好多好多坑啊...

懒加载可以监听scroll事件进行高度计算，超过一定的值就加载，顺便把不在窗口内被划过去的dom解除一下。动画方面，这里是通过调html的className表示状态，然后相应状态写css动画。\
而为了避免一些鬼畜效果，调用各块函数的同时用setTimeout弄几个防抖也是需要的。

::: details lazy-load & css animation
 still come from [myst729/Waterfall](https://github.com/myst729/Waterfall)

```js
  let manageCells = function () {
    // Lock managing state to avoid another async call. See {Function} delayedScroll.
    managing = true;

    let cells = cellsContainer.children;
    let viewportTop = (document.body.scrollTop || document.documentElement.scrollTop) - cellsContainer.offsetTop;
    let viewportBottom = (window.innerHeight || document.documentElement.clientHeight) + viewportTop;

    // Remove cells' contents if they are too far away from the viewport. Get them back if they are near.
    // TODO: remove the cells from DOM should be better :<  :> :) :(
    for (let i = 0; i < cells.length; i++) {
      if ((cells[i].offsetTop - viewportBottom > THRESHOLD) || (viewportTop - cells[i].offsetTop - cells[i].offsetHeight > THRESHOLD)) {
        if (cells[i].className === 'cell ready') {
          cells[i].fragment = cells[i].innerHTML;
          cells[i].innerHTML = '';
          cells[i].className = 'cell shadow';
        }
      } else {
        if (cells[i].className === 'cell shadow') {
          cells[i].innerHTML = cells[i].fragment;
          cells[i].className = 'cell ready';
        }
      }
    }

    // If there's space in viewport for a cell, request new cells.
    if (viewportBottom > getMinVal(columnHeights)) {
      // Remove the if/else statement in your project, just call the appendCells function.
      if (isGithubDemo) {
        appendCellsDemo(columnCount);
      } else {
        appendCells(columnCount);
      }
    }

    // Unlock managing state.
    managing = false;
  };
```

```css
.pending {
  opacity: 0;
  transform: translateY(50px);
}
.ready {
  transition: 
    opacity 1s ease-in-out, 
    box-shadow 300ms ease-in-out, 
    left 700ms ease-in-out, 
    top 700ms ease-in-out, 
    transform 700ms ease-in-out;
}
.shadow {
  visibility: hidden;
}
```

:::

## 瀑布流，和vue有啥关系 && 绕圈圈

要说的话...没关系，你看上面用js手搓的效果都已经那么好了。也许写网页也是，用不用这些库和框架都无所谓...
>ps:我又了解了css里叫flex的一种布局，似乎...能很轻松的实现简单版本的瀑布流，就是那种一个个小方块那种...。但想要玩花的还是上js吧，css里写计算是真...。\
我想要学着生产的也许是一种错落的秩序，输入的内容依旧是长方形但同时利用这些内容的长与宽去打破完全的秩序，去制造些不一样的...东西。

只是这些家伙提供了一套工具与实践方法，啃它们，能做到更多。是的，我看着看着就飘了，我甚至想抄一个花瓣网或者Pinterest这样的东西出来。

但...我依旧不知道怎么写，这是个问题，有两条路，一个是写成小而精的库与工具，另一个是作为大项目的一部分直接丢上去，但这两者我目前功力都基本是0......。
想要小巧就别上vue,ts这些了...原生js能做到...

嗯，还是打算先vue+ts写一个简单的npm包。前天折腾了折腾大概知道包要怎么发了，github action也调通了，就差代码了。
...我终于开始写代码了，但我写的真烂...其实通都没通，ts也救不了的那种..........
也许这些...没什么意义。
也许好久之后才会有...

嗯，又过了一天大概算是搞通了。下一步有希望了 :yum
而且，写组件时的思考...————暴露什么样的接口，哪些又要收回到组件内部去控制...这些东西和我使用的框架暴露给我的那些..有些地方好像...

[why, some say, the moon？](../helloworld/why-the-moon.md/#why-some-say-the-moon)

### npm publish & github action

写这个包的时候...虽然没什么人用，但毕竟..万一有人看呢？我还是有意识的去控制暴露哪些东西，藏住哪些东西...也算是种自我审查吧。
又添加了一个对proxy，劫持，中介，代理......的理解...也是对封装的理解...?将输入输出流控制住，或者说一一登记记录，...就像...疫情防控一样...就可以对对象的控制更加的精准强力。

### component & props & emit & slot & store

这些部分...算是vue提供的，一种代码组织方式。尤其与原生js相比。

ps:update:看了一下午react的文档，我想转战react了————"超哦...我写vue的那个组件的时候想的事情，在react文档里被说出来了"(((等我消息

#### store

也许store应该摘出来bb一下，由于组件化对组件内数据做了一定的隔离，进而才有了props、emit，store这一类的，用于组件间重新通信的东西。而store...

### reactive... how it works, where it works

### css animation & vue's transition component

必须要v-if之类的进行触发就好憨...写个钩子搞变量解决了。

### javascript

#### Statements & Expressions & namespace & variable & pure function & lambda

1.Statements & Expressions
如果让现在的我来看...也许Expressions会是干净些的东西，而Statements则是暴力的...
Expressions是最基础的，数学的部分，这些代码会有一个...或者说可以自动的被化归为一个明确的值，返回值。比如1+1就是会被化为2.
而Statements远没有这么天经地义，还有很多名词都嫩让我想到这个东西...状态机，寄存器，记忆...嗯。经典的定义与赋值就属于Statements(是的，也许一开始都有的一个疑惑，编程里的单等号不是数学表示相等的等号而是“赋值”)，这是没法自动被化为一个值的，就是说，在这里我们需要手动自己去定义，创造东西，这也是我说它暴力的原因...质量嘛...肯定是比不过天经地义的那套的。但Statements依旧很好用，很tmd方便。

其实我又在react文档看到了这部分...useState弄出的东西被叫做组件的记忆，而为了代码的健壮，通常，我们要谨慎的设计、控制、最小化这一部分。

2.namespace & variable
[闭包 closure](https://zh.javascript.info/closure)
这里主要看到的是一个叫闭包的东西...就是，一种...权限管理？全局中的每一个函数，每一个小的代码块都可以访问全局的变量，以此类推代码块中的代码块中的代码块...可以随意的向上向外部环境访问变量，而外部则不能访问内部的变量。\
这里...茫然想起了刚学到C语言时，我发现的一个小东西，两个并列的for循环可以重复使用一个i变量，而如果套在一起，就要用ij两个。还有...在做xxx管理系统的时，我疑惑的在看传入函数的变量是指针还是数值...何时是直接修改变量何时是返回值，还有现在的js函数传递时带括号和不带括号...哦对了，返回值和计组里的PC也有关系。

3.pure function & lambda
pure function这个是我在尝试拆分函数的时候意识到作用的一个东西。有些函数会操作外部变量，这样...爽，但是相互耦合代码不容易分离，看的时候就不爽了。尤其是vue2中的this关键字获取vue实例，然后随之把各种东西不管是数据还是函数统统挂在这个实例上来回访问...还有直接有把整个vue实例在组件间传来传去的操作...爽是爽，但是...看了些东西之后尤其在我尝试拆解函数时，感觉这样有点坏...对，想要拆东西的时候，为什么要用一堆返回值，而不是操作变量，这些问题一下就清楚了，也能明白为什么要呢么操作了...

另外还有一个，关于写了一大推const xxx = =>这种箭头函数的问题...就是说...箭头函数是很好啦...但这样也不是很好...
[函数声明与函数表达式](https://zh.javascript.info/function-expressions)\
>什么时候选择函数声明与函数表达式？\
根据经验，当我们需要声明一个函数时，首先考虑函数声明语法。它能够为组织代码提供更多的灵活性。因为我们可以在声明这些函数之前调用这些函数。\
这对代码可读性也更好，因为在代码中查找 function f(…) {…} 比 let f = function(…) {…} 更容易。函数声明更“醒目”。\
……但是，如果由于某种原因而导致函数声明不适合我们（我们刚刚看过上面的例子），那么应该使用函数表达式。

[var的历史遗留](https://zh.javascript.info/var)
还有另另外一个，和用var声明变量时期一块的，用来简单实现私有空间，私有作用域的一个操作。\
IIFE\
在之前，JavaScript 中只有 var 这一种声明变量的方式，并且这种方式声明的变量没有块级作用域，程序员们就发明了一种模仿块级作用域的方法。这种方法被称为“立即调用函数表达式”（immediately-invoked function expressions，IIFE）。这里，创建了一个函数表达式并立即调用。因此，代码立即执行并拥有了自己的私有变量。\
之前给我看懵的的连写两个小括号的操作，就是这里...前一个是函数，后一个是即时传入的参数。

#### Recursion & Iteration

update:12-29
嗯...时隔好久我又来更新一下，或者说..填一下坑。
递归这个东西在在我刚接触编程算是让我头疼好久的一个...斐波那契、汉诺塔、小兔子跳...是的它本来就没那么简单。而它也与之后的栈堆、与多叉树与dfs都有关系。而今天...它与状态机，也会有关系。
常常把递归和另一个叫做迭代的放在一起比较，而如果要说两种有什么区别，最简单一个就是，在迭代中人可以利用自己对全局的掌控力直接规定好一切，而递归则...需要人去把很巧妙的让程序一点点自己摸完全局。
但有些工作即使是人也很难直接看穿，大部分递归的程序想要硬改成迭代更是需要人去做更多的工作...

##### 状态机。

程序，计算机提供的所以服务都能被看作是，状态机。

#### Promise && async & await && callback function

[从回调函数开始](https://zh.javascript.info/callbacks)
我这里主要是想写一个img.onload，让图片加载完再传数据到vue那边...然后就看到回调函数这一块了。
也许应该提一嘴的是函数名后面带不带括号的区别？一个是把函数的魂传过去，一个是直接调用。而回调...一般是传魂...吧。而这种传魂的，又叫高阶函数。另一种是直接调用的相互黏在一起的，可能...就是嵌套函数了吧，这里会牵扯到闭包一类的问题...

嗯，这里也是，看了好久...但好像卡的bug完全不是理解的问题而是一个脑残操作...我把Promise多包了一层。
但...看了总是好的嘛...\
一个想法，await只能在async function里写的原因，可能，如果await外部不是一个async function，不返回一个Promise，那在里层await其实是白写的，如果外层不是async，到外面那一层的时候异步，等待就全都丢了直接把null undefined传出去也是有可能的...吧...\
Promise是用来让回调函数好看的，用.then来解决回调函数写起来的嵌套和右移问题。
而async & await，主要是await,await是对.then的简写...
而有关原理，Promise如字面一样是种保证...await和迭代器有关.......现在好像对我没什么用。

再再另外有关函数执行顺序的，时间循环...v8引擎，函数栈啊，微任务宏任务的队列啊...我也是看了一堆，但目前也是没用。

#### object

...说起来，也是在我搞不定img.onload的那个破玩意的时候瞎看的一堆，js的面向对象....
该有的应该都不少。只是现在前端好像都不太喜欢用这一部分的东西了......
我真的看到面向对象的意思时，是java里的那一堆，java bean，model，vo，bo，po，pojo，dto，dao....这里面的o全都是object。。。所以叫tmd面向对象。
工厂模式，构造函数...\
构造函数，实例与原型，它们三个是有关系的。\
原型链。原型链现在好像还会时不时提到...
————原型对象其实也是普通的对象。几乎所有的对象都可能是原型对象，也可能是实例对象，而且还可以同时是原型对象与实例对象。这样的一个对象，正是构成原型链的一个节点。因此理解了原型，那么原型链并不是一个多么复杂的概念。
确实，根本不用看，看名字就知道了。类似继承那一类的东西。

crud ...
c ->set
r ->get
u->set+get
d->set+get

### typescript

vue's bug\
props + ts不能写 withDefault....那个issue开了有一年多了还没修。

但说真的...我这里面没用多少typescript...

### css's flex & grid layout

嗯...其实一路过来也看了好多别的操作，css的flex和grid布局之类的...但是如果要写的话，有一部分计算是规避不掉的，那就是维护那个用于储存每一列的高度的数组，这个数组同时也是支持后续懒加载的关键。

[pure css,grid,waterfall](https://www.smashingmagazine.com/native-css-masonry-layout-css-grid)

嗯，grid能做到很多了，看了看，如果用的话估计能省下不少憨批代码...但，真的想玩骚操作还得上js。

啊...这些都好傻逼...不对，我是想说这些原来这么简单...傻逼的是我。

### 优化。啊

嗯...其实是今天复习...或者说预习操作系统的时候，看见了一个叫“缺页”的操作，通过虚拟内存这个东西来让计算机运行的更加高效。而在瀑布流这部分代码里...有，或者，可以有一个相似的操作，那就是，把鼠标滚过去的、不再在可视区之内的元素取消渲染，等滚回去之后才再次渲染。\
另外，如果第一次打开页面没有加载出滚动条，就是元素不够多的时候...我写的布局会的懒加载功能会直接停工...但这个bug也提醒了我另一个bug，就是首次加载宽度不正确（过大）的问题，可能也和滚动条有关...所以...其实那200行的代码我还没抄完，比如，按照计算出的行数去获取需要新加载的元素个数。这部分函数如果要写...那我写的那个组件还需要把行数的计算结果也返回给App或者pages组件，用emits之类的。这部分写完了也许可以解决很多，包括首屏过慢的问题。再另外...写防抖...写handler...\
不想动......

### 下一步工作...

对，应该考虑下一步做什么，现在的功能...其实有点单调...
要不要做一个点击图片就弹出一个新图层把图片放大展示的？
再或像pinterset一样，点击图片后直接跳转到新页面然后刷新推荐....这个估计不行，需要后端整活，搞推荐算法什么的...
嗯...我想做的也不只是这之内的...\
而在我想要修bug的时候...我真怀疑自己做这些的意义。我又去看了看Pinterest，直接一个固定236px的列宽效果就已经够好了，而在超大的屏幕展示上...[那点](vue-waterfall.md/#瀑布流计算部分)优化根本没啥意义...是的，给出了一个方向，但是...也许会有别的起作用的方式，但这样现在这样，并没有什么意义。\
另一方面，在写法上，vue提供的单组件与模板语法等等...也看不出优势，因为这个功能内部就是需要复杂数据交换，拆组件拆函数...说真的，等想要添新功能的时候，一样无从下手...\
可能是我的原因，反正也是第一次做..但也许有更好的实现方式，也许vue提供的语法与这个功能本来就没有那么合拍...

## 别看，废案，错误百出(~~虽然上面也一样~~)

::: details 啥都没干就瞎bb的部分

### 1.工程问题

瀑布流其实也是一个经典的item in items的玩意，通常，代码方面对这玩意设计就是，对单个item写一个组件，对items写一个组件。
这里要使用到的两个比较重要的东西一个是props，一个是插槽 slot...也许还要再提前说一下组件。

vue2，里面很重要的一个东西叫组件，就像面向对象的类一样，它们也可以有叫做 parent-child 的关系，但与面向对象的继承不太一样，组件中这种关系叫做“注册”，小组件引入、注册到大组件之中——这里的大组件在最后是要直接展示起作用的。而面向对象中的父类可能只是搭个架子，并不会被实例化，最后干活的是子类。

props，使用的时候，一般是作为子组件的那个组件里的 props。那是给父组件开的一个接口，从父那里拿数据传到子组件，经过子组件处理后展示在子组件的 template 里，然后再由父组件调用、一整个展示。嗯，一个子组件可以有许多个父组件，给哪个用都行，这样就把一个小功能块拆了出了，方便复用。

slot，插槽，也是我在这一次新学到的一个用法。
  如果不使用插槽，一个item in items的操作通常要将item组件放在items组件里组合好了再把items再交出去给别人用。
  虽然不知道这样有什么不好...但是就是想要拆一拆。

  但如果用插槽...
  item组件写好props开插槽
  items组件也是一样写好props开插槽
  直接交出去这两个，组合交给后边去做

  在pages里引入并调用时，items组件的插槽位置里放的就是item
  而item的插槽会放进具体的需要个性化定制的玩意，....好像items也可以在这里进行一些定制...
  对，组合全都发生在了pages中。
  定制与数据传输绑定也是，这些全都在pages的组合组件中去写，可以直接传给单个的item。
  而，如果没有插槽，就不能在pages中直接碰到item。

组件的循环与递归。
我是觉得我选的有点巧...瀑布流是用了vue的v-for指令来排item组件，而隔壁的多级评论用的是组件递归。刚好一种一个。vue提供的写法也是真优雅...

### 2.那，就从数据设计开始吧

大组件的props。
瀑布流配置选项
    autoResize: 一个boolean，关键字段，是否开启自动适应窗口改变UI
    interval: {防抖时间间隔，默认200ms
    lineGap: {列间隔
    minLineGap: {最小最大列间隔
    maxLineGap: {
    singleMaxWidth: {单个元素的最大宽度
    fixedHeight: {固定高度

align这个值和getLeft这个函数有关...
为啥我觉得这函数没啥用...
left貌似才是默认选项...就是不做处理。
嗯...这个left意味蛮深的，用于计算虚拟矩形的位置的...为什么不直接写死啊，这么点差别这么多信息，值得么？
嗯，删了。又少了好几十行。这样的话...9个选项。

....为啥一加载右边就弹出一个空白条了...
不管了。以后再说。

子组件的props，数据传入。item由
    width:
    height:
    order:
    moveClass:

高与宽度都是getItem给的，order是vue自动生成的index...这个就很魔性，开发者工具检查就找不到这个数值。
moveClass: 是css动画。但...先删了算了

在小组件的create钩子中，有虚拟矩形的初始值。
    this.rect = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    }
这个虚拟矩形会由大组件计算出来，再传回给小组件，最后通过绑定到小组件div标签的css样式实现展示。

这是原始矩形。除了必要的计算数据。随之一并给出的还有vm，node....
    getMeta() {
      return {
        vm: this,
        node: this.$el,
        order: this.order,
        width: this.width,
        height: this.height,
        moveClass: this.moveClass,
      }

### 3.好了，再看看两个组件...也许还得加上pages，三个组件的数据流

pages里传入数据，数据分为两种，一种是瀑布流配置选项，一种是流入的..需要处理展示的数据。
配置选项自然直接给到了大组件，而而由于某种拆分的执念，需要处理、展示的数据是直接进入到小组件之中的...但数据处理的大头依旧在大组件。
所以，小组件拿到数据后要给到大组件，大组件通过计算后，传回给小组件一串css代码（...或者说直接把小组件的node拿到手然后狂暴轰入），小组件再把这个给到自己的标签样式上，实现大小的控制。

嗯，具体的数据流通如何实现？
props不必说。
而metas的传输是大组件粗暴的直接调用子组件的getMeta方法
let metas = $children(this).map((slot) => slot.getMeta())
处理后的数据，粗暴的传入metas[i].node.style。传过去的node也许就是为了这里...

好了，这部分大概也可以结束了

#### 3.1状态

小组件的
notify() {
      $emit(this.$parent, 'reflow', this)
},
对应的是大组件的
    $on(this, 'reflow', () => {
      this.reflowHandler()
    })
这个...很重要。但这样的话..是每个小组件都会调用一次reflowHandler？
嗯。没错。这也太。。。害。

另一个与多次加载还有...isShow掩藏实在界有关，是大组件里的
    $emit(this, 'reflowed')
为什么这个时间没有on去声明就可以用...
删掉这一行会让懒加载只能用一次。
删掉pages标签上的也会让懒加载只能用一次。。。
好吧。这个emit就是大组件给大大组件的。
是pages里的函数。addItems会把isBusy设为true需要在reflowed这里把isBusy改回false才可以reflow。

好吧。都不是大问题。

### 4.好像大概看懂了

我寻思。可以开始自己整了。
组件通信根本不需要this。虽然这一路看下来...他们this用的很爽。。
eventbus也根本不需要on off once直接emit，就完了
发布订阅的三个选项（instance，event_name（key），function）
————————————————————————

### 5.vue在这过程中提供了什么？干了什么？

——————————————————————

### 6.还有核心的，那一大坨做计算的函数

算了...看结构
methods里写了三个函数，但只写了名字...大概是方便用vue的this调用

reflowHandler和时间，token有关...算是个封装。
interval是个防抖的时限？默认200ms。而reflowHandler给出的token就是200ms内一次reflow...大概。
嗯，确实，除了reflowHandler自己，没有直接调用reflow的地方。
就是说...mothods里写的reflow只用了这一个地方。

autoResizeHandler看到窗口变化也要调reflowHandler。

tidyUpAnimations
getTransitionEndEvent
两个和动画效果相关的。
之前几个地方的moveClass也是与动画效果有关...

好了，到reflow了。
这算是一个...调用集中点。
常规的获取窗口宽度calculate计算得到排布方式...除此之外

使用了一个叫metas的玩意去作为中介...
let metas = this.$children.map((slot) => slot.getMeta())
还有之前在子组件里的getMeta，返回了order，长宽，node节点等子组件的信息。
这个metas的数据几乎...贯穿全部。

另外this也并没有消失，而是传入给了后边的函数，通常是写作vm。
getOptions这个方法里是最多的。而这里，return了一串props里的数据，有关大组件的排布的....
又是一次封装...
在calculate中，getOptions拿到排布数据，传给更具体的处理机制，然后，...就是计算了，终于到tmd计算了。
verticalLineProcessor 和 另一个horizontal什么的...
还有tmd   getRowStrategy
getGreedyCount...

这里有一种二分，那就是rect和meta。meta是原始大小，rect是通过计算后、真正会展示出的大小。

瀑布流，简单的版本主要是维护一个数组，数组存的是每一列的高度，每次新增在高度最小的那一列填。
有关列数，如果是平常简单的设计...直接把元素大小固定，拿到窗口大小后两个做个除法得到一个变量就可以了，得到这个值就是要排的列数。或者更懒一点直接把列数写死也没问题。
可是这里很细..很tmd细，也很tmd让人头疼。但不算怎样效果是很惊艳丝滑的，会根据窗口大小去同时计算元素大小和列数，做到很炫酷的即时填充，再加上动画简直太酷了。而，这是通过加了一堆函数，还有rect这个变量作为中介来实现的。

如果metas是虚拟矩形...
真的需要这么多吗...
也许需要吧...

好了，看完了，差不多。还行。

### 7.重做的话，要做的是

建好文件，用vue3重写那些东西...props，emits。
还有在各个组件内部的那些方法。

再然后是，用this.xxx这种方法调用函数的又是什么...
如果不用vue的this，函数相互调用组合...怎么组合？写成一大堆const 字符串，里面放箭头函数？这还是在一个文件里...
拆出utils...还是另一回事。

还有一串串的函数的内部结构。
用ts改....可能也是一堆麻烦事。但不是现在要考虑的。

还是好难...嘤嘤嘤
该学js了。
好。终于有需求了。

:::
