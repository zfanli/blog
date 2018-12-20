---
title: CSS3 布局神器 - Flexbox
subtitle: Flexbox 为我们提供了一种新的、灵活的布局方式。
date: 2018-02-08 21:12:06 +0800
lastUpdateTime: 2018-12-20 13:01:37 +0800
tags:
  - CSS
---

为了方便构筑前端 UI，时隔几个月我再次看起了流行的 CSS 框架 Bootstrap 的文档，发现和之前我看的时候相比，Bootstrap 已经升级了一个版本，而在新版本中摒弃了之前的 CSS + DIV 盒子的布局方式，转而全面使用起了 Flexbox 的布局。

在一番了解之后得知，Flexbox 布局更加灵活方便，在 DIV 盒子时代的很多布局痛点在 Flexbox 中都有了完美的解决方案。这篇文章是我查阅资料时对 Flexbox 的概念和使用方法做的一些笔记和总结，以方便日后回顾。

---

### 参考文档

对于 Flexbox 布局方式，Bootstrap 官方推荐的文章是 [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#flexbox-background)。这是一篇很全面的文章，但是通篇英文可能不是很好理解。

一番搜索之下找到了一篇优质的且有中文译文的文章。这是文章原文的链接：[Understanding Flexbox: Everything you need to know](https://medium.freecodecamp.org/understanding-flexbox-everything-you-need-to-know-b4013d4dc9af)。感谢作者 Ohans Emmanuel 的分享。

这是来自大漠的中文译文：[理解 Flexbox：你需要知道的一切](https://www.w3cplus.com/css3/understanding-flexbox-everything-you-need-to-know.html)。这篇文章足以让我们对 Flexbox 的概念和用法有一个全面的了解。

---

### 速记

关键点的笔记。

**如何声明 Flexbox？**

给 Container 元素添加 CSS 属性 `display: flex` 或 `display: inline-flex`，即声明这个元素启动 Flexbox 布局。`inline-flex` 指对元素内进行 `flex` 布局，对元素外是 `inline` 布局。

```css
.container {
  display: flex;
}
/* 或者 */
.container {
  display: inline-flex;
}
```

设置了 `flex` 属性之后，这个容器内的所有直属后代元素都将处于 Flexbox 布局中，所以这个父容器可以称作 Flex Container，而它的后代可以称作 Flex Items。

**Flex Container 的可用属性有哪些？大致有以下这些！**

```css
.container {
  display: flex;
  /* flex 布局方向 */
  flex-direction: row;
  /* flex 布局是否允许换行 */
  flex-wrap: nowrap;
  /* direction 和 wrap 的速记属性 */
  flex-flow: row nowrap;
  /* 水平方向控制对齐方式 */
  justify-content: flex-start;
  /* 垂直方向控制对齐方式 */
  align-items: flex-start;
  /* 多行情况下垂直方向控制对齐方式 */
  align-content: flex-start;
}
```

**flex-direction**

父容器设定 flex-direction 属性来规定其子元素的排列方式。默认是`row`，即水平排列。

```css
.container {
  display: flex;
  flex-direction: row;
}
```

以下是可选值。

| row  | column | row-reverse          | column-reverse       |
| ---- | ------ | -------------------- | -------------------- |
| 水平 | 垂直   | 反向水平（自右向左） | 反向垂直（自下向上） |

**flex-wrap**

是否允许换行。默认是`nowrap`，不换行。

```css
.container {
  display: flex;
  flex-wrap: nowrap;
}
```

以下是可选值。

| wrap | nowrap | wrap-reverse     |
| ---- | ------ | ---------------- |
| 换行 | 不换行 | 换行（向上堆砌） |

**flex-flow**

flex-flow 是上面两个属性的速记属性。

用例如下。

```css
.container {
  display: flex;
  flex-flow: row wrap;
}
```

**justify-content**

基于行的对齐方式，类似于`align-text`属性。

```css
.container {
  display: flex;
  /* 此时 flex-direction 默认为 row（行）  */
  /* 控制水平方向的对齐方式 */
  justify-content: flex-start;
}
```

> 注意！`justify-content`属性的作用对象是 Main-Axis。而 Main-Axis 在`Flex-direction`属性不同的情况下表现的行为不同。记住它的调整参照是 Main-Axis，在`row`方向的情况是对行的排列方式进行调整，而在`column`方向时调整的是垂直的列。之后介绍的`align-items`属性也是一样的。

```css
.container {
  display: flex;
  flex-direction: column;
  /* 由于 flex-direction 为 column（列） */
  /* 此时 justify-content 控制垂直方向的对齐方式 */
  justify-content: flex-start;
}
```

以下是可选值。

| flex-start         | flex-end           | center | space-between                      | space-around       |
| ------------------ | ------------------ | ------ | ---------------------------------- | ------------------ |
| 居左（垂直时居上） | 居右（垂直时居下） | 居中   | 项目等间距隔开（最左及最右无间距） | 项目左右等间距隔开 |

**align-items**

Cross-Axis 上的调整。`row`表示时调整垂直方向，`column`表示时调整水平方向。

```css
.container {
  display: flex;
  /* 此时 flex-direction 默认为 row（行）  */
  /* 控制垂直方向的对齐方式 */
  align-items: flex-start;
}
```

```css
.container {
  display: flex;
  flex-direction: column;
  /* 由于 flex-direction 为 column（列） */
  /* 此时 align-items 控制水平方向的对齐方式 */
  align-items: flex-start;
}
```

以下是可选值。默认值是`stretch`，拉伸。

| flex-start   | flex-end     | center | stretch | baseline       |
| ------------ | ------------ | ------ | ------- | -------------- |
| 居上（居左） | 居下（居右） | 居中   | 伸展    | 基线（第一行） |

**align-content**

效果和上面的属性一致，但是作用对象是多行的 Flex 容器，换句话说是 Flex 整体的调整。

```css
.container {
  display: flex;
  align-content: flex-start;
}
```

上面是所有的容器的属性。针对一个容器内的所有子元素起效。

**Flex 项目的属性呢？大致如下！**

```css
.item {
  /* 控制项目的显示顺序 */
  order: 1;
  /* 控制自动适应填充宽度（仅控制变大） */
  flex-grow: 0;
  /* 控制自动使用收缩宽度（仅控制变小） */
  flex-shrink: 0;
  /* 控制初始大小（需要带单位） */
  flex-basis: auto;
  /* grow，shrink，basis 的一个速记属性 */
  flex: 0 0 auto;
  /* 单独调整这个元素的水平对齐方式 */
  justify-self: flex-start;
  /* 单独调整这个元素的垂直对齐方式 */
  align-self: flex-start;
}
```

Flex 项目有一些神奇的属性。这些属性只对该元素本身起作用。

**order**

不修改 HTML 源代码的情况下，修改项目显示的顺序。默认值为 `0`。

该属性接收数值参数，根据数值大小做出调整，可以想象 `z-index` 的模式。

通常情况下，不设置 `order` 属性时，所有项目的 `order` 默认为 0，画面将按照 HTML 结构从上到下渲染显示。

但是存在 `order` 属性的情况下，画面显示时将先考虑 `order` 值的大小做出判断，值越靠前则显示越靠前。在 `order` 值相等的情况下，按照 HTML 结构上下顺序优先显示先解析的。

```html
<div class="b">Class b</div>
<div class="a">Class a</div>
<div class="c">Class c</div>
```

```css
.a {
  order: 1;
}
.b {
  order: 2;
}
.c {
  order: 2;
}
```

// TODO 效果展示

**flex-grow & flex-shrink & flex-basis**

这三个可以一起说了。

`flex-grow` 的默认值为 `0`，表示默认不会填充满宽度（`row` 显示时）。

`flex-grow` 接收数值作为参数，数值的大小具有意义。当一行存在多个项目时，同时开启 `flex-grow` 属性时，这些项目将根据该属性的值分配宽度。

例如一行存在两个 DIV，A 和 B，A 的 `flex-grow` 值为 2，B 为 1。

则在显示时宽度一分为三，三分之二宽度分配个 A，剩下三分之一分配给 B。

```html
<div class="a">Class a</div>
<div class="b">Class b</div>
```

```css
.a {
  flex-grow: 2;
}
.b {
  flex-grow: 1;
}
```

// TODO 效果展示

`flex-shrink` 接收数值作为参数，但是数值仅作为开关。默认为 `1`，开启收缩。此时当宽度较小时会收缩子元素的宽度来保证完全显示所有元素。当其值为 `0` 时，宽度不会自动适应，即使宽度超过容器最大宽度。

```css
.a {
  flex-shrink: 1;
}
```

`flex-basis` 指定项目的初始大小。取值可以有各种单位，`px` 或 `%` 等。但是注意即使值是 `0` 也要写上单位，如 `0px`。它的默认值是 `auto`。这时项目的宽度根据内容的长度计算。

使用 `flex-basis` 可以固定项目的宽度。

```css
.a {
  flex-basis： 150px；
}
```

上面三个属性有一个速记方法。

**flex**

用例。

```css
.a {
  flex: 0 1 auto;
}
```

记住**GSB**。第一个值是 grow，第二个是 shrink，最后一个是 basis。

有一些组合。

```css
.a {
  flex: none;
  /* 等同于 */
  flex: 0 0 auto;
}
```

```css
.a {
  flex: auto;
  /* 等同于 */
  flex: 1 1 auto;
}
```

**justify-self & align-self**

效果和父元素的 `justify-content` 和 `align-items` 属性是完全一样的，不同之处在于，这个属性是对子元素自身设置的，并且仅会对这个元素产生作用，**不影响到其他元素**！

```css
.a {
  align-self: flex-start;
}
```

### margin: auto

之前我们使用`margin: auto`来让一个块状元素居中显示。但是在这里它可能会出错。因为实现它的原理是将剩余的空间均匀分配到元素的两边。

但是由此可以很方便的做出一些布局。

我么可以单独使用`margin-right: auto`，将右边剩余的空白分配到该元素的右边，让它鹤立鸡群。

**但是要注意，使用了`margin: auto`进行自动对齐的话，`justify-content`将不再起作用！**

// TODO 效果展示

### 总结

我们从如何声明一个 Flexbox 容器开始介绍了 Flex 容器和子项目的属性及其效果。

对于 Flex 容器我们介绍了：

1. 设置 `display` 属性的值为 `flex` 或 `inline-flex` 来开启 Flexbox 布局，
2. 设置 `flex-direction` 属性来控制 Flexbox 布局的方向，
3. 设置 `flex-wrap` 属性来控制是否在 Flexbox 中允许换行，
4. 前两个属性可以速记为 `flex-flow` 属性，
5. 设置 `justify-content` 属性来控制所有子元素的水平对齐方式，
6. 设置 `align-items` 属性来控制所以子元素的垂直对齐方式，
7. 设置 `align-content` 属性来控制多行情况下的垂直对齐方式。

对于 Flex 子项目我们介绍了：

1. 设置 `order` 属性来控制元素的显示顺序（忽略 HTML 解析顺序），
2. 设置 `flex-grow` 属性来控制子元素是否自适应填充宽度（仅变大），
3. 设置 `flex-shrink` 属性来控制子元素是否收缩宽度（仅变小），
4. 设置 `flex-basis` 属性来控制子元素的初始宽度。
5. 前三个属性可以速记为 `flex`，顺序是**GSB**，即 `Grow -> Shrink -> Basis`，
6. 设置 `justify-self` 属性来单独控制该子元素的水平方向对齐方式，
7. 设置 `align-self` 属性来单独控制该子元素的垂直方向对齐方式。

最后还有一个 Tip 可以方便的两边对齐一个子元素：

1. 设置 `margin: auto` 属性来获得剩余的布局空间，使指定项目和其他项目孤立开的布局。

但是使用 `margin: auto` 之后，`justify-content` 属性将不再起作用。

这是一篇笔记，以方便日后回顾和加深印象。在开篇有两篇优质的文章可以在需要的时候参考。
