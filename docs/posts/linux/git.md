##### git

- **将远程非空仓库与本地git同步**
```bash
## 远程新建仓库(middleware;新建时,添加证书文件: LICENSE)
# 初始化化本地仓库
git init
# 远程仓库添加到本地
git remote add origin git@github.com:laazua/middleware.git
# 将本地文件与远程仓库合并
git fetch origin
git merge origin/main
# 配置本地仓库用户与邮箱
git config --local user.name laazua
git config --local user.email laazua@github.com
# 如果本地分支与远程分支不一致,重命名本地分支名(git branch -a 查看所有)
git branch -a
git branch -m master main
# 添加本地文件到暂存区
git add .
git commit -m ..
# 将暂存区文件推送到远程仓库
git push --set-upstream origin main
```

- **其他常用git操作**
```bash
# 新建分组
git branch test
# 将新分支推送到远程仓库
git push -u origin test
```
