##### 编译

```shell
# 设置静态编译及平台架构
CGO_ENABLED=0 GOOS=linux GOARCH=amd64

# trivy fs .
# trivy config .

# 优化编译目标体积
go build -mod=readonly -trimpath -ldflags "-s -w" -o app
upx --lzma --best app
```