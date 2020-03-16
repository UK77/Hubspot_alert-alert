function getReport() {
  //スプレッドシートの設定
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("メルマガ一覧").activate();
  // mailchimp APIから必要な情報を取得
  var urlFetchOption = {
    'method' : 'get',
    'headers':{
      'Authorization':'Bearer '+'3224410ef775f0f1a9d82d30046878f1-us16'
      
    },
  };
  
  var url = "https://us16.api.mailchimp.com/3.0/reports";
  var responce = UrlFetchApp.fetch(url,urlFetchOption);
  
  var json = responce.getContentText();
  var data = JSON.parse(json);
  
  var reports = data.reports;
  //mailchimpAPIは一度に10件のみ
  for (k=0;k<=9;k++){
    var report = reports[k];
    
    var title = report.campaign_title;
    
    var emails_sent = report.emails_sent;
    
    var opens = report.opens;
    // open系
    var opens_total = opens.opens_total;
    var unique_opens = opens.unique_opens;
    var open_rate = opens.open_rate;
    
    var clicks = report.clicks;
    //click系
    var clicks_total = clicks.clicks_total;
    var unique_clicks = clicks.unique_clicks;
    var click_rate = clicks.click_rate;
    
    //キャンペーンごとの内容列
    var summaryRow = [
      [title, emails_sent, opens_total, unique_opens, open_rate, clicks_total, unique_clicks, click_rate]
    ];
    Logger.log(summaryRow);
    
    // spreadsheetに新しいものが上に追加されるように記載
    sheet.insertRowAfter(k+1);
    var range = sheet.getRange(k+2, 1, 1, 8);
    range.setValues(summaryRow);
  };
};
