#!/bin/bash

## 部署项目
# 重新克隆项目后运行: git remote add origin git@github.com:laazua/laazua.github.io.git

npm run docs:build && \
  cp docs/avatar.png dist/ && \
  npx gh-pages -d dist -b gh-pages
