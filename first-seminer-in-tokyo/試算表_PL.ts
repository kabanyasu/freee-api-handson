/**********************************************************
シート・パラメータ指定
***********************************************************/
let SS = SpreadsheetApp.getActiveSpreadsheet();
let CONTROL_SHEET = SS.getSheetByName("コントロールシート");
let PL_SHEET = SS.getSheetByName("PL");
let PARAMS = CONTROL_SHEET.getRange("B8:B11").getValues();

/**********************************************************
PLを取得する処理
***********************************************************/

function getPl() {
  //アクセストークンを取得
  let freeeApp = getService();
  let accessToken = freeeApp.getAccessToken();

  //URLで情報の参照先URLとパラメータ（条件）指定を行います。

  let keyUrl = "https://api.freee.co.jp/api/1/reports/trial_pl?"; //情報の取得先
  let companyId = PARAMS[0];
  let fiscalYear = PARAMS[1];
  let startMonth = PARAMS[2];
  let endMonth = PARAMS[3];
  let url =
    keyUrl +
    `company_id=${companyId}&fiscal_year=${fiscalYear}&start_month=${startMonth}&end_month=${endMonth}`;

  //HTTPリクエストを送る際のオプションを指定します。
  let options = {
    "method": "get",
    "headers": {
      "Authorization": "Bearer " + accessToken
    }
  };

  //freeeからデータを取得し、JSON形式に変換した後、残高情報のある部分を抜き出します。
  let res = UrlFetchApp.fetch(url, options).getContentText();
  let res = JSON.parse(res);
  let resPl = res.trial_pl.balances;

  //科目ごとに、取得したPLの内容を格納していきます。
  let array = resPl.map(account => {
    if (account.total_line) {
      return [account.account_item_id, account.account_item_name, account.hierarchy_level,
      account.opening_balance, account.debit_amount, account.credit_amount, account.closing_balance
      ]
    } else {
      return [account.account_category_id, account.account_category_name, account.hierarchy_level,
      account.opening_balance, account.debit_amount, account.credit_amount, account.closing_balance
      ]
    }
  })

  //取得したデータをスプレッドシートに転記しましょう。
  PL_SHEET.getRange(2, array[0].length).clear();
  PL_SHEET.getRange(2, 1, array.length, array[0].length).setValues(array);
}
