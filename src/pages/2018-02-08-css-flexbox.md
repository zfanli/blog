---
title: CSS3 布局神器 - Flexbox
subtitle: Flexbox 为我们提供了一种新的、灵活的布局方式。
date: 2018-02-08 21:12:06 +0800
tags:
  - CSS
---

### 关于 Bootstrap 4.0

---

时隔几个月，又看起了 Bootstrap 的文档。

上次 4.0 版本还在测试中，我看了 3.0 版本的文档。对用法还有个大致印象。

这次又要用到它构建 UI，而且基于 Flexbox 的 4.0 正式版本已经 Release 了，所以这次当然选择 Bootstrap4.0。

看到目前，4.0 基于 Flexbox 更方便，很多之前需要 hack 的问题现在都可以无痛解决了。

这篇文章相当于我看 Flexbox 文档的一份笔记。大致记一下用法。

### 参照文档

---

Bootstrap 官方推荐的文档是[A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#flexbox-background)。

很全面，就是全英文。大致浏览一遍之后，转头读汉化版文档去了。

（真的是，为了读一篇文档，延伸出好多需要读的文档呀。）

于是找到一篇挺好的中文译文。原文不是上面那篇。

[Understanding Flexbox: Everything you need to know](https://medium.freecodecamp.org/understanding-flexbox-everything-you-need-to-know-b4013d4dc9af)

感谢作者 Ohans Emmanuel 的分享。英文还是吃力。好在有译文。

[理解 Flexbox：你需要知道的一切](https://www.w3cplus.com/css3/understanding-flexbox-everything-you-need-to-know.html)

来自大漠的译文。

上面的文档足以对 Flexbox 的工作有全面的了解。

下面是一些备忘笔记。

### 速记

---

直接正文。

**如何声明 Flexbox？**

给 Container 元素加`display: flex`或`diaplay: inline-flex`属性即声明这个元素启动了 Flexbox 布局。

这个 Container 内的所有后代元素都处于 Flexbox 布局中。

这个父容器 Container 称作 Flex Container。

它的后代称作 Flex Items。

**Flex Container 的属性有哪些？**

> flex-direction \|\| flex-wrap \|\| flex-flow \|\| justify-content \|\| align-items \|\| align-content

**flex-direction**

父容器设定 flex-direction 属性来规定其子元素的排列方式。默认是`row`，即水平排列。

以下是可选值。

row | column | row-reverse | column-reverse
水平 | 垂直 | 反向水平（自右向左） | 反向垂直（自下向上）

**flex-wrap**

是否允许换行。默认是`nowrap`，不换行。

以下是可选值。

wrap | nowrap | wrap-reverse
换行 | 不换行 | 换行（向上堆砌）

**flex-flow**

flex-flow 是上面两个属性的速记属性。

用例如下。

> flex-flow: row wrap;

**justify-content**

基于行的对齐方式，类似于`align-text`属性。

> 注意！`justify-content`属性的作用对象是 Main-Axis。而 Main-Axis 在`Flex-direction`属性不同的情况下表现的行为不同。记住它的调整参照是 Main-Axis，在`row`方向的情况是对行的排列方式进行调整，而在`column`方向时调整的是垂直的列。之后介绍的`align-items`属性也是一样的。

以下是可选值。

flex-start | flex-end | center | space-between | space-around
居左（垂直时居上） | 居右（垂直时居下） | 居中 | 项目等间距隔开（最左及最右无间距） | 项目左右等间距隔开

**align-items**

Cross-Axis 上的调整。`row`表示时调整垂直方向，`column`表示时调整水平方向。

以下是可选值。默认值是`stretch`，拉伸。

flex-start | flex-end | center | stretch | baseline
居上（居左） | 居下（居右） | 居中 | 伸展 | 基线（第一行）

**align-content**

效果和上面的属性一致，但是作用对象是多行的 Flex 容器，换句话说是 Flex 整体的调整。

上面就是容器的属性。

**Flex 项目的属性呢？**

> order \|\| flex-grow \|\| flex-shrink \|\| flex-basis

Flex 项目有一些神奇的属性。

**order**

不修改 HTML 源代码的情况下，修改项目显示的顺序。默认值为`0`。

该属性接收数值参数，根据数值大小做出调整，可以想象`z-index`的模式。

通常情况下，不设置`order`属性时，所有项目的`order`默认为 0，画面将按照 HTML 结构从上到下渲染显示。

但是存在`order`属性的情况下，画面显示时将先考虑`order`值的大小做出判断，值越靠前则显示越靠前。在`order`值相等的情况下，按照 HTML 结构上下顺序优先显示先解析的。

**flex-grow & flex-shrink & flex-basis**

这三个可以一起说了。

`flex-grow`的默认值为`0`，表示默认不会填充满宽度（`row`显示时）。

`flex-grow`接收数值作为参数，数值的大小具有意义。当一行存在多个项目时，同时开启`flex-grow`属性时，这些项目将根据该属性的值分配宽度。

例如一行存在两个 DIV，A 和 B，A 的`flex-grow`值为 2，B 为 1。

则在显示时宽度一分为三，三分之二宽度分配个 A，剩下三分之一分配给 B。

（速记，若有时间补上 CSS 示例。）

`flex-shrink`接收数值作为参数，但是数值仅作为开关。默认为`1`，开启收缩。此时当宽度较小时会收缩子元素的宽度来保证完全显示所有元素。

`flex-basis`指定项目的初始大小。取值可以有各种单位，`px`或`%`等。但是注意即使值是`0`也要写上单位，如`0px`。它的默认值是`auto`。这时项目的宽度根据内容的长度计算。

使用`flex-basis`可以固定项目的宽度。

> flex-basis： 150px；

上面三个属性有一个速记方法。

**flex**

用例。

> flex: 0 1 auto;

记住**GSB**。第一个值是 grow，第二个是 shrink，最后一个是 bisis。

有一些组合。

> flex: none; -> flex: 0 0 auto;

> flex: auto; -> flex: 1 1 auto;

**子项目还有一些额外的属性！**

**align-self**

效果和父元素的`align-items`完全一致。唯一的区别就是，对子元素设置该属性可以单独调整这个元素的对齐方式，**而不影响到其他元素**！

### margin: auto

---

之前我们使用`margin: auto`来让一个块状元素居中显示。但是在这里它可能会出错。因为实现它的原理是将剩余的空间均匀分配到元素的两边。

但是由此可以很方便的做出一些布局。

我么可以单独使用`margin-right: auto`，将右边剩余的空白分配到该元素的右边，让它鹤立鸡群。

**但是要注意，使用了`margin: auto`进行自动对齐的话，`justify-content`将不再起作用！**

（有空补效果。）

### 总结

---

我们从声明 Flexbox 布局方式开始介绍了 Flex 容器和子项目。

对于 Flex 容器我们分别介绍了：

1. 控制子元素水平或垂直分布的`flex-direction`属性，
2. 控制子元素能否换行的`flex-wrap`属性，
3. 前两个属性的速写`flex-flow`属性，
4. 针对 Main-Axis 上对子元素进行排列调整的`justify-content`属性，
5. 在 Cross-Axis 上进行排列调整的`align-items`属性，
6. 以及对多行元素整体调整位置的`align-content`属性。

而针对 Flex 子项目我们介绍了：

1. 控制子项目显示顺序的`order`属性，
2. 控制子元素在有剩余空间的情况下进行拉伸的`flex-grow`属性，
3. 控制子元素在宽度变小的情况下是否收缩的`flex-shrink`属性，
4. 以及指定子元素初始宽度的`flex-basis`属性。
5. 最后这三个属性可以用`flex`属性速记，要记住**GSB**，即`Grow -> Shrink -> Basis`。

我们还介绍了：

1. 可以控制指定子项目在 Cross-Axis 上对齐位置的`align-self`属性
2. 和技巧运用`margin: auto`来获得剩余空间，使指定项目和其他项目孤立开的布局。

但是使用`margin: auto`时我们的`justify-content`属性就不再起作用了。

本文只是一个速记，在之后的某段时间用来加深印象和认识。本文开篇也给出了详细介绍 Flexbox 布局的两篇文章，以待需要时可以定位查阅。

以上。
