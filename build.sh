#!/bin/bash

## 部署项目

npm run docs:build && \
  cp docs/avatar.png dist/ && \
  gh-pages -d dist