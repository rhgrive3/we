document.addEventListener('DOMContentLoaded', () => {
    // Custom Select Component
    class CustomSelect extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: "open" });
            const template = document.createElement("template");
            template.innerHTML = `
                <style>
                    :host {
                        display: inline-block;
                        position: relative;
                    }
                    .dropdown {
                        display: none;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        background-color: rgba(255, 255, 255, 0.9);
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                        border-radius: 10px;
                        z-index: 100;
                        min-width: 150px;
                        max-height: 200px;
                        overflow-y: auto;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        animation: fadeIn 0.2s ease-out;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-5px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    :host([open]) .dropdown {
                        display: block;
                    }
                    :host .label { 
                        display: inline-flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 120px;
                        height: 36px;
                        padding: 0 12px;
                        border-radius: 8px;
                        background-color: rgba(255, 255, 255, 0.2);
                        color: white;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
                    }
                    :host .label:hover {
                        background-color: rgba(255, 255, 255, 0.3);
                    }
                    :host .label::after {
                        content: '';
                        width: 10px;
                        height: 10px;
                        border-right: 2px solid white;
                        border-bottom: 2px solid white;
                        transform: rotate(45deg) translateY(-2px);
                        transition: transform 0.2s ease;
                    }
                    :host([open]) .label::after {
                        transform: rotate(-135deg) translateY(2px);
                    }
                    .item {
                        padding: 10px 12px;
                        cursor: pointer;
                        color: #333;
                        font-size: 14px;
                        transition: background-color 0.2s ease;
                    }
                    .item:not(:last-child) {
                        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                    }
                    .item.selected {
                        background-color: rgba(0, 122, 255, 0.1);
                        color: #007AFF;
                        font-weight: 500;
                    }
                    .item:hover {
                        background-color: rgba(0, 0, 0, 0.05);
                    }
                </style>
                <div class="label">全ランク</div>
                <div class="dropdown"></div>
            `;
            shadow.appendChild(template.content.cloneNode(true));

            this.label = shadow.querySelector(".label");
            this.dropdown = shadow.querySelector(".dropdown");

            this.addEventListener("click", (event) => {
                const isOpen = this.hasAttribute("open");
                if (isOpen) {
                    this.removeAttribute("open");
                } else {
                    const selectElement = this.parentNode.querySelector("select");
                    if (selectElement) { 
                        selectElement.style.display = "none"; 
                    }
                    this.setAttribute("open", "");
                }
            });

            document.addEventListener("click", (event) => {
                if (!this.contains(event.target)) {
                    this.removeAttribute("open");
                }
            });
        }

        connectedCallback() {
            const options = this.querySelectorAll("option");
            for (const option of options) {
                const value = option.getAttribute("value");
                const text = option.textContent;

                const item = document.createElement("div");
                item.classList.add("item");
                item.setAttribute("data-value", value);
                item.textContent = text;

                item.addEventListener("click", (event) => {
                    event.stopPropagation();

                    const selectedItem = this.dropdown.querySelector(".selected");
                    if (selectedItem) {
                        selectedItem.classList.remove("selected");
                    }

                    item.classList.add("selected");
                    this.label.textContent = text;
                    this.removeAttribute("open");
                    this.dispatchEvent(new Event("change"));
                });
                this.dropdown.appendChild(item);
            }
        }

        get value() {
            const selectedItem = this.dropdown.querySelector(".selected");
            if (selectedItem) {
                return selectedItem.getAttribute("data-value");
            }
            return "";
        }
    }

    customElements.define("custom-select", CustomSelect);

    // Add smooth animations to panels
    const addPanelAnimations = () => {
        const panels = [
            document.getElementById('status'),
            document.getElementById('choose'),
            document.getElementById('torisetsu')
        ];
        
        panels.forEach(panel => {
            if (panel) {
                panel.addEventListener('animationend', () => {
                    panel.style.animation = '';
                });
            }
        });
    };
    
    addPanelAnimations();

    // Initialize search functionality
    const initSearch = () => {
        const inputElement = document.querySelector(".search_text");
        if (inputElement) {
            inputElement.addEventListener("input", filterTable);
        }
    };
    
    initSearch();

    // Load character data
    loadCharacterData();
});

