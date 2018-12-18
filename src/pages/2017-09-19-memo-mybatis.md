---
title: 关于 Mybatis 的笔记
subtitle: 问题与解决，研究与笔记。
date: 2017-9-19 22:17:13
tags:
  - java
  - mybatis
---

### 基于接口调用 xml 配置的 SQL

在 XML 中配置好 SQL 之后一般使用下面的调用方式。

```java
    SqlSessionFactory sqlSessionFactory = TestUtils.getSqlSessionFactory();
    sqlSession = sqlSessionFactory.openSession();
    String statement = "config.UserMapper.getUser";
    TestUser user = sqlSession.selectOne(statement,2);
```

但每次都需要写调用语句，容易出错。（而且限定名太长也麻烦）

可以创建一个借口，并且 xml 配置限定名（mapper 标签的 namespace 属性）指定到这个接口。在程序中使用这个借口访问数据库。xml 配置如下。

```xml
<mapper namespace="mybatis.test.mapper.UserMapper">
    <select id="getUser" parameterType="int" resultType="TestUser">
        SELECT * FROM users WHERE id=#{id}
    </select>
</mapper>
```

Java 接口定义如下，接口的包名需要与 xml 配置中的限定名一致。

```java
package mybatis.test.mapper;

public interface UserMapper {

    TestUser getUser(int id) throws Exception;
}
```

在程序中调用如下。

```java
    UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
    TestUser user = userMapper.getUser(2);
```

**分析**

这样做可以避免纯注解配置出现的各种问题（暂时未遇到...）。而且也避免了调用语句拼写错误带来的问题。但是增加了配置的量，新加一条 SQL 需要在 xml 和 java 接口中各配置一次。

### 遇到的问题和解决

---

**时区问题**

`Caused by: java.sql.SQLException: The server time zone value...`

原因：

新版本 MySQL 驱动需要设置时区。

解决：

```properties
#改前
url=jdbc:mysql://localhost:3306/spring
#改后
url=jdbc:mysql://localhost:3306/spring?serverTimezone=UTC
```

**SSL 认证报错**

`WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.`

原因：

新版本 MySQL 驱动需要设定是否开启 SSL 认证。可以关闭或者启用。

```properties
#改前
url=jdbc:mysql://localhost:3306/spring?serverTimezone=UTC
#改后（关闭SSL）
url=jdbc:mysql://localhost:3306/spring?serverTimezone=UTC&useSSL=false
```
