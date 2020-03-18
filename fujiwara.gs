HUBSPOT_BOT_USER_ID = 'BEG9XEBCN'
SLACK_TOKEN = "xoxb-188819411059-982980887233-23VspX7vWquHtWhA2JrJXwsz";
const slackApp = SlackApp.create(SLACK_TOKEN);

function doPost(e) {
    const params = JSON.parse(e.postData.getDataAsString());
    // URL登録時にURLの検証イベントがあった気がする
    if (params.type == 'challenge') {
        const response = { 'challenge': params.challenge }
        return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }
    // EventAPIからのPOSTを検証し、userがbotだったらSlackに投げる
    if (params.event.user == HUBSPOT_BOT_USER_ID) {
        const mentionTo = getUserId(params.event.attachment[0].text);
        const message = getMessage(mentionTo);
        postToSlack(message);
        return ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
    }
}


const getUserId = (text) => {
  //正規表現でownerの項目を取得
  const reg = new RegExp(/owner\*: .*?\n/);
  const owner = text.match(reg)[0].replace('owner*: ', '').replace('\n', '');
  console.log(owner);
/*
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
*/
  // スプレッドシートからユーザーIDを拾って返す
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("slackID");
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(2, 1, lastRow, 2).getValues();
  
  let slackID;
  for (i=0;i<lastRow-1;i++){
    if (owner !== data[i][0]){
      ;
    }else{
      slackID = data[i][1];
      return slackID;
    };
  };
}

const getMessage = (mentionTo) => {
  // メッセージを組み立てる
  const message = {
    "channel": "CU383GUEL", //#biz-sales-hubspotalert
    "username": "Hubspot巡査", 
    "text": "<@" + mentionTo + ">さん!\nHubspotの入力項目に漏れがあります！！直ちに修正してください！！",
    "icon_emoji":":cop:"
  };
};

const postToSlack = (message) => {
    // Slackに投稿する
  slackApp.postMessage(message.channel, message.text, message.username, message.icon_emoji);
};
  
/*  
let testText = "*提案内容(IS/FS)*: \n*前払い利用状況（FS旧導入種別）*:\n*Deal Name*: ＨＲケイスタッフ\n*Deal owner*: 宮本 悠太郎\n*勤怠システム*: \n*バッティング状況*: ";
const getTest = getUserId(testText);
const logTest = test => {
  Logger.log(testText);
  Logger.log(test + "test is done");
};
logTest(getTest);
*/