// Utility functions
function hide(elements) {
    elements.forEach(function(element) {
        element.style.display = 'none';
    });
}

function show(elements) {
    elements.forEach(function(element) {
        element.style.display = '';
    });
}

// Filter table based on search input
function filterTable() {
    var input = document.querySelector(".search_text").value.toLowerCase();
    var rows = document.querySelectorAll("#List tbody tr");
    rows.forEach(function (row) {
        let tdElement = row.querySelector("td:nth-child(3) a");
        if (tdElement) {
            let tdValue = tdElement.textContent.toLowerCase();
            if (tdValue.includes(input)) {
                row.style.display = "table-row";
            } else {
                row.style.display = "none";
            }
        }
    });
    changeDisplay3();
}

// Change display based on rank selection
function changeDisplay() {
    var selectedValue = document.querySelector(".search_rank").value;
    var trElements = document.querySelectorAll("#List tbody tr");

    trElements.forEach(function (element) {
        var fontElement = element.querySelector("td:nth-child(2) font.hide");
        if (fontElement && (selectedValue === "" || fontElement.textContent.includes(selectedValue))) {
            element.style.display = "";
        } else {
            element.style.display = "none";
        }
    });
}

function changeDisplay3() {
    var selectedValue = document.querySelector(".search_rank").value;
    var trElements = document.querySelectorAll("#List tbody tr");

    trElements.forEach(function (element) {
        var fontElement = element.querySelector("td:nth-child(2) font.hide");
        if (fontElement && (selectedValue === "" || fontElement.textContent.includes(selectedValue))) {
            // Keep visible
        } else {
            element.style.display = "none";
        }
    });
}

// Remove data from local storage
function remove() {
    // Create iOS-style alert
    const result = confirm('本当に削除していいですか？');
    if (!result) {
        alert('削除されませんでした');
    } else {
        localStorage.removeItem('valueArray');
        localStorage.clear();
        alert('削除しました');
    }
}

// Convert number to hex
function toHex(num) { return "0x" + num.toString(16); }

// Character ID variable
let CharaID = null;

// Extract number from text
function extractNumberFromText(text) {
    CharaID = parseInt(text.match(/\d+/)[0], 10);
}

// Output number and show status panel
function outputNumber(text) {
    extractNumberFromText(text);
    if (CharaID) {
        document.getElementById('contents').style.display = 'none';
    }
    const status = document.getElementById('status');
    if (status) {
        status.style.display = "block";
        status.style.animation = "slideIn 0.3s ease-out";
    }
}

// Handle kaihou button click
document.getElementById('kaihou').addEventListener('click', function() {
    let check = prompt('解放方法を1か2か3で選択してください(3は削除)');
    if (check == 1) {
        h5gg.setValue(offsets.kaihouS + (CharaID * 4), ks + 1, 'I32');
        alert('解放しました');
    } else if (check == 2) {
        h5gg.setValue(offsets.kaihouS + (CharaID * 4), ks - 1, 'I32');
        alert('解放しました');
    } else if (check == 3) {
        h5gg.setValue(offsets.kaihouS + (CharaID * 4), ks, 'I32');
        alert('削除しました');
    }
    document.getElementById("contents").style.display = "";
    document.getElementById("status").style.display = 'none';
});

let charaAddress;
let nownumber;
let textArray = [];
let labels = [];

