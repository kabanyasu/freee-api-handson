# 第一回 GAS ハンズオンセミナー

## 目的

## カリキュラム

- OAuth 認証の始めかた(サンプルシートと一緒に)
- そこから試算表の取得の方法
  - JSON からのデータ入手
  - JSON のデータを配列に格納する方法
- スプレッドシートへの貼り付け

## JSON

### JSON とは

JSON とは、JavaScript のオブジェクトリテラル形式に準じたデータフォーマットです。
API を叩くことにより入手できる情報は、現在 JSON 形式が主流であることから、API を用いて任意の情報を取得する際には JSON の仕組みを理解する必要があります。

### JSON の構成

key:値
という構成で出来ており、値を取り出したい場合は key を出力できます。

入れ子になっている場合は、その階層分だけ見てもらう。

memo:GAS のデバッグ画面で JSON の中身を見てもらう方向が一番濃厚

#### JSON の構成

```
{
  "trial_bs" :
    {
      "company_id" : 1,
      "fiscal_year" : 2017,
      "breakdown_display_type" : "partner",
      "created_at" : "2018-05-01 12:00:50"
      "balances" : [{
        "account_item_id" : 1000,
        "account_item_name" : "現金",
        "hierarchy_level" : 2,
        "parent_account_item_id" : 100;
        "parent_account_item_name" : "流動資産",
        "opening_balance" : 100000,
        "debit_amount" : 50000,
        "credit_amount" : 20000,
        "closing_balance" : 130000,
        "composition_ratio" : 0.25
        "partners" : [{
          "id" : 123,
          "name" : "freee",
          "long_name" : "freee株式会社",
          "opening_balance" : 100000,
          "debit_amount" : 50000,
          "credit_amount" : 20000,
          "closing_balance" : 130000,
          "composition_ratio" : 0.25
          },
        ...
        ]
      },
      ...
      ]
    }
}
```
