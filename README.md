## 设备资讯

### 安装要求：

`UriRoute应用版本 >= 1.1`
1. 安装前需确保UriRoute不小于该版本，否则更新应用后需重新安装该背屏模块。
2. 使用该背屏模块UriRoute需拥有Root权限，Shizuku权限无法显示电压电流相关内容

`REAREye版本 >=157`

[UriRoute下载地址](https://github.com/Jawiiki/UriRoute/releases)


### 模块特点
1. 安装后默认在背屏显示CPU负载、内存占用、存储空间、电压电流功率信息
2. 背屏使用的是通用模块，仅修改UriRoute应用下的REAREye-generality文件便可显示其他内容。
3. 优化CPU负载的计算。若UriRoute中设置缓存时间为30s，则CPU负载为30s的平均负载值。
### 手动安装步骤
1. 将`仓库/deviceinfo.js`的内容复制到UriRoute应用REAREye目录下的generality文件中。
2. 安装 `releases` 中的背屏模块。