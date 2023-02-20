var recordStatus = 0
var voice;
window.onload = function () {

  // ip判断
  ipPass();
 
  const messageInput = document.querySelector(".message-input")
  let times = null;

  // 实例化迅飞语音听写（流式版）WebAPI
  voice = new Voice({

    // 服务接口认证信息 注：apiKey 和 apiSecret 的长度都差不多，请要填错哦，！
    appId: 'd9514f5c',
    apiSecret: 'YWM0YWU3ZjE0OWM4MDUwYzY4YWYzZWVj',
    apiKey: 'a7dba6ba91d64f460f0290366e475ab7',
    // 注：要获取以上3个参数，请到迅飞开放平台：https://www.xfyun.cn/services/voicedictation 【注：这是我的迅飞语音听写（流式版）每天服务量500（也就是调500次），如果你需求里大请购买服务量：https://www.xfyun.cn/services/voicedictation?target=price】

    onWillStatusChange: function (oldStatus, newStatus) {
      //可以在这里进行页面中一些交互逻辑处理：注：倒计时（语音听写只有60s）,录音的动画，按钮交互等！
      // fixedBox.style.display = 'block';
    },
    onTextChange: function (text) {
      console.log(text)
      //监听识别结果的变化
      messageInput.value = text;


      // 3秒钟内没有说话，就自动关闭
      if (text) {
        clearTimeout(times);
        times = setTimeout(() => {
          this.stop(); // voice.stop();
          // fixedBox.style.display = 'none';
        }, 3000);
      };
    }
  });


 

};


function recordZhVoice () {
  voice.setLanguage("zh_cn");
  let recordBtn = document.querySelector('#zh');
  recordStatus++;
  if ((recordStatus % 2) == 0) {
    voice.stop();
    recordBtn.innerHTML = " 录制声音（中文） "
    recordBtn.style.background = '#1D7745';
  } else {
    voice.start();
    recordBtn.innerHTML = " 录制中 "
    recordBtn.style.background = 'red';
  }

};

function recordEnVoice () {
  voice.setLanguage("en_us");
  let recordBtn = document.querySelector('#en');
  recordStatus++;
  if ((recordStatus % 2) == 0) {
    voice.stop();
    recordBtn.innerHTML = " 录制声音（英文） "
    recordBtn.style.background = '#1D7745';
  } else {
    voice.start();
    recordBtn.innerHTML = " 录制中 "
    recordBtn.style.background = 'red';
  }

};








var $messages = $('.messages-content'),
  d, h, m,
  i = 0;

$(window).load(function () {
  $messages.mCustomScrollbar();
  setTimeout(function () {
    fakeMessage();
  }, 100);
});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate() {
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
}

function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }


  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  updateScrollbar();
  // setTimeout(function () {
  //   fakeMessage();
  // }, 1000 + (Math.random() * 20) * 100);

  testfakeMessage();
 

}

$('.message-submit').click(function () {
  insertMessage();
});


let audioChunks = [];
let rec;

const constraints = {
  audio: {
    sampleRate: 16000,
    channelCount: 1,
    volume: 1.0
  },
  video: false
};




$(window).on('keydown', function (e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
})

var Fake = [
  'Hello budy, I\'m Fabio and you?'
]

function fakeMessage() {
  if ($('.message-input').val() != '') {
    return false;
  }
  $('<div class="message loading new"><figure class="avatar"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();

  setTimeout(function () {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" /></figure>' + Fake[0] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
    i++;
  }, 1000 + (Math.random() * 20) * 100);

}

function testfakeMessage() {
  if ($('.message-input').val() != '') {
    return false;
  }
  $('<div class="message loading new"><figure class="avatar"><img src="./img/profile-80.jpg" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();


  ask(msg).then(function (data) {
    let answer = data.message
    if (data.code == 200) {
      textToVoice(answer)
    }
    
    $('.message.loading').remove();
    $('<div class="message new" style = "white-space: pre-line;"><figure class="avatar"><img src="./img/profile-80.jpg" /></figure>' + answer + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
  }).catch(function(error) {
    console.error("Error:", error);
  });


}

// 发送问题
function ask(question) {

  if(!question) {
    console.log("ask nothing was valid")
    return
  }

  // 准备 POST 请求参数
  var postData = {
    "question": question
  };

  // 返回一个 Promise 对象
  return new Promise(function (resolve, reject) {
    fetch('https://toolkit.show/tool/gpt/text/ask', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body:JSON.stringify(postData)
    })
      .then(function (response) {
        // 检查响应状态码
        if (response.ok) {
          // 返回响应结果的 JSON 格式
          return response.json();
        } else {
          console.log("Network response was not ok.");
          return {"message":"抱歉，服务超时！请重试！","code":503}
          // 如果响应状态码不是 200，抛出一个错误
         
        }
      })
      .then(function (data) {
        // 处理响应结果
        resolve(data);
      })
      .catch(function (error) {
        // 处理错误
        reject(error);
      });

  })



}


  // 文字转语音
  function textToVoice(text) {
    
    if(!text) {
      console.log("text nothing was valid")
      return
    }
    // 准备 POST 请求参数
    var paramsDto = {
      "locale": hasChinese(text) ? "zh-CN" : "en-US",
      "voice":  hasChinese(text) ? "zh-CN-YunxiNeural" : "en-US-GuyNeural",
      "style": "general",
      "voiceRate": 0,
      "voicePitch": 0,
      "content": text,
    };
  
    let ctx = new AudioContext();
  
        // 返回一个 Promise 对象
    return new Promise(function (resolve, reject) {
      fetch('https://toolkit.show/tool/audio/play/sync/tts', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body:JSON.stringify(paramsDto)
      })
        .then(function (response) {
          // 检查响应状态码
          if (response.ok) {
            // 返回响应结果的 byte 格式
            return response.arrayBuffer()
          } else {
            // 如果响应状态码不是 200，抛出一个错误
            throw new Error("Network response was not ok.");
          }
        }).then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
        .then(audio => {
          // 处理响应结果
          let player = ctx.createBufferSource();
          player.buffer = audio;
          player.connect(ctx.destination);
          player.start(ctx.currentTime);
          resolve(audio);
        })
        .catch(function (error) {
          // 处理错误
          reject(error);
        });
  
    })
    }

// 判断字符串是否包含中文
function hasChinese(str) {
  return /[\u4E00-\u9FA5]+/g.test(str)
}


var mySwiper = new Swiper('.swiper-container', {
  // Optional parameters
  direction: 'horizontal',
  loop: false,
});


// 弹出层逻辑

var openInfos = [
  {
    "pic":"./img/0.jpg",
    "name":"关注公众号<br>【Drew小哥】<br>发送【chat】获取暗号"
  },
  {
    "pic":"./img/1.jpg",
    "name":"关注公众号<br>【ggball coding】<br>发送【chat】获取暗号"
  }
]

function showPopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "block";

  let i = parseInt(Math.random()*10 % 2)
  document.querySelector(".openImg").setAttribute("src",openInfos[i]["pic"]);
  document.querySelector(".popup-header").innerHTML = openInfos[i]["name"];

}


function closePopup() {
  var popup = document.getElementById("popup");
  var secretCode = document.getElementById("secretCode");
  let code = secretCode.value
  if (code == "chat2023") {
    popup.style.display = "none";
  } else{
    alert("错误暗号！请关注公众号，发送【chat】获取暗号")
  }
  
}


// 工具

function ipPass() {


  $.getJSON('https://api.ipify.org/?format=json', function(data){
    console.log(data);
    // 判断ip是否可以访问
    if (data.ip != "165.154.230.203") {
      showPopup()
    }
});

}