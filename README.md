# 單字小森林 🌳

劍橋英檢 A1 Movers 背單字遊戲。答對題目賺能量，把荒涼大地種成茂密森林！

- 609 個單字（Starters + Movers 累積字表可測驗內容詞），22 個主題
- 英文發音（Web Speech API，可挑選推薦語音）
- 答錯的單字會加權重複出現，連續答對才畢業
- 進度存在裝置的 localStorage，離線可玩（PWA）

## 技術架構

Vite + React 18 + Tailwind CSS v4 + vite-plugin-pwa

```
movers-forest/
├── index.html              # 入口 HTML（含 PWA meta）
├── vite.config.js          # Vite + Tailwind + PWA manifest 設定
├── package.json
├── public/icons/           # App 圖示（192 / 512）
└── src/
    ├── main.jsx            # React 入口
    ├── index.css           # Tailwind 入口
    └── MoversForest.jsx    # 遊戲主元件（單檔）
```

## 本機開發與測試

```bash
npm install
npm run dev        # 已含 --host，同網段的手機可直接連 http://<電腦IP>:5173
```

測試重點：

1. 答題、能量、種樹、進度條與森林顏色變化
2. 發音：森林主畫面「發音聲音」下拉選單 + 試聽（真機上 Chrome/Edge 的語音品質最好）
3. 重新整理頁面後進度應保留（localStorage）
4. `npm run build && npm run preview` 後用手機開啟，測「加入主畫面」與離線開啟
   （Service Worker 只在 build 後的 preview / 正式站生效，dev 模式不會註冊）

## 部署

### 方案 A：GitHub Pages（已內建指令）

```bash
git init && git add -A && git commit -m "init"
gh repo create movers-forest --public --source=. --push   # 或手動建 repo 後 push
npm run deploy                                            # build 並推到 gh-pages 分支
```

然後到 repo 的 Settings → Pages，Source 選 `gh-pages` 分支。
網址會是 `https://<帳號>.github.io/movers-forest/`（`vite.config.js` 已設 `base: "./"`，子路徑可直接運作）。

### 方案 B：Vercel / Netlify

匯入 repo 即可，兩者都會自動偵測 Vite。Build command `npm run build`、輸出目錄 `dist`。

## 已知事項

- 套件版本若有相依性衝突，直接升級到當下最新版即可，本專案沒有用到冷門 API。
- iOS Safari 對 Web Speech API 的語音載入較慢，第一次點發音可能沒聲音，再點一次即可。
- 想清除進度：遊戲內「重新開始」（連按兩次），或清除瀏覽器站台資料。

## 給 Claude Code 的交接指令（可直接貼上）

> 這是一個 Vite + React + Tailwind v4 + PWA 的完整專案。請：
> 1. `npm install`，若有版本衝突請升級套件解決
> 2. `npm run dev` 啟動，確認遊戲可玩、無 console 錯誤
> 3. `npm run build && npm run preview`，確認 PWA manifest 與 service worker 正常
> 4. 依 README 的方案 A 部署到 GitHub Pages，完成後給我網址
