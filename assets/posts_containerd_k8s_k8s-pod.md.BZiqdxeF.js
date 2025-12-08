import{_ as t,c as e,o as s,af as n}from"./chunks/framework.BKhkn9_V.js";const k=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"posts/containerd/k8s/k8s-pod.md","filePath":"posts/containerd/k8s/k8s-pod.md"}'),a={name:"posts/containerd/k8s/k8s-pod.md"};function r(p,o,d,i,l,_){return s(),e("div",null,[...o[0]||(o[0]=[n(`<h5 id="pod" tabindex="-1">pod <a class="header-anchor" href="#pod" aria-label="Permalink to “pod”">​</a></h5><pre>  1. pod是一种逻辑上的概念,
     它的的逻辑可以归纳为多个容器共享: network,IPC,PID.

  2. 具体实现上,一个pod至少包含一个pause的容器,
     它负责对整个pod进行初始化和僵尸进程的回收工作.
</pre><ul><li><p><strong>启动探测</strong></p></li><li><p><strong>就绪探测</strong></p><ul><li>pod的整个生命周期内都在检测</li></ul></li><li><p><strong>存活探测</strong></p></li></ul>`,3)])])}const f=t(a,[["render",r]]);export{k as __pageData,f as default};