function chooseStatus(number) {
    textArray = [];
    nownumber = null;
    nownumber = number;
    const status = document.getElementById('status'); 
    status.style.display = "none";
    const nowStatus = ((number - 1) * 0x1D4).toString(16);
    const charaIdValue = (CharaID - 1);
    const charaIdTimesSixD = toHex(0x750 * charaIdValue); 
    let CharaAddr = (parseInt(charaIdTimesSixD, 16) + parseInt(nowStatus, 16) + parseInt(offsets.catsstatus, 10));
    charaAddress = CharaAddr;
    var chooseElement = document.getElementById("choose");
    chooseElement.style.display = "block";
    chooseElement.style.animation = "slideIn 0.3s ease-out";
    
    var skipIndices = [8,9,11,14,15,54,56,57,68,69,76];
    labels = [
        "体力: ", "KB数: ", "速度(2x): ", "攻撃力: ", "攻撃待機時間: ", "感知射程(4x): ", "コスト(100x): ", 
        "再生産: ", "例外: ", "例外: ", "対赤: ", "例外: ", "攻撃種類: ", "攻撃発生: ", "例外: ", "例外: ", 
        "対浮: ", "対黒: ", "対メタル: ", "対白: ", "対天使: ", "対エイリアン: ", "対ゾンビ: ", "めっぽう強い: ", 
        "ふっとばす(確率): ", "止める(確率): ", "止める(時間): ", "遅くする(確率): ", "遅くする(時間): ", 
        "打たれ強い: ", "超ダメ: ", "クリティカル(確率): ", "攻撃ターゲット限定: ", "撃破金2倍: ", "対城: ", 
        "波動(確率): ", "波動(レベル): ", "攻撃ダウン(確率): ", "攻撃ダウン(時間): ", "攻撃ダウン倍率: ", 
        "攻撃up発動HPトリガー: ", "攻撃力up倍率: ", "生き残る(確率): ", "メタル属性: ", "最短射程(x4): ", 
        "最長射程(x4 - 最短射程): ", "波動無効: ", "波動ストッパー: ", "ふっとばす無効: ", "動く止める無効: ", 
        "動き遅くする無効: ", "攻撃ダウン無効: ", "ゾンビキラー: ", "魔女キラー: ", "例外: ", "最大攻撃回数1: ", 
        "例外", "例外 ", "最大回数2: ", "2段目威力: ", "3段目威力: ", "2発生f: ", "3発生f: ", "一撃目特性付与: ", 
        "二撃目特性付与: ", "三撃目特性付与: ", "生産演出(-1基本): ", "死亡演出(0): ", "例外: ", "例外: ", 
        "バリブレ: ", "ワープ確率: ", "ワープ時間: ", "ワープ距離最短: ", "ワープ距離最長: ", "ワープ無効: ", 
        "例外: ", "使徒キラー: ", "対古: ", "呪い無効: ", "超打たれ強い: ", "極ダメ: ", "渾身確率: ", 
        "渾身倍率(100x-1): ", "攻撃無効確率: ", "攻撃無時間(25x): ", "烈波確率: ", "烈波最短距離: ", 
        "烈波動最長距離: ", "烈波レベル: ", "毒撃無効: ", "烈波無効: ", "呪い確率: ", "呪い時間: ", "小波動化: ", 
        "シルブレ: ", "対悪: "
    ];

    for (var i = -6; i < 91; i++) { 
        var textToInsert = h5gg.getValue((parseInt(CharaAddr, 10) + (i * 4)), "I32");
        textArray.push(textToInsert);
    }

    var statusItems = chooseElement.querySelectorAll(".status-item");
    for (var j = 0; j < textArray.length && j < statusItems.length; j++) {
        if (skipIndices.includes(j)) {
            statusItems[j].style.display = "none";
            continue;
        }
        var text = labels[j] + textArray[j];
        var spanElement = statusItems[j].querySelector("span");
        if (spanElement) {
            spanElement.textContent = text;
        }
    }
}

function torisetsu() {
    let choose = document.getElementById("choose");
    let torisetsu = document.getElementById("torisetsu");
    choose.style.display = 'none';
    torisetsu.style.display = 'block';
    torisetsu.style.animation = "slideIn 0.3s ease-out";
}

