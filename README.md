# NewPaperNotification-To-Slack

Summarize new papers using ChatGPT and notify them via Slack.
Run on Google Apps Script.

- 参考にしたサイト
    - https://qiita.com/tmiyama/items/646595ac76dab039b6ec


## 変えたポイント
- サマライズする論文の優先度を，どこで発表されているかで考えています
    - GASでは実行時間に6分という制限があり，そんな大量の論文を扱うことはできないかもしれないので
        - GPT-4o以上だと高速なのでそこまで気にしなくても良いかもしれませんが，どっちみちtokenを消費します
    - 優先度は以下の通り (降順)
        1. ACM
        2. IEEE
        3. ScienceDirect
        4. arXiv

## そのうち直すかもポイント
- IEEEに関してはabstractのスクレイピング方法がよくわからなかったので (対策されてる？)，有識者は教えてください
- かなり愚直な書き方なので，もっとスマートにするかもしれません
    - 動きはしているので優先度は低め

