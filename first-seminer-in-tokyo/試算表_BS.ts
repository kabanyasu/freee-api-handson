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
  var url = "https://api.freee.co.jp/api/1/reports/trial_bs"; //情報の取得先
  var url = url + "?company_id=" + PARAMS[0];
  var url = url + "&fiscal_year=" + PARAMS[1];
  var url = url + "&start_month=" + PARAMS[2];
  var url = url + "&end_month=" + PARAMS[3];
  
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
  
  //抜き出したデータをスプレッドシートに転記する前処理として、配列に格納します。
  var rowData = [];
  for (var i in resBs){
    if(!resBs[i].total_line){
      rowData.push([
        resBs[i].account_item_id,
        resBs[i].account_item_name,
        resBs[i].hierarchy_level,
        resBs[i].opening_balance,
        resBs[i].debit_amount,
        resBs[i].credit_amount,
        resBs[i].closing_balance
      ]);
    }else{
       rowData.push([
        resBs[i].account_category_id,
        resBs[i].account_category_name,
        resBs[i].hierarchy_level,
        resBs[i].opening_balance,
        resBs[i].debit_amount,
        resBs[i].credit_amount,
        resBs[i].closing_balance
       ]);
    };
  };
  
  //取得したデータをスプレッドシートに転記しましょう。
  BS_SHEET.getRange(2, rowData[0].length).clear();
  BS_SHEET.getRange(2, 1, rowData.length, rowData[0].length).setValues(rowData);
  
}