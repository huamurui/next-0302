---
title: css-layout
icon: config
date: 2022-12-16
tag:
  - css
---

update: 2023-01-29\
我看看直接的html文件能不能被发布上去...\
[css-responsive-layouts](./img/css-responsive-layout.html)
..好吧不可以。。
突然想自己弄一个 web-awesome 的仓库，然后用 github page 来丢。

嘶...codepen是不是已经算是了。。

::: normal-demo grid-layout

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>

    .Container {
      display: grid;
      width: 100%;
      height: 100%;
      grid-template-columns: repeat(4,1fr);
      /* bad */
      /* grid-template-rows: 1fr 2fr 4fr 1fr; */
      grid-template-rows: 10vw 20vw 40vw 10vw;
      /* naming the line */
      /* grid-template-rows: [header-start] 100px [header-end] 200px 400px 100px; */
      gap:2vw;
      /* naming area. Cooooool! */
      /* grid-template-areas: "head head head head"
                           "box box box side"
                           "main main main side"
                           "footer footer footer footer" */
    }
    .box {
      background-color: blueviolet;
      grid-row:2/3
    }

  </style>
</head>
<body>
  <div class="Container">
    <header class="header" style="background-color: blueviolet; grid-row: 1/2;grid-column: 1/5;">header</header>
      <div class="box" style="grid-row: 2/3;grid-column:1/2">box1</div>
      <div class="box" style="grid-row: 2/3;grid-column:2/3">box2</div>
      <div class="box" style="grid-row: 2/3;grid-column:3/4">box3</div>
      <div class="sidebar" style="background-color: blueviolet; grid-column:4/5; grid-row: 2/4">sidebar</div>
      <div class="main" style="background-color: blueviolet; grid-row: 3/4;grid-column:1/4">main</div>
    <footer class="footer"  style="background-color: blueviolet; grid-row: 4/5;grid-column: 1/5;">footer</footer>
  </div>
</body>
</html>
```

:::

::: normal-demo flex-layout

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    * {
      margin:0;
      padding:0;
      box-sizing:border-box;
    }
    .container {
      background-color: #ccc;
      width: 100%;
      padding:10px;

      display: flex;
      flex-direction: row;
      justify-content:space-between;
      
      flex-wrap: wrap;
      
    }
    .item {
      background-color: orchid;
      font-size: 30px;
      color:#fff;
      /* width: 100px;
      height: 100px; */
      padding:30px;
      margin:30px;
    }
    .item--1 {
      flex-grow: 2;
      flex-shrink: 2;
      flex-basis: 1;
    }
  </style>
</head>
<body>
  <!-- .container>.item.item--$*10 -->
  <div class="container">
    <div class="item item--1">1</div>
    <div class="item item--2">2</div>
    <div class="item item--3">3</div>
    <div class="item item--4">4</div>
    <div class="item item--5">5</div>
    <div class="item item--6">6</div>
    <div class="item item--7">7</div>
    <div class="item item--8">8</div>
    <div class="item item--9">9</div>
    <div class="item item--0">0</div>
  </div>
</body>
</html>
```

:::
