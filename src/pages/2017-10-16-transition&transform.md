---
title: CSS 的过渡效果和变形（transition & transform）
subtitle: 过渡动画和变形可以赋予页面生命力。
date: 2017-10-16 00:00:00 +8
externalCSS: transition-transform
tags:
  - CSS
---

### transition 过渡效果

先贴一份 W3 官方的说明文档：[CSS Transitions](https://www.w3.org/TR/css3-transitions/#transition-property-property)。

CSS 的 transition 属性可以让我们从此放弃简单的 JS 动画，因为 CSS 就可以做到了。先来看看兼容性和各个浏览器的写法。

> Internet Explorer 10、Firefox、Opera 和 Chrome 支持 transition 属性。  
>  Safari 支持替代的 -webkit-transition 属性。  
>  注释：Internet Explorer 9 以及更早版本的浏览器不支持 transition 属性。

```css
.test {
  /*各个浏览器下的写法*/
  /*@prop 过渡效果作用的属性*/
  /*@time 过渡效果持续的时间，单位为 s 或者 ms */
  -webkit-transition: prop time; /*Chrome and Safari*/
  -moz-transition: prop time; /*FireFox*/
  -ms-transition: prop time; /*IE*/
  -o-transition: prop time; /*Opera*/
  transition: prop time; /*标准写法*/
}
```

上面是各个浏览器的写法和属性的最基本构成。过渡属性一般需要两个参数，第一个表述让过渡效果触发的属性，默认是 `all`，即当所有支持的属性发生改变时都将触发过渡效果，这就像是一个监听器，我们要做的是告诉监听器我们需要监控的属性。第二个属性是过渡效果的持续时间，单位可以为`s`或者`ms`。先来看一个例子 🌰。

下面是一个例子，通过触发 hover 事件来看看它的效果，把鼠标移到色块上吧，当然如果你是移动设备，手指轻触色块。

<div class="test-container">
    <div class="contents test"></div>
</div>

是不是很酷炫，其实实现这个效果的 css 很简单，大家请看：

```css
.test {
  background-color: darksalmon;
  transition: all 2s;
}

.test:hover {
  background-color: violet;
  width: 300px;
}
```

我们先来看看需要我们设置的参数。

```css
transition: [<transition-property> || <transition-duration>
        || <transition-timing-function> || <transition-delay>]
        [, [<transition-property> || <transition-duration>
        || <transition-timing-function> || <transition-delay>]]*);
```

过渡效果有四个可设定的参数，并且每个参数之间使用空格隔开，逗号将分隔新的过渡效果设定。

**`transition-property`** 过渡效果作用的属性。只有有中间值的属性才支持过渡效果。

取值：`all | none | <property>[ ,<property> ]*`

默认值：`all`

作用对象：所有元素，包括 `:before` 和 `:after` 伪元素

继承：`no`

下面是指定背景颜色为过渡属性的例子，注意宽度的变化没有过渡效果。鼠标悬停展示效果，或者如果你使用移动设备，手指轻触也可以触发效果。

<div class="test-container">
    <div class="contents test-prop"></div>
</div>

这个效果的 CSS 属性：

```css
.test-prop {
  background-color: grey;
  transition: background-color 1s;
}

.test-prop:hover {
  background-color: #269abc;
  width: 300px;
}
```

**`transition-duration`** 持续时间。

取值：`<time> [, <time>]*`

默认值：`0s`

作用对象：所有元素，包括 `:before` 和 `:after` 伪元素

继承：`no`

下面两个例子展示了不同持续时间的效果。

<div class="test-container">
    <div class="contents test-dura-1s"></div>
</div>
<div class="test-container">
    <div class="contents test-dura-5s"></div>
</div>

下面是它们的 css：

```css
.test-dura-1s {
  background-color: skyblue;
  transition: all 1s;
}

.test-dura-1s:hover {
  background-color: yellowgreen;
  width: 300px;
}

.test-dura-5s {
  background-color: skyblue;
  transition: all 5s;
}

.test-dura-5s:hover {
  background-color: yellowgreen;
  width: 300px;
}
```

**`transition-timing-function`** 过渡效果。

取值：`<single-transition-timing-function> [ ‘,’ <single-transition-timing-function> ]*`

默认值：`ease`

作用对象：所有元素，包括 `:before` 和 `:after` 伪元素

继承：`no`

可选值：`ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | steps(<integer>[, [ start | end ] ]?) | cubic-bezier(<number>, <number>, <number>, <number>)`

引用网上的解释。

> `linear`：  
>  线性过渡。等同于贝塞尔曲线(0.0, 0.0, 1.0, 1.0)  
>  `ease`：  
>  平滑过渡。等同于贝塞尔曲线(0.25, 0.1, 0.25, 1.0)  
>  `ease-in`：  
>  由慢到快。等同于贝塞尔曲线(0.42, 0, 1.0, 1.0)  
>  `ease-out`：  
>  由快到慢。等同于贝塞尔曲线(0, 0, 0.58, 1.0)  
>  `ease-in-out`：  
>  由慢到快再到慢。等同于贝塞尔曲线(0.42, 0, 0.58, 1.0)  
>  `cubic-bezier(<number>, <number>, <number>, <number>)`：  
>  特定的贝塞尔曲线类型，4 个数值需在[0, 1]区间内

`linear` 中规中矩的过渡；`ease` 开始和结束稍有缓冲；`ease-in` 滑动从慢到快；`ease-out` 滑动从快到慢；`ease-in-out` 开始和结束的缓冲较为明显。

`cubic-bezier` 这个复杂一点。由四个点控制，开始(`p0`)是[0,0]，结束(`p3`)是[1,1]，我们需要设定中间俩个点(`p1`,`p2`)的坐标，来得到我们想要的曲线。文字表述不好理解，来看看下面这张图。

![TimingFunction](/img/TimingFunction.png)

话不多说，看几个常用的例子。鼠标经过查看效果。为了凸显过渡效果的不同点，这里把持续时间设定到了 2 秒，个人认为实际运用在 0.5 秒左右比较合适。

<div class="test-container">
    <div class="contents test-linear">linear</div>
</div>

<div class="test-container">
    <div class="contents test-ease">ease</div>
</div>

<div class="test-container">
    <div class="contents test-ease-in two-line">ease<br>in</div>
</div>

<div class="test-container">
    <div class="contents test-ease-out two-line">ease<br>out</div>
</div>

<div class="test-container">
    <div class="contents test-ease-in-out two-line">ease<br>in-out</div>
</div>

下面是这五个样例的 CSS 属性：

```css
.test-linear {
  background-color: pink;
  transition: all 2s linear;
}

.test-linear:hover {
  background-color: rebeccapurple;
  width: 300px;
  color: white;
}

.test-ease {
  background-color: pink;
  transition: all 2s ease;
}

.test-ease:hover {
  background-color: rebeccapurple;
  width: 300px;
  color: white;
}

.test-ease-in {
  background-color: pink;
  transition: all 2s ease-in;
}

.test-ease-in:hover {
  background-color: rebeccapurple;
  width: 300px;
  color: white;
}

.test-ease-out {
  background-color: pink;
  transition: all 2s ease-out;
}

.test-ease-out:hover {
  background-color: rebeccapurple;
  width: 300px;
  color: white;
}

.test-ease-in-out {
  background-color: pink;
  transition: all 2s ease-in-out;
}

.test-ease-in-out:hover {
  background-color: rebeccapurple;
  width: 300px;
  color: white;
}
```

此外还有一个 steps 的过渡效果，也说不上过渡，是一步一步展示递进的效果，看看下面的例子就知道了。

<div class="test-container">
    <div class="contents test-steps two-line">steps<br>5</div>
</div>

它的 CSS 属性如下：

```css
.test-steps {
  background-color: pink;
  transition: all 1s steps(5);
}

.test-steps:hover {
  background-color: rebeccapurple;
  width: 300px;
  color: white;
}
```

`transition-delay` 过渡效果前延迟。

取值：`<time> [, <time>]*`

默认值：`0s`

作用对象：所有元素，包括 `:before` 和 `:after` 伪元素

继承：`no`

下面对比下无延迟和有延迟时的效果。鼠标经过展示效果。下面的色块鼠标放上请耐心等待 2 秒。

<div class="test-container">
    <div class="contents test-delay-0s two-line">delay<br>0s</div>
</div>

<div class="test-container">
    <div class="contents test-delay-2s two-line">delay<br>2s</div>
</div>

下面是 CSS 属性：

```css
.test-delay-0s {
  background-color: orangered;
  transition: all 2s ease;
}
.test-delay-0s:hover {
  background-color: blueviolet;
  width: 300px;
  color: white;
}

.test-delay-2s {
  background-color: orangered;
  transition: all 1s ease 2s;
}
.test-delay-2s:hover {
  background-color: blueviolet;
  width: 300px;
  color: white;
}
```

差不多了。知道上面这些，我们就已经具备了做出好看的过渡效果的能力。下面让我们看看另一个属性。

### CSS 的 transform 属性

Transform 是变形的意思。就如字面意思一样，CSS 的 transform 属性的作用就是给指定元素变形。这个属性配合上面我们介绍的属性可以获得很棒的效果，我们先来看一个例子。

<div class="test-container-big">
    <div class="contents test-transform"></div>
</div>

或许我展现的效果不是很好，但是这确实是很实用很酷炫的东西。变形属性可以让元素按照我们的想法自由变换，而过渡效果的加入使得我们所定义的变形可以平缓的展开和回收。再让我们看几个网上的示例吧，这次找几个看上去实用又酷炫的。

<div class="test-container">
    <div class="contents test-transform-back"><div class="fill two-line">ROTATE</div></div>
    <div class="contents test-transform-back second"><div class="fill two-line">SCALE</div></div>
    <div class="contents test-transform-back third"><div class="fill two-line">TRANSLATE</div></div>
</div>

<div class="test-container second height-plus">
    <div class="contents test-transform-back"><div class="fill two-line">ROTATE-X</div></div>
    <div class="contents test-transform-back second"><div class="fill two-line">ROTATE-Y</div></div>
    <div class="contents test-transform-back third"><div class="fill two-line">ROTATE(O)</div></div>
</div>

是不是有一种想马上使用一下的冲到呢？设置很简单，第一排 2D 变换单独使用 `transform` 属性即可实现，第二排 3D 变换还加入了一个 `perspective（透视）`属性，第二排后面两个同时使用了 `transform-origin` 定义旋转的圆心点。

第一排，从左到右：

```css
/*通用的容器设定*/
.test-transform-back .fill {
  background-color: #5bdaff;
  transition: all 0.3s ease;
  opacity: 0.5;
}

/*ROTATE*/
.test-transform-back:hover .fill {
  transform: rotate(45deg);
}

/*SCALE*/
.test-transform-back.second:hover .fill {
  transform: scale(2);
}

/*TRANSLATE*/
.test-transform-back.third:hover .fill {
  transform: translate(15px, 15px);
}
```

第二排，从左到右：

```css
/*通用容器追加透视属性*/
.test-container.second .test-transform-back {
  perspective: 100px;
}

/*ROTATE-X*/
.test-container.second .test-transform-back:hover .fill {
  transform: rotateX(45deg);
}

/*第二个和第三个效果的圆心定位*/
.test-container.second .test-transform-back.second .fill,
.test-container.second .test-transform-back.third .fill {
  transform-origin: 0 100% 0;
}

/*ROTATE-Y*/
.test-container.second .test-transform-back.second:hover .fill {
  transform: rotateY(-45deg);
}

/*ROTATE(O)*/
.test-container.second .test-transform-back.third:hover .fill {
  transform: rotate(45deg);
}
```

上面用到了最常用的三个变化效果，分别是 scale（缩放）、rotate（旋转）和 translate（移动）。此外还有很多很实用的属性，下面列出所有的可应用属性。

| 值                                        | 描述                                    |
| :---------------------------------------- | :-------------------------------------- |
| none                                      | 定义不进行转换。                        |
| matrix(n,n,n,n,n,n)                       | 定义 2D 转换，使用六个值的矩阵。        |
| matrix3d(n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n) | 定义 3D 转换，使用 16 个值的 4x4 矩阵。 |
| translate(x,y)                            | 定义 2D 转换。                          |
| translate3d(x,y,z)                        | 定义 3D 转换。                          |
| translateX(x)                             | 定义转换，只是用 X 轴的值。             |
| translateY(y)                             | 定义转换，只是用 Y 轴的值。             |
| translateZ(z)                             | 定义 3D 转换，只是用 Z 轴的值。         |
| scale(x[,y]?)                             | 定义 2D 缩放转换。                      |
| scale3d(x,y,z)                            | 定义 3D 缩放转换。                      |
| scaleX(x)                                 | 通过设置 X 轴的值来定义缩放转换。       |
| scaleY(y)                                 | 通过设置 Y 轴的值来定义缩放转换。       |
| scaleZ(z)                                 | 通过设置 Z 轴的值来定义 3D 缩放转换。   |
| rotate(angle)                             | 定义 2D 旋转，在参数中规定角度。        |
| rotate3d(x,y,z,angle)                     | 定义 3D 旋转。                          |
| rotateX(angle)                            | 定义沿着 X 轴的 3D 旋转。               |
| rotateY(angle)                            | 定义沿着 Y 轴的 3D 旋转。               |
| rotateZ(angle)                            | 定义沿着 Z 轴的 3D 旋转。               |
| skew(x-angle,y-angle)                     | 定义沿着 X 和 Y 轴的 2D 倾斜转换。      |
| skewX(angle)                              | 定义沿着 X 轴的 2D 倾斜转换。           |
| skewY(angle)                              | 定义沿着 Y 轴的 2D 倾斜转换。           |
| perspective(n)                            | 为 3D 转换元素定义透视视图              |

详细参考 W3Schools 的文档。

[CSS3 transform Property](https://www.w3schools.com/cssref/css3_pr_transform.asp)
