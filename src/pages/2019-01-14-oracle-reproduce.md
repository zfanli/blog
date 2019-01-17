---
title: Oracle 数据库 SQL 调优笔记 2 - 重现与实践
subtitle: 使用 Docker 快速搭建一个 Oracle 数据库测试环境，来做一次调优实战！
date: 2019-01-14 10:15:00 +8
# lastUpdateTime: 2019-01-08 17:57:00 +8
tags:
  - Oracle
  - SQL
  - Database
  - Docker
---

上篇文章最后留了一个清除缓存的 Tips，这篇文章将会用到，所以在这里再贴一次。

```sql
alter system flush buffer_cache;
alter system flush shared_pool;
```

---

### 写在前面

用两篇文章来对最近项目中遇到的 SQL 性能问题做一个笔记和总结。

上篇文章中我们描述了优化的思路，并且结合案例介绍了几个主要问题的优化方案。这篇文章将搭建一个测试环境来对其中的一些案例进行重现，并套用解决方案来做一个实战。

- [Oracle 数据库 SQL 调优笔记 1 - 思路和方案](#/post/Oracle%20数据库%20SQL%20调优笔记%201%20-%20思路和方案)
- Oracle 数据库 SQL 调优笔记 2 - 重现与实践（本文）

### 准备

这是准备部分。

#### 搭建测试环境

> ⚠️ 如果你的环境已经准备就绪，可以跳过这一步。

方便起见，直接用 Docker 来快速搭建一个 Oracle 数据库环境。如果你还没有 Docker 环境，那么首先从 [这里](https://www.docker.com/get-started) 下载并安装 Docker。

在命令行确认一下 Docker 版本，确认是否安装成功。

```bash
$ docker --version
Docker version 18.09.0, build 4d60db4
```

首先登陆 Docker Hub，使用下载时注册的账户。敲以下命令然后根据提示来登陆即可。

```bash
$ docker login
```

登陆完成后，可以拉取 Oracle 数据库环境了。使用下面的命令，拉取一个别人已经配置好的 Oracle 12c 版本的数据库。这个版本不是企业版，不能做表分区，不过这次我们不尝试表分区内容，所以标准版足够了。

```bash
$ docker pull sath89/oracle-12c
```

文件有点大，等安装完成后，使用下面的命令来启动 Oracle 数据库。

```bash
$ docker run -d -e WEB_CONSOLE=false -p 1521:1521 sath89/oracle-12c
```

稍等片刻，控制台会输出一长串的 ID，Oracle 数据库已经启动成功了，并且映射到本地 `1521` 端口上了，这时可以使用任何你喜欢的工具连接数据库进行后面的操作了。连接数据库时使用下面的参数。

```yaml
hostname: localhost
port: 1521
sid: xe
service name: xe
username: system
password: oracle
```

也可以直接进入虚拟机环境中使用 SQL\*Plus。

```bash
# 首先拿到 Container 的 ID
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                              NAMES
2a00bcc34a0f        sath89/oracle-12c   "/entrypoint.sh "   8 minutes ago       Up 8 minutes        0.0.0.0:1521->1521/tcp, 8080/tcp   recursing_saha
# 用拿到的 ID 进入控制台
$ docker exec -it 2a00bcc34a0f /bin/bash
# 可以看到前缀的变换，现在已经处于虚拟机中的控制台
# 然后，切换到 oracle 用户
root@2a00bcc34a0f:/\# su oracle
# 进入 Oracle 安装目录
oracle@2a00bcc34a0f:/$ cd $ORACLE_HOME
# 启动 sqlplus
oracle@2a00bcc34a0f:/u01/app/oracle/product/12.1.0/xe$ bin/sqlplus / as sysdba

SQL*Plus: Release 12.1.0.2.0 Production on Tue Jan 8 09:51:44 2019

Copyright (c) 1982, 2014, Oracle.  All rights reserved.


Connected to:
Oracle Database 12c Standard Edition Release 12.1.0.2.0 - 64bit Production

SQL> select 1 from dual;

   1
----------
   1

SQL>
```

要关闭 Oracle 数据库，输入下面的命令。如果不知道 Container ID，可以使用 `docker ps` 命令查询。

```bash
$ docker container stop [container id]
```

参考文档：

- [Docker Documentation](https://docs.docker.com/)
- [Docker Hub - sath89/oracle-12c](https://hub.docker.com/r/sath89/oracle-12c)

#### 准备测试数据

我们设计一个游戏场景。假设有两张表，一个叫做 `characters`，用来储存所有的角色信息，让我们一步一步创建。

```sql
create table characters_temp as select
  -- 角色 ID（1-500000）递增，左边补零到 8 位
  lpad(level, 8, '0') as character_id,
  -- 玩家 ID，可重复（1-500000）中随机
  floor(dbms_random.value(1, 500000)) as gamer_id,
  -- 角色性别，0: Female，1: Male
  floor(dbms_random.value(0, 2)) as character_gender,
  -- 角色等级（1-100）中随机
  floor(dbms_random.value(1, 100)) as character_level,
  -- 角色持有的金币（1-10000）中随机
  floor(dbms_random.value(1, 10000)) as character_coin,
  -- 创建时间
  current_timestamp as create_date,
  -- 角色名称
  'NAME_' || level as character_name
from dual connect by level <= 500000;
```

执行上面的语句，可以得到一张 50 万数据的临时角色表。不过目前字段比较少，真实场景肯定不止这些字段，我们利用笛卡尔积来丰富测试数据，让两张表相乘，扩充一下其他字段作为背景数据。这里看上去 `all_indexes` 表字段比较多，就用它来扩充数据了。

```sql
create table characters as select
  t.*, d.*
from
  characters_temp t,
  (select * from all_indexes
  where rownum = 1) d;
```

执行完上面的语句，我们的数据量虽然不变，但是字段数量增加了不少。我们先给这张表加上主键。

```sql
alter table characters
  modify character_id varchar2(8) not null;
alter table characters
  add constraint characters_pk primary key (character_id);
```

到这里角色表的数据就准备完成了，此时表结构应该是这样的。

```sql
SQL> desc characters;
 Name                  Null?    Type
 --------------------- -------- ----------------------------
 CHARACTER_ID          NOT NULL VARCHAR2(8)
 GAMER_ID                       NUMBER
 CHARACTER_GENDER               NUMBER
 CHARACTER_LEVEL                NUMBER
 CHARACTER_COIN                 NUMBER
 CREATE_DATE                    TIMESTAMP(6) WITH TIME ZONE
 CHARACTER_NAME                 VARCHAR2(45)
-- 以上是我们会用到的字段，以下是背景数据的字段，共 60 个字段
 OWNER                 NOT NULL VARCHAR2(128)
 INDEX_NAME            NOT NULL VARCHAR2(128)
 ...
 ...
 ...
 ORPHANED_ENTRIES               VARCHAR2(3)
 INDEXING                       VARCHAR2(7)
```

并且存在一个主键索引。

```sql
SQL> select index_name from user_indexes
where table_name = upper('characters');

INDEX_NAME
---------------
CHARACTERS_PK
```

另一张表 `items` 用来储存角色的所持物品信息，我们定义每个角色有 10 个物品栏，每个物品栏可以放一种物品，数量在 1 和 99 之间，设定类似 MineCraft。

```sql
create table items_temp as select
  -- 物品顺序（1-10）
  i.item_order as item_order,
  -- 角色 ID
  c.character_id as character_id,
  -- 物品 ID（1-50）中随机
  floor(dbms_random.value(1, 51)) as item_id,
  -- 物品数量（1-99）中随机
  floor(dbms_random.value(1, 100)) as item_num,
  -- 物品可用 flag（0-1）中随机
  floor(dbms_random.value(0, 2)) as enable_flag,
  -- 更新时间
  current_timestamp as last_update_time,
  -- 物品描述
  'DESCRIPTION_' || current_timestamp as item_description
from
  characters c,
  (select level as item_order
    from dual connect by level <= 10) i;
```

为了方便起见，物品表将给每个角色都创建 10 条记录，用来分别储存每个物品格子的信息，而对于物品格子中是否存在物品，则使用 `enable_flag` 来控制。执行这条语句，稍等片刻，可以得到了一张 500 万数据的测试表。

依照之前的方法，将物品表也添加上一些其他字段来丰富数据。

```sql
create table items as select
  i.*, d.*
from
  items_temp i,
  (select * from all_indexes
  where rownum = 1) d;
```

同样的，给物品表加上主键。物品表使用角色 ID + 物品顺序字段作为联合主键。

```sql
alter table items
  modify item_order number not null;
alter table items
  add constraint items_pk primary key (character_id, item_order);
```

物品表的表结构应该是这样的。

```sql
SQL> desc items;
 Name                   Null?    Type
 --------------------- -------- ----------------------------
 ITEM_ORDER            NOT NULL NUMBER
 CHARACTER_ID          NOT NULL VARCHAR2(8)
 ITEM_ID                        NUMBER
 ITEM_NUM                       NUMBER
 ENABLE_FLAG                    NUMBER
 LAST_UPDATE_TIME               TIMESTAMP(6) WITH TIME ZONE
 ITEM_DESCRIPTION               VARCHAR2(85)
-- 以上是我们会用到的字段，以下是背景数据的字段，共 60 个字段
 OWNER                 NOT NULL VARCHAR2(128)
 INDEX_NAME            NOT NULL VARCHAR2(128)
 ...
 ...
 ...
 ORPHANED_ENTRIES               VARCHAR2(3)
 INDEXING                       VARCHAR2(7)
```

还有一个主键索引。

```sql
SQL> select index_name from user_indexes
where table_name = upper('items');

INDEX_NAME
-----------
ITEMS_PK
```

测试数据的准备就完成了。

#### 开始实战之前

准备已经就绪，不过在进入实战之前，还有一些 Tips 可以帮助我们进展的更顺利。

**打开 `timing` 显示执行时间。**

`timing` 设置会把 SQL 执行的时间输出到控制台，方便我们评估性能，所以，你不用再掐表算时间了。

```sql
SQL> set timing on;
SQL> select 1 from dual;

   1
----------
   1

Elapsed: 00:00:00.02
```

**打开 `autotrace` 显示执行计划。**

`autotrace` 设置可以让我们查看当前 SQL 的真实执行计划，来帮助我们定位性能问题所在。

```sql
SQL> set autotrace on;
SQL> select 1 from dual;

   1
----------
   1

Execution Plan
----------------------------------------------------------
Plan hash value: 1388734953

-----------------------------------------------------------------
| Id  | Operation        | Name | Rows  | Cost (%CPU)| Time     |
-----------------------------------------------------------------
|   0 | SELECT STATEMENT |      |     1 |     2   (0)| 00:00:01 |
|   1 |  FAST DUAL       |      |     1 |     2   (0)| 00:00:01 |
-----------------------------------------------------------------


Statistics
----------------------------------------------------------
    0  recursive calls
    0  db block gets
    0  consistent gets
    0  physical reads
    0  redo size
  535  bytes sent via SQL*Net to client
  551  bytes received via SQL*Net from client
    2  SQL*Net roundtrips to/from client
    0  sorts (memory)
    0  sorts (disk)
    1  rows processed
```

执行计划的解读可以参考下面的资料，但是官方资料很多地方都不在我们的关注点上，不过好在仔细阅读执行计划也能悟出很多有用的信息，至少走没走索引是看一眼就知道的。

**进行表分析**

Oracle 的优化器根据表的统计信息来选择执行计划。

有时我们会发现执行计划可能不太准确，比如添加一个索引后，查看执行计划发现 cost 降低了很多，但是实际执行起来却效率低下，这是为什么？

很有可能是因为这张表没有统计信息，或者统计信息过时了，此时需要再次对表进行分析，更新统计信息，才能让优化器选择最合适的执行计划。

执行下面的语句，对两张测试表进行分析。一般对表进行大规模对数据删除或者插入之后需要重新进行分析，来保证优化器选择正确的执行计划。

```sql
analyze table characters compute statistics;
analyze table items compute statistics;
```

**⚠️ 仅测试环境下，降低服务器可用资源。**

为了方便再现性能问题，我们可以限制一下 Docker 引擎使用的 CPU 资源，模拟低配置环境，参考下图。

![Docker Configuration](/img/DockerConfiguration.png)

参考文档：

- [Database SQL Tuning Guide - 7 Reading Execution Plans](https://docs.oracle.com/database/121/TGSQL/tgsql_interp.htm#TGSQL94618)

### 探索测试数据

环境搭建好了，数据也准备好了，可以开始实战了。不过先别慌，这些数据都是随机生成的，我们不妨先来探索一下，了解这些数据的大致情况。

> ⚠️ 由于大部分都是随机数据，所以如果你跟着我的步骤探索的话，你的结果可能会和我的不同。不妨来看看我们的数据之间有多大的差别？

先来看看数据量，按照之前的 DDL 来看，`characters` 表应该有 50 万数据。

```sql
SQL> select count(1) from characters;

  COUNT(1)
----------
    500000

Elapsed: 00:00:00.35
```

`items` 表则是 500 万。

```sql
SQL> select count(1) from items;

  COUNT(1)
----------
   5000000

Elapsed: 00:00:00.58
```

嗯，看上去没问题，由于存在主键，`count(1)` 函数会使用到主键索引，所以速度会很快。从执行计划可以看出来。

```sql
SQL> set autotrace traceonly;
SQL> select count(1) from items;

Elapsed: 00:00:00.18

Execution Plan
----------------------------------------------------------
Plan hash value: 3881446812

------------------------------------------------------------------------

| Id  | Operation             | Name     | Rows  | Cost (%CPU)| Time    |

------------------------------------------------------------------------

|   0 | SELECT STATEMENT      |          |     1 |  4185   (1)| 00:00:01|

|   1 |  SORT AGGREGATE       |          |     1 |            |         |

|   2 |   INDEX FAST FULL SCAN| ITEMS_PK |  4523K|  4185   (1)| 00:00:01|

------------------------------------------------------------------------


Note
-----
   - dynamic statistics used: dynamic sampling (level=2)


Statistics
----------------------------------------------------------
    0  recursive calls
    0  db block gets
15394  consistent gets
    0  physical reads
    0  redo size
  542  bytes sent via SQL*Net to client
  551  bytes received via SQL*Net from client
    2  SQL*Net roundtrips to/from client
    0  sorts (memory)
    0  sorts (disk)
    1  rows processed
```

请注意执行计划中的关键字 `ITEMS_PK` 和 `INDEX FAST FULL SCAN`，这说明这条 SQL 语句使用了主键索引，并且执行了索引快速全表扫描。如果这里没有主键会如何呢？我们尝试一下先删除主键，然后再执行一次之前的语句。

```sql
SQL> alter table items drop constraint items_pk;

Table altered.

Elapsed: 00:00:00.31

SQL> select count(1) from items;

  COUNT(1)
----------
   5000000

Elapsed: 00:00:07.03
```

可以看到查询时间从不到 0.58 秒飙升到了 7.03 秒。主键索引让查询速度提升了十多倍，并且通常来说，数据了越大的情况下，提升的越明显。

执行计划也不同，由于过于冗长，我就不贴具体的内容了，想看具体执行计划可以本地跑一下这条语句。

如同之前一样，我们只需要关注几个关键字就足够了。没有主键的情况下 `items` 走了全表，执行了 `TABLE ACCESS FULL` 计划，从字面上理解，就是全表检索。并且 cost 为 58940，而使用主键的情况下 cost 为 4185。

⚠️ 如果你跟着我的步骤把主键删除了的话，别忘了用下面的语句再加回来。

```sql
alter table items
  add constraint items_pk primary key (character_id, item_order);
```

下一步，我们来看看表空间有多大。

```sql
SQL> select
  segment_name as table_name,
  bytes / 1024 / 1024 mb
from user_segments
where segment_name = upper('characters')
or segment_name = upper('items');

TABLE_NAME        MB
------------- ------
CHARACTERS       151
ITEMS           1735

Elapsed: 00:00:00.03
```

接近 10 倍差距，正常范围。

创建角色表的时候，玩家 ID 是使用一个 1-50,0000 之间的随机数来表示的，50 万的数据量下必定会存在重复的玩家 ID，对于重复的数据我们可以定义为同一个玩家所创建的不同角色。来让我们看看一共有多少个“独立”玩家。

```sql
SQL> select count(1) from (
  select distinct gamer_id from characters
);

  COUNT(1)
----------
    316260

Elapsed: 00:00:01.04
```

从结果中我们得到了 2 个信息。最明显的信息告诉我们，一共存在超过 31 万的玩家，这说明有接近 19 万的角色是属于其他玩家下面的重复角色。另一个信息就是执行速度，超过了 1 秒。

不过角色表规模较小，还看不出来这个 1 秒的差距。我们来看看数据规模大一点的物品表。

物品表中有一个 `enable_flag` 来控制这个物品是否是有效的，所以来看看有效的物品一共有多少吧。

```sql
SQL> select count(1) from items where enable_flag = 1;

  COUNT(1)
----------
   2499255

Elapsed: 00:00:06.33
```

一个非常趋于概率的结果。注意查询时间是 6 秒，对这样一个查询来说，这算是很长的时间了。我们已经可以看到一些性能问题的端倪。

再来一个稍微复杂点的例子，来看看每个角色平均持有的有效物品数量。

```sql
SQL> select avg(c) from (
  select count(1) c from items where enable_flag = 1
  group by character_id
);

    AVG(C)
----------
5.00361369

Elapsed: 00:00:09.06
```

执行时间 9 秒！

看看有多少角色拥有超过 5 个有效物品。

```sql
SQL> select count(c) from (
  select character_id c from items where enable_flag = 1
  group by character_id having count(1) > 5
);

  COUNT(C)
----------
    188762

Elapsed: 00:00:05.29
```

接近 19 万，执行了 5 秒。

看看有多少角色等级超过 60 级。

```sql
SQL> select count(1) from characters where character_level > 60;

  COUNT(1)
----------
    196683

Elapsed: 00:00:01.58
```

接近 20 万。这次查询的是规模小的角色表，执行时间 1 秒。

我们已经大概了解了数据的情况。

- 角色表只有 50 万数据，表空间仅 151 M，即使不使用索引，把全表数据加载到内存处理依旧很快；
- 而物品表有 500 万数据，表空间有 1,735 M，任何走全表的操作都会降低 SQL 执行的速度，这个尺寸的数据已经不太适合全部加载到内存后再做操作了。

### 重现索引优化案例

目前除了主键以外还没有其他索引，在之前的探索中我们已经发现了一些性能问题的端倪，现在让我们设计一个需求。

角色表中的 `character_coin` 字段表示这个角色的持有金币数量，我们假设一个需求，出于统计目的，现在需要知道所有持有金币数量少于 `1,000` 的角色，其所持有的物品 ID 为 `7` 的物品的数量总和。

- **需求**：
  - 物品数量总和
- **条件**：
  - 角色持有金币数量少于 `1,000`
  - 物品 ID 为 `7`
  - 物品有效

别去考虑这个需求有什么用。首先这是简单的 `inner join` 关系，条件也很明确，所以我们很快可以得出下面的 SQL 语句。

```sql
select
  sum(i.item_num)
from
  items i
inner join
  characters c
on
  c.character_id = i.character_id
where
      c.character_coin <= 1000
  and i.enable_flag = 1
  and i.item_id = 7;
```

把这条语句丢给 Oracle 执行一下试试看。

```sql
SUM(I.ITEM_NUM)
---------------
         256808

Elapsed: 00:00:17.30
```

这个结果是物品表 `item_num` 字段的求和的值，虽然结果是 25 万多，但是涉及到的数据应该不会很多。最终这条语句执行花了 17.3 秒。

让我们先来看看执行计划，尝试定位一下性能问题所在。

```sql
Execution Plan
----------------------------------------------------------
Plan hash value: 2594570633

------------------------------------------------------------------------

| Id  | Operation           | Name       | Rows  | Bytes |TempSpc| Cost(%CPU) | Time      |

------------------------------------------------------------------------

|   0 | SELECT STATEMENT    |            |     1 |    29 |       | 64304   (1)| 00:00:03 |

|   1 |  SORT AGGREGATE     |            |     1 |    29 |       |            |          |

|*  2 |   HASH JOIN         |            | 49985 |  1415K|  1128K| 64304   (1)| 00:00:03 |

|*  3 |    TABLE ACCESS FULL| CHARACTERS | 50010 |   537K|       |  5218   (1)| 00:00:01 |

|*  4 |    TABLE ACCESS FULL| ITEMS      | 49985 |   878K|       | 58960   (1)| 00:00:03 |

------------------------------------------------------------------------


Predicate Information (identified by operation id):
---------------------------------------------------

   2 - access("C"."CHARACTER_ID"="I"."CHARACTER_ID")
   3 - filter("C"."CHARACTER_COIN"<=1000)
   4 - filter("I"."ITEM_ID"=7 AND "I"."ENABLE_FLAG"=1)


Statistics
----------------------------------------------------------
    191  recursive calls
      0  db block gets
 238878  consistent gets
 237747  physical reads
      0  redo size
    551  bytes sent via SQL*Net to client
    551  bytes received via SQL*Net from client
      2  SQL*Net roundtrips to/from client
      7  sorts (memory)
      0  sorts (disk)
      1  rows processed
```

执行计划提示了很多信息，我们提取一些对我们有用的出来。

- 整体 cost 为 `64,304`
- `CHARACTERS` 访问了全表
- `ITEMS` 访问了全表

#### 开始尝试添加索引

从执行计划中可以了解到，两张表都走了全表检索是真正影响执行效率的原因所在，对于这个场合我们不需要所有的数据，所以可以使用索引来优化查询性能。

对于角色表来说，仅使用到两个字段作为查询的条件，`character_id` 作为关联条件，`character_coin` 作为筛选条件。所以对这 2 个字段创建索引。

```sql
create index characters_index1 on characters (
  character_id,
  character_coin
);
```

对物品表来说，有 3 个字段作为查询条件，一个 `character_id` 作为关联条件，然后 `enable_flag` 和 `item_id` 作为筛选条件；此外，还有 1 个字段 `item_num` 最终被选出进行求和，所以一共需要对 4 个字段创建索引。

```sql
create index items_index1 on items (
  character_id,
  enable_flag,
  item_id,
  item_num
);
```

创建好上面的索引，我们准备再执行一次之前的语句。不过先别急，Oracle 会自动使用缓存，所以如果重复查询同一条 SQL，速度只会越来越快，这会影响我们尝试性能调优的结果，所以我们先执行下面两条语句，清除掉缓存的影响。

```sql
alter system flush buffer_cache;
alter system flush shared_pool;
```

好了，接下来让我们重新执行一次之前的语句。

```sql
SQL> select
  sum(i.item_num)
from
  items i
inner join
  characters c
on
  c.character_id = i.character_id
where
      c.character_coin <= 1000
  and i.enable_flag = 1
  and i.item_id = 7;

SUM(I.ITEM_NUM)
---------------
         256808

Elapsed: 00:00:03.29
```

从 17.3 秒降低到了 3.29 秒，接近 5 倍的性能提升。再来看看执行计划上的变化。

```sql
Execution Plan
----------------------------------------------------------
Plan hash value: 3200269783

------------------------------------------------------------------------

| Id  | Operation              | Name              | Rows  | Bytes |TempSpc| Cost (%CPU)| Time     |

------------------------------------------------------------------------

|   0 | SELECT STATEMENT       |                   |   1   |    29 |       |  6000   (1)| 00:00:01 |

|   1 |  SORT AGGREGATE        |                   |   1   |    29 |       |            |          |

|*  2 |   HASH JOIN            |                   |  5337 |   151K|  1128K|  6000   (1)| 00:00:01 |

|*  3 |    INDEX FAST FULL SCAN| CHARACTERS_INDEX1 | 50010 |   537K|       |   458   (1)| 00:00:01 |

|*  4 |    INDEX FAST FULL SCAN| ITEMS_INDEX1      | 49985 |   878K|       |  5416   (1)| 00:00:01 |

------------------------------------------------------------------------


Predicate Information (identified by operation id):
---------------------------------------------------

   2 - access("C"."CHARACTER_ID"="I"."CHARACTER_ID")
   3 - filter("C"."CHARACTER_COIN"<=1000)
   4 - filter("I"."ITEM_ID"=7 AND "I"."ENABLE_FLAG"=1)

Note
-----
   - dynamic statistics used: dynamic sampling (level=2)


Statistics
----------------------------------------------------------
 1653  recursive calls
    0  db block gets
27292  consistent gets
22596  physical reads
    0  redo size
  551  bytes sent via SQL*Net to client
  551  bytes received via SQL*Net from client
    2  SQL*Net roundtrips to/from client
  106  sorts (memory)
    0  sorts (disk)
    1  rows processed
```

依旧从执行计划上提取我们感兴趣的信息。

- 整体 cost 为 `6,000`
  - 相较之前的 `64,304` 有明显的改善
- 角色表使用了新建的 `CHARACTERS_INDEX1` 索引
  - 相较于全表检索，全索引检索对性能有明显的改善
- 物品表使用了新建的 `ITEMS_INDEX1` 索引
  - 同上

#### 小结

我们对目前遇到的问题和使用的方法做一个小结。

- 执行计划可以帮助我们定位问题的所在
  - **前提是表进行过分析**
  - 当执行计划不准确时可能是由于统计信息过时
  - 你需要重新进行表分析
- 创建索引时尽量包含查询字段
  - \*包含更多的字段将造成索引表所占空间增大
  - \*包含更多字段也将造成索引表检索时间变长
  - 包含查询字段可以避免回查开销
- 创建索引时如果仅包含查询条件
  - 使用 `ROWID` 对原表进行回查获取查询字段的数据
- 创建索引将降低数据写入效率
  - 因为数据变动时需要同步更新索引表
  - 写入操作多的表慎加索引

### 重现 `merge` 优化案例

就数据库的增删改查来说，可能我们平时熟悉的是 `insert`、`delete`、`update` 和 `select`，而 `merge` 是一个聚合操作，可以在一条语句里面实现增删改查。

merge 的语法结构表明了其适用于参照一张表的数据来操作另一张表的场合。其他操作暂且不论，当使用 merge 来替代 update 时，由于更新机制的不同，似乎 merge 拥有天然优势，经常能比 update 操作要快。

下面的语句将物品表所有数据的 `enable_flag` 设置为 `0`，即失效所有物品。经过多次清除缓存再执行之后，在我本地环境下平均水平在 2 分 10 秒左右。

```sql
SQL> update items set enable_flag = 0;

5000000 rows updated.

Elapsed: 00:02:16.88
```

下面则是使用 merge 来进行这一操作，同样的多次清除缓存执行的结果，平均水平在 1 分 30 秒左右。

```sql
SQL> merge into items i using dual
on (1=1) when matched then
update set i.enable_flag = 0;

5000000 rows merged.

Elapsed: 00:01:35.50
```

即使是这么简单的任务，merge 依旧比 update 要快 40 秒左右，提升 30% 的效率。

但是通过分析两边的执行计划，我们得到了下面的信息。

- `update` 的 cost 为 39,811；`merge` 为 59,127
- `update` 访问并修改了 61M 数据；`merge` 最终修改了 61M 数据，但是中途访问了 1,239M 数据

merge 虽然速度快于 update，但是由于访问数据量远超过 update，所以优化器判定其开销大于 update。

简单说，就是这种情况下 merge 会使用更多的内存来提升执行效率。不过 merge 本身并不是被设计成主要用来处理这种情况的，来看一个复杂点的例子。

首先还是设计一个更新的需求。

探索数据的时候我们发现同一个玩家 ID 下面会有重复的角色，而且重复角色有接近 19 万之多！所以我们做一个恶作剧，找到存在多个角色的玩家，保留等级最高的那个角色不动，将其他的角色对应的所有的物品数量，更新为这个角色的等级！

> 还是那句话，别想这有什么意义。就当是来自一个黑客的恶作剧把 👿！

分析一下这个需求，我们需要做这些事情。

- **需求**：
  - 将物品数量字段更新为等级字段的值
- **条件**：
  - 玩家 ID 相同
  - 拥有多个角色
  - 除了等级最高的角色之外
  - 所有物品栏

```sql
update items i set enable_flag = 0
where exists(
  select 1 from (
    select
      c.character_id,
      row_number() over(
        partition by c.gamer_id
        order by c.character_level desc
      ) as flag
    from
      characters c
    inner join
      (select gamer_id from characters
      group by gamer_id having count(1) > 1) t
    on t.gamer_id = c.gamer_id
  ) c
  where c.flag > 1
  and c.character_id = i.character_id
);


select count(1) from (
  select
    c.character_id,
    row_number() over(
      partition by c.gamer_id
      order by c.character_level desc
    ) as flag
  from
    characters c
  inner join
    (select gamer_id from characters
    group by gamer_id having count(1) > 1) t
  on t.gamer_id = c.gamer_id
) where flag > 1
;
```

```sql
merge into items i using (
  select character_id from (
    select
      c.character_id,
      row_number() over(
        partition by c.gamer_id
        order by c.character_level desc
      ) as flag
    from
      characters c
    inner join
      (select gamer_id from characters
      group by gamer_id having count(1) > 1) t
    on t.gamer_id = c.gamer_id
  ) where flag > 1
) t
on (i.character_id = t.character_id)
when matched then
update set i.enable_flag = 0;
```
