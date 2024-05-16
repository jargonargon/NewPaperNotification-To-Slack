// APK keys
const OPENAI_API_KEY = ' ***** ';
var SERPAPI_API_KEY = ' ***** ';
// 結果メールの送信先
const EMAIL_RECIPIENT = ' ***** ';
// Key word
const keyword = ' ***** ';
// ChatGPT に渡す命令 (例)
const PROMPT_PREFIX = "以下の論文を5行の箇条書きで，日本語で要約してください．なお，URLにIEEEが含まれるものについてはタイトルの和訳だけを返してください．";
// 結果メールのタイトル
const EMAIL_SUBJECT = `Google scholar 要約 (${keyword}) `;
// 結果メールの送信者の名前
const EMAIL_SENDER = "論文要約bot";
// 最新から検索対象日数
const DAYS = 7;
// ヒット論文で要約する論文の本数の上限
const MAX_PAPER_COUNT = 10;

var postUrl = ' ***** ';
var username = 'scholar bot';  // 通知時に表示されるユーザー名
var icon = ':hatching_chick:';  // 通知時に表示されるアイコン
var message = 'test';  // 投稿メッセージ


function main() {
  // call Google Scholar
  var results = getMostRecentArticleUrlSerpApi(keyword);
  if (results){
    var output = "新着論文のお知らせ\n\n";
    var paperCount = 0;
    for (let i = 0; i < results.length; i++) {
      var title = results[i].title;
      var url = results[i].link;
      var daysago = parseInt(results[i].snippet.split(" ")[0])
      Logger.log(url)
      Logger.log(daysago)
      if (daysago<=DAYS){
        if (url.search("acm") != -1){
          // call ChatGpt
          paperCount += 1
          let response = UrlFetchApp.fetch(url);
          let text = response.getContentText("utf-8");
          let topic_block = Parser.data(text).from('class="abstractSection abstractInFull"').to('</div>').build();
          let content_block = Parser.data(topic_block).from('<p>').to('</p>').build();
          const input = "content: " + content_block;
          const res = callChatGPT(input);
          
          // send result by E-mail 
          
          const paragraphs = res.choices.map((c) => c.message.content.trim());
          message = `${daysago} days ago\n`+title +"\n"+ url + "\n" + `${paragraphs.join("\n")}\n` + "\n\n\n";
          myFunction();
        }
      }
      else{
        break
      }      
      if (paperCount == MAX_PAPER_COUNT) break;
    }

    for (let i = 0; i < results.length; i++) {
      var title = results[i].title;
      var url = results[i].link;
      var daysago = parseInt(results[i].snippet.split(" ")[0])
      Logger.log(url)
      Logger.log(daysago)
      if (daysago<=DAYS){
        if (url.search("ieee") != -1){
          // call ChatGpt
          const input = "title: " + title;
          const res = callChatGPT(input);
          
          // send result by E-mail 
          
          const paragraphs = res.choices.map((c) => c.message.content.trim());
          message = `${daysago} days ago\n`+title +"\n"+ url + "\n" + `${paragraphs.join("\n")}\n` + "\n\n\n";
          myFunction();
        }
      }
      else{
        break
      }      
      if (paperCount == MAX_PAPER_COUNT) break;
    }



    for (let i = 0; i < results.length; i++) {
      var title = results[i].title;
      var url = results[i].link;
      var daysago = parseInt(results[i].snippet.split(" ")[0])
      Logger.log(url)
      Logger.log(daysago)
      if (daysago<=DAYS){
        if (url.search("sciencedirect") != -1){
          // call ChatGpt
          paperCount += 1
          let response = UrlFetchApp.fetch(url);
          let text = response.getContentText("utf-8");
          let topic_block = Parser.data(text).from('id="abstracts"').to('</div>').build();
          let content_block = Parser.data(topic_block).from('<p>').to('</p>').build();
          const input = "content: " + content_block;
          const res = callChatGPT(input);
          
          // send result by E-mail 
          
          const paragraphs = res.choices.map((c) => c.message.content.trim());
          message = `${daysago} days ago\n`+title +"\n"+ url + "\n" + `${paragraphs.join("\n")}\n` + "\n\n\n";
          myFunction();
        }
      }
      else{
        break
      }      
      if (paperCount == MAX_PAPER_COUNT) break;
    }

    for (let i = 0; i < results.length; i++) {
      var title = results[i].title;
      var url = results[i].link;
      var daysago = parseInt(results[i].snippet.split(" ")[0])
      Logger.log(url)
      Logger.log(daysago)
      if (daysago<=DAYS){
        if (url.search("arxiv") != -1){
          // call ChatGpt
          paperCount += 1
          let response = UrlFetchApp.fetch(url);
          let text = response.getContentText("utf-8");
          let topic_block = Parser.data(text).from('class="abstract mathjax"').to('</blockquote>').build();
          const input = "content: " + topic_block;
          const res = callChatGPT(input);
          
          // send result by E-mail 
          
          const paragraphs = res.choices.map((c) => c.message.content.trim());
          message = `${daysago} days ago\n`+title +"\n"+ url + "\n" + `${paragraphs.join("\n")}\n` + "\n\n\n";
          myFunction();
        }
      }
      else{
        break
      }      
      if (paperCount == MAX_PAPER_COUNT) break;
    }
    
    if (paperCount ==0){
      output = "No new article \n "
    } 
  }
  else{
    output="No article found (check keyword) \n "
  }
};


function getMostRecentArticleUrlSerpApi(keyword) {
  
  var searchUrl = 'https://serpapi.com/search?q=' + encodeURIComponent(keyword) +
                  '&engine=google_scholar' +
                  '&scisbd=1' +
                  '&api_key=' + SERPAPI_API_KEY;
  
  var options = {
    'method': 'get',
    'muteHttpExceptions': true,
    'followRedirects': true
  };
  
  var response = UrlFetchApp.fetch(searchUrl, options);
  var content = JSON.parse(response.getContentText());
  
  if (content.organic_results && content.organic_results.length > 0) {
    results=content.organic_results
    return results;
  } else {
    Logger.log("No articles found.");
    return null;
  }
}

function callChatGPT(input) {
    const messages = [
        {
            role: "user",
            content: PROMPT_PREFIX + "\n" + input,
        },
    ];

    const url = "https://api.openai.com/v1/chat/completions";

    const options = {
        "method": "post",
        "headers": {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
        "payload": JSON.stringify({
            model: "gpt-4o",
            messages,
        }),
    };

    return JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
}


function myFunction() {
  var jsonData =
  {
     "username" : username,
     "icon_emoji": icon,
     "text" : message
  };
  var payload = JSON.stringify(jsonData);

  var options =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : payload
  };

  UrlFetchApp.fetch(postUrl, options);
}

