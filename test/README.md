# Validation fixtures

Small translation files for trying the converter by hand. Select one in the page (or drop it on the page): it is checked and the results are shown, and the **Download** button appears only when there are no errors.
`node tools/update.js` checks the same expectations automatically, so keep the numbers there in sync if you edit these files.

| File | Expected result |
|---|---|
| `valid.json` | "Translation checked: no errors", no error or warning panel, and the Download button appears. |
| `warnings-only.json` | The Download button appears, and an orange panel lists **4** strings with tags different from the source (see below). |
| `errors.json` | **No Download button.** A red panel lists **4** strings with errors, then an orange panel with **1** warning (see below). |
| `not-json.json` | Error message "JSON parsing: …", no Download button. |

Also worth trying by hand: rename any file to `.txt` (error "Wrong file type"), and check that the Download button stays hidden until a file passes the check. Also change the language after a file passed: the zip is rebuilt for it, and nothing downloads until you click.

## `warnings-only.json`

| Key | What changed | Warning shown |
|---|---|---|
| `base_该版本无更新日志_2` | the `<color>` tags were removed | missing `<color>` and `</color>` |
| `base_目标建议副标题二_3` | an extra `<b>extra</b>` was added | unexpected `<b>` and `</b>` |
| `base_几个蓝图地基无限_3` | an icon code was removed | missing icon code |
| `base_几个蓝图地基_3` | an icon code has one backslash instead of two | missing `\\code;` and unexpected `\code;` |

## `errors.json`

| Key | What changed | Error shown |
|---|---|---|
| `base_型恒星_5` | the `{0}` variable was replaced | missing variable |
| `base_当前线程数量_3` | `{9}` was added | unexpected variable |
| `base_所有播报_3` | `</color>` was removed | unbalanced `<color>` tag |
| `base_推荐线程数量_3` | the text contains `<img src=x onerror=alert(1)>`, quotes and `&` | missing variable `{0}` and unbalanced `<img>` and `<b>` tags; the text must appear as plain text in the "Translation" row and nothing runs |
| `base_立即建造物品不足_5` | the `<color>` tags were removed | warning, not an error |

The files are built from real strings in `data/DysonSphereProgram_The_Dark_Fog.json`. If a key disappears from a future source file the string is simply not checked, and `node tools/update.js` will report the fixture as no longer matching its expected counts.
