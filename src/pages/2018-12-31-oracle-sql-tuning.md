---
title: Oracle 数据库 SQL 性能调优实践笔记
subtitle: 亿级数据量下 Oracle 数据库 SQL 性能调优初级解决方案。
date: 2018-12-31 19:54:38 +8
lastUpdateTime: 2019-01-08 17:57:00 +8
tags:
  - Oracle
  - SQL
  - Database
  - BigDate
---

> ETL： Extract-Transform-Load，一个数据清洗 ✨ 的过程。

目前项目正在构建一个 ETL 系统，做数据清洗 ✨。到现在已经拿到“真实数据”在做最后的线上环境测试。

在测试的过程中，出现了几个性能上有问题的 SQL，这篇文章对解决这些性能问题的过程和方法做一个笔记。不过在进入正文之前，我想说一下问题出现的原因。

- 设计时不清楚表的数据规模，未考虑性能上的影响
- 开发时过于注重遵从设计，写法没有考虑性能优化
- 测试中数据量少，体现不出来问题

其根本原因还是在设计阶段的疏忽，设计 ETL 系统掌握每张表的数据规模也是非常重要的事情，有助于针对性的优化某些任务，优化时间分配。

---

### 写在前面

篇幅略长，主要是想对项目上最近解决的一些 SQL 性能问题做一个笔记。笔记包括问题出现的原因，解决的过程以及结果，最后动手做个再现和验证。下面是这篇文章的 road map。

- 概括部分
  - 罗列具体方法
  - 概括调优思路
  - 结合案例
  - 少量代码示例
- 实践部分
  - 重现案例
  - 套用解决方案
  - 大量代码示例
  - 从构建环境开始

### 解决方案

具体运用了的解决方法有以下几种：

- 添加索引（针对表读取大于写入的场景）
- 优化和改写相同逻辑（让其使用索引）
- 切割复杂语句到多个简单语句（主要优化内存占用）
- 使用 `merge` 代替 `update`
- 修改业务逻辑（效果好但没有普适性）

未运用到实际问题上，但是试验过有效的方案有下面这些：

- 使用 `partition` 表分区提高效率
- 使用 `/*+ APPEND */` 配合 `nologging` 减少日志提高写入效率
- 表压缩，利用空闲 CPU 减少 IO 时间

### 优化思路

一般遇到问题时先尝试最简单的索引法。

#### 配合执行计划分析 SQL 定位问题

查看执行计划最好的方式是打开 `autotrace`，执行下面语句之后，每条 SQL 将会返回实际的执行计划可供分析。前提是需要 DBA 权限。

```sql
set autotrace on;
```

但如果你和我一样没有 DBA 权限，那就只能看推测的实行计划了。在 SQL Developer 里选中一条 SQL 按 `F10` 可以查看精简版的执行计划，好处是方便快捷。

> 我使用的 Oracle SQL Developer 版本：3.2.20.10

除此之外还有一个可查看信息更多的解释计划语句，写在每条 SQL 前面，查看**推测的执行计划**。注意，重点是“推测”，由于没有 DBA 权限，这种解释计划仅是基于统计信息分析出来的“Guess”，并非实际采用的执行计划。同理上面的 `F10` 也是仅供参考的，一般保证表的统计信息分析正确的话还是挺准的。

```sql
explain plan for
  -- 接具体的语句
  select 1 from dual;

-- 使用下面的语句来查看执行计划
select plan_table_output from table(dbms_xplan.display())；
```

参考文档：

