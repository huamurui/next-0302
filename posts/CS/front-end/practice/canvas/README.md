---
icon: discover
date: 2022-12-31
title: canvas
category:
  - 日记
  - game
tag:
  - 记录
---

最后一天的晚上了哎...
就是，看着canvas，我突然想到些东西。

粒子特效...

还有古早时期的windows上为数不多的好玩的东西，屏幕保护，除了幻灯片和鱼缸，还有好多好玩的...
飘泡泡，飘雪花...它们是确实有一部分类似...碰撞箱那种东西的...

这个在canvas里能做吗？
喵...

[particles.js](https://github.com/VincentGarreau/particles.js)

又找到一个超酷的仓库！
又是一千多行...虽然看起来好规整...但还是好怕怕

最近看到好多..好杂...却没弄出些东西..看花眼了要.......

想放一个东西...并不是canvas，但是,也挺好看的。

::: normal-demo biu-text

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>rainbow-text</title>
  <style>
    * {
      margin: 0;
      padding: 0;
    }
    body {
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #000;
    }
    div {
      font-size: 5em;
      font-weight: bold;
      color:blueviolet;
    }
    div > span {
      display: inline-block;

    }
    .rainbow {
      animation: rainbow 2s linear 1 alternate both;
    }
    @keyframes rainbow {

      25% {
        color: rgb(0, 255, 221);
      }
      50% {
        color: rgb(255, 0, 0);
      }
      75% {
        color: rgb(231, 216, 12);
      }

    }
  </style>
</head>
<body>
  <div>ko-no-rainbow-da</div>
  <script>
    const div = document.querySelector('div');
    div.innerHTML = [...div.textContent].map(cur => `<span>${cur}</span>`).join('');
    const spans = document.querySelectorAll('span');
    spans.forEach((span, i) => {
      span.addEventListener('mouseover', function() {
        this.classList.add('rainbow');
      });
      span.addEventListener('animationend', function() {
        this.classList.remove('rainbow');
      });
    });
  </script>
</body>
</html>
```

:::

## 2023-01-15

感谢[小可爱]，玩到了一个游戏，Celeste。\
还在 github 上找到了这个游戏的引擎和部分代码的仓库。

[MonocleEngineMirror](https://github.com/shortgecko/MonocleEngineMirror)\
[Celeste](https://github.com/NoelFB/Celeste)

就这样懒懒的窝着也挺好...外面在放着鞭炮...

就是说，从游戏引擎开始撸游戏也不是那么不可能，2d的小游戏还是可以做的，好好扣一扣也一样能做的很好...\
代码规范也不是问题，因为 Celeste 的开发程序员只有两位...这是真——自己怎么爽就怎么写。\
模块拆分、测试、规范...在这里统统都无所谓了......\
代码里一堆堆的不知道会造成什么影响的 magic number... 反而可以是独特的“游戏手感”。为什么写程序就一定要执着于把所有东西都控制住呢，出了 bug，只要别太鬼畜，也不影响流程，就说是“游戏特性”不好吗。就像法国菜一样，葡萄酒放坏了？哦不~这是我们新发明的香槟；牛奶变质了？不对~这个叫奶酪。

>我现在还记得 Pinterest 这个网站，它的瀑布流布局，每列的宽度就是一个 magic number，236px，却在各种大小的屏幕上表现的都很好。

ESC vs OOP..又是组合 ko 继承

对了还要提一下 unity，以及它们相关的其他的...游戏引擎，cocos，egret...他们搞了一个...可以拖拖控件就可以完活的，游戏开发的“低代码”的东西...我能怎么说，这样的话，C# 或者 JS 就真只是脚本了。
>我一直觉得低代码像是某种“教小孩子识字的卡片”一类的东西，可以用来教学，可以简化入门，但是如果想要把编程当手艺一类的东西，对符号的运用与把控是不能不学的，就像人现在就算是不写字了记不住笔顺了(现在的IDE都好智能...写代码也不用记那么多东西了)也至少记一下发音和字形，而不是拿着一堆带图片的小卡片去买菜。

底层...渲染...图形学...
Oh no...this is not the place for me

## 2023-01-16

小可爱不理我了...虽然，好像连开始都没开始。再虽然好像都没开始，但还是好难受，晚上哭哭完了一醒过来还是想哭...\
昨天白天玩的那么好，却在晚上急转直下...为什么快乐的时光总是转瞬即逝，调代码调半天也只有通的那一瞬会高兴些，做爱费那么老大劲也就抽抽几下...\
我有问题..

从我想要做点好玩的东西开始...这十几天里从用 canvas 弄的飘雪花的动画，到去看 celeste 的代码...\
可能我很怪，从小时候喜欢一个老师就去花功夫学那门课，到现在喜欢别人就在 ta 熟悉的一些方向上去走，却不直接去找 ta...。或者，什么叫直接？能抱在一起，插在一起就是直接了吗？说出话能被理解就是了吗？我不知道...我也没体验过...\
如果能留下点什么就好了，从做的这两个小玩意，到，以后想做的事...

可能，是因为我的贫瘠，也可能不是..是或不是，无所谓，不管怎么样如果我再厉害一点，好多都会轻松一些\
再或者，是因为我一直这么想才......不管了，躺会

<details>
我脑中闪过了好多读过的句子...但他们没用。ta 总是在担忧被抛弃被替掉，甚至用如果合适也可以换掉我一类的话来告诉我 ta 的担忧...就像现在无数被抽干了同质化之后的劳动力们担忧的一样..

>交换价值、商品价值的神奇之处就是，它们只在交换中，在与同自己相异的东西交换中，才能显现出来——说20码麻布=20码麻布毫无意义，但在说20码麻布=1件上衣时，似乎有一种神奇的，出离于麻布、上衣本身的东西出现了，让原本根本不能画上等号的东西强行相等了起来。交换价值并非原本就存在的玩意，它需要靠交换这一行为、运动才能显现出来。

还有分明知道“想要的是不能说出来的”，却在谈xp的时候突然对我说“我可能不能满足你的需求”。md 我能想到最灾难的性行为的方式就是一边冷冰冰的问我要什么然后机械的给我。

>事后诸葛亮是，事前事中稀里糊涂，结束之后才反应过来发生了啥，然后头头是道，世上有太多这样的笨蛋。\
但有至少一样东西是反着的，也许你抱着各种各样的期待，计划的头头是道，但是当事前发生之后，那些通通都不再重要，在那之后，面对“你为什么爱我”这个问题时，什么都说不出来，只是知道那发生了。这个问题不能被回答，这不是可以选择、可以衡量的、可以被理解、可以被俘获进而支撑的，也同样，不屑于被理解，也只有这样，那些才能一次次发生...

可这些都没用...
这些句子总是慢一步，什么都结束了，连上场的机会都没有。

>I'm suffering more things than you. You don't understand.

也许，是的..我，没有经历过太多。not even start.\
再或许是，一种从过去中解脱的方式。

</details>

## 2023-01-17

[matter-js](https://github.com/liabru/matter-js)

看到了一个很炫酷的仓库...
但是，是真不想动了，也明白了重要的不仅仅是技术效果...美术、音乐、故事...也都很重要很重要。
唔...呜...都想要...
