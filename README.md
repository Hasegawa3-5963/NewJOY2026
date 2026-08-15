# noaa.jp（本体サイト）Cloudflare Pages セットアップ手順

LUCEのランディングページは、この本体サイトとは独立に `lp.noaa.jp`（別のPagesプロジェクト）
で運用します。この構成には含めていません。

## 構成
- `public/` サイト本体（いただいたzipの中身）
  - `public/admin/` お知らせ・ユーザーの声の編集画面（Decap CMS、今回追加）
  - `public/content/` 上の管理画面が編集するJSON（今回追加）
  - それ以外は、いただいたzipのままです
- `functions/api/contact.js` お問い合わせフォームの送信を受け取り、メール通知を送るPages Function（今回追加）
- `wrangler.toml` Cloudflareへの設定ファイル（今回追加）

## 1. Cloudflare Pagesでの設定
- ビルドコマンド：空欄のままでOK
- ビルド出力ディレクトリ：`public`

## 2. お問い合わせのメール通知（Cloudflare Email Routing）
1. Cloudflareダッシュボード → 対象ドメイン → 「Email」→「Email Routing」を有効化
2. 通知を受け取りたいアドレス（`info@noaa.jp`）を「送信先アドレス」として登録・認証
3. Pagesプロジェクトの「Settings」→「Functions」→「Bindings」から、
   `Send Email` バインディングを追加する
   - Variable name: `SEND_EMAIL`
   - Destination address: `info@noaa.jp`

## 3. 確認が必要な点
- お知らせ（`/news/`）は、いただいたzipの時点で41件がすでに静的なページとして
  作られています。今回追加した`/admin/`の編集画面は、別の仕組み（JSON1ファイルを
  編集する形）を前提にしているため、今のままでは`/news/`の41件とはつながっていません。
  お知らせの追加・編集を今後どちらの方法で行うか、確認させてください。
  - (a) 今の静的ページ方式のまま、新しい記事もページを直接追加していく
  - (b) `/admin/`のJSON方式に作り直す（41件の移行が必要）
