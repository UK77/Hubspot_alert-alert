HUBSPOT_BOT_USER_ID = 'BEG9XEBCN'

function doPost(e) {
    const params = JSON.parse(e.postData.getDataAsString());
    // URL登録時にURLの検証イベントがあった気がする
    if (params.type == 'challenge') {
        const response = { 'challenge': params.challenge }
        return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }
    // EventAPIからのPOSTを検証し、userがbotだったらSlackに投げる
    if (params.event.user_id == HUBSPOT_BOT_USER_ID) {
        const mentionTo = getUserId(params.event.text);
        const message = getMessage1(mentionTo);
        postToSlack(message);
        return ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
    }
}

const getUserId = (text) => {
  // スプレッドシートからユーザーIDを拾って返す
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("slackID");

  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(2, 1, lastRow, 2).getValues();

  for (i=0;i<lastRow;i++){
    if (owner !== data[i][0]){
      break;
    }else{
      var slackID = data[i][1];
      return slackID;
    };
  };
}

const getMessage1 = (mentionTo) => {
  // メッセージを組み立てる
  const token = "xoxb-188819411059-982980887233-23VspX7vWquHtWhA2JrJXwsz";
  const channel = "CU383GUEL";
  const urlFetchOption = {
    'method' : 'get',
    'headers':{
      'Authorization':'Bearer '+ token,
    },
    'payload': {'channel': channel}
  };

  const url = "https://slack.com/api/channels.history";
  const responce = UrlFetchApp.fetch(url,urlFetchOption);

  const json = responce.getContentText();
  const data = JSON.parse(json);

  //レスポンスから"text"を抜き出す
  let messages = data.messages;
  //Logger.log(messages);


  let bot_id = messages[5].bot_id;
  //Logger.log(bot_id);
  //hubspotからの場合のみ、以下のコードを動かす処理
  const botID = "BEG9XEBCN";
  if (botID !== bot_id){
    Logger.log("botID is false");
    return;
  }else{
    let text = messages[5].attachments[0].text;
    Logger.log("Error is found!");
    //正規表現でownerの項目を取得
    if (text.match(/Deal owner/)){
      owner = text.split("\n")[3].replace("*Deal owner*: ", "");
      Logger.log("Deal owner");
    }else if(text.match(/Contact owner/)){
      owner = text.split("\n")[1].replace("*Contact owner*: ", "");
      Logger.log("Contact owner");
    }else if(/Company owner/){
      owner = text.split("\n")[1].replace("*Company owner*: ", "");
      Logger.log("Company owner");
    }else{
      return;
    };
  };
}

const postToSlack = (message) => {
    // Slackに投稿する
}