const COMPANY_ID: number = 9999999;
const FISCAL_YEAR: number = 2019;
const FISCAL_MONTH: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const SS = SpreadsheetApp.getActiveSpreadsheet();
const DATA_SHEET = SS.getSheetByName('');

function setSpreadSheet() {
    let n = FISCAL_MONTH.map(function (month) {
        return getMonthlyPl(month);
    });
    let list = n.reduce(function (pre, current) {
        pre.push(...current);
        return pre
    }, []);
    DATA_SHEET.getRange(1, 1, list.length(), list[0].length).setValue(list);
}

/**
 * @param {number} month
 * @return {Array} array
 */
function getMonthlyPl(month: number) {
    let service = getService();
    let accessToken = service.getAccessToken();
    let keyUrl = "https://api.freee.co.jp/api/1/reports/trial_pl?";
    let url =
        keyUrl +
        `company_id=${COMPANY_ID}&fiscal_year=${FISCAL_YEAR}&start_month=${month}&end_month=${month}`;
    let options = {
        "method": "get",
        "headers": {
            "Authorization": "Bearer " + accessToken
        }
    };
    //データを取得し、JSONに変換
    let res = UrlFetchApp.fetch(url, options).getContentText();
    let json = JSON.parse(res);
    let resPl = json.trial_pl.balances;
    let array = resPl.map(function (account) {
        if (!account.account_item_id) {
            return [FISCAL_YEAR, month, account.account_category_id, account.account_category_name, account.closing_balance];
        } else {
            return [FISCAL_YEAR, month, account.account_item_id, account.account_item_name, account.closing_balance];
        }
    });
    return array;
}
