/************************************************************************
参照ライブラリ
title        |OAuth2
project_key  |1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF
************************************************************************/
var control_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("コントロールシート");
var client_id = control_sheet.getRange("B3").getValue();
var client_secret = control_sheet.getRange("B4").getValue();

/*認証エンドポイント*/
function alertAuth(){
  var service = getService();
  var authorizationUrl = service.getAuthorizationUrl();
  var template = HtmlService.createTemplateFromFile("認証ダイアログ");
  template.authorizationUrl = authorizationUrl;
  var page = template.evaluate();
  SpreadsheetApp.getUi().showModalDialog(page, "認証をしてください");
}


/*APIサービスを取得*/
function getService(){
  return OAuth2.createService("freee")
    .setAuthorizationBaseUrl("https://secure.freee.co.jp/oauth/authorize")
    .setTokenUrl("https://api.freee.co.jp/oauth/token")
    .setClientId(client_id)
    .setClientSecret(client_secret)
    .setCallbackFunction("authCallback")
    .setPropertyStore(PropertiesService.getUserProperties());
}


/*認証コールバック*/
function authCallback(request){
  var service = getService();
  var isAuthorized = service.handleCallback(request);
  var accessToken = service.getAccessToken();
  
  if(isAuthorized){
    return HtmlService.createHtmlOutput("認証成功。閉じてOK");
  }else{
    return HtmlService.createHtmlOutput("認証失敗");
  };

}


/*終了する*/
function clearService(){
  OAuth2.createService("freee")
    .setPropertyStore(PropertiesService.getUserProperties())
    .reset();
}