function backed() {
    let choose = document.getElementById("choose");
    let torisetsu = document.getElementById("torisetsu");
    choose.style.display = 'block';
    choose.style.animation = "slideIn 0.3s ease-out";
    torisetsu.style.display = 'none';
}

function givesprompt(name, offsets) {
    offset = parseInt(charaAddress, 10) + parseInt((offsets * 4), 10);
    value = prompt(`${name}を入力してください`);
    if (value !== null) {
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
            if (offset) {
                h5gg.setValue(offset, parsedValue, "I32");
                chooseStatus(nownumber);
            } else {
                alert("正しい数値を入力してください");
            }
        }
    }
    loads();
}

function load() {
    let storedData = JSON.parse(localStorage.getItem("valueArray"));
    if (storedData !== null) {
        for (let i = 0; i < 721; i++) {
            let CharacterID = Number(offsets.catsstatus + (i * 0x750));
            for (let j = 0; j < 3; j++) {
                let getter = CharacterID + (j * 0x1D4);
                let ID = "0x" + getter.toString(16);
                for (let k = -6; k < 91; k++) {
                    h5gg.clearResults();
                    let number = (i * 3 * 97) + (j * 97) + (k + 6);
                    let value = h5gg.setValue("0x" + (parseInt(ID, 16) + (k * 4)).toString(16), storedData[number], "I32");
                }
            }
        }
    }
}

function loads() {
    valueArray = [];
    for (let i = 0; i < 721; i++) {
        let CharacterID = Number(offsets.catsstatus + (i * 0x750));
        for (let j = 0; j < 3; j++) {
            let getter = CharacterID + (j * 0x1D4);
            let ID = "0x" + getter.toString(16);
            for (let k = -6; k < 91; k++) {
                h5gg.clearResults();
                let value = h5gg.getValue("0x" + (parseInt(ID, 16) + (k * 4)).toString(16), "I32");
                h5gg.clearResults();
                valueArray.push(value);
            }
        }
    }
    localStorage.clear();
    localStorage.setItem("valueArray", JSON.stringify(valueArray));
}

function back() {
    document.getElementById("contents").style.display = "";
    document.getElementById("choose").style.display = "none";
}

let locker;
function aa() {
    const hpswitch = document.getElementById("aa");
    HPEnabled = hpswitch.checked;
    
    if (HPEnabled) {
        locker = setInterval(function() {
            h5gg.setValue(offsets.God, "1", "I32");
        }, 500); 
    } else {
        if (locker !== null) {
            clearInterval(locker);
            locker = null;
        }
    }
}

function loadCharacterData() {
    fetch('../json/characters.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const charaDATA = data.map(item => ({
          id:       item.id.slice(0, 3),
          rankText: item.rankText,
          rankHide: item.rankHide,
          rankLink: item.rankLink,
          name:     item.name,
          pageLink: item.pageLink
        }));

        const tbody = document.getElementById('table-body');
        tbody.innerHTML = '';
        charaDATA.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${item.id}</td>
            <td>
              <a class="rank" href="${item.rankLink}">${item.rankText}</a>
              <font class="hide">${item.rankHide}</font>
            </td>
            <td>
              <a class="truncate" href="${item.pageLink}">${item.name}</a>
            </td>
            <td>
              <button type="button" onclick="outputNumber('${item.id}')">改竄</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(error => {
        console.error('データ取得／描画エラー:', error);
      });
  }

