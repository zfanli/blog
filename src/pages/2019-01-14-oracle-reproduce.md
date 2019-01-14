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

### 重现和实践

这是实践部分。

#### 搭建测试环境

如果环境就绪请跳过这一步。

方便起见，我们直接用 Docker 来快速搭建一个 Oracle 数据库环 境。如果你还没有 Docker 环境，那么首先从 [这里](https://www.docker.com/get-started) 下载并安装 Docker。

在命令行确认一下 Docker 版本，看看有没有安装成功。

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

我们设计一个游戏场景。假设有两张表，一个叫做 `characters`，用来储存所有的角色信息，`DDL` 如下。

```sql
create table characters as select
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
  'NAME_' || level as character_name,
  -- 其他的字段
  'INFO1_' || current_timestamp as character_info1,
  'INFO2_' || current_timestamp as character_info2,
  'INFO3_' || current_timestamp as character_info3
from dual connect by level <= 500000;
```

执行语句，我们将得到一张 50 万数据的角色表。角色表的玩家 ID 字段是可以重复的，如果重复就说明这个玩家有多个游戏角色。

我们先给这张表加上主键。

```sql
alter table characters
  modify character_id varchar2(8) not null;
alter table characters
  add constraint characters_pk primary key (character_id);
```

角色表的数据就准备完成了，此时表结构应该是这样的。

```sql
SQL> desc characters;
 Name               Null?    Type
 ------------------ -------- ----------------------------
 CHARACTER_ID       NOT NULL VARCHAR2(8)
 GAMER_ID                    NUMBER
 CHARACTER_GENDER            NUMBER
 CHARACTER_LEVEL             NUMBER
 CHARACTER_COIN              NUMBER
 CREATE_DATE                 TIMESTAMP(6) WITH TIME ZONE
 CHARACTER_NAME              VARCHAR2(45)
 CHARACTER_INFO1             VARCHAR2(79)
 CHARACTER_INFO2             VARCHAR2(79)
 CHARACTER_INFO3             VARCHAR2(79)
```

并且存在一个主键索引。

```sql
SQL> select index_name from user_indexes
where table_name = upper('characters');

INDEX_NAME
---------------
CHARACTERS_PK
```

另一张表 `items` 用来储存角色的所持物品信息，我们定义每个角色有 10 个物品栏，每个物品栏可以放一种物品，数量在 1 和 99 之间，类似 MineCraft。

```sql
create table items as select
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
  -- 其他字段
  'DESCRIPTION_' || current_timestamp as item_description
from
  characters c,
  (select level as item_order
    from dual connect by level <= 10) i;
```

为了方便起见，物品表给每个角色都创建了 10 条记录来储存每个物品栏的信息，对于空的物品栏使用 `enable_flag` 来控制。这张表的数据量 10 倍于角色表，我本地运行了 7 分钟才创建完成，得到了一张 500 万数据的测试表。

同样的，给物品表加上主键。物品表使用角色 ID + 物品顺序字段作为联合主键。

```sql
alter table items
  modify character_id varchar2(8) not null;
alter table items
  modify item_order number not null;
alter table items
  add constraint items_pk primary key (character_id, item_order);
```

物品表的表结构应该是这样的。

```sql
SQL> desc items;
 Name               Null?    Type
 ------------------ -------- ----------------------------
 ITEM_ORDER         NOT NULL NUMBER
 CHARACTER_ID       NOT NULL VARCHAR2(8)
 ITEM_ID                     NUMBER
 ITEM_NUM                    NUMBER
 ENABLE_FLAG                 NUMBER
 LAST_UPDATE_TIME            TIMESTAMP(6) WITH TIME ZONE
 ITEM_DESCRIPTION            VARCHAR2(84)

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

#### 探索测试数据

数据准备好了，但先别急着往下走。由于数据基本上是随机生成的，我们可以先看看数据的大致情况，为之后的测试打个底。

先来看看数据量，按照之前的 DDL 来看，`characters` 表应该有 50 万数据。

```sql
SQL> select count(1) from characters;

  COUNT(1)
----------
    500000
```

`items` 表则是 500 万。

```sql
SQL> select count(1) from items;

  COUNT(1)
----------
   5000000
```

嗯，看上去没问题，我们再来看看表空间有多大。

```sql
SQL> select
  segment_name as table_name,
  bytes / 1024 / 1024 mb
from user_segments
where segment_name = upper('characters')
or segment_name = upper('items');

TABLE_NAME     MB
------------- ---
CHARACTERS    104
ITEMS         472
```

角色表将近 100 M 容量，物品表虽然数据量是 10 倍于角色表的，但是字段较少，容量相差仅接近 5 倍。

再来看看去除掉同一个玩家下面的重复角色，一共存在多少个玩家 ID。由于是随机数据，所以下面的结果可能会不一样。

```sql
SQL> select count(1) from (
  select distinct gamer_id from characters
);

  COUNT(1)
----------
    316227
```

可以看到一共存在 31 万多的玩家，这说明有接近 19 万的角色是属于其他玩家下面的重复角色。

再来看看物品表中一共有多少个可用的物品。

```sql
SQL> select count(1) from items where enable_flag = 1;

  COUNT(1)
----------
   2500972
```

一个非常趋于概率的结果。再来看看每个角色平均的有效物品数量。

```sql
SQL> select avg(c) from (
  select count(1) c from items where enable_flag = 1
  group by character_id
);

    AVG(C)
----------
5.00765272
```

同样是一个趋于概率的结果。

看看有多少角色拥有超过 5 个物品。

```sql
SQL> select count(c) from (
  select character_id c from items where enable_flag = 1
  group by character_id having count(1) > 5
);

  COUNT(C)
----------
    189536
```

答案是接近 19 万。

我们再看看有多少角色等级超过 60 级。

```sql
SQL> select count(1) from characters where character_level > 60;

  COUNT(1)
----------
    197029
```

接近 20 万。差不多有个底了。

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

**⚠️ 仅测试环境下，降低服务器可用资源。**

为了方便再现性能问题，我们可以限制一下 Docker 引擎使用的 CPU 资源，模拟低配置环境，参考下图。

![Docker Configuration](/img/DockerConfiguration.png)

参考文档：

- [Database SQL Tuning Guide - 7 Reading Execution Plans](https://docs.oracle.com/database/121/TGSQL/tgsql_interp.htm#TGSQL94618)

#### 重现索引优化案例

```sql
select
  *
from (
  select 1
  from characters c inner join items i
  on c.character_id = i.character_id
  where c.character_level > 60
  and c.character_gender = 1
  and c.character_coin > 5000
  and i.enable_flag = 1
  group by i.character_id having count(1) > 5
);
```
