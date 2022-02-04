<template>
  <div>
    <div id='pop' :style='blackbg' v-if='dialog == true'>
      <div :style='whitebg'>
        <b>{{ message }}</b>
        <v-btn @click='dialog=false'>닫기</v-btn>
        <div id='sheetPop' :style='sheetPopStyle'></div>
      </div>
    </div>
    <div>
      <v-btn @click='BtnFunc(1)'>조회</v-btn>
      <v-btn @click='BtnFunc(2)'>추가</v-btn>
      <v-btn @click='BtnFunc(3)'>삭제</v-btn>
      <v-btn @click='BtnFunc(4)'>저장</v-btn>
      <v-btn @click='BtnFunc(5)'>문자열 추출</v-btn>
      <v-btn @click='BtnFunc(6)'>JSON 추출</v-btn>
      <v-btn @click='BtnFunc(7)'>엑셀업로드</v-btn>
      <v-btn @click='BtnFunc(8)'>엑셀다운로드</v-btn>
    </div>
    <div id='sheetContainer' :style='sheetStyle'></div>
  </div>

</template>

<script>
import loader from '@ibsheet/loader';
import { IB_Preset } from "../shared/common"; // Extend 를 사용하기 위한 모듈 파일.

// 시트 id
let SHEET_ID = '';
// 팝업 시트 id
let popSheetId = '';
// 시트 객체 담을 변수
let ibsheet = {};

