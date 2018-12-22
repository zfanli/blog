---
title: CSS3 布局神器 - Flexbox
subtitle: Flexbox 为我们提供了一种新的、灵活的布局方式。
date: 2018-02-08 21:12:06 +8
lastUpdateTime: 2018-12-20 13:01:37 +8
externalCSS: flexbox-samples
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

`row` 和 `column` 是最常用到的两个值，下面是默认值 `row` 时的表现。

<div class="container flex-direction-row">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

当我们将其设为 `column` 时文档流将变成下面这样。

<div class="container flex-direction-column">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

这是这个例子 🌰 的 HTML 和 CSS。

```html
<div class="container flex-direction-row">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

<div class="container flex-direction-column">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>
```

```css
.flex-direction-row {
  display: flex;
}

.flex-direction-column {
  display: flex;
  flex-direction: column;
}
```

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

默认情况下，当子元素宽度的和超过容器的宽度时不会进行换行，而是强行压缩子元素的宽度保持不超过最大宽度，这会造成子元素内换行。

<div class="container flex-wrap-nowrap">
  <div class="item item1">This is item 1. Sat Dec 22 2018</div>
  <div class="item item2">This is item 2. Sat Dec 22 2018</div>
  <div class="item item3">This is item 3. Sat Dec 22 2018</div>
</div>

当我们设置其为 `wrap` 时，一旦子元素宽度之和超过容器宽度，超过部分的子元素将会换到下一行显示，而子元素内部不再进行换行。

<div class="container flex-wrap-wrap">
  <div class="item item1">This is item 1. Sat Dec 22 2018</div>
  <div class="item item2">This is item 2. Sat Dec 22 2018</div>
  <div class="item item3">This is item 3. Sat Dec 22 2018</div>
</div>

`wrap-reverse` 属性控制子元素换行时，新的一行将出现在上方。

<div class="container flex-wrap-wrap-reverse">
  <div class="item item1">This is item 1. Sat Dec 22 2018</div>
  <div class="item item2">This is item 2. Sat Dec 22 2018</div>
  <div class="item item3">This is item 3. Sat Dec 22 2018</div>
</div>

下面是这个例子 🌰 的 HTML 和 CSS。

```html
<div class="container flex-wrap-nowrap">
  <div class="item item1">This is item 1. Sat Dec 22 2018</div>
  <div class="item item2">This is item 2. Sat Dec 22 2018</div>
  <div class="item item3">This is item 3. Sat Dec 22 2018</div>
</div>

<div class="container flex-wrap-wrap">
  <div class="item item1">This is item 1. Sat Dec 22 2018</div>
  <div class="item item2">This is item 2. Sat Dec 22 2018</div>
  <div class="item item3">This is item 3. Sat Dec 22 2018</div>
</div>

<div class="container flex-wrap-wrap-reverse">
  <div class="item item1">This is item 1. Sat Dec 22 2018</div>
  <div class="item item2">This is item 2. Sat Dec 22 2018</div>
  <div class="item item3">This is item 3. Sat Dec 22 2018</div>
</div>
```

```css
.flex-wrap-nowrap {
  display: flex;
}

.flex-wrap-wrap {
  display: flex;
  flex-wrap: wrap;
}

.flex-wrap-wrap-reverse {
  display: flex;
  flex-wrap: wrap-reverse;
}
```

**flex-flow**

flex-flow 是上面两个属性的速记属性，其第一个参数定义 `flex-direction`，第二个参数定义 `flex-wrap`。用例如下。

```css
.container {
  display: flex;
  flex-flow: row wrap;
}
```

**justify-content**

水平方向的对齐方式，类似于 `text-align` 属性。

```css
.container {
  display: flex;
  /* 此时 flex-direction 默认为 row（行）  */
  /* 控制水平方向的对齐方式 */
  justify-content: flex-start;
}
```

以下是可选值。

| flex-start         | flex-end           | center | space-between                      | space-around       |
| ------------------ | ------------------ | ------ | ---------------------------------- | ------------------ |
| 居左（垂直时居上） | 居右（垂直时居下） | 居中   | 项目等间距隔开（最左及最右无间距） | 项目左右等间距隔开 |

> 注意 ⚠️：这部分的例子 🌰 在手机上显示可能会因为宽度不够而看不出来效果，建议横屏查看，或者换到大屏设备上来查看。

所有可选值都很有用，默认值是 `flex-start`，效果如下。

<div class="container justify-content-flex-start">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

`flex-end` 居左，效果如下。

<div class="container justify-content-flex-end">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

`center` 居中，效果如下。

<div class="container justify-content-center">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

