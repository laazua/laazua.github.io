import{_ as a,c as t,o as s,j as e,a as n}from"./chunks/framework.BKhkn9_V.js";const f=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"posts/containerd/k8s/k8s-pod.md","filePath":"posts/containerd/k8s/k8s-pod.md"}'),r={name:"posts/containerd/k8s/k8s-pod.md"};function d(p,o,c,i,l,k){return s(),t("div",null,[...o[0]||(o[0]=[e("h5",{id:"pod",tabindex:"-1"},[n("pod "),e("a",{class:"header-anchor",href:"#pod","aria-label":"Permalink to “pod”"},"​")],-1),e("pre",null,`  1. pod是一种逻辑上的概念,
     它的的逻辑可以归纳为多个容器共享: network,IPC,PID.

  2. 具体实现上,一个pod至少包含一个pause的容器,
     它负责对整个pod进行初始化和僵尸进程的回收工作.
`,-1)])])}const _=a(r,[["render",d]]);export{f as __pageData,_ as default};