- [Tuning SQL\*Plus - Tracing Statements](https://docs.oracle.com/database/121/SQPUG/ch_eight.htm#SQPUG534)
- [Database SQL Language Reference - EXPLAIN PLAN](https://docs.oracle.com/database/121/SQLRF/statements_9010.htm#SQLRF01601)
- [Database PL/SQL Packages and Types Reference - DBMS_XPLAN](https://docs.oracle.com/database/121/ARPLS/d_xplan.htm#ARPLS378)

#### 添加索引并配合使用 `hint` 让不走索引的部分强制走索引看效果

尝试给没有走索引的地方创建相应的索引。

```sql
create index index_name on table_name (fields...);
```

如果创建了相应索引，但因为优化器判断不去走索引的情况，可以用 `hint` 强制走索引看看效果。`index()` 的括号里面一般填两个参数，第一个为表名，第二个是索引名。

```sql
select /*+ index(target_table target_index) */
  fields...
from target_table;
```

> ⚠️ 创建索引的代价是会占更多的储存空间，并且每次插入数据的时候都会对索引进行维护，对写入速度产生影响。

参考文档：

- [Database SQL Language Reference - INDEX Hint](https://docs.oracle.com/database/121/SQLRF/sql_elements006.htm#BABEFDFC)
- [Database SQL Language Reference - USE_NL Hint](https://docs.oracle.com/database/121/SQLRF/sql_elements006.htm#BABDDFHC)

**例子 🌰1**

添加索引优化的栗子。

| 输入表     |      数据量 |
| ---------- | ----------: |
| 顾客表     | 138,066,840 |
| 顾客信息表 | 145,586,869 |
| 业务表     |      16,220 |

输出数据量为：7,442。

| &nbsp;     | 运行时间 |
| ---------- | -------- |
| 创建索引前 | 2:02:27  |
| 创建索引后 | 0:01:17  |

这个例子中，虽然最终输出结果仅为 7 千行，但由于 `顾客表` 和 `顾客信息表` 都是拥有百来个字段的大表，全表检索非常吃力。优化的方法是对所有查询条件创建索引，效果很明显。

**例子 🌰2**

数据量大的情况索引优化的栗子。

| 输入表 |      数据量 |
| ------ | ----------: |
| 顾客表 | 138,066,840 |
| 业务表 |  43,850,757 |
| 种类表 |          16 |

输出数据量为：43,599,931。

| &nbsp;     | 运行时间 |
| ---------- | -------- |
| 创建索引前 | 3:10:17  |
| 创建索引后 | 1:12:23  |

这个例子由于四千三百万的输出数据量的限制，仅 IO 操作都会花费不少时间，添加索引后把查询部分的时间减少了不少，最终结果是 72 分钟，还算可以接受的结果。

一般来说，到这里很多问题都可以得到解决，尤其是读大表的场景，可能慢就慢在没有索引上。如果问题还没得到解决，我们再往后看。

#### 对无法走索引的部分进行改写最终让其走索引

某些语句的写法也会导致无法利用索引。在我们遇到的问题中就有一个，使用了 `in` 关键字导致无法走索引，最终通过改写 SQL 将其转化为 `inner join` 才得以使用索引，提高了执行效率。代码无法直接贴出来，做个重现的例子，大致如下。

```sql
-- 原始语句
select
  field_names...
from
  table_a a
where
  a.the_key in (select the_key from table_b);

-- 修改后语句
select
  field_names...
from
  table_a a
inner join
  table_b b
on
  a.the_key = b.the_key;
```

**例子 🌰3**

改写使其使用索引的栗子。

| 输入表       |      数据量 |
| ------------ | ----------: |
| 顾客信息表 1 | 145,586,869 |
| 顾客信息表 2 | 294,225,728 |
| 顾客信息表 3 | 261,309,380 |
| 顾客信息表 4 | 140,379,648 |

输出数据量为：149。但是对上面四张表做了不同程度的更新。

| &nbsp; | 运行时间 |
| ------ | -------- |
| 修改前 | 1:58:48  |
| 修改后 | 0:00:03  |

这个案例中，SQL 包含一连串的 `with as` 语句，其中一块语句的查询条件里面存在两个 `in` 关键字，但是 `in` 语句里面都是亿级的大表，造成严重的性能问题，最终通过将其改写为两个 `inner join` 得到改善。

优化索引当然不能解决所有的问题，所以如果索引解决不了问题，就要结合更多信息来分析定位问题所在了。

#### 分割复杂 SQL 到多个简单 SQL，减少内存占有时间

如果遇到内存问题，如 PAG 写满了，或者 UNDO 空间写爆了，考虑这个方案。

子查询嵌套过多会加剧内存资源的消耗，也会拉长内存占有时间。这时可以考虑分割复杂的 SQL 语句，加入几个中间表来缓和内存的负担。毕竟对于系统稳定性来说，增加的那点储存空间总是微不足道的。

#### 使用 `merge` 代替 `update` 缩短更新操作时间，减少内存占有时间

`merge` 是一个可以同时进行插入和更新的聚合操作，而在最新版本中已经支持单独的更新和插入操作。经过我们的测试发现，用 `merge` 来进行更新操作执行效率比 `update` 要好，数据量大的情况下甚至 `merge` 的效率高出几倍。`merge` 示例如下。

```sql
merge into table_a a using table_b b
on (a.pk = b.pk)
when matched then     -- 当满足 on 里的条件执行更新语句，可省略
  update set a.flag = b.flag
when not matched then -- 当不满足 on 里的条件执行插入语句，可省略
  insert (a.pk, a.flag, a.other_fields)
  values (b.pk, b.flag, b.other_fields);
```

尝试用更有效率的写法改写 SQL，减少内存占有时间，也是优化内存出问题的一种方法。目前我们遇到带报错信息的问题还只有内存问题一个。

参考文档：

- [Database SQL Language Reference - MERGE](https://docs.oracle.com/database/121/SQLRF/statements_9017.htm#SQLRF01606)

**例子 🌰4**

分割复杂 SQL 并且使用 `merge` 代替 `update` 的栗子。

| 输入表     |      数据量 |
| ---------- | ----------: |
| 顾客信息表 | 145,586,869 |
| 业务表     |  48,094,285 |

分割后插入到中间表的数据量。

| 中间表   |     数据量 |
| -------- | ---------: |
| 中间表 1 | 48,067,928 |
| 中间表 2 |     11,051 |

输出数据量为 11,051，并且更新顾客信息表对应对数据。

| &nbsp;             | 运行时间 |
| ------------------ | -------- |
| 修改前             | 报错     |
| 修改后（游标）     | 1:17:31  |
| 修改后（不用游标） | 0:09:51  |

这个例子中，修改前由于数据量原因运行了四五个小时之后报错了。类似于下面这个报错信息。原因是 UNDO 空间被写爆了。

> ORA-01555: snapshot too old: rollback segment number 1 with name "\_SYSSMU1\$" too small

优化的方法是分割复杂 SQL 到多个语句，中间加入中间表来衔接，并且使用 `merge` 代替 `update` 减少内存占有时间。

最终方案修改了两个版本，一个是使用游标进行分批处理，每次 1000 数据 `commit` 一次，减少内存负担，但是这个版本耗时太长了，plsql 引擎和 SQL 引擎来回切换颇为费时。

另外一版本直接使用 `insert select` 插入数据，虽然内存使用率变高，但速度提升显著，且十分钟的内存占有时间在接受范围内。最终使用了这个版本。

#### 从业务的角度上优化

如果上述方案都没有太大效果，那么可能你的瓶颈出现在 IO 操作或者是 `merge` 和 `update` 等非常昂贵又不可避免的操作上了，这时就可以尝试从业务的角度上优化。

优化业务逻辑风险大，且能否成功还是随缘的。不过如果成功，效果就会很美好。一般优化业务逻辑可以做下面的考虑。

#### 数据更新的场景，可以结合数据分析，寻找业务逻辑的优化点

更新是相对来说毕竟昂贵的操作，结合数据分析考虑是否能减少更新量将有助于提高效率。

举例来说，有一个业务要求抽取一批数据统一加上一个 Flag，设为 `00`，然后根据一堆条件筛选出其中一部分数据把 Flag 更新为 `99`。在这个业务上出现了性能问题，其原因是需要更新为 `99` 的数据太多了。

当知道性能问题真正的原因，事情就会简单很多。在这个栗子 🌰 中，由于需要更新的数据超过了处理数据的一半以上，于是，将其初始化为 `99`，然后将那些不符合条件的数据找出来更新为 `00` 可以有效的减少更新的数据量，提高效率。

**例子 🌰5**

上面的栗子其实是一个存在的案例。

| 输入表     |      数据量 |
| ---------- | ----------: |
| 顾客表     | 138,066,840 |
| 顾客信息表 | 145,586,869 |

输出数据量为：13,764。并且途中做了几次不同程度的更新。

| &nbsp; | 运行时间 |
| ------ | -------- |
| 修改前 | 5:05:53  |
| 修改后 | 0:01:00  |

通过反向更新减少了大量更新操作，大幅度提高了执行效率。

#### 分析子查询，将重复的查询固化到一张工作表中，减少反复查询

减少 IO 永远都是优化的首选方案，但实际上可能任务的每一步 IO 都是不可避免的。但是不同任务之间可能会有重复的逻辑，尝试分析类似的业务，找到反复查询的数据，将其临时固化到工作表，减少 IO，提高效率。

#### 针对多步骤的业务，提取所有筛选条件到第一步，缩小数据范围

设计的时候有些地方由于逻辑的连贯性，会将筛选条件分布到多个步骤上，来让设计更可读，更好理解。

还是举例子来说，假设有一个业务分为两步，第一步根据处理条件筛选出 4800 万数据，放在一张中间表里，第二步用这张中间表关联其他表，进一步筛选出 1 万条数据，更新这些数据的 Flag，更新的条件是原本为 `0` 的更新为 `1`，原本为 `1` 的更新为 `0`。

// SVG

这里的 IO 有两步，第一步读取 4800 万数据再写入 4800 万数据，第二步读取 4800 万数据，然后在其中找到 1 万数据用来更新。但是整体看下来这 4800 万数据其实还是存在优化余地的，因为这个业务的第二步隐藏了一个筛选条件，Flag 的值需要限定在 `0` 和 `1`。

这个条件如果在第一步加入进来，那么这 4800 万数据就能在一定程度得到减少，由此后续的 IO 操作都能减轻部分负担。

// SVG

#### 一些其他的解决方案

上面是有具体案例的实践，下面还有一些试验过有效果的方案，但是由于一些原因没有运用到这次遇到的问题上去。都是一些有价值的方法，所以在这里也记录一下。

#### 使用 partition 表分区提高效率

创建表分区虽然没有用来解决这次遇到的问题，但是实际上当初设计表的时候已经是做过分区的了。

表分区具体的作用是根据一定条件将一张大表分为几个不同的 `partition`，对外部来说这张表还是一个整体，但是优化器会自动判断，在符合条件的情况下访问对应的分区来提高效率。当然也可以在 SQL 语句中表名后面添加 `partition(partition_name)` 小句来指定访问哪个分区。

```sql
select count(1) from target_table partition(table_part01);
```

举一个具体的例子来说，假设顾客表中有两种类型的顾客，`企业` 顾客和 `个人` 顾客，这张表有 1 亿数据，如果我们按照顾客类型来给表进行分区，并且刚好每个分区有 5 千万数据的话，这时如果我们查询某个 `企业` 顾客的数据，查找范围就会从原本的 1 亿数据直接降到 5 千万数据，效率可谓直接提升一倍。

这个例子的 DDL 可能是下面这样的：

```sql
create table customer (
  id number,
  name varchar2(256),
  customer_type varchar2(20),
  -- other fields
) partition by list (customer_type) (
  partition customer_enterprise values ('enterprise'),
  partition customer_individual values ('individual')
);
```

> ⚠️ 表分区仅在企业版本可用。

官方文档建议的应该考虑创建表分区的场景：

- 表占空间大于 2G 以上；
- 表包含历史数据，典型的例子是按照月份整理的数据，仅更新当前月份的数据，而其他 11 个月的数据都是只读的；
- 表的内容必须分布到不同存储设备上。

参考文档：

- [VLDB and Partitioning Guide - 2 Partitioning Concepts](https://docs.oracle.com/en/database/oracle/oracle-database/12.2/vldbg/partition-concepts.html#GUID-E849DE8A-547D-4A2E-9324-706CAF574754)

#### 减少 `UNDO` 和 `REDO` 日志提高写入效率

Oracle 中在执行 DML 语句时会产生 `UNDO` 和 `REDO` 日志来保护数据的完整性和安全性。`UNDO` 日志用来做事务的回滚，`REDO` 日志用来恢复事务。但是在大数据的情况下，大量的日志会很大程度地拉低执行效率。这时可以使用 `/*+ APPEND */` 来减少甚至不做 `UNDO` 日志，配合 `nologging` 来减少 `REDO` 日志，以此来提高执行效率。

使用 `/*+ APPEND */` 的 SQL 语句看起来是这样的。

```sql
insert /*+ APPEND */ into target_table (
  target_values,
  -- ...
);
```

使用 `nologging` 有两种方式，一种是从表定义上设定。

```sql
alter table target_table nologging;
```

或者写在 DML 语句中。

```sql
insert /*+ APPEND */ into target_table nologging (
  target_fields...
) values (
  insert_values...
);
```

#### 表压缩，利用空闲 CPU 减少 IO 时间

作为最后的手段，压缩表也是提升执行效率的大杀器。

压缩表的原理是，给相同数据创建字典表，每次有相同数据进来，数据库将不储存原始数据，而仅储存字典表的一个引用，对 DML 有效。好处是压缩了表空间，大幅减少了 IO 操作，不过缺点也很明显，会显著提高 CPU 使用率。

对我们项目来说，数据库使用独立服务器，CPU 经常是闲置的，所以压缩表没有太大负担，进行表压缩反而是一个不错的选择。

对于已经创建的表进行压缩，使用下面的语句。

```sql
alter table target_table compress for olpt;
```

要在创建表时让表使用压缩，使用下面对语句。

```sql
create table table_name (
  fields...
) compress for olpt;
```

#### Tips

多次进行相同的操作会导致数据库使用缓存，导致调优结果可能不准确，可以使用下面的语句清空缓存。前提是需要 DBA 权限，很可惜我没有权限，所以我用不了...

```sql
alter system flush buffer_cache;
alter system flush shared_pool;
```

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

我们直接抽取 `dba_objects` 的数据作为测试数据。

```sql
SQL> create table test_table as select * from dba_objects;

Table created.
```

查看一下数据量。

```sql
SQL> select count(1) from test_table;

  COUNT(1)
----------
     90883
```

现在我们的测试数据准备好了，这张表目前没有任何索引，主键也没有。

参考文档：

- [Database Reference - 2.179 ALL_OBJECTS](https://docs.oracle.com/database/121/REFRN/GUID-AA6DEF8B-F04F-482A-8440-DBCB18F6C976.htm#REFRN20146)

#### 打开 `autotrace` 和 `timing` 显示执行计划和时间。

执行计划和时间有助于分析 SQL 性能，我们先打开 `autotrace` 和 `timing` 看看效果。

```sql
SQL> set autotrace on;
SQL> set timing on;
SQL> select count(1) from test_table;

  COUNT(1)
----------
     90883

Elapsed: 00:00:00.06

Execution Plan
----------------------------------------------------------
Plan hash value: 711311523

-------------------------------------------------------------------------
| Id  | Operation          | Name       | Rows  | Cost (%CPU)| Time  |
-------------------------------------------------------------------------
|   0 | SELECT STATEMENT   |            |     1 |   416   (1)| 00:00:01 |
|   1 |  SORT AGGREGATE    |            |     1 |            |          |
|   2 |   TABLE ACCESS FULL| TEST_TABLE |   100K|   416   (1)| 00:00:01 |
-------------------------------------------------------------------------

Note
-----
   - dynamic statistics used: dynamic sampling (level=2)


Statistics
----------------------------------------------------------
    0  recursive calls
    0  db block gets
 1528  consistent gets
 1525  physical reads
    0  redo size
  544  bytes sent via SQL*Net to client
  551  bytes received via SQL*Net from client
    2  SQL*Net roundtrips to/from client
    0  sorts (memory)
    0  sorts (disk)
    1  rows processed
```

执行计划的解读可以参考下面的资料，但是官方资料很多地方都不在我们的关注点上，不过好在仔细阅读执行计划也能悟出很多有用的信息，至少走没走索引是看一眼就知道的。

参考文档：

- [Database SQL Tuning Guide - 7 Reading Execution Plans](https://docs.oracle.com/database/121/TGSQL/tgsql_interp.htm#TGSQL94618)

#### 重现索引优化案例

// TODO

```sql
create table test_dba as select rownum as id, d.*, t.* from dba_objects d, (select level as type_code from dual connect by level <= 100) t;

select
  count(1)
from
  test_dba t
where
  t.timestamp >= '2015-07-06:11:00:00'
  and t.timestamp <= '2015-07-06:12:00:00'
  and t.object_type = upper('table')
  and t.status = upper('valid');


create table characters as select
  -- 角色 ID
  lpad(level, 8, '0') as character_id,
  -- 玩家 ID，可重复
  floor(dbms_random.value(1, 500000)) as gamer_id,
  -- 角色性别，0: Female，1: Male
  floor(dbms_random.value(0, 2)) as character_gender,
  -- 角色等级
  floor(dbms_random.value(1, 100)) as character_level,
  -- 角色持有的金币
  floor(dbms_random.value(1, 100)) as character_coin,
  -- 创建时间
  current_timestamp as create_date,
  -- 角色名称
  'NAME_' || level as character_name,
  -- 其他的字段
  'INFO1_' || current_timestamp as character_info1,
  'INFO2_' || current_timestamp as character_info2,
  'INFO3_' || current_timestamp as character_info3
from dual connect by level <= 500000;

alter table characters 
  alter column character_id varchar2(8) not null;
alter table characters 
  add constraint characters_pk primary key (character_id);

SELECT ABS(MOD(DBMS_RANDOM.RANDOM,100000000)) FROM DUAL;

select count(1) from (
select gamer_id from characters group by gamer_id having count(gamer_id) > 1);

select character_id, gamer_id, character_gender, character_level from characters where rownum <= 10;

select max(count(gamer_id)) from characters group by gamer_id having count(1) > 1;

SELECT segment_name AS TABLENAME,
       BYTES B,
       BYTES / 1024 KB,
       BYTES / 1024 / 1024 MB
  FROM user_segments
where segment_name = upper('characters');

```


**⚠️ Tips**

数据准备完毕，不过为了方便再现性能问题，我们可以限制一下 Docker 引擎使用的 CPU 资源，参考下图。

![Docker Configuration](/img/DockerConfiguration.png)