`space-between` 分散布局，每个元素之间的间隔相等，效果如下。

<div class="container justify-content-space-between">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

`space-around` 也是分散布局，每个元素左右两边围绕的空格间距相等，效果如下。

<div class="container justify-content-space-around">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

> 注意 ⚠️ `justify-content` 属性的作用对象是 Main-Axis，即主轴。而主轴在 `Flex-direction` 属性不同的情况下方向是不同的。在默认 `row` 方向的时候，`justify-content` 属性作用于水平方向，而为 `column` 方向时作用于垂直方向。之后介绍的 `align-items` 属性也有类似的转换。

```css
.container {
  display: flex;
  flex-direction: column;
  /* 由于 flex-direction 为 column（列） */
  /* 此时 justify-content 控制垂直方向的对齐方式 */
  justify-content: flex-start;
}
```

**align-items**

垂直方向上的对齐方式。布局方向为 `row` 时调整垂直方向，`column` 时调整水平方向。

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

`align-items` 的默认值是 `stretch`，填充高度，效果如下。

<div class="container h align-items-stretch">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

`flex-start` 子元素不再填充高度，并且全都居上对其，效果如下。

<div class="container h align-items-flex-start">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

`flex-end` 和上面相反，靠下对齐，效果如下。

<div class="container h align-items-flex-end">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

`center` 居中，效果如下。

<div class="container h align-items-center">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

`baseline` 是基于文字的基线对齐的，为了演示效果，下面三个项目设定了不同的 `padding` 值，可以看到三个项目里的文字都在一条水平线上。

<div class="container h align-items-baseline">
  <div class="item item1 p1">This is item 1.</div>
  <div class="item item2 p0">This is item 2.</div>
  <div class="item item3 p2">This is item 3.</div>
</div>

下面是这些例子 🌰 的 HTML 和 CSS。

```html
<div class="container h align-items-stretch">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

<div class="container h align-items-flex-start">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

<div class="container h align-items-flex-end">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

<div class="container h align-items-center">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

<div class="container h align-items-baseline">
  <div class="item item1 p1">This is item 1.</div>
  <div class="item item2 p0">This is item 2.</div>
  <div class="item item3 p2">This is item 3.</div>
</div>
```

```css
.align-items-stretch {
  display: flex;
}

.align-items-flex-start {
  display: flex;
  align-items: flex-start;
}

.align-items-flex-end {
  display: flex;
  align-items: flex-end;
}

.align-items-center {
  display: flex;
  align-items: center;
}

.align-items-baseline {
  display: flex;
  align-items: baseline;
}
```

**align-content**

`align-content` 的效果和上面的 `align-items` 属性几乎一致，不同之处在于， `align-items` 只对一行元素起作用，但是 `align-content` 针对多行。

```css
.container {
  display: flex;
  align-content: flex-start;
}
```

`align-content` 的值除了上面列出来的 `align-items` 的可选值之外，还有一些实用的可选值。

| space-between                      | space-around       |
| ---------------------------------- | ------------------ |
| 项目等间距隔开（最左及最右无间距） | 项目左右等间距隔开 |

`space-between` 和上面出现过的效果一致，但是作用方向变成了垂直方向，元素之间的间隔相等。

<div class="container h-extra align-content-space-between">
  <div class="item item1">This is item 1. Sat Dec 22 2018. I feel good.</div>
  <div class="item item2">This is item 2. Sat Dec 22 2018. I feel good.</div>
  <div class="item item3">This is item 3. Sat Dec 22 2018. I feel good.</div>
</div>

`space-around` 和也同样，作用方向变成了垂直方向，元素左右围绕的间隔相等。

<div class="container h-extra align-content-space-around">
  <div class="item item1">This is item 1. Sat Dec 22 2018. I feel good.</div>
  <div class="item item2">This is item 2. Sat Dec 22 2018. I feel good.</div>
  <div class="item item3">This is item 3. Sat Dec 22 2018. I feel good.</div>
</div>

这些例子 🌰 的 HTML 和 CSS 如下。

```html
<div class="container h-extra align-content-space-between">
  <div class="item item1">This is item 1. Sat Dec 22 2018. I feel good.</div>
  <div class="item item2">This is item 2. Sat Dec 22 2018. I feel good.</div>
  <div class="item item3">This is item 3. Sat Dec 22 2018. I feel good.</div>
</div>

<div class="container h-extra align-content-space-around">
  <div class="item item1">This is item 1. Sat Dec 22 2018. I feel good.</div>
  <div class="item item2">This is item 2. Sat Dec 22 2018. I feel good.</div>
  <div class="item item3">This is item 3. Sat Dec 22 2018. I feel good.</div>
</div>
```

