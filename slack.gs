function doGet(){
  var token = "xoxb-188819411059-982980887233-23VspX7vWquHtWhA2JrJXwsz";
  var channel = "CU383GUEL";
  
  
  var urlFetchOption = {
    'method' : 'get',
    'headers':{
      'Authorization':'Bearer '+ token,
    },
    'payload': {'channel': channel}
  };
  
  var url = "https://slack.com/api/channels.history";
  var responce = UrlFetchApp.fetch(url,urlFetchOption);
  
  var json = responce.getContentText();
  var data = JSON.parse(json);
  
  //レスポンスから"text"を抜き出す
  var messages = data.messages;
  var text = messages[0].attachments[0].text;
  Logger.log(text);
  Logger.log(typeof(text));
  //正規表現でDeal ownerの項目を取得
  var regex = /\*Deal owner\*:\s.*?/;
  var dealOwner = text.match(regex,"").toString();
  Logger.log(dealOwner);
  var name = dealOwner.replace(regex,"");
  Logger.log(name);
};

// spreadsheetのデータを参照してUserId 
function matchUser(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Deal owner");
  var slackID = "";
  
  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(2, 1, lastRow, 2).getValues();
  for (i=0;i<lastRow;i++){
    if (dealOwner !== data[i][0]){
    }
    else {
      slackID = data[i][1];
    };
  };
  
  //webhookを用いてpost
  var webhook = "https://hooks.slack.com/services/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";
  
  var channel = "biz-sales-hubspotalert";
  var slackID = "USV1KUDS9"
  var message = "<@" + slackID + ">さん!\nHubspotの入力項目に漏れがあります！！直ちに修正してください！！";
  var jsonData = {
    "channel": "#" + channel,
    "text": message,
    "icon_emoji":":警官:"
  };
  var payload = JSON.stringify(jsonData);
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": payload
  };
  UrlFetchApp.fetch(webhook, options);  
};



