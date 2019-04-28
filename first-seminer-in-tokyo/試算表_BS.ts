/**********************************************************
シート・パラメータ指定
***********************************************************/
var ss = SpreadsheetApp.getActiveSpreadsheet();
var CONTROL_SHEET = ss.getSheetByName("コントロールシート");
var BS_SHEET = ss.getSheetByName("BS");
var PARAMS = CONTROL_SHEET.getRange("B8:B11").getValues();

/**********************************************************
BSを取得する処理
***********************************************************/
function getBs() {
  //アクセストークンを取得
  var freeeApp = getService();
  var accessToken = freeeApp.getAccessToken();

  //URLで情報の参照先URLとパラメータ（条件）指定を行います。
  let keyUrl = "https://api.freee.co.jp/api/1/reports/trial_bs?"; //情報の取得先
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

  //freeeにアクセスしてデータを取得し、JSON形式にデータを変換した後、取得したデータから残高情報のある部分を抜き出します。
  var res = UrlFetchApp.fetch(url, options).getContentText();
  var res = JSON.parse(res);
  var resBs = res.trial_bs.balances;

  /*取得したデータを配列に格納する。
  true:個別勘定科目である場合
  false:小計である場合*/
  var rowData = [];
  for (var i in resBs) {
    if (!resBs[i].total_line) {
      rowData.push([
        /*[勘定科目ID, 勘定科目名, 改装レベル, 開始残高, 借方金額, 貸方金額, 期末残高] */
        resBs[i].account_item_id,
        resBs[i].account_item_name,
        resBs[i].hierarchy_level,
        resBs[i].opening_balance,
        resBs[i].debit_amount,
        resBs[i].credit_amount,
        resBs[i].closing_balance
      ]);
    } else {
      rowData.push([
        /*[勘定科目ID, 科目区分, 改装レベル, 開始残高, 借方金額, 貸方金額, 期末残高] */
        resBs[i].account_category_id,
        resBs[i].account_category_name,
        resBs[i].hierarchy_level,
        resBs[i].opening_balance,
        resBs[i].debit_amount,
        resBs[i].credit_amount,
        resBs[i].closing_balance
      ]);
    }
  }

  //取得したデータをスプレッドシートに転記しましょう。
  BS_SHEET.getRange(2, rowData[0].length).clear();
  BS_SHEET.getRange(2, 1, rowData.length, rowData[0].length).setValues(rowData);
}
