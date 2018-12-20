---
title: 从需求来看 MongoDB 的最简单用法
subtitle: 从需求来看看目前最流行的 NoSQL 数据库 MongoDB 的最简单用法，基于 Python。
date: 2018-06-05 10:56:06 +0800
lastUpdateTime: 2018-06-16 12:39:37 +0800
tags:
  - Python
  - MongoDB
---

从需求来看 MongoDB，了解能满足我们需求的最简用法。

这篇文章介绍如何在 Python 中操作 MongoDB，面向初学者。第一次阅读建议阅读全文，之后建议检索关键字或者根据索引按需阅读。

这一次我们使用 MongoDB 来储存文档，满足一个博客网站可能会遇到的需求。

我们要了解文章、评论和设定，诸如此类的数据，它们如何储存在 MongoDB 中，以及我们要如何使用和更新它们。

这篇文章讨论的内容：

- 设计符合需求的数据结构
- document 的增删改查
- 计划获取的字段或内容
- 查询和过滤内嵌数组

基本上，就是入门知识。

## 最简内容索引

- find 查询
- project 计划字段
- update 更新
- delete 删除
- cursor 操作
- aggregate 聚合

## 设计符合需求的数据结构

// TODO or delete

## document 的增删改查

### 连接 MongoDB

这是一个连接 MongoDB 的示例代码，主要用来定义几个变量方便下面使用。

```python
from pymongo import MongoClient
from bson import ObjectId


mc = MongoClient() # connect to default client
db = mc['test'] # use 'test' database
col = db['test-collection'] # use 'test-collection' collection

```

### find 查询

查询是使用数据库的基础需求。

#### find_one & find

```python
# Query for only one document
col.find_one({
    'some_fields': 'values',
    'array_fields': ['value1', 'value2'],
    'object_fields': {'keys': 'values'}
})
# Query for one or more than one documents
col.find({
    'some_fields': 'values',
    'array_fields': ['value1', 'value2'],
    'object_fields': {'keys': 'values'}
})
```

从上面的例子我们可以知道，第一个参数将被视为查询的条件。

这个参数需要是 `dict`。

在 SQL 中，例子中的操作对应 `select * from ... where ...`。

有时我们查询的条件不是一个具体的值，可能需要在一个范围内查找。

```python
col.find(
    {
        'views': {'$gte': 1000},
    }
)
```

上面这个例子中，我们可以拿到所有 `views` 值大于等于 1000 的文章。

`$gte` 表达大于等于的关系，含义等同于 `>=`。

常见的比较操作符如下：

- `$eq` equal to
- `$gt` greater than
- `$gte` greater than or equal to
- `$lt` less than
- `$lte` less than or equal to
- `$ne` not equal to
- `$in` match in an array
- `$nin` not match in an array

这些操作符的表达方式有两种。

`$in` 和 `$nin` 需要匹配数组，例如 `$in` 的表达方式如下：

```python
{'field': {'$in': ['value1', 'value2'...'values']}}
```

而其他的比较操作符需要匹配单个值，例如 `$eq` 的表达方式如下：

```python
{'field': {'$eq': 'value'}}
```

这些操作符在需要表达比较关系的场合都用得到，不仅限于 `find` 查询，还包括更新、删除和 `aggregate` 聚合等场合。

#### project 计划字段

find 默认拉取整个 document 作为输出。

但出于带宽和性能考虑，有时我们不需要这么多数据，我们仅需求我们需要的字段。

`project` 可以帮我们解决问题，我们能声明需要或者不需要哪些字段。

传给 find 方法的第二个参数将被视为 `projection`，同样它需要是 `dict`。

```python
col.find(
    {},
    {
        'title': 1,
        'author': 1,
        'content': 1,
    }
)
```

像上面这样，在第二个参数中列出需要的字段名，并将其值设为 `1`， 我们就声明了包含的字段。

`1` 的意思就是**包含**，这样 MongoDB 就可以理解我们的需求，仅取出需要的字段。

或者可以声明不包含的字段。

```python
col.find(
    {},
    {
        'comments': 0,
        'timestamp': 0,
        'reviews': 0,
    }
)
```

`0` 表示**不包含**。

