---
layout: page
pageClass: page-map
sidebar: false
aside: false
footer: false
search: false
---

<MapView />

<style>
/* 地图页全屏：VitePress 空页布局（layout: page + pageClass: page-map）下去掉内容区宽度限制 */
.page-map .VPPage {
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.page-map .VPDoc .container,
.page-map .VPDoc .content,
.page-map .VPDoc .content-container {
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.page-map .vp-doc {
  max-width: none !important;
  padding: 0 !important;
}
</style>
