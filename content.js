let timer;

function checkShortsPage() {
  if (window.location.href.includes('/shorts/')) {
    console.log('YouTube Shorts ページを検出しました。');
    stopTimer();
    startTimer();
  } else {
    stopTimer();
    console.log('YouTube Shorts ページではありません。');
  }
}

function startTimer() {
  if (!timer) {
    const videoPlayer = document.querySelector('ytd-player#player video');

    if (videoPlayer) {
      const duration = videoPlayer.duration;

      if (!isNaN(duration) && duration > 0) { // duration が数値で有効か確認
        timer = setTimeout(() => {
          console.log('動画の長さが経過しました。キーボードイベント (下矢印キー) でスクロールします。');
          simulateKeyDown();
        }, duration * 1000); // duration は秒単位なのでミリ秒に変換
        console.log('タイマーを開始しました。動画の長さ: ' + duration + '秒');
      } else {
        console.warn('動画の長さを取得できませんでした。1秒後に再試行します。');
        setTimeout(startTimer, 1000); // 1秒後に再試行
      }
    } else {
      console.warn('動画プレイヤーが見つかりませんでした。1秒後に再試行します。');
      setTimeout(startTimer, 1000); // 1秒後に再試行
    }
  }
}


function stopTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
    console.log('タイマーを停止しました。');
  }
}

function simulateKeyDown() {
  // 動画プレイヤーの要素を特定する
  const player = document.querySelector('ytd-player#player');

  if (player) {
    // フォーカスを当てる
    player.focus();

    // 遅延を入れてキーイベントを dispatch する
    setTimeout(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40,
        which: 40,
        bubbles: true,
        cancelable: false, // preventDefault() を無視
        composed: true
      });

      player.dispatchEvent(event);

      // 上位要素にイベントを伝播させる
      let parent = player.parentElement;
      while (parent) {
        parent.dispatchEvent(event);
        parent = parent.parentElement;
      }

      console.log('動画プレイヤーにキーボードイベント (下矢印キー) を発生させました。');
    }, 50); // 50ms の遅延
  } else {
    console.warn('動画プレイヤーが見つかりませんでした。');
  }
}

// ページのURLが変更された際にチェック
let currentUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    checkShortsPage(); // URLが変わったら再度 Shorts ページかどうかチェック
  }
}, 500); // 0.5秒間隔でURLをチェック

// 初回ページ読み込み時にもチェック
checkShortsPage();