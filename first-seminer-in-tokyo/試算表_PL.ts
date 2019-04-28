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

  var keyUrl = "https://api.freee.co.jp/api/1/reports/trial_pl?"; //情報の取得先
  let companyId = PARAMS[0];
  let fiscalYear = PARAMS[1];
  let startMonth = PARAMS[2];
  let endMonth = PARAMS[3];
  var url =
    keyUrl +
    `company_id=${companyId}&fiscal_year=${fiscalYear}&start_month=${startMonth}&end_month=${endMonth}`;

  //HTTPリクエストを送る際のオプションを指定します。
  var options = {
    "method": "get",
    "headers": {
      "Authorization": "Bearer " + accessToken
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
        /*[勘定科目ID, 勘定科目名, 改装レベル, 開始残高, 借方金額, 貸方金額, 期末残高] */
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
        /*[勘定科目ID, 科目区分, 改装レベル, 開始残高, 借方金額, 貸方金額, 期末残高] */
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
