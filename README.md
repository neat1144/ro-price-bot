# RO 物品價格通知機器人

- url: https://event.gnjoy.com.tw/Ro/RoShopSearch?fbclid=IwAR1xC46Qfmpbv0RzjG2t7LpJp19ZUKNnpBDL0QLKNfAbzScZYgU_Sl9C04Q

## 使用方法

### windows 本地部署

1. 下載 code，解壓縮到 C 槽。
2. 右鍵 `start.ps1` 檔案，選擇使用 "**用 PowerShell 執行**"。

### docker 部署

1. 安裝 docker。
2. 下載 code，解壓縮到 C 槽。
3. 使用系統管理員開啟 `docker_start_ro_spider.bat`

4. \*\*刪除容器時，使用系統管理員開啟 `docker_stop_ro_spider.bat`

#### docker 重新安裝

- 使用系統管理員開啟 `docker_rebuild_ro_spider.bat`

## 需求

- 輸入: "物品名稱", "伺服器", "收購/販售", "set 價格"
- if set_price > new_price
  - 輸出: "物品名稱", "伺服器", "收購/販售", "new 價格"
  - 寫入 db
  - 通知機器人，nofi 寫 1
- 排序: "高價>低價" or "低價>高價"
- 爬蟲: 去 db 撈資料開始爬，價格低於特定價格時，寫到 db 去
  - GET(all_items)，然後再一個一個爬
  - 設定的條件
  - 低於某價格時
    - new_price 寫入
    - nofi 寫 0
- 間隔查詢: 可以自定義每次爬蟲的間隔（從 db 撈）
- 通知機器人: telegram，低於特定價格時通知
- 伺服器合併: 新增 or 合併
- 介面:
  - 關鍵字: 預設空白
  - 伺服器: 預設波利
  - 類型: 預設販售
  - 設定價格: 預設空白

## DB

- **customer**

  | id  | keyword | svr | type |
  | --- | ------- | --- | ---- |

- **child**

  | id  | customer_id | include | exclude | refining | level | set_price | new_price | time |
  | --- | ----------- | ------- | ------- | -------- | ----- | --------- | --------- | ---- |

## To-Do

- [x] RO request api
- [x] Customer(CRUD) api
- [x] 爬蟲
- [x] 前端
- [x] chat-bot
- [x] fix stop button
- [x] docker
- [x] notify only once
- [x] fix robot
- [x] timeout form
- [x] clean new_price button
- [x] clean form of customer
- [x] new timeout function
- [x] add unit test
- [x] add new table `child` for filter keywrods
- [x] support add form (react and node) for table `child`
- [ ] support **filter** `itemRefining` and `ItemGradeLevel`
- [x] support **filter** "exclude" and "include" keywords

## 伺服器更改

- call api 去確認伺服器代號，再更改以下的東西！
  - `client/src/components/CustomerTable.js   (line:71)`
  - `client/src/components/NewCustomerForm.js (line:53)`
