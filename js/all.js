var firebaseConfig = {
  apiKey: "AIzaSyDgQ2BBEyzRi3Vymqe5m0joS2xWzt1JCD0",
  authDomain: "bmi-meneger.firebaseapp.com",
  databaseURL: "https://bmi-meneger.firebaseio.com",
  projectId: "bmi-meneger",
  storageBucket: "bmi-meneger.appspot.com",
  messagingSenderId: "184150909969",
  appId: "1:184150909969:web:0b7644925b5ebaaf437db0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 連接 Firebase
var BMIRef = firebase.database().ref('BMI-List');

// DOM元素
var height = document.querySelector('.height');
var weight = document.querySelector('.weight');
var result = document.querySelector('.result');
var list = document.querySelector('.record_list');
var result_btn = document.querySelector('.result_btn');


// Fn 程式區段 - 送出按鈕
function sendFirebase(e) {
  e.preventDefault();
  var heightVal = Number(height.value);
  var weightVal = Number(weight.value);
  var BMI = (weightVal / (heightVal / 100 * heightVal / 100)).toFixed(1);

  BMIRef.push({
    height: heightVal,
    weight: weightVal,
    BMI: BMI,
    recordTime: recordTime(Date.now()),
    status: status(BMI),
    statusBgColor: bgColor(BMI),
    statusShadowColor: shadowColor(BMI)
  })

  transResultBtn(BMI);
  
}
function transResultBtn(BMI) {
  var resultBtn = document.querySelector('.result_btn');
  var str = '';

  str = `<div class="calculation">
          <div class="calculation_result" style="border: 6px solid ${bgColor(BMI)}; color:${bgColor(BMI)}">
            <div class="calculation_result_text">
              <p>${BMI}</p><span>BMI</span>
            </div>
            <div class="reset" style="background-color:${bgColor(BMI)}">
              <i class="fas fa-redo"></i>
            </div>
          </div>
          <div class="calculation_text" style="color:${bgColor(BMI)}">${status(BMI)}</div>
        </div>`

  resultBtn.innerHTML = str;

  var reset = document.querySelector('.reset');
  reset.addEventListener('click', resetVal, false);

}
function resetVal() {
  var resultBtn = document.querySelector('.result_btn');
  var str = '';

  height.value = "";
  weight.value = "";

  str = `<div class="result centerFlex">
            <p>看結果</p>
          </div>`
  resultBtn.innerHTML = str;

  var result = document.querySelector('.result');
  result.addEventListener('click', sendFirebase, false);
}
// Fn 程式區段 - 數值計算
function recordTime(time) {
  var date = new Date(time);
  return (date.getMonth() + 1) + '-' + (date.getDate()) + '-' + (date.getFullYear())
}
function status(BMI) {
  if (BMI < 18.5) {
    return '過輕'
  } else if (24 > BMI && BMI >= 18.5) {
    return '理想'
  } else if (27 > BMI && BMI >= 24) {
    return '過重'
  } else if (30 > BMI && BMI >= 27) {
    return '輕度肥胖'
  } else if (35 > BMI && BMI >= 30) {
    return '中度肥胖'
  } else if (BMI >= 35) {
    return '重度肥胖'
  }
}
function bgColor(BMI) {
  if (BMI < 18.5) {
    return '#31BAF9'
  } else if (24 > BMI && BMI >= 18.5) {
    return '#86D73F'
  } else if (27 > BMI && BMI >= 24) {
    return '#FF982D'
  } else if (30 > BMI && BMI >= 27) {
    return '#FF6C03'
  } else if (35 > BMI && BMI >= 30) {
    return '#FF6C03'
  } else if (BMI >= 35) {
    return '#FF1200'
  }
}
function shadowColor(BMI) {
  if (BMI < 18.5) {
    return '2px 0 3px 0 rgba(49,186,249,0.29)'
  } else if (24 > BMI && BMI >= 18.5) {
    return '2px 0 3px 0 rgba(134,215,63,0.29)'
  } else if (27 > BMI && BMI >= 24) {
    return '2px 0 3px 0 rgba(255,152,45,0.29)'
  } else if (30 > BMI && BMI >= 27) {
    return '2px 0 3px 0 rgba(255,108,3,0.29)'
  } else if (35 > BMI && BMI >= 30) {
    return '2px 0 3px 0 rgba(255,108,3,0.29)'
  } else if (BMI >= 35) {
    return '2px 0 3px 0 rgba(255,18,0,0.29)'
  }
}
// Fn 程式區段 - Firebase資料撈取
function firebaseDate(snapshot) {
  console.log('snapshot.val()', snapshot.val());
  var data = snapshot.val();
  var str = '';
  for (var item in data) {
    str += `<li class="record_list_item">
              <div class="status" style="background-color: ${data[item].statusBgColor}; box-shadow: ${data[item].statusShadowColor}"></div>
              <p class="item_status">${data[item].status}</p>
              <p class="item_value">
                <span class="value_title">BMI</span>${data[item].BMI}
              </p>
              <p class="item_value">
                <span class="value_title">weight</span>${data[item].weight}kg
              </p>
              <p class="item_value">
                <span class="value_title">height</span>${data[item].height}cm
              </p>
              <p class="item_date">${data[item].recordTime}</p>
            </li>`
  };
  list.innerHTML = str;
}

// 傳送資料到Firebase
result.addEventListener('click', sendFirebase, false)

// 從 Firebase 撈取資料並顯示
BMIRef.on('value', firebaseDate, false);