const statusItems = [
  ['HP', -6],
  ['KB数', -5],
  ['移動速度', -4],
  ['攻撃力', -3],
  ['攻撃待機時間', -2],
  ['感知射程', -1],
  ['コスト', 0],
  ['再生産', 1],
  ['対赤', 4],
  ['範囲=1', 6],
  ['攻撃発生時間', 7],
  ['対浮', 10],
  ['対黒', 11],
  ['対メ', 12],
  ['対白', 13],
  ['対天', 14],
  ['対エ', 15],
  ['対ゾ', 16],
  ['めっぽう強い', 17],
  ['吹っ飛ばす', 18],
  ['動き止める確率', 19],
  ['動き止め時間', 20],
  ['遅確率', 21],
  ['遅時間', 22],
  ['打たれ強い', 23],
  ['超ダメ', 24],
  ['クリ', 25],
  ['タゲ限定', 26],
  ['金2倍', 27],
  ['対城', 28],
  ['波動確率', 29],
  ['波動レベル', 30],
  ['攻ダウン確率', 31],
  ['攻ダウン時間', 32],
  ['攻ダウン倍率', 33],
  ['攻撃upトリガーＨＰ', 34],
  ['攻撃up倍率', 35],
  ['生き残る確率', 36],
  ['メタル属性化', 37],
  ['最小射程', 38],
  ['最長射程', 39],
  ['波動無効', 40],
  ['波動ストッパー', 41],
  ['ふっとばす無効', 42],
  ['動き止める無効', 43],
  ['動き遅する無効', 44],
  ['攻撃ダウン無効', 45],
  ['ゾンビキラー', 46],
  ['魔女キラー', 47],
  ['攻撃回数変更1', 49],
  ['攻撃回数変更2', 52],
  ['2撃目威力', 53],
  ['3撃目威力', 54],
  ['2撃目発生f', 55],
  ['3撃目発生f', 56],
  ['特性付与1撃目', 57],
  ['特性付与2撃目', 58],
  ['特性付与3撃目', 59],
  ['生産演出-1が基本0は特殊', 60],
  ['死亡演出0が基本～15は特殊', 61],
  ['バリブレ確率', 64],
  ['ワープ確率', 65],
  ['ワープ時間(f)', 66],
  ['ワープ最低距離', 67],
  ['ワープ最高距離', 68],
  ['ワープ無効', 69],
  ['使徒キラー', 71],
  ['対古', 72],
  ['呪い無効', 73],
  ['超打たれ強い', 74],
  ['極ダメ', 75],
  ['渾身確率', 76],
  ['渾身倍率', 77],
  ['攻撃無効確率', 78],
  ['攻撃無効時間(25x)', 79],
  ['烈波確率', 80],
  ['烈波最短距離', 81],
  ['烈波最長距離', 82],
  ['烈波レベル', 83],
  ['毒撃無効', 84],
  ['烈波無効', 85],
  ['呪い確率', 86],
  ['呪い時間', 87],
  ['小波動化', 88],
  ['シルブレ', 89],
  ['対悪', 90]
];

function renderStatusList() {
  const container = document.querySelector('.status-list');
  container.innerHTML = statusItems.map(
    ([label, idx]) => `
      <div class="status-item">
        <span class="status-icon"></span>
        <button 
          class="ios-button edit-button"
          data-label="${label}"
          data-index="${idx}"
        >変更</button>
      </div>`
  ).join('');
  
  container.addEventListener('click', e => {
    const btn = e.target.closest('.edit-button');
    if (!btn) return;
    const label = btn.dataset.label;
    const idx   = parseInt(btn.dataset.index, 10);
    givesprompt(label, idx);
  });
}

document.addEventListener('DOMContentLoaded', renderStatusList);
/*
h5gg.searchNumber('32400','I32','0x100000000','0x110000000');
let baseAddr = Number(window.parent.h5gg.getResults('1')[0].address);
let offsets = {
  catsstatus: baseAddr + 0x8d0b0,
  God: baseAddr + 0x1868f4c,//
  kaihouE: baseAddr + 0x3b6e4,
  kaihouS: baseAddr + 0x3aa34, //-1個目
}
let ks = Number(h5gg.getValue(offsets.kaihouE,"I32"));*/