这样就可以取出除了我们声明了不包含的其他所有字段，这在一些场景下很有用。

`_id` 字段是默认会被取出的，即使你没有在 `project` 中声明并设为 `1`。

如果你实在不想看到它，可以在 `project` 里手动将它设为 `0`，它就不会出现了。

```python
col.find(
    {},
    {
        '_id': 0,
        'title': 1,
        'author': 1,
        'content': 1,
    }
)
```

**但是注意，除了 `_id` 以外，包含（`1`）和不包含（`0`）是不能同时出现的，否则你会得到下面这个错误。**

```
pymongo.errors.OperationFailure: Projection cannot have a mix of inclusion and exclusion.
```

所以记住，对于 `_id` 来说，想要不显示它需要手动设置为 `0`。

对其他字段来说，要不就告诉 MongoDB 需要哪些字段，要不就告诉它不需要哪些，同时声明需要和不需要的字段将会报错。

#### project 进阶

`project` 有更实用的功能，相应也会更复杂一些。

当查询一个数组对象时，有时我们有更多的需求。

比如做评论的分页时，我们不需要一次性取出这个文章的所有评论，我们只需要指定的几个。

```python
col.find(
    {},
    {
        # Fetch the 0-3 of comments
        'comments': {
            '$slice': 3
        }
        # Fetch the 2-6 of comments
        'comments': {
            '$slice': [2, 6]
        }
        # Fetch the last comment
        'comments': {
            '$slice': -1
        }
    }
)
```

上面的例子分别从评论数组中取出前三条、第 2 到第 6 条和最后一条评论。

或者，有时我们仅需要取出符合要求的第一个评论，

```python
col.find(
    {},
    {
        # Fetch the first deleted comment
        'comments': {
            '$elemMatch': {
                'deleted': True
            }
        }
    }
)

col.find(
    # Fetch the first element matched the condition
    {
        'comments': {
            'deleted': True
        }
    },
    {
        'comments.$': 1
    }
)
```

上面这两个查询的效果一样，获取评论数组中满足被删除这个条件的第一条评论。

但上面这个匹配实际上用处有限，通常我们需要取出满足条件的多条评论，而不仅仅是符合条件的第一条。

`project` 有办法实现，但却不是在 find 方法中，在 `aggregate` 中我们继续讨论如何使用 `project` 满足需求。

目前为止涉及的文档：