```css
.align-content-space-between {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}

.align-content-space-around {
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
}
```

到目前为止我们讨论的都是容器的属性，即这些属性是对一个容器内所有的子元素起作用的。

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

Flex 项目还有一些神奇的属性。这些属性只对该元素本身起作用。

**order**

`order` 属性控制元素显示的顺序。默认情况下元素显示的顺序是遵从 HTML 解析的顺序，是自上而下的，而变更元素的顺序需要修改 HTML 标签的顺序。但是这个属性让我们可以不修改 HTML 标签的顺序，而仅修改 CSS 来变更元素的显示顺序。

`order` 的默认值为 `0`。该属性接收数值作为参数，根据数值大小来调整顺序，在值相等的情况下，按照 HTML 解析顺序显示，即标签在前则显示在上。

下面来看一个例子 🌰。

<div class="container flex-direction-column">
  <div class="item item1 b">This is item 1.</div>
  <div class="item item2 c">This is item 2.</div>
  <div class="item item3 a">This is item 3.</div>
</div>

我们需要结合 HTML 来看这个例子，下面是具体的 HTML 标签顺序。我们可以看到原始标签是按照项目 1、2、3 的顺序排列的。但是由于在 CSS 中将 `.a` 的顺序设为了 `1`，所以项目 3 被显示在最前面。而 `.b` 和 `.c` 的顺序是相同的，所以这时按照 HTML 解析的顺序，项目 1 被显示在前面。

```html
<div class="container flex-direction-column">
  <div class="item item1 b">This is item 1.</div>
  <div class="item item2 c">This is item 2.</div>
  <div class="item item3 a">This is item 3.</div>
</div>
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

**flex-grow**

当 Flex 容器有剩余的宽度时，这个属性控制子元素是否将宽度填充满。

`flex-grow` 的默认值为 `0`，表示默认不会填充满宽度。它接收数值作为参数，数值的大小是具有意义的。当一行存在多个元素同时开启了 `flex-grow` 属性时，这些项目将根据该属性的值来分配宽度。

> 注意 ⚠️：这部分的例子 🌰 在手机上显示可能会因为宽度不够而看不出来效果，建议横屏查看，或者换到大屏设备上来查看。

来看两个例子 🌰。

<div class="container flex-direction-row">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3 flex-grow-1">This is item 3.</div>
</div>

<div class="container flex-direction-row">
  <div class="item item1">This is item 1.</div>
  <div class="item item2 flex-grow-2">This is item 2.</div>
  <div class="item item3 flex-grow-1">This is item 3.</div>
</div>

同样结合 HTML 和 CSS 来分析这两个例子 🌰。

第一个例子只有项目 3 有 `flex-grow` 属性，所有剩余的所有宽度都被它填充了。

而第二个例子，项目 2 和项目 3 都开启了 `flex-grow` 属性，而项目 2 的值是 `2`，项目 3 是 `1`，最终的结果就是剩余的宽度一分为三，项目 2 占 2 份，项目 3 占 1 份，从显示来看，项目 2 占了更多的宽度。

```html
<div class="container flex-direction-row">
  <div class="item item1">This is item 1.</div>
  <div class="item item2">This is item 2.</div>
  <div class="item item3 flex-grow-1">This is item 3.</div>
</div>

<div class="container flex-direction-row">
  <div class="item item1">This is item 1.</div>
  <div class="item item2 flex-grow-2">This is item 2.</div>
  <div class="item item3 flex-grow-1">This is item 3.</div>
</div>
```

```css
.flex-grow-1 {
  flex-grow: 1;
}

.flex-grow-2 {
  flex-grow: 2;
}
```

**flex-shrink**

`flex-shrink` 与上一个属性相反，它控制当 Flex 容器宽度不够，且不允许换行的情况下，是否允许子元素收缩宽度。它同样接收数值作为参数，但是仅作为开关，默认为 `1`，开启收缩。当其值为 `0` 时，这个子元素不再收缩它当宽度来适应 Flex 容器。

之前的 `flex-wrap` 的例子中其实我们已经见到了它的效果，我们把它找出来再改改。

<div class="container flex-wrap-nowrap">
  <div class="item item1 flex-shrink-0">This is item 1. Sat Dec 22 2018</div>
  <div class="item item2">This is item 2. Sat Dec 22 2018</div>
  <div class="item item3">This is item 3. Sat Dec 22 2018</div>
</div>

继续结合这个例子 🌰 的 HTML 和 CSS 来分析分析。

项目 1 设定了 `flex-shrink` 为 `0`，而其他 2 个项目没有设定这个属性，所以它们默认是 `1`。从显示结果上来看，项目 1 的宽度没有收缩，它没有产生元素内换行，而项目 2 和 3 都在元素内换行了。

```html
<div class="container flex-wrap-nowrap">
  <div class="item item1 flex-shrink-0">This is item 1. Sat Dec 22 2018</div>
  <div class="item item2">This is item 2. Sat Dec 22 2018</div>
  <div class="item item3">This is item 3. Sat Dec 22 2018</div>
