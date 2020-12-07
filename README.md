# webrtc-project

### 一键自动运行

```
直接运行run.bat
```

run.bat将自动完成：

1. 若目录下没有node_modules，则执行npm install，并自动安装证书(可修改为cnpm安装)
2. 启动脚本

### 手动安装证书

+ 方式一：将public/cert/OlrearnCA.crt安装到受信任的根证书颁发机构

+ 方式二：直接运行public/cert/cert.bat

### 访问

```
默认设置端口为：443
直接访问https://localhost即可
其他ip地址可能需要再生成对应的证书

登录页面：
https://localhost/login
```