- [Query Documents](https://docs.mongodb.com/manual/tutorial/query-documents/)
- [Comparison Query Operators](https://docs.mongodb.com/manual/reference/operator/query-comparison/)
- [Project Fields to Return from Query](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/)
- [collection – Collection level operations - find()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.find)
- [collection – Collection level operations - find_one()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.find_one)

### update 更新

修改已有的数据是普遍的需求。

在博客中，用户主动或者被动的操作都会触发数据的更新。

比如用户打开一篇文章，我们需要更新这篇文章的浏览数；用户赞了这篇文章，我们需要更新这篇文章的点赞数。

或者用户在线修改了一篇文章的内容，我们需要将这次修改更新到正确到数据源上。

#### update_one

```python
# Get user inputted content
new_content = get_user_input()

# Update specified article
col.update_one(
    # Match article by id
    {'_id': ObjectId('5b432a42f04705565525529d')},
    # Update content
    {
        '$set': {'content': new_content}
    }
)
```

上面这个简单到例子中，我们假设通过 `get_user_input()` 函数拿到了已经检查过的用户输入数据。

接着，对指定的文章做了一次更新，`$set` 是更新操作的操作符，它对应的 dict 中，key 表示要操作的字段名称，value 则是更新后的值。

所以我们的操作是：更新此 `_id` 对应的文章，并且设置（`$set`）文章的 `content（内容）` 字段的值为用户输入值 `new_content`。

这是一个简单的更新操作。

回到用户点击文章和点赞的例子，在这个场景我们希望点击量字段和点赞数字段增加 1 个单位，而不是设置一个具体的值给他。

#### \$inc 数值增量

```python
col.update_one(
    # Match article by id
    {'_id': ObjectId('5b432a42f04705565525529d')},
    # Update views
    {
        '$inc': {'views': 1}
    }
)
```

这也很好实现，MongoDB 提供了一个 `$inc` 操作符来给指定的字段增量。

我们的操作是：更新此 `_id` 对应的文章，增加（`$inc`）字段 `views（点击量）` 的值，增量为 `1`。

当然增量可以随意设定。

```python
col.update_one(
    # Match user by username
    {'username': 'Richard',
    # Update points
    {
        '$inc': {'points': 100}
    }
)
```

上面的例子中，我们给名为 Richard 的用户增加了 100 积分来激励他使用我们的网站。

```python
col.update_one(
    # Match user by username
    {'username': 'Richard',
    # Update points
    {
        '$inc': {'points': -999}
    }
)
```

接着我们发现了 Richard 的违规行为，经过思考我们决定从他的账户上扣除 999 积分。

这些操作都可以使用 `$inc` 完成。

当然我们的博客也不需要积分系统。

上面的例子都使用了 `update_one` 方法，它仅仅更新一个指定的文章或者用户。

有时我们需要更新一批对象。

比如对所有点击量超过 1000 的文章标注为热点文章。

#### update_many

```python
col.update_many(
    {'views': {'$gte': 1000}},
    {
        '$set': {'hot_topic': True}
    }
)
```

使用 `update_many` 进行批量更新操作。第一个参数作为 filter 筛选出我们需要的数据，第二个参数则更新指定的字段。

当我们在设计 RESTful API 的时候，出于减少请求数的考虑，一个更新操作可能需要将更新之后的对象放在 response 中返回给 client。

要满足这个需求，我们可以先执行一次更新操作，然后在执行查询操作将更新后的数据再次取出来。

但这太繁琐了，有一个更好的办法。

#### find_one_and_update

```python
from time import time
from pymongo import ReturnDocument

# Get user inputted content
new_content = get_user_input()

col.find_one_and_update(
    # Match article by id
    {
        '_id': ObjectId('5b432a42f04705565525529d')
    },
    # Update content and timestamp
    {
        '$set': {
            'content': new_content,
            'updated_time': time()
        }
    },
    # Project fields
    {
        'title': 1,
        'username': 1,
        'content': 1,
        'reviews': 1,
        'comment': 1,
        'updated_time': 1
    },
    # Return modified document
    return_document=ReturnDocument.AFTER
)
```

例子稍微有点长，首先我们导入了两个工具，用途我们稍后再看。

和之前一样，假设我们从 `get_user_input()` 方法拿到了检查过的用户输入内容。

使用 `find_one_and_update` 更新数据。

第一个参数是 filter，我们匹配一个唯一的 `_id` 字段。

第二个参数是更新内容，我们用用户输入内容更新了 `content`，并且使用 `time()` 工具更新时间戳。

第三个参数是 `project`，在之前 `find` 的介绍中已经说明过它的用途，在这里用法一般无二。

第四个参数是一个关键字参数，是可以省略的。

但是记住，默认情况下，`find_one_and_update` 方法会返回**更新前的文档**。

但是我们的需求是获得更新之后的文档，`return_document` 参数用来修改默认的行为。

从 `pymongo` 包中导入的 `ReturnDocument` 工具可以帮我们解决这个问题。

设置 `return_document=ReturnDocument.AFTER` 即可告诉 MongoDB 给我们更新后的文档。

关于更新，了解这些想必搭建一个 blog 网站是够用了。

这一部分涉及的文档：

- [Field Update Operators](https://docs.mongodb.com/manual/reference/operator/update-field/)
- [collection – Collection level operations - update_one()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.update_one)
- [collection – Collection level operations - update_many()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.update_many)
- [collection – Collection level operations - find_one_and_update()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.find_one_and_update)

### delete 删除

一般的删除操作个人认为应该进行软删除，即更新一个删除 flag，数据仍然保留，但是在页面上不再显示，逻辑上认为该数据已被删除。

但在一些情况下物理删除也是必要的，出于对用户信息保护的考虑，建议给予用户删除个人数据的权利。

删除操作比较简单，但需要慎重。

#### delete_one

```python
col.delete_one(
    # Delete specified article
    {'_id': ObjectId('5b432a42f04705565525529d')}
)
```

上面的例子将删除 `_id` 匹配的文章。

有时我们也需要批量删除。

#### delete_many

```python
col.delete_many(
    # Delete articles which deleted flag is True
    {'deleted': True}
)
```

上面的例子删除所有已被逻辑删除（删除 flag 为 True）的文章。

有时我们可能也需要将删除的文档放在 response 中返回给 client。虽然可能性比较小，姑且看看如何满足这个需求。

#### find_one_and_delete

```python
col.find_one_and_delete(
    # Match article by id
    {
        '_id': ObjectId('5b432a42f04705565525529d')
    },
    # Project fields
    {
        'title': 1,
        'username': 1,
        'content': 1,
        'reviews': 1,
        'comment': 1,
        'updated_time': 1
    }
)
```

上面这个例子很简单，匹配 `_id` 对应的文章，删除它，第二个参数作为 `project` 声明获取的字段，最终我们会得到一个文档，但是在数据库这个文档已经被删除了。

删除操作看上去很简单，但是一份数据被删除的后果可能会很严重，对于删除操作我们应该小心慎行。

这部分内容涉及的文档：

- [collection – Collection level operations - delete_one()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.delete_one)
- [collection – Collection level operations - delete_many()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.delete_many)
- [collection – Collection level operations - find_one_and_delete()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.find_one_and_delete)

### insert 插入

了解完查询、更新和删除，插入操作则显得很简单。

用户发来了一条评论，我们需要保存用户的评论。

#### insert_one

```python
col.insert_one(
    {
        'username': 'Richard',
        'article_id': ObjectId('5b432a42f04705565525529d'),
        'comment': 'Awesome!',
        'timestamp': 1531211551.682105
    }
)
```

上面的例子将保存一条来自用户 Richard 的评论，虽然评论内容没什么意义，但是它还是被正常的保存在数据库了。

或许我们应该把这条评论的 ID 发回客户端，让我们稍微修改下这个例子。

```python
result = col.insert_one(
    {
        'username': 'Richard',
        'article_id': ObjectId('5b432a42f04705565525529d'),
        'comment': 'Awesome!',
        'timestamp': 1531211551.682105
    }
)
comment_id = result.inserted_id
```

用一个变量接受插入操作的结果对象，里面包含了我们需要的 ID，使用 `inserted_id` key 可以将其取出来。

你或许觉得有些麻烦，为何我们不能手动设置 ID，或者设置我们想要的 ID？

再修改一下代码。

```python
col.insert_one(
    {
        '_id': 'cid007',
        'username': 'Richard',
        'article_id': ObjectId('5b432a42f04705565525529d'),
        'comment': 'Awesome!',
        'timestamp': 1531211551.682105
    }
)
```

当我们手动指定了 ID 字段，MongoDB 将不会自动为我们生成新的 ID，有些时候会比较有用，根据你的习惯觉得指定还是不指定它吧。

可能我们会处于性能考虑，收集一定的评论之后同时更新。

#### insert_many

```python
col.insert_many(
    [
        {
            'username': 'Richard',
            'article_id': ObjectId('5b432a42f04705565525529d'),
            'comment': 'Awesome!',
            'timestamp': 1531211551.682105
        },
        {
            'username': 'Richard',
            'article_id': ObjectId('5b432a42f04705565525529d'),
            'comment': 'Awesome again!',
            'timestamp': 1531212418.92356
        }
    ]
)
```

我们又插入了两条没有意义的评论。

可以看到 `insert_many` 接收一个文档 list，同样的，如果需要得到 ID，可以用一个变量接收插入操作的结果，使用 `inserted_ids` 来获得 ID，但是注意，获得的将会是一个 ID 的 list。

插入操作同样很简单。

但是目前为止，我们似乎默认了一个事实，将评论储存在一个单独的 collection 中。

MongoDB 是一个文档数据库，不应该用传统的关系型数据库的思路来看待它，对于文章和评论这种典型的一对多的关系，内嵌数组或许会是一种更好的数据结构。

```python
articles = {
    # Article ID
    '_id': '5b33af56d2cbe686e00b75c9',
    # Other fields
    # ...
    # Comments
    'comments': [
        {
            # Comment ID
            'cid': '5b3dc242f0470538510b28d7',
            # Username
            'from': 'Richard',
            # Comment body
            'body': 'Content of comment.',
            # Created or updated timestamp
            'timestamp': 1529248843.301676,
            # Deleted flag
            'deleted': False
        },
        # ...
    ],
    # Created or updated timestamp
    'timestamp': 1529248869.717813,
    # ...
}
```

评论作为一个 list 内嵌在所属的文章文档里，这时添加一个评论不再是插入操作了，它变成了一个更新操作。

#### update array use \$push

```python
col.update_one(
    {'_id': Object('5b33af56d2cbe686e00b75c9')},
    {
        '$push': {
            'comments': {
                'username': 'Richard',
                'cid': ObjectId(),
                'comment': 'Awesome!',
                'timestamp': 1531211551.682105
            }
        }
    }
)
```

使用 `$push` 操作符可以将一条评论添加到评论 list 中。

由于评论不再是单独的文档，不会自动生成 ID 属性，如果需要的话我们可以手动生成一个 ID 属性。

这部分涉及的文档：

- [collection – Collection level operations - insert_one()](http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.insert_one)
- [collection – Collection level operations - insert_many()](hhttp://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.insert_many)
- [results – Result class definitions - InsertOneResult](http://api.mongodb.com/python/current/api/pymongo/results.html#pymongo.results.InsertOneResult)
- [results – Result class definitions - InsertManyResult](http://api.mongodb.com/python/current/api/pymongo/results.html#pymongo.results.InsertManyResult)
- [Array Update Operators](https://docs.mongodb.com/manual/reference/operator/update-array/)

### 总结

现在我们已经了解了 MongoDB 的增删改查的操作。

无论增删改查，都有两种模式，操作单一文档的方法后缀都是 `one`:

- insert_one
- delete_one
- update_one
- find_one

而操作多个文件基本都是加后缀 `many`，只有 `find` 是特殊的，什么都不加：

- insert_many
- delete_many
- update_many
- find

对于更新或者删除之后的数据，有时我们需要拿到更新后或者删除前的文档返回给客户端，有两个方法很实用：

- find_one_and_update
- find_one_and_delete

但是注意，`find_one_and_update` 默认返回更新前的文档，设定 `return_document=ReturnDocument.AFTER` 可以变更默认行为，让它返回修改后的文档。

对于查询来说，我们还了解了 `project` 的概念，以此来声明我们需要哪些字段。

对于 `project` 要注意两点：

- `_id` 是默认会取出的，除非在 `project` 中声明不包含（设为 0）
- `_id` 以外的字段，在 `project` 中不可以同时声明包含（设为 1）和不包含（设为 0），否则将会报错

除此之外，我们还看了看 MongoDB 中的比较操作符，快速扫一眼：

- `$eq` equal to
- `$gt` greater than
- `$gte` greater than or equal to
- `$lt` less than
- `$lte` less than or equal to
- `$ne` not equal to
- `$in` match in an array
- `$nin` not match in an array

然后，还有更新操作符：

- `$set` 设置更新字段内容
- `$inc` 设置更新字段增量
- `$push` 添加一个对象到内嵌数组

感觉如何？是不是很简单？

但是等等！如果你熟悉 SQL 的话可能会想，除了这些基础的功能，在 SQL 中实用的 GROUP BY、MAX、SUM 甚至 PARTITION BY 等分析函数在 MongoDB 中没有对应的实现吗？

答案是有的！我们需要的大部分分析函数在 MongoDB 中都有相应的实现。

MongoDB 使用 `aggregate` 来满足各种数据分析的需求。

当我们需要在查询中做一些数据分析或者一些更精细的操作时，我们将感受到 find 的乏力。`aggregate` 帮我们做到这些，如果有机会在之后的文章中我们再来讨论一下聚合的用法吧。

切实需要的东西才能在我们的记忆中保留一席之地，过多实际用不到的，或者近期用不到的信息，只会让记忆系统趋于混沌。

目前我们已经了解了足够的知识来使 MongoDB 为我们所用了。

等到需求或者求知欲继续延伸，就是进一步学习的最好时机。
