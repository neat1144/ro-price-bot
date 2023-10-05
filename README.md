# RO 物品價格通知機器人
- url: https://event.gnjoy.com.tw/Ro/RoShopSearch?fbclid=IwAR1xC46Qfmpbv0RzjG2t7LpJp19ZUKNnpBDL0QLKNfAbzScZYgU_Sl9C04Q

## 使用方法

1. 安裝 docker，再跑 `docker-compose up`。
2. 設定 telegram (chat_id & token)。
3. 新增要爬蟲的項目。
4. 設定爬蟲間隔時間（至少要項目的兩倍秒數）。
5. 啟動爬蟲（右上角按鈕）。

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

## DB

| name | svr | type | set_price | new_price | nofi |
| ---- | --- | ---- | --------- | --------- | ---- |

## To-Do

- [x] RO request api
- [x] Customer(CRUD) api
- [x] 爬蟲
- [x] 前端
- [x] chat-bot
- [x] fix stop button
- [x] docker
- [x] notify only once

## 伺服器更改
- call api 去確認伺服器代號，再更改以下的東西！
  - `client/src/components/CustomerTable.js   (line:71)`
  - `client/src/components/NewCustomerForm.js (line:53)`