export default {
  data() {
    return {
      sheetPopStyle: 'width: 100%; height: 300px;',
      sheetStyle: 'height: 700px;',
      dialog: false,
      message: 'Sheet Popup',
      blackbg: 'z-index: 999; width: 100%; height:100%; background: rgba(0,0,0,0.5); position: fixed; padding: 20px;',
      whitebg: 'width: 100%; background: white; border-radius: 8px; padding: 20px;',
      // 팝업시트 옵션
      popSheetOpt: {
        options: {
          "Cfg": {
            "SearchMode": 0,
            "HeaderMerge": 3,
            "FitWidth": 1
          },
          "Cols": [
            {"Header": ["신청인","신청인"],"Type": "Text","MinWidth": 100,"Name": "sName","ColMerge": 1},
            {"Header": ["선택","선택"],"Type": "Bool","MinWidth": 80,"Name": "check","ColMerge": 1},
            {"Header": ["신청사유","신청사유"],"Type": "Enum","MinWidth": 150,"Name": "Reason","ColMerge": 0,"Align": "Center","Enum": "|야근|주말특근|휴일특근","EnumKeys": "|01|02|03"},
            {"Header": ["신청금액","신청금액"],"Type": "Int","MinWidth": 100,"Name": "Qty","ColMerge": 1,"Required": 1},
          ]
        }
      },
      // 시트 옵션
      sheetOpt: {
        options: {
          // 공통 설정의 경우 Def 를 이용하여 할 수 있습니다.
          Def: {
            Col: {
              Width: 70,
              Align: 'Center'
            },
            Row: {
              // Formula 를 사용하기 위한 옵션
              CanFormula: true,
              // Formula 를 사용할 컬럼 이름, attribute + Formula 의 경우 컬럼 + 속성명을 입력합니다. ex) 컬럼이름: M7 속성: EmptyValue
              CalcOrder: 'L8,M7EmptyValue,R2'
            }
          },
          Cfg: {
            SearchMode: 3,
          },
          LeftCols: [
            {
              Header: ['NO', 'NO'],
              Name: 'SEQ'
            },
            {
              Header: ['삭제', '삭제'],
              Name: 'DelCheck',
              // Extend 를 사용하여 IB_Preset 모듈을 입힐 수 있습니다.
              Extend: IB_Preset.DelCheck
            },
            {
              Header: ['정보', '정보11'],
              Name: 'L1',
              Type: 'Text',
              // TextColor 를 사용하여 글씨색을 변경할 수 있습니다.
              TextColor: '#f00'
            },
            {
              Header: ['정보', '정보12'],
              Name: 'L2',
              Type: 'Text',
              // Color 를 사용하여 배경색을 변경할 수 있습니다.
              Color: '#ff7f00'
            },
            {
              Header: ['정보', '정보13'],
              Name: 'L3',
              Type: 'Text',
              // CanEdit 을 사용하여 편집불가(0), 가능(1)을 할 수 있습니다.
              CanEdit: 0,
              // 셀의 OnClick 이벤트를 사용합니다.
              OnClick: evt => {
                // 클릭시 특정 url 호출하면서 정보11, 12 param 실려가는거 확인.
                evt.sheet.ajax({url: 'http://localhost:8000/api/ajaxTest', param: 'L1=' + evt.row['L1'] + '&' + 'L2=' + evt.row['L2']});
              }
            },
            {
              Header: ['정보2', '정보21'],
              Name: 'L4',
              Type: 'Bool'
            },
            {
              Header: ['정보2', '정보22'],
              Name: 'L5',
              // Button 을
              Type: 'Button',
              Button: 'Button',
              OnClick: evt => {
                // 버튼 클릭시 특정 URL 호출
                location.href = 'https://ibsheet.com/'
              }
            },
            {
              Header: ['정보2', '날짜1'],
              Name: 'L6',
              Extend: IB_Preset.YMDHMS
            },
            {
              Header: ['정보2', '날짜2'],
              Name: 'L7',
              Extend: IB_Preset.YMDHMS
            },
            {
              Header: ['정보2', '날짜2-날짜1'],
              Name: 'L8',
              Extend: IB_Preset.mmss,
              // 포뮬러 (엑셀 예약 수식어) 메뉴얼 참고
              Formula: fr => {
                const row = fr.Row;
                let diff = 0;
                if (row['L6'] && row['L7']) {
                  // 날짜2 - 날짜1
                  diff = Math.round((row['L7'] - row['L6']) / 1000) * 1000;
                  if (diff < 0) diff = 0;
                }
                return diff;
              }
            },
            {
              Header: ['정보2', '시간'],
              Name: 'L9',
              Extend: IB_Preset.mmss
            },
            {
              Header: ['정보2', '저장시간'],
              Name: 'L10',
              Extend: IB_Preset.mmss
            },
            {
              // Text 컬럼을 이용하여 분초 마스킹
              Header: ['정보2', '분초 마스킹'],
              Name: 'L11',
              Extend: IB_Preset.MaskingBunCho
            },
          ],
          Cols: [
            {
              Header: ['정보3', '정보31'],
              Name: 'M1',
              Type: 'Bool'
            },
            {
              Header: ['정보3', '정보32'],
              Name: 'M2',
              Type: 'Text',
              CanEdit: 0
            },
            {
              Header: ['정보3', '날짜'],
              Name: 'M3',
              Extend: IB_Preset.YMDHMS,
              CanEdit: 0,
              OnClick: evt => {
                // vue dialog open
                this.dialog = true;
                // 날짜 클릭시 팝업창에 그리드 확인.
                // window.open('./Popup', 'windowPop', 'width=500, height=600, resizable=yes');
              }
            },
            {
              Header: ['정보4', '정보41'],
              Name: 'M4',
              Type: 'Bool'
            },
            {
              Header: ['정보4', '정보42'],
              Name: 'M5',
              Type: 'Enum',
              // select 리스트 데이터 (서버에서 받아와서 동적으로 하는 경우, setAttribute 를 이용하시면 됩니다.) setAttribute(row, col, 'Enum', '|A|B|C|D')
              // Enum: '|사과|배|C|D',
              // EnumKeys: '|1|2|3|4'
            },
            {
              Header: ['정보4', '정보43'],
              Name: 'M6',
              Type: 'Text'
            },
            {
              Header: ['정보4', '정보44'],
              Name: 'M7',
              Type: 'Text',
              // attribute + Formula 사용, 메뉴얼 참고. 빈값일 시 L1 + L2 값, 동적인
              EmptyValueFormula: fr => fr.Row['L1'] + fr.Row['L2']
            },
          ],
          RightCols: [
            {
              Header: ['정보5', '정보51'],
              Name: 'R1'
            },
            {
              Header: ['정보5', '정보52'],
              Name: 'R2'
            }
          ],
          Events: {
            onRenderFirstFinish: evt => {
              // 동적으로 Enum, EnumKeys 사용방법
              evt.sheet.setAttribute(null, 'M5', 'Enum', '|A|B|C|D');
              evt.sheet.setAttribute(null, 'M5', 'EnumKeys', '|1|2|3|4');
              // SearchMode: 3 을 통해 조회
              const param = {
                url: 'http://localhost:8000/api/data',
                // 카운팅 할 data 의 갯수와 전체 갯수를 param 으로 해서 보내도록 합니다.
                param: 'data=1000&total=20000&searchMode=' + evt.sheet.SearchMode,
                callback: rtn => {
                  const rtnData = JSON.parse(rtn.data);
                  evt.sheet.showMessageTime('<span style=\'color:black\'>조회가 완료되었습니다.<br> 서버모듈 전체 데이터 건수 : ' + rtnData.Total + '</span>', 1500);
                }
              };

              evt.sheet.doSearchPaging(param);
            },
            onRowLoad: evt => {
              // 시트 렌더링 완료전 각 행마다 호출 하는 이벤트로 해당 이벤트시에 셀의 데이터를 변경해도 됨.
            },
            onAfterChange: evt => {
              // 체크 박스누를시 에 대한 이벤트 처리
              const sheet = evt.sheet;
              const row = evt.row;
              const col = evt.col;

              if (col === 'L4') {
                // 날짜1, 날짜2 에 시점
                sheet.setValue(row, row[col] ? 'L6' : 'L7', new Date().getTime());
              } else if (col === 'M1') {
                // 체크박스 클릭시 입력가능 불가능
                sheet.setAttribute(row, 'M2', 'CanEdit', row[col] ? 1 : 0);
              } else if (col === 'M4') {
                if (row[col]) {
                  // select 자동 활성화
                  sheet.startEdit(row, 'M5');
                } else {
                  sheet.endEdit(0);
                }
              } else if (col === 'M5') {
                // select 리스트 자동 입력
                sheet.setValue(row, 'M6', sheet.getString(row, col));
              }
            },
            // 이벤트 순서: onSave => onBeforeSave => onAfterSave
            onSave: evt => {
              evt.sheet.showMessage('저장 중');
              // 시작 시간
              evt.sheet.StartSaveTime = new Date().getTime();
            },
            onBeforeSave: evt => {
              // 저장 전 이벤트에서 Changed 된 로우들의 객체를 미리 담아줍니다.
              evt.sheet.SaveRows = evt.sheet.getRowsByStatus('Changed');
            },
            onAfterSave: evt => {
              // 저장 후 시간 체크
              if (evt.sheet.SaveRows) {
                const endSaveTime = Math.round((new Date().getTime() - evt.sheet.StartSaveTime) / 1000) * 1000;
                delete evt.sheet.StartSaveTime;
                for (let i = 0; i < evt.sheet.SaveRows.length; i++) {
                  evt.sheet.SaveRows[i]['L10'] = endSaveTime;
                  evt.sheet.refreshCell(evt.sheet.SaveRows[i], 'L10');
                }
                delete evt.sheet.SaveRows;
                evt.sheet.hideMessage();
              }
            }
          }
        }
      }
    }
  },
  mounted() {
    const options = this.sheetOpt.options;

    loader.createSheet({
      el: 'sheetContainer',
      options,
      // data
    }).then((sheet) => {
      ibsheet = sheet;
      SHEET_ID = ibsheet.id;
    });
  },
  updated() {
    // 렌더링이 일어나면 발생
    if (this.dialog) {
      // 팝업 시트 데이터
      const data = [
        {"Reason":"01","sName":"강인철","rDate":"20030908","chk":0,"Qty":545000,"Time1":"1300","Time2":"1800"},
        {"Reason":"01","sName":"김수용","rDate":"20030906","chk":1,"Qty":500000,"Date1":"20030906","Date2":"20030906","Time1":"0900","Time2":"1800"},
        {"Reason":"01","sName":"김수용","rDate":"20030906","chk":1,"Qty":500000,"Date1":"20030906","Date2":"20030906","Time1":"0900","Time2":"1800"},
        {"Reason":"01","sName":"김수용","rDate":"20030906","chk":1,"Qty":500000,"Date1":"20030906","Date2":"20030906","Time1":"0900","Time2":"1800"},
        {"Reason":"02","sName":"김수용","rDate":"20030905","chk":1,"Qty":500000,"Date1":"20030905","Date2":"20030905","Time1":"0900","Time2":"1800"},
        {"Reason":"03","sName":"조문성","rDate":"20030905","chk":0,"Qty":50000,"Date1":"20030905","Date2":"20030905","Time1":"1400","Time2":"1500"},
        {"Reason":"02","sName":"김수용","rDate":"20030905","chk":1,"Qty":500000,"Date1":"20030905","Date2":"20030905","Time1":"0900","Time2":"1800"},
        {"Reason":"03","sName":"조문성","rDate":"20030905","chk":0,"Qty":50000,"Date1":"20030905","Date2":"20030905","Time1":"1400","Time2":"1500"},
        {"Reason":"02","sName":"김수용","rDate":"20030905","chk":1,"Qty":500000,"Date1":"20030905","Date2":"20030905","Time1":"0900","Time2":"1800"},
        {"Reason":"03","sName":"조문성","rDate":"20030905","chk":0,"Qty":50000,"Date1":"20030905","Date2":"20030905","Time1":"1400","Time2":"1500"}
      ];

      loader.createSheet({
        el: 'sheetPop',
        options: this.popSheetOpt.options,
        data
      }).then((sheet) => {
        popSheetId = sheet.id
      });
    } else {
      loader.removeSheet(popSheetId);
    }
  },
  methods: { // 함수만드는 공간.
    BtnFunc(mode) {
      switch (mode) {
        case 1:
          // 조회 doSearch, doSearchPaging, loadSearchData 가 있음. 메뉴얼 참고
          // page param 의 경우, 다음 조회시 ibpage=1 이런식으로 네트워크로 호출 됩니다.
          ibsheet.doSearchPaging({
            url: 'http://localhost:8000/api/data',
            param: 'data=1000&total=20000&searchMode=' + ibsheet.SearchMode,
            callback: rtn => {
              const rtnData = JSON.parse(rtn.data);
              ibsheet.showMessageTime('<span style=\'color:black\'>조회가 완료되었습니다.<br> 서버모듈 전체 데이터 건수 : ' + rtnData.Total + '</span>', 1500);
            }
          });
          break;
        case 2:
          // 행추가
          ibsheet.addRow(ibsheet.getFirstVisibleRow());
          break;
        case 3:
          // 행삭제
          ibsheet.removeRow(ibsheet.FRow || ibsheet.getFirstVisibleRow());
          break;
        case 4:
          // 저장
          ibsheet.doSave({
            url: 'http://localhost:8000/api/success',
            validRequired: true,
            queryMode: 0,
            reqHeader: { 'Content-Type': 'application/json' },
            quest: true
          });
          break;
        case 5:
          // 문자열 추출 (saveMode 값에 따라 데이터 추출 여부 메뉴얼 참고)
          console.log(ibsheet.getSaveString(0));
          break;
        case 6:
          // JSON 구조 추출 (saveMode 값에 따라 데이터 추출 여부 메뉴얼 참고)
          console.log(JSON.stringify(ibsheet.getSaveJson(0)));
          break;
        case 7:
          // 서버모듈
          ibsheet.loadExcel();
          // 클라이언트 모듈
          // ibsheet.exportData();
          break;
        case 8:
          // 서버모듈
          ibsheet.down2Excel();
          // 클라이언트 모듈
          // ibsheet.exportData();
          break;
      }
    }
  },
  beforeDestroy() {
    loader.removeSheet(SHEET_ID)
  }
}
</script>