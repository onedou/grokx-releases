# grokx-releases
GrokX downloads, release notes, and GitHub Pages

## version.json

GrokX 客户端每次启动（最多每天一次）通过 raw 直链读取本文件，判断是否有新版本：

```
https://raw.githubusercontent.com/onedou/grokx-releases/main/version.json
```

字段：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `version` | 是 | 最新已发布的版本号，不带 `v` 前缀；客户端用它与自身版本比较。 |
| `date` | 否 | 发布日期（`YYYY-MM-DD`），显示在设置页的更新说明里。 |
| `notes` | 否 | 更新说明。可以是一段文本，也可以按语言分开写（`zh-CN`、`en`）；客户端按界面语言取值，缺省回退中文。 |
| `downloads` | 否 | 平台 → 安装包地址，键名为 `macOS`、`windowsX64`、`windowsArm64`；缺少当前平台的键时打开 `site`。 |
| `site` | 否 | 发布站点，作为下载兜底。 |

发版时把本文件更新为刚上传的版本，并保证 `downloads` 指向同一次 release 的真实产物。客户端不会自动安装，只会提示并打开对应安装包的下载地址。

官网首页也读取这份清单。发布三平台安装包并更新清单后，首页会自动显示对应的版本和下载链接，文件大小取自该版本的 GitHub Release。清单暂时不可用时，首页会提供 GitHub 最新发布页入口。