</div>
```

```css
.flex-shrink-0 {
  flex-shrink: 0;
}
```

**flex-basis**

`flex-basis` 指定项目的初始宽度。这个属性需要一个可以量化的单位，例如 `px` 或 `%` 等，注意即使是 0 也需要写上单位，如 `0px`。它的默认值是 `auto`，这时项目的宽度根据内容的长度来计算。

<div class="container flex-direction-row">
  <div class="item item1">This is item 1.</div>
  <div class="item item2 flex-basis-200">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>

我们给项目 2 设定了 `flex-basis` 为 `200px`，从显示效果来看，项目 2 没有适应自身的宽度，而是固定显示 `200px` 的宽度。

```html
<div class="container flex-direction-row">
  <div class="item item1">This is item 1.</div>
  <div class="item item2 flex-basis-200">This is item 2.</div>
  <div class="item item3">This is item 3.</div>
</div>
```

```css
.flex-basis-200 {
  flex-basis: 200px;
}
```

**flex**

上面三个属性有一个速记方法，用例如下。需要记住**GSB**，即第一个值是 `flex-grow`，第二个是 `flex-shrink`，最后一个是 `flex-basis`。

```css
.a {
  flex: 0 1 auto;
}
```

下面有一些简写的组合或许会有帮助，来看一眼留一个印象吧。

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

**align-self**

这个属性的效果和 Flex 容器的属性 `align-items` 是完全一样的，不同之处在于，这个属性是对子元素自身设置的，并且仅会对这个元素产生作用，**不影响到其他元素**！

`align-self` 的可选值和 `align-items` 完全相同。下面这个例子 🌰 中，3 个项目有 3 个不同的 `align-self` 属性，来看看具体的效果吧。

<div class="container h align-items-stretch">
  <div class="item item1 align-self-center">This is item 1.</div>
  <div class="item item2 align-self-flex-start">This is item 2.</div>
  <div class="item item3 align-self-flex-end">This is item 3.</div>
</div>

```html
<div class="container h align-items-stretch">
  <div class="item item1 align-self-center">This is item 1.</div>
  <div class="item item2 align-self-flex-start">This is item 2.</div>
  <div class="item item3 align-self-flex-end">This is item 3.</div>
</div>
```

```css
.align-self-center {
  align-self: center;
}

.align-self-flex-start {
  align-self: flex-start;
}

.align-self-flex-end {
  align-self: flex-end;
}
```

### margin: auto;

在 Flex 布局中，`margin: auto;` 属性是一个布局的小技巧。

在做页面顶部导航栏的时候，我们时常需要让一些元素在左边，一些元素靠右边，大致就是下面这个例子 🌰 的效果。

我们给项目 3 设定了属性 `margin-left: auto;`，这个属性会把 Flex 容器的所有剩余空间全部填充到项目 3 的左边，这看起来就像是项目 1 和 2 是靠左对齐的，但是项目 3 是靠右对齐。

<div class="container flex-direction-row">
  <div class="nav item1">Item 1</div>
  <div class="nav item2">Item 2</div>
  <div class="nav item3 margin-left-auto">Item 3</div>
</div>

当然如果给项目 3 设定 `margin: auto;` 的话，项目 3 会在 Flex 容器剩余的空间中居中对齐，变成下面这个效果。

<div class="container flex-direction-row">
  <div class="nav item1">Item 1</div>
  <div class="nav item2">Item 2</div>
  <div class="nav item3 margin-auto">Item 3</div>
</div>

```html
<div class="container flex-direction-row">
  <div class="nav item1">Item 1</div>
  <div class="nav item2">Item 2</div>
  <div class="nav item3 margin-left-auto">Item 3</div>
</div>

<div class="container flex-direction-row">
  <div class="nav item1">Item 1</div>
  <div class="nav item2">Item 2</div>
  <div class="nav item3 margin-auto">Item 3</div>
</div>
```

```css
.margin-left-auto {
  margin-left: auto;
}

.margin-auto {
  margin: auto;
}
```

> 注意 ⚠️：使用了 `margin: auto` 进行自动对齐的话，`justify-content` 将不再起作用！因为剩余的空间全都被 `margin` 所占用。

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
