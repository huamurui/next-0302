---
title: 工程化
icon: creative
date: 2023-02-23
category:
  - 记录
  - 日记
---

嗯...是让我比较郁闷、羞耻的一个东西。

郁闷是老是搞不对搞不通，羞耻是看着自己以前弄得那几个玩意...怎么说呢，像那种过家家的，p 用没有，形式都不对，根本没进到门槛但是又做样子...
——杀了我吧.jpg

我会把 iief 和 commonjs 的一些小的片段改成 esmodule ，会拆分一些代码；但是真的面对那些工具的时候...还是很懵。

vite 打包，用 pnpm 做 monorepo，还有当我遇到今天的 bug 的时候...我发我连最简单的 js 脚本引入都没了解全。(还有少不了的日常把 src 写成 scr)

---

从[联网游戏](https://github.com/sgoedecke/socket-io-game/blob/master/BLOG.md)开始.

客户端要做的是，把服务器发来的数据渲染到 canvas 上，然后把用户的输入发送给服务器。而服务端要做的是，把用户的输入转换成游戏的状态，然后把状态发送给客户端。

前端负责渲染、接受输入，后端负责计算。这是一个典型的前后端分离的场景。从脑子里想一点问题都没有，但是我即使是只是单纯的把把那个游戏改成现代的模块形式，也...tmd一堆坑，删那两个jQuery(也是最近才知道，它在以前主要是解决浏览器兼容的问题...)倒是挺简单。而也许后面还有网速、帧数、延迟、同步等等的问题，但是我现在...不是我要考虑的问题。
<details>
<summary>工程化or轮子化</summary>

[这就是前端的整体风气，整体工程化水平低，标准不统一，每个人都以造轮子为荣，工具多到发指，却没几个好用的。舍本逐末。比如：小A的项目，页面状态不多，逻辑也不复杂。他在网上看见了redux很nb，很高端。很想学一下，他给自己的项目强行引入了redux。做完以后对自己一知半解的redux沾沾自喜，简历中也浓墨重彩的填上了，利用redux实现状态管理...... 看似很完美，但是他损失的是什么呢？他损失的是对项目整体最小复杂度判断的直觉，整体风险评估的能力，工具的适应场景边界的判断力。这些品质在他作为初级码农的时候可能无足轻重。](https://www.zhihu.com/question/441533092/answer/2572060475)

</details>

具体的，服务端依赖 socket-io 这个库，客户端要 socket-io-client.

nodejs 服务端怎么打包...？webpack 好像就可以。这又提醒了我一个事，前端打包后交付给一个http服务器挂到网络上，而后端直接就是要起一个服务。前后端不分离的时候，甚至直接是，后端一块把打好的静态文件丢到服务上...

[nestjs打包](https://juejin.cn/post/7065724860688760862)

...之前刷到一个这个的...

nodejs 并不打包，而都是到服务器上安装依赖然后直接运行？顶多搞个pm2管理下进程...我想rnm退钱了...

一些全家桶像 nuxt的ssr 或者上面的 nest(这个有风险...)，或者是 strapi 能控制依赖的种类的还会专门写个打包命令...这种框架大概都是扩展性很差的，但其他的那些...可能就不得行了。

不是，都是个圈，为啥 java 他们能打包。哦。。好像出了个 ncc 的东西，能打成二进制。

---

好像前端一直都在和兼容作斗争...之前是浏览器大战、多端适配......今天是自己的工具链——js ts， commonjs 和 esmodule 相互引，一堆坑。

有点累了...这都啥啊。不想弄...这是纯粹的形式、工程问题。有趣的点子就只有那一小块，却要为此...搞那么一大坨。可能都要做，只是...好难。这不是学会操作系统的复杂...更多的，好像是，繁杂，要一遍遍的踩，虽说实践很棒...但这好难熬...
