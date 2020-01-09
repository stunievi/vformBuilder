# xdh-async-img 异步图片组件

异步图片组件常用于图片需要通过异步方式获取的需求。

## 用法

```
<xdh-async-img style="width: 150px; height: 180px; border: 1px solid gray; margin: 30px" action="GET_ASYNC_IMAGE" id="000001"></xdh-async-img>
```

## 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|----|----|----|----|----|
| action | vuex加载图片的action | String | -  | 'GET_ASYNC_IMAGE' （需要配合代码生成器） |
| id | 获取图片的唯一ID，通常为接口的参数 | String | -  | - |
| default | 可以自定义pending图片 | String | - | - |
| lazy | 是否使用懒加载 | Number | - | - |



## 方法

无


## 更新日志

- 2018-01-16 新增 by：黄吉平



