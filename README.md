# hyperappをTypeScriptと共にお手軽にparcelで試す。
React+TypeScriptなら``create-react-app``というツールがあって簡単に試せますけど
hyperapp+TypeScriptはどうなんでしょうか？
parcelを使うと簡単に試せそうだと思い、多少試行錯誤したら簡単にできたので纏めてみます。

先ずはparcelを導入してみます。

```
yarn global add parcel-bundler
```

では、プロジェクトを作るところから

```
mkdir hyperapp-ts-sample
cd hyperapp-ts-sample
npm --init
```

``npm --init``でpackage.jsonを作っておきます。

更に追加でローカルにバッケージを導入します

```
yarn add babel-preset-env hyperapp
```

``babel-preset-env`` を入れないと実行時に``Couldn't find preset "env"`` というエラーが出ます

また、今回の肝となりますが以下のようにtsconfigを作ります。

```tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react",
    "jsxFactory": "h"
  }
}
```
parcelはindex.htmlをエントリーポイントとして指定できるみたいなので
以下のようにindex.htmlを作ります。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Counter</title>
    <link rel="stylesheet" href="src/counter.scss">
</head>
<body>
    <script src="src/counter.tsx"></script>
</body>
</html>
```

src配下にソースを置いていきます。ちなみにhtml内のファイル名と一致させていることを確認して下さい。
parcelがhtml内のtsファイル名から追いかけてくれます。
更にscssも直接指定できました。
マニュアルをろくに確認せずに使えてしまうparcelすごいっす。


```src/counter.tsx
import { h, app } from "hyperapp"

const SECONDS = 5

const pad = (n: number) => (n < 10 ? "0" + n : n)

const humanizeTime = (t: number) => {
  const hours = (t / 3600) >> 0
  const minutes = ((t - hours * 3600) / 60) >> 0
  const seconds = (t - hours * 3600 - minutes * 60) >> 0
  return `${pad(minutes)}:${pad(seconds)}`
}

const state = {
  count: SECONDS,
  paused: true
}


const actions = {
  tick: () => (state: State, actions: Actions) => {
    if (state.count === 0) {
      actions.reset()
      actions.toggle()
    } else if (!state.paused) {
      actions.drop()
    }
  },
  drop: () => (state: State) => ({ count: state.count - 1 }),
  reset: () => ({ count: SECONDS }),
  toggle: () => (state: State) => ({ paused: !state.paused })
}

type State = typeof state;
type Actions = typeof actions;

const view = (state: State, actions: Actions) => (
  <main>
    <h1>{humanizeTime(state.count)}</h1>

    <button onclick={actions.toggle}>
      {state.paused ? "START" : "PAUSE"}
    </button>

    <button onclick={actions.reset}>RESET</button>
  </main>
)

const main = app(state, actions, view, document.body)

setInterval(main.tick, 1000)
```

```src/counter.scss
body {
    align-items: center;
    background-color: #111;
    display: flex;
    font-family: Helvetica Neue, sans-serif;
    height: 100vh;
    justify-content: center;
    text-align: center;
  
    margin: 0;
    padding: 0;
  }
  
  h1 {
    color: #00caff;
    font-weight: 100;
    font-size: 9em;
    margin: 0;
    
    padding-bottom: 10px;
  }
  
  button {
    background: #111;
    border: 1px solid #00caff;
    color: #00caff;
  
    font-size: 1.5em;
    font-weight: 200;
  
    outline: none;
    width: 48%;
    height: 50px;
  
    letter-spacing: 1px;
  
    margin: 0;
  
    &:hover, &:disabled, &.paused {
      background: #00caff;
      color: #111;
    }
    &:active {
      outline: 2px solid #00caff;
    }
    &:focus {
      border: 1px solid #00caff;
    }
  }
  
  button + button {
    margin-left: 10px;
  }
  
```

あとは以下のコマンドを実行するだけです。

```
parcel index.html
```

試すにあたって詰まったところは``tsconfig.json``と``babel-preset-env``くらいでした。
``create-react-app``みたいなツールがなくても簡単にお試し環境は作れるって確認できて良かったです。

一応githubにコードを置いておきます。
https://github.com/m0a-mystudy/hyperapp-ts-sample
