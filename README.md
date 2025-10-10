### myblog

- **项目**
```shell
mkdir myblog && cd myblog/
npm add -D vitepress@next
npx vitepress init
npm run docs:dev
npm run docs:build

## 推送 dist 内容到专用分支（如 gh-pages）
# npm install -g gh-pages
# gh-pages -d dist
```
