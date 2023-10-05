# RO 物品價格通知機器人

## 使用方法

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
