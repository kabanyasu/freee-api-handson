/**********************************************************
シート・パラメータ指定
***********************************************************/
var ss = SpreadsheetApp.getActiveSpreadsheet();
var CONTROL_SHEET = ss.getSheetByName("コントロールシート");
var PL_SHEET = ss.getSheetByName("PL");
var PARAMS = CONTROL_SHEET.getRange("B8:B11").getValues();

/**********************************************************
PLを取得する処理
***********************************************************/

function getPl() {
  //アクセストークンを取得
  var freeeApp = getService();
  var accessToken = freeeApp.getAccessToken();

  //URLで情報の参照先URLとパラメータ（条件）指定を行います。
  var url = "https://api.freee.co.jp/api/1/reports/trial_pl"; //情報の取得先
  url += "?company_id=" + PARAMS[0];
  url += "&fiscal_year=" + PARAMS[1];
  url += "&start_month=" + PARAMS[2];
  url += "&end_month=" + PARAMS[3];

  //HTTPリクエストを送る際のオプションを指定します。
  var options = {
    method: "get",
    headers: {
      Authorization: "Bearer " + accessToken
    }
  };

  //freeeからデータを取得し、JSON形式に変換した後、残高情報のある部分を抜き出します。
  var res = UrlFetchApp.fetch(url, options).getContentText();
  var res = JSON.parse(res);
  var resPl = res.trial_pl.balances;

  //科目ごとに、取得したPLの内容を格納していきます。
  var rowData = [];
  for (var i in resPl) {
    if (!resPl[i].total_line) {
      rowData.push([
        resPl[i].account_item_id,
        resPl[i].account_item_name,
        resPl[i].hierarchy_level,
        resPl[i].opening_balance,
        resPl[i].debit_amount,
        resPl[i].credit_amount,
        resPl[i].closing_balance
      ]);
    } else {
      rowData.push([
        resPl[i].account_category_id,
        resPl[i].account_category_name,
        resPl[i].hierarchy_level,
        resPl[i].opening_balance,
        resPl[i].debit_amount,
        resPl[i].credit_amount,
        resPl[i].closing_balance
      ]);
    }
  }

  //取得したデータをスプレッドシートに転記しましょう。
  PL_SHEET.getRange(2, rowData[0].length).clear();
  PL_SHEET.getRange(2, 1, rowData.length, rowData[0].length).setValues(rowData);
}
