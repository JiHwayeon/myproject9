function fnAgeCheckAll(ele) {
  let isChecked = ele.checked
  let checkList = document.querySelectorAll("input[name='ageChk']")

  for (let i = 0; i < checkList.length; i++) {
    checkList[i].checked = isChecked
  }
}

function fnJobCheckAll(ele) {
  let isChecked = ele.checked
  let checkList = document.querySelectorAll("input[name='jobChk']")

  for (let i = 0; i < checkList.length; i++) {
    checkList[i].checked = isChecked
  }
}

function fnSampleCheckAll(ele) {
  let isChecked = ele.checked
  let checkList = document.querySelectorAll("input[name='sampleChk']")

  for (let i = 0; i < checkList.length; i++) {
    checkList[i].checked = isChecked
  }
}

function fnCheckAll(ele) {
  let isChecked = ele.checked
  let checkList = document.querySelectorAll("input[name='entryChk']")

  for (let i = 0; i < checkList.length; i++) {
    checkList[i].checked = isChecked
  }
}

function fnCheckRow(ele) {
  let isChecked = ele.querySelector("input[name='entryChk']").checked
  ele.querySelector("input[name='entryChk']").checked = !isChecked
}

function fnSurveyPop(ele) {
  let surveyResultPop = document.getElementById("surveyResultPop")
  if (surveyResultPop == null) {
    $.ajax({
      url: getContextPath() + "/project/surveyResultPop.do",
      type: "POST",
      data: {
        surveyNo: ele,
      },
      dataType: "html",
      async: false,
      success: function (data) {
        $("body").append(data)
      },
      error: function (xhr, status, error) {
        console.log("function fnSurveyPop() error!")
      },
    })
  }
}

function fnClose() {
  let surveyResultPop = document.getElementById("surveyResultPop")
  if (surveyResultPop != null) {
    surveyResultPop.remove()
  }
}

function fnDeleteSurveyList() {
  let checkList = document.querySelectorAll("input[name='entryChk']:checked")

  if (checkList.length == 0 || checkList.length <= 0) {
    alert("참가자를 선택해주세요.")
  } else {
    if (confirm("선택한 참가자의 설문조사 데이터를 삭제하시겠습니까?")) {
      let surveyEntryList = []
      for (let i = 0; i < checkList.length; i++) {
        let entryNo = checkList[i].value
        let item = {
          entryNo: entryNo,
        }
        surveyEntryList.push(item)
      }

      $.ajax({
        url: getContextPath() + "/project/surveyResultDeleteList.do",
        type: "POST",
        data: JSON.stringify(surveyEntryList),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        async: false,
        success: function (data) {
          alert(data.msg)
          location.reload()
        },
        error: function (xhr, status, error) {
          console.log("function fnDeleteEntry() error!")
        },
      })
    }
  }
}

function fnSearch() {
  let ageChkList = document.querySelectorAll("input[name='ageChk']:checked")
  let jobChkList = document.querySelectorAll("input[name='jobChk']:checked")
  let sampleChkList = document.querySelectorAll(
    "input[name='sampleChk']:checked"
  )

  let ageArr = []
  let jobArr = []
  let sampleArr = []

  if (
    ageChkList.length == 0 &&
    jobChkList.length == 0 &&
    sampleChkList.length == 0
  ) {
    alert("최소 1개의 검색 조건을 선택해주세요.")
  } else if (
    ageChkList.length == 0 ||
    jobChkList.length == 0 ||
    sampleChkList.length == 0
  ) {
    alert("최소 1개의 검색 조건을 선택해주세요.")
  } else {
    $("body").prepend('<div id="loading"></div>')
    document.getElementById("layout-main").classList.add("loading")

    for (var i = 0; i < ageChkList.length; i++) {
      ageArr.push(ageChkList[i].value)
    }

    for (var i = 0; i < jobChkList.length; i++) {
      jobArr.push(jobChkList[i].value)
    }

    for (var i = 0; i < sampleChkList.length; i++) {
      sampleArr.push(sampleChkList[i].value)
    }

    let item = {
      projectNo: projectNo,
      surveyTimes: surveyTimes,
      age: ageArr,
      job: jobArr,
      product: sampleArr,
    }

    $.ajax({
      url: getContextPath() + "/project/searchFilter.do",
      type: "POST",
      data: JSON.stringify(item),
      contentType: "application/json; charset=UTF-8",
      dataType: "json",
      success: function (data) {
        // B1. 펴짐성
        $("#spreadTb").find("tbody").empty()

        let spreadAppendHtml = ""

        if (data.staticSpreadability.length <= 0) {
          spreadAppendHtml += "<tr>"
          spreadAppendHtml += "<td colspan='16' class='no-data'>"
          spreadAppendHtml += "등록된 데이터가 없습니다."
          spreadAppendHtml += "</td>"
          spreadAppendHtml += "</tr>"

          $("#spreadTb").append(spreadAppendHtml)

          spreadChart.destroy()

          // 막대그래프 - 펴짐성
          spreadChart = new Chart(document.getElementById("static_spread"), {
            type: "bar",
            data: {
              labels: ["등록된 데이터 없음"],
              datasets: [
                {
                  label: "등록된 데이터 없음",
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgb(255, 99, 132)",
                  data: [1],
                },
              ],
            },
            options: {
              responsive: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "펴짐성",
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "right",
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            },
          })
        } else {
          for (let x = 0; x <= 10; x++) {
            spreadAppendHtml += "<tr>"
            spreadAppendHtml += "<th>" + x + "</th>"

            for (let i = 0; i < data.staticSpreadability.length; i++) {
              if (data.staticSpreadability[i].staticList.length == 0) {
                spreadAppendHtml += "<td>-</td>"
              } else {
                let isText = ""
                for (
                  let j = 0;
                  j < data.staticSpreadability[i].staticList.length;
                  j++
                ) {
                  let spreadIsCnt = 0
                  if (
                    data.staticSpreadability[i].staticList[j].fieldValue == x
                  ) {
                    spreadIsCnt = 1
                    isText =
                      data.staticSpreadability[i].staticList[j].valueCount
                    break
                  } else if (spreadIsCnt == 0) {
                    isText = "-"
                  }
                }

                spreadAppendHtml += "<td>"
                spreadAppendHtml += isText
                spreadAppendHtml += "</td>"
              }
            }

            spreadAppendHtml += "</tr>"
          }

          $("#spreadTb").append(spreadAppendHtml)

          // 데이터셋 비우기
          spreadChart.destroy()

          spreadArr = new Array()

          /* 펴짐성 평균 */
          $("#spreadTb").find("tbody").append("<tr><th>평균</td></tr>")

          for (var i = 0; i < 14; i++) {
            var sum = 0
            $("#spreadTb")
              .find("tbody tr")
              .each(function () {
                if (!isNaN(Number($(this).find("td").eq(i).text()))) {
                  sum = sum + Number($(this).find("td").eq(i).text())
                }
              })
            spreadArr.push((sum / 11).toFixed(2))
            $("#spreadTb")
              .find("tbody tr:last-child")
              .append("<td>" + (sum / 11).toFixed(2) + "</td>")
          }

          // 펴짐성 총 합계
          $("#spreadTb")
            .find("tbody tr")
            .each(function () {
              var sum = 0
              $(this)
                .find("td")
                .each(function () {
                  if (!isNaN(Number($(this).text()))) {
                    sum = sum + Number($(this).text())
                  }
                })
              $(this).append("<td>" + sum + "</td>")
            })

          let newData = {
            label: "펴짐성",
            data: spreadArr,
            backgroundColor: colorize(),
          }

          // 막대그래프 - 펴짐성
          spreadChart = new Chart(document.getElementById("static_spread"), {
            type: "bar",
            data: {
              labels: [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
              ],
              datasets: [
                {
                  label: "펴짐성",
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgb(255, 99, 132)",
                  data: spreadArr,
                },
              ],
            },
            options: {
              responsive: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "펴짐성",
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "right",
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            },
          })
        }

        /******************************************************************************************************************/

        // B1. 촉촉함
        $("#wetnessTb").find("tbody").empty()

        let wetnessAppendHtml = ""

        if (data.staticWetness.length <= 0) {
          wetnessAppendHtml += "<tr>"
          wetnessAppendHtml += "<td colspan='16' class='no-data'>"
          wetnessAppendHtml += "등록된 데이터가 없습니다."
          wetnessAppendHtml += "</td>"
          wetnessAppendHtml += "</tr>"

          $("#wetnessTb").append(wetnessAppendHtml)

          wetnessChart.destroy()

          // 막대그래프 - 촉촉함
          wetnessChart = new Chart(document.getElementById("static_wetness"), {
            type: "bar",
            data: {
              labels: ["등록된 데이터 없음"],
              datasets: [
                {
                  label: "등록된 데이터 없음",
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgb(255, 99, 132)",
                  data: [1],
                },
              ],
            },
            options: {
              responsive: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "촉촉함",
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "right",
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            },
          })
        } else {
          for (let x = 0; x <= 10; x++) {
            wetnessAppendHtml += "<tr>"
            wetnessAppendHtml += "<th>" + x + "</th>"

            for (let i = 0; i < data.staticWetness.length; i++) {
              if (data.staticWetness[i].staticList.length == 0) {
                wetnessAppendHtml += "<td>-</td>"
              } else {
                let isText = ""
                for (
                  let j = 0;
                  j < data.staticWetness[i].staticList.length;
                  j++
                ) {
                  let wetnessIsCnt = 0
                  if (data.staticWetness[i].staticList[j].fieldValue == x) {
                    wetnessIsCnt = 1
                    isText = data.staticWetness[i].staticList[j].valueCount
                    break
                  } else if (wetnessIsCnt == 0) {
                    isText = "-"
                  }
                }

                wetnessAppendHtml += "<td>"
                wetnessAppendHtml += isText
                wetnessAppendHtml += "</td>"
              }
            }

            wetnessAppendHtml += "</tr>"
          }

          $("#wetnessTb").append(wetnessAppendHtml)

          wetnessArr = new Array()

          /* 촉촉함 평균 */
          $("#wetnessTb").find("tbody").append("<tr><th>평균</td></tr>")

          for (var i = 0; i < 14; i++) {
            var sum = 0
            $("#wetnessTb")
              .find("tbody tr")
              .each(function () {
                if (!isNaN(Number($(this).find("td").eq(i).text()))) {
                  sum = sum + Number($(this).find("td").eq(i).text())
                }
              })
            wetnessArr.push((sum / 11).toFixed(2))
            $("#wetnessTb")
              .find("tbody tr:last-child")
              .append("<td>" + (sum / 11).toFixed(2) + "</td>")
          }

          // 촉촉함 총 합계
          $("#wetnessTb")
            .find("tbody tr")
            .each(function () {
              var sum = 0
              $(this)
                .find("td")
                .each(function () {
                  if (!isNaN(Number($(this).text()))) {
                    sum = sum + Number($(this).text())
                  }
                })
              $(this).append("<td>" + sum + "</td>")
            })

          wetnessChart.destroy()

          // 막대그래프 - 촉촉함
          wetnessChart = new Chart(document.getElementById("static_wetness"), {
            type: "bar",
            data: {
              labels: [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
              ],
              datasets: [
                {
                  label: "촉촉함",
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgb(255, 99, 132)",
                  data: wetnessArr,
                },
              ],
            },
            options: {
              responsive: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "촉촉함",
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "right",
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            },
          })
        }

        /******************************************************************************************************************/

        // B1. 빡빡함
        $("#densenessTb").find("tbody").empty()

        let densenessAppendHtml = ""

        if (data.staticDenseness.length <= 0) {
          densenessAppendHtml += "<tr>"
          densenessAppendHtml += "<td colspan='16' class='no-data'>"
          densenessAppendHtml += "등록된 데이터가 없습니다."
          densenessAppendHtml += "</td>"
          densenessAppendHtml += "</tr>"

          $("#densenessTb").append(densenessAppendHtml)

          densenessChart.destroy()

          // 막대그래프 - densenessChart
          densenessChart = new Chart(
            document.getElementById("static_denseness"),
            {
              type: "bar",
              data: {
                labels: ["등록된 데이터 없음"],
                datasets: [
                  {
                    label: "등록된 데이터 없음",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: [1],
                  },
                ],
              },
              options: {
                responsive: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: "빡빡함",
                    font: {
                      size: 20,
                    },
                  },
                  legend: {
                    display: true,
                    position: "right",
                  },
                  hover: {
                    mode: "nearest",
                    intersect: true,
                  },
                },
              },
            }
          )
        } else {
          for (let x = 0; x <= 10; x++) {
            densenessAppendHtml += "<tr>"
            densenessAppendHtml += "<th>" + x + "</th>"

            for (let i = 0; i < data.staticDenseness.length; i++) {
              if (data.staticDenseness[i].staticList.length == 0) {
                densenessAppendHtml += "<td>-</td>"
              } else {
                let isText = ""
                for (
                  let j = 0;
                  j < data.staticDenseness[i].staticList.length;
                  j++
                ) {
                  let densenessIsCnt = 0
                  if (data.staticDenseness[i].staticList[j].fieldValue == x) {
                    densenessIsCnt = 1
                    isText = data.staticDenseness[i].staticList[j].valueCount
                    break
                  } else if (densenessIsCnt == 0) {
                    isText = "-"
                  }
                }

                densenessAppendHtml += "<td>"
                densenessAppendHtml += isText
                densenessAppendHtml += "</td>"
              }
            }

            densenessAppendHtml += "</tr>"
          }

          $("#densenessTb").append(densenessAppendHtml)

          densenessArr = new Array()

          /* 빡빡함 평균 */
          $("#densenessTb").find("tbody").append("<tr><th>평균</td></tr>")

          for (var i = 0; i < 14; i++) {
            var sum = 0
            $("#densenessTb")
              .find("tbody tr")
              .each(function () {
                if (!isNaN(Number($(this).find("td").eq(i).text()))) {
                  sum = sum + Number($(this).find("td").eq(i).text())
                }
              })
            densenessArr.push((sum / 11).toFixed(2))
            $("#densenessTb")
              .find("tbody tr:last-child")
              .append("<td>" + (sum / 11).toFixed(2) + "</td>")
          }

          // 빡빡함 총 합계
          $("#densenessTb")
            .find("tbody tr")
            .each(function () {
              var sum = 0
              $(this)
                .find("td")
                .each(function () {
                  if (!isNaN(Number($(this).text()))) {
                    sum = sum + Number($(this).text())
                  }
                })
              $(this).append("<td>" + sum + "</td>")
            })

          densenessChart.destroy()

          // 막대그래프 - 빡빡함
          densenessChart = new Chart(
            document.getElementById("static_denseness"),
            {
              type: "bar",
              data: {
                labels: [
                  "A",
                  "B",
                  "C",
                  "D",
                  "E",
                  "F",
                  "G",
                  "H",
                  "I",
                  "J",
                  "K",
                  "L",
                  "M",
                  "N",
                ],
                datasets: [
                  {
                    label: "빡빡함",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: densenessArr,
                  },
                ],
              },
              options: {
                responsive: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: "빡빡함",
                    font: {
                      size: 20,
                    },
                  },
                  legend: {
                    display: true,
                    position: "right",
                  },
                  hover: {
                    mode: "nearest",
                    intersect: true,
                  },
                },
              },
            }
          )
        }

        /******************************************************************************************************************/

        // B2. 흡수 포인트에서 문지른 횟수
        $("#absorpTb").find("tbody").empty()

        let absorpAppendHtml = ""

        if (data.staticRub.length <= 0) {
          absorpAppendHtml += "<tr>"
          absorpAppendHtml += "<td colspan='16' class='no-data'>"
          absorpAppendHtml += "등록된 데이터가 없습니다."
          absorpAppendHtml += "</td>"
          absorpAppendHtml += "</tr>"

          $("#absorpTb").append(absorpAppendHtml)

          absorpChart.destroy()

          // 막대그래프 - densenessChart
          absorpChart = new Chart(document.getElementById("static_absorp"), {
            type: "bar",
            data: {
              labels: ["등록된 데이터 없음"],
              datasets: [
                {
                  label: "등록된 데이터 없음",
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgb(255, 99, 132)",
                  data: [1],
                },
              ],
            },
            options: {
              responsive: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "횟수",
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "right",
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            },
          })
        } else {
          absorpAppendHtml += "<tr>"
          absorpAppendHtml += "<th>최저</th>"

          for (let i = 0; i < data.staticRub.length; i++) {
            if (data.staticRub[i].staticList[0].minValue == 0) {
              absorpAppendHtml += "<td>-</td>"
            } else {
              absorpAppendHtml += "<td>"
              absorpAppendHtml += data.staticRub[i].staticList[0].minValue
              absorpAppendHtml += "</td>"
            }
            absorpAppendHtml += ""
          }
          absorpAppendHtml += "</tr>"

          absorpAppendHtml += "<tr>"
          absorpAppendHtml += "<th>평균</th>"
          for (let i = 0; i < data.staticRub.length; i++) {
            if (data.staticRub[i].staticList[0].avgValue == 0) {
              absorpAppendHtml += "<td>-</td>"
            } else {
              absorpAppendHtml += "<td>"
              absorpAppendHtml += data.staticRub[i].staticList[0].avgValue
              absorpAppendHtml += "</td>"
            }
            absorpAppendHtml += ""
          }
          absorpAppendHtml += "</tr>"

          absorpAppendHtml += "<tr>"
          absorpAppendHtml += "<th>최대</th>"
          for (let i = 0; i < data.staticRub.length; i++) {
            if (data.staticRub[i].staticList[0].maxValue == 0) {
              absorpAppendHtml += "<td>-</td>"
            } else {
              absorpAppendHtml += "<td>"
              absorpAppendHtml += data.staticRub[i].staticList[0].maxValue
              absorpAppendHtml += "</td>"
            }
            absorpAppendHtml += ""
          }
          absorpAppendHtml += "</tr>"

          $("#absorpTb").append(absorpAppendHtml)

          // 횟수 총 합계
          $("#absorpTb")
            .find("tbody tr")
            .each(function () {
              var sum = 0
              $(this)
                .find("td")
                .each(function () {
                  if (!isNaN(Number($(this).text()))) {
                    sum = sum + Number($(this).text())
                  }
                })
              $(this).append("<td>" + sum + "</td>")
            })

          var newAbsorpArr = new Array()
          var newAbsorpData

          for (let i = 0; i < data.staticRub.length; i++) {
            let product = data.staticRub[i].product
            let minVal = data.staticRub[i].staticList[0].minValue
            let avgVal = data.staticRub[i].staticList[0].avgValue
            let maxVal = data.staticRub[i].staticList[0].maxValue

            if (minVal != 0 && avgVal != 0 && maxVal != 0) {
              newAbsorpArr = new Array()
              newAbsorpArr.push(minVal)
              newAbsorpArr.push(avgVal)
              newAbsorpArr.push(maxVal)
            }
          }

          absorpChart.destroy()

          aArray = new Array()
          bArray = new Array()
          cArray = new Array()
          dArray = new Array()
          eArray = new Array()
          fArray = new Array()
          gArray = new Array()
          hArray = new Array()
          iArray = new Array()
          jArray = new Array()
          kArray = new Array()
          lArray = new Array()
          mArray = new Array()
          nArray = new Array()

          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(0).text()))) {
              aArray.push(Number($(this).find("td").eq(0).text()))
            }
          })
          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(1).text()))) {
              bArray.push(Number($(this).find("td").eq(1).text()))
            }
          })
          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(2).text()))) {
              cArray.push(Number($(this).find("td").eq(2).text()))
            }
          })
          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(3).text()))) {
              dArray.push(Number($(this).find("td").eq(3).text()))
            }
          })
          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(4).text()))) {
              eArray.push(Number($(this).find("td").eq(4).text()))
            }
          })
          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(5).text()))) {
              fArray.push(Number($(this).find("td").eq(5).text()))
            }
          })
          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(6).text()))) {
              gArray.push(Number($(this).find("td").eq(6).text()))
            }
          })
          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(7).text()))) {
              hArray.push(Number($(this).find("td").eq(7).text()))
            }
          })
          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(8).text()))) {
              iArray.push(Number($(this).find("td").eq(8).text()))
            }
          })
          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(9).text()))) {
              jArray.push(Number($(this).find("td").eq(9).text()))
            }
          })
          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(10).text()))) {
              kArray.push(Number($(this).find("td").eq(10).text()))
            }
          })
          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(11).text()))) {
              lArray.push(Number($(this).find("td").eq(11).text()))
            }
          })
          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(12).text()))) {
              mArray.push(Number($(this).find("td").eq(12).text()))
            }
          })
          absorpTb.find("tbody tr").each(function () {
            if (!isNaN(Number($(this).find("td").eq(13).text()))) {
              nArray.push(Number($(this).find("td").eq(13).text()))
            }
          })

          var absorpCtx = document
            .getElementById("static_absorp")
            .getContext("2d")
          var absorpData = {
            labels: ["최저", "평균", "최고"],
            datasets: [
              {
                label: "A",
                backgroundColor: colorize(),
                data: aArray,
              },
              {
                label: "B",
                backgroundColor: colorize(),
                data: bArray,
              },
              {
                label: "C",
                backgroundColor: colorize(),
                data: cArray,
              },
              {
                label: "D",
                backgroundColor: colorize(),
                data: dArray,
              },
              {
                label: "E",
                backgroundColor: colorize(),
                data: eArray,
              },
              {
                label: "F",
                backgroundColor: colorize(),
                data: fArray,
              },
              {
                label: "G",
                backgroundColor: colorize(),
                data: gArray,
              },
              {
                label: "H",
                backgroundColor: colorize(),
                data: hArray,
              },
              {
                label: "I",
                backgroundColor: colorize(),
                data: iArray,
              },
              {
                label: "J",
                backgroundColor: colorize(),
                data: jArray,
              },
              {
                label: "K",
                backgroundColor: colorize(),
                data: kArray,
              },
              {
                label: "L",
                backgroundColor: colorize(),
                data: lArray,
              },
              {
                label: "M",
                backgroundColor: colorize(),
                data: mArray,
              },
              {
                label: "N",
                backgroundColor: colorize(),
                data: nArray,
              },
            ],
          }

          absorpChart = new Chart(absorpCtx, {
            type: "bar",
            data: absorpData,
            options: {
              barValueSpacing: 20,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      min: 0,
                    },
                  },
                ],
              },
              plugins: {
                legend: {
                  display: true,
                  position: "right",
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            },
          })
        }

        /******************************************************************************************************************/

        // C2. 발림성
        $("#applyTb").find("tbody").empty()

        let applyAppendHtml = ""

        if (data.staticApplyability.length <= 0) {
          applyAppendHtml += "<tr>"
          applyAppendHtml += "<td colspan='16' class='no-data'>"
          applyAppendHtml += "등록된 데이터가 없습니다."
          applyAppendHtml += "</td>"
          applyAppendHtml += "</tr>"

          $("#applyTb").append(applyAppendHtml)

          // 데이터셋 비우기
          applyChart.destroy()

          applyChart = new Chart(document.getElementById("static_apply"), {
            type: "bar",
            data: {
              labels: ["등록된 데이터 없음"],
              datasets: [
                {
                  label: "등록된 데이터 없음",
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgb(255, 99, 132)",
                  data: [1],
                },
              ],
            },
            options: {
              responsive: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "발림성",
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "right",
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            },
          })
        } else {
          for (let x = 0; x <= 10; x++) {
            applyAppendHtml += "<tr>"
            applyAppendHtml += "<th>" + x + "</th>"

            for (let i = 0; i < data.staticApplyability.length; i++) {
              if (data.staticApplyability[i].staticList.length == 0) {
                applyAppendHtml += "<td>-</td>"
              } else {
                let isText = ""
                for (
                  let j = 0;
                  j < data.staticApplyability[i].staticList.length;
                  j++
                ) {
                  let applyIsCnt = 0
                  if (
                    data.staticApplyability[i].staticList[j].fieldValue == x
                  ) {
                    applyIsCnt = 1
                    isText = data.staticApplyability[i].staticList[j].valueCount
                    break
                  } else if (applyIsCnt == 0) {
                    isText = "-"
                  }
                }

                applyAppendHtml += "<td>"
                applyAppendHtml += isText
                applyAppendHtml += "</td>"
              }
            }

            applyAppendHtml += "</tr>"
          }
          $("#applyTb").append(applyAppendHtml)

          applyArr = new Array()

          /* 발림성 평균 */
          $("#applyTb").find("tbody").append("<tr><th>평균</td></tr>")

          for (var i = 0; i < 14; i++) {
            var sum = 0
            $("#applyTb")
              .find("tbody tr")
              .each(function () {
                if (!isNaN(Number($(this).find("td").eq(i).text()))) {
                  sum = sum + Number($(this).find("td").eq(i).text())
                }
              })
            applyArr.push((sum / 11).toFixed(2))
            $("#applyTb")
              .find("tbody tr:last-child")
              .append("<td>" + (sum / 11).toFixed(2) + "</td>")
          }

          // 발림성 총 합계
          $("#applyTb")
            .find("tbody tr")
            .each(function () {
              var sum = 0
              $(this)
                .find("td")
                .each(function () {
                  if (!isNaN(Number($(this).text()))) {
                    sum = sum + Number($(this).text())
                  }
                })
              $(this).append("<td>" + sum + "</td>")
            })

          applyChart.destroy()

          // 막대그래프 - 발림성
          applyChart = new Chart(document.getElementById("static_apply"), {
            type: "bar",
            data: {
              labels: [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
              ],
              datasets: [
                {
                  label: "발림성",
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgb(255, 99, 132)",
                  data: applyArr,
                },
              ],
            },
            options: {
              responsive: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "발림성",
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "right",
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            },
          })
        }

        /******************************************************************************************************************/

        // C2. 향기
        $("#perfumeTb").find("tbody").empty()

        let perfumeAppendHtml = ""

        if (data.staticPerfume.length <= 0) {
          perfumeAppendHtml += "<tr>"
          perfumeAppendHtml += "<td colspan='16' class='no-data'>"
          perfumeAppendHtml += "등록된 데이터가 없습니다."
          perfumeAppendHtml += "</td>"
          perfumeAppendHtml += "</tr>"

          $("#perfumeTb").append(perfumeAppendHtml)

          perfumeChart.destroy()

          perfumeChart = new Chart(document.getElementById("static_perfume"), {
            type: "bar",
            data: {
              labels: ["등록된 데이터 없음"],
              datasets: [
                {
                  label: "등록된 데이터 없음",
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgb(255, 99, 132)",
                  data: [1],
                },
              ],
            },
            options: {
              responsive: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "향기",
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "right",
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            },
          })
        } else {
          for (let x = 0; x <= 10; x++) {
            perfumeAppendHtml += "<tr>"
            perfumeAppendHtml += "<th>" + x + "</th>"

            for (let i = 0; i < data.staticPerfume.length; i++) {
              if (data.staticPerfume[i].staticList.length == 0) {
                perfumeAppendHtml += "<td>-</td>"
              } else {
                let isText = ""
                for (
                  let j = 0;
                  j < data.staticPerfume[i].staticList.length;
                  j++
                ) {
                  let perfumeIsCnt = 0
                  if (data.staticPerfume[i].staticList[j].fieldValue == x) {
                    perfumeIsCnt = 1
                    isText = data.staticPerfume[i].staticList[j].valueCount
                    break
                  } else if (perfumeIsCnt == 0) {
                    isText = "-"
                  }
                }

                perfumeAppendHtml += "<td>"
                perfumeAppendHtml += isText
                perfumeAppendHtml += "</td>"
              }
            }

            perfumeAppendHtml += "</tr>"
          }
          $("#perfumeTb").append(perfumeAppendHtml)

          perfumeArr = new Array()

          /* 향기 평균 */
          $("#perfumeTb").find("tbody").append("<tr><th>평균</td></tr>")

          for (var i = 0; i < 14; i++) {
            var sum = 0
            $("#perfumeTb")
              .find("tbody tr")
              .each(function () {
                if (!isNaN(Number($(this).find("td").eq(i).text()))) {
                  sum = sum + Number($(this).find("td").eq(i).text())
                }
              })
            perfumeArr.push((sum / 11).toFixed(2))
            $("#perfumeTb")
              .find("tbody tr:last-child")
              .append("<td>" + (sum / 11).toFixed(2) + "</td>")
          }

          // 향기 총 합계
          $("#perfumeTb")
            .find("tbody tr")
            .each(function () {
              var sum = 0
              $(this)
                .find("td")
                .each(function () {
                  if (!isNaN(Number($(this).text()))) {
                    sum = sum + Number($(this).text())
                  }
                })
              $(this).append("<td>" + sum + "</td>")
            })

          perfumeChart.destroy()

          // 막대그래프 - 향기
          perfumeChart = new Chart(document.getElementById("static_perfume"), {
            type: "bar",
            data: {
              labels: [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
              ],
              datasets: [
                {
                  label: "향기",
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgb(255, 99, 132)",
                  data: perfumeArr,
                },
              ],
            },
            options: {
              responsive: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "향기",
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "right",
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            },
          })
        }

        /******************************************************************************************************************/

        // 만족도 통계
        let compareFilterData = data.staticCompare
        let compareFilterLabelList = new Array()
        let compareFilterValueList = new Array()
        let compareFilterColorList = new Array()

        let compareTable = $("#compare_static_tb").find("tbody")
        let filterAppendHtml = ""

        let filterTotCnt = 0

        if (compareFilterData.length == 0) {
          filterAppendHtml += "<tr>"
          filterAppendHtml += "<td colspan='2' class='no-data'>"
          filterAppendHtml += "등록된 데이터가 없습니다."
          filterAppendHtml += "</td>"
          filterAppendHtml += "</tr>"

          compareTable.empty().append(filterAppendHtml)

          compareChart.destroy()

          compareChart = new Chart(document.getElementById("static_compare"), {
            type: "pie",
            data: {
              labels: ["등록된 데이터 없음"],
              datasets: [
                {
                  label: "등록된 데이터 없음",
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgb(255, 99, 132)",
                  data: [1],
                },
              ],
            },
            options: {
              responsive: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "만족도 통계",
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "right",
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            },
          })
        } else {
          for (let i = 0; i < compareFilterData.length; i++) {
            let compareValue = compareFilterData[i].valueCount
            filterTotCnt += compareValue
          }

          for (let i = 0; i < compareFilterData.length; i++) {
            let compareValue = compareFilterData[i]
            compareFilterLabelList.push(compareValue.fieldValue)
            compareFilterValueList.push(compareValue.valueCount)
            compareFilterColorList.push(colorize())

            filterAppendHtml += "<tr>"
            filterAppendHtml += "<td>" + compareValue.fieldValue + "</td>"
            filterAppendHtml +=
              "<td>" +
              ((compareValue.valueCount * 100) / filterTotCnt).toFixed(1) +
              "%</td>"
            filterAppendHtml += "</tr>"
          }
          compareTable.empty().append(filterAppendHtml)

          let compareNewData = {
            labels: compareFilterLabelList,
            datasets: [
              {
                backgroundColor: compareFilterColorList,
                data: compareFilterValueList,
              },
            ],
          }

          // 데이터셋 비우기
          compareChart.destroy()

          var compareChartArea = document
            .getElementById("static_compare")
            .getContext("2d")
          compareChart = new Chart(compareChartArea, {
            type: "pie",
            data: compareNewData,
            options: {
              responsive: false,
              display: true,
              plugins: {
                title: {
                  display: true,
                  text: "만족도 통계",
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "right",
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              },
            },
          })
        }

        /******************************************************************************************************************/

        // 테이블 기본
        let ascii
        let apb
        let isAfter
        let tdNum

        /* 유분감  */
        let newOilAppendHtml = ""

        $("#oilsTb").find("tbody").empty()

        if (data.oilInstantList.length <= 0) {
          newOilAppendHtml += "<tr>"
          newOilAppendHtml += "<td colspan='46' class='no-data'>"
          newOilAppendHtml += "등록된 데이터가 없습니다."
          newOilAppendHtml += "</td>"
          newOilAppendHtml += "</tr>"

          $("#oilsTb").append(newOilAppendHtml)

          oilChart.destroy()

          oilChart = new Chart(document.getElementById("static_oils"), {
            type: "bar",
            data: {
              labels: ["등록된 데이터 없음"],
              datasets: [
                {
                  label: "등록된 데이터 없음",
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgb(255, 99, 132)",
                  data: [1],
                },
              ],
            },
            options: {
              responsive: false,
              barValueSpacing: 20,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      min: 0,
                    },
                  },
                ],
              },
              plugins: {
                legend: {
                  display: true,
                  position: "right",
                },
                title: {
                  display: true,
                  text: "유분감",
                  font: {
                    size: 20,
                  },
                },
              },
            },
          })
        } else {
          for (let i = 0; i <= 10; i++) {
            newOilAppendHtml += "<tr>"
            newOilAppendHtml += "<th style='border: 1px solid #DEE2E6;'>"
            newOilAppendHtml += i
            newOilAppendHtml += "</th>"

            for (let j = 0; j <= 44; j++) {
              ascii = 65 + j / 3
              apb = String.fromCharCode(ascii)

              isAfter = j % 3
              if (isAfter == 0) {
                tdNum = "0M"
              } else if (isAfter == 1) {
                tdNum = "30M"
              } else if (isAfter == 2) {
                tdNum = "60M"
              }
              newOilAppendHtml +=
                "<td id='oilsTb_" +
                apb +
                "_" +
                tdNum +
                "_" +
                i +
                "' style='border: 1px solid #DEE2E6;'>"
              newOilAppendHtml += "-"
              newOilAppendHtml += "</td>"
            }

            newOilAppendHtml += "</tr>"
          }
          $("#oilsTb").append(newOilAppendHtml)

          let oilFilterList = []

          // 즉시
          let oilInstantList = data.oilInstantList
          for (let i = 0; i < oilInstantList.length; i++) {
            let item = oilInstantList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 0,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              oilFilterList.push(filteredData)

              let idName = "oilsTb_" + product + "_0M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 30분
          let oilThirtyList = data.oilThirtyList
          for (let i = 0; i < oilThirtyList.length; i++) {
            let item = oilThirtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 30,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              oilFilterList.push(filteredData)

              let idName = "oilsTb_" + product + "_30M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 60분
          let oilSixtyList = data.oilSixtyList
          for (let i = 0; i < oilSixtyList.length; i++) {
            let item = oilSixtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 60,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              oilFilterList.push(filteredData)

              let idName = "oilsTb_" + product + "_60M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          /* 합계 */
          for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 3; j++) {
              let tdId = "oilsTb_O_"
              let times
              if (j == 0) {
                tdId += "0M_" + i
                times = 0
              } else if (j == 1) {
                tdId += "30M_" + i
                times = 30
              } else {
                tdId += "60M_" + i
                times = 60
              }

              let sumList = oilFilterList.filter((item) => {
                return item.times == times && item.fieldValue == i
              })
              document.getElementById(tdId).innerText = sumList.length
            }
          }

          /* 평균 */
          $("#oilsTb")
            .find("tbody")
            .append('<tr><th style="border: 1px solid #DEE2E6;">평균</td></tr>')

          for (var i = 0; i < 45; i++) {
            var sum = 0
            $("#oilsTb")
              .find("tbody tr")
              .each(function () {
                if (!isNaN(Number($(this).find("td").eq(i).text()))) {
                  sum = sum + Number($(this).find("td").eq(i).text())
                }
              })
            var avg = (sum / 11).toFixed(2)
            if (avg == 0) {
              avg = "-"
            }
            $("#oilsTb")
              .find("tbody tr:last-child")
              .append(
                '<td style="border: 1px solid #DEE2E6; font-size: 0.8rem;">' +
                  avg +
                  "</td>"
              )
          }

          let oilsTr = $("#oilsTb").find("tbody tr:last")
          let oilsTd = oilsTr.children()

          let oilsZeroArray = new Array() // 유분감(즉시) chart 배열
          let oilsThirtyArray = new Array() // 유분감(30분) chart 배열
          let oilsSixtyArray = new Array() // 유분감(60분) chart 배열

          let oz = 1
          let ot = 2
          let os = 3

          for (let i = 1; i <= 14; i++) {
            if (oilsTd.eq(oz).text() == "-") {
              oilsZeroArray.push(0)
            } else {
              oilsZeroArray.push(oilsTd.eq(oz).text())
            }
            oz += 3
          }

          for (let i = 2; i <= 15; i++) {
            if (oilsTd.eq(ot).text() == "-") {
              oilsThirtyArray.push(0)
            } else {
              oilsThirtyArray.push(oilsTd.eq(ot).text())
            }
            ot += 3
          }

          for (let i = 3; i <= 16; i++) {
            if (oilsTd.eq(os).text() == "-") {
              oilsSixtyArray.push(0)
            } else {
              oilsSixtyArray.push(oilsTd.eq(os).text())
            }
            os += 3
          }

          oilChart.destroy()

          // 유분감
          var oilCtx = document.getElementById("static_oils").getContext("2d")

          var oilData = {
            labels: [
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "J",
              "K",
              "L",
              "M",
              "N",
            ],
            datasets: [
              {
                label: "즉시",
                backgroundColor: "#F0D8D1",
                data: oilsZeroArray,
              },
              {
                label: "30분",
                backgroundColor: "#EBD5F1",
                data: oilsThirtyArray,
              },
              {
                label: "60분",
                backgroundColor: "#CDDEEE",
                data: oilsSixtyArray,
              },
            ],
          }

          oilChart = new Chart(oilCtx, {
            type: "bar",
            data: oilData,
            options: {
              responsive: false,
              barValueSpacing: 20,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      min: 0,
                    },
                  },
                ],
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "유분감",
                  font: {
                    size: 20,
                  },
                },
              },
            },
          })
        }

        /******************************************************************************************************************/

        // 수분감
        let newMoistureAppendHtml = ""

        $("#moistureTb").find("tbody").empty()

        if (data.moistureInstantList.length <= 0) {
          newMoistureAppendHtml += "<tr>"
          newMoistureAppendHtml += "<td colspan='46' class='no-data'>"
          newMoistureAppendHtml += "등록된 데이터가 없습니다."
          newMoistureAppendHtml += "</td>"
          newMoistureAppendHtml += "</tr>"

          $("#moistureTb").append(newMoistureAppendHtml)

          moistureChart.destroy()

          moistureChart = new Chart(
            document.getElementById("static_moisture"),
            {
              type: "bar",
              data: {
                labels: ["등록된 데이터 없음"],
                datasets: [
                  {
                    label: "등록된 데이터 없음",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: [1],
                  },
                ],
              },
              options: {
                responsive: false,
                barValueSpacing: 20,
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        min: 0,
                      },
                    },
                  ],
                },
                plugins: {
                  legend: {
                    display: true,
                    position: "right",
                  },
                  title: {
                    display: true,
                    text: "수분감",
                    font: {
                      size: 20,
                    },
                  },
                },
              },
            }
          )
        } else {
          for (let i = 0; i <= 10; i++) {
            newMoistureAppendHtml += "<tr>"
            newMoistureAppendHtml += "<th style='border: 1px solid #DEE2E6;'>"
            newMoistureAppendHtml += i
            newMoistureAppendHtml += "</th>"

            for (let j = 0; j <= 44; j++) {
              ascii = 65 + j / 3
              apb = String.fromCharCode(ascii)

              isAfter = j % 3
              if (isAfter == 0) {
                tdNum = "0M"
              } else if (isAfter == 1) {
                tdNum = "30M"
              } else if (isAfter == 2) {
                tdNum = "60M"
              }
              newMoistureAppendHtml +=
                "<td id='moistureTb_" +
                apb +
                "_" +
                tdNum +
                "_" +
                i +
                "' style='border: 1px solid #DEE2E6;'>"
              newMoistureAppendHtml += "-"
              newMoistureAppendHtml += "</td>"
            }

            newMoistureAppendHtml += "</tr>"
          }
          $("#moistureTb").append(newMoistureAppendHtml)

          let moistureFilterList = []
          // 즉시
          let moistureInstantList = data.moistureInstantList
          for (let i = 0; i < moistureInstantList.length; i++) {
            let item = moistureInstantList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 0,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              moistureFilterList.push(filteredData)

              let idName = "moistureTb_" + product + "_0M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 30분
          let moistureThirtyList = data.moistureThirtyList
          for (let i = 0; i < moistureThirtyList.length; i++) {
            let item = moistureThirtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount
              let filteredData = {
                product: product,
                times: 30,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              moistureFilterList.push(filteredData)

              let idName = "moistureTb_" + product + "_30M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 60분
          let moistureSixtyList = data.moistureSixtyList
          for (let i = 0; i < moistureSixtyList.length; i++) {
            let item = moistureSixtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 60,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              moistureFilterList.push(filteredData)

              let idName = "moistureTb_" + product + "_60M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          /* 합계 */
          for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 3; j++) {
              let tdId = "moistureTb_O_"
              let times
              if (j == 0) {
                tdId += "0M_" + i
                times = 0
              } else if (j == 1) {
                tdId += "30M_" + i
                times = 30
              } else {
                tdId += "60M_" + i
                times = 60
              }

              let sumList = moistureFilterList.filter((item) => {
                return item.times == times && item.fieldValue == i
              })
              document.getElementById(tdId).innerText = sumList.length
            }
          }

          /* 평균 */
          $("#moistureTb")
            .find("tbody")
            .append('<tr><th style="border: 1px solid #DEE2E6;">평균</td></tr>')

          for (var i = 0; i < 45; i++) {
            var sum = 0
            $("#moistureTb")
              .find("tbody tr")
              .each(function () {
                if (!isNaN(Number($(this).find("td").eq(i).text()))) {
                  sum = sum + Number($(this).find("td").eq(i).text())
                }
              })
            var avg = (sum / 11).toFixed(2)
            if (avg == 0) {
              avg = "-"
            }
            $("#moistureTb")
              .find("tbody tr:last-child")
              .append(
                '<td style="border: 1px solid #DEE2E6; font-size: 0.8rem;">' +
                  avg +
                  "</td>"
              )
          }

          let moistureTr = $("#moistureTb").find("tbody tr:last")
          let moistureTd = moistureTr.children()

          let moistureZeroArray = new Array() // 수분감(즉시) chart 배열
          let moistureThirtyArray = new Array() // 수분감(30분) chart 배열
          let moistureSixtyArray = new Array() // 수분감(60분) chart 배열

          let mz = 1
          let mt = 2
          let ms = 3

          for (let i = 1; i <= 14; i++) {
            if (moistureTd.eq(mz).text() == "-") {
              moistureZeroArray.push(0)
            } else {
              moistureZeroArray.push(moistureTd.eq(mz).text())
            }
            mz += 3
          }

          for (let i = 2; i <= 15; i++) {
            if (moistureTd.eq(mt).text() == "-") {
              moistureThirtyArray.push(0)
            } else {
              moistureThirtyArray.push(moistureTd.eq(mt).text())
            }
            mt += 3
          }

          for (let i = 3; i <= 16; i++) {
            if (moistureTd.eq(ms).text() == "-") {
              moistureSixtyArray.push(0)
            } else {
              moistureSixtyArray.push(moistureTd.eq(ms).text())
            }
            ms += 3
          }

          moistureChart.destroy()

          // 수분감
          let moistureCtx = document
            .getElementById("static_moisture")
            .getContext("2d")

          let moistureData = {
            labels: [
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "J",
              "K",
              "L",
              "M",
              "N",
            ],
            datasets: [
              {
                label: "즉시",
                backgroundColor: "#F0D8D1",
                data: moistureZeroArray,
              },
              {
                label: "30분",
                backgroundColor: "#EBD5F1",
                data: moistureThirtyArray,
              },
              {
                label: "60분",
                backgroundColor: "#CDDEEE",
                data: moistureSixtyArray,
              },
            ],
          }

          moistureChart = new Chart(moistureCtx, {
            type: "bar",
            data: moistureData,
            options: {
              responsive: false,
              barValueSpacing: 20,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      min: 0,
                    },
                  },
                ],
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "수분감",
                  font: {
                    size: 20,
                  },
                },
              },
            },
          })
        }

        /******************************************************************************************************************/

        // 피부탄력감
        let newElasticityAppendHtml = ""

        $("#elasticityTb").find("tbody").empty()

        if (data.elasticityInstantList.length <= 0) {
          newElasticityAppendHtml += "<tr>"
          newElasticityAppendHtml += "<td colspan='46' class='no-data'>"
          newElasticityAppendHtml += "등록된 데이터가 없습니다."
          newElasticityAppendHtml += "</td>"
          newElasticityAppendHtml += "</tr>"

          $("#elasticityTb").append(newElasticityAppendHtml)

          elasticityChart.destroy()

          elasticityChart = new Chart(
            document.getElementById("static_elasticity"),
            {
              type: "bar",
              data: {
                labels: ["등록된 데이터 없음"],
                datasets: [
                  {
                    label: "등록된 데이터 없음",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: [1],
                  },
                ],
              },
              options: {
                responsive: false,
                barValueSpacing: 20,
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        min: 0,
                      },
                    },
                  ],
                },
                plugins: {
                  legend: {
                    display: true,
                    position: "right",
                  },
                  title: {
                    display: true,
                    text: "피부탄력감",
                    font: {
                      size: 20,
                    },
                  },
                },
              },
            }
          )
        } else {
          for (let i = 0; i <= 10; i++) {
            newElasticityAppendHtml += "<tr>"
            newElasticityAppendHtml += "<th style='border: 1px solid #DEE2E6;'>"
            newElasticityAppendHtml += i
            newElasticityAppendHtml += "</th>"

            for (let j = 0; j <= 44; j++) {
              ascii = 65 + j / 3
              apb = String.fromCharCode(ascii)

              isAfter = j % 3
              if (isAfter == 0) {
                tdNum = "0M"
              } else if (isAfter == 1) {
                tdNum = "30M"
              } else if (isAfter == 2) {
                tdNum = "60M"
              }
              newElasticityAppendHtml +=
                "<td id='elasticityTb_" +
                apb +
                "_" +
                tdNum +
                "_" +
                i +
                "' style='border: 1px solid #DEE2E6;'>"
              newElasticityAppendHtml += "-"
              newElasticityAppendHtml += "</td>"
            }

            newElasticityAppendHtml += "</tr>"
          }
          $("#elasticityTb").append(newElasticityAppendHtml)

          let elasticityFilterList = []
          // 즉시
          let elasticityInstantList = data.elasticityInstantList
          for (let i = 0; i < elasticityInstantList.length; i++) {
            let item = elasticityInstantList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 0,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              elasticityFilterList.push(filteredData)

              let idName = "elasticityTb_" + product + "_0M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 30분
          let elasticityThirtyList = data.elasticityThirtyList
          for (let i = 0; i < elasticityThirtyList.length; i++) {
            let item = elasticityThirtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 30,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              elasticityFilterList.push(filteredData)

              let idName = "elasticityTb_" + product + "_30M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 60분
          let elasticitySixtyList = data.elasticitySixtyList
          for (let i = 0; i < elasticitySixtyList.length; i++) {
            let item = elasticitySixtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 60,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              elasticityFilterList.push(filteredData)

              let idName = "elasticityTb_" + product + "_60M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          /* 합계 */
          for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 3; j++) {
              let tdId = "elasticityTb_O_"
              let times
              if (j == 0) {
                tdId += "0M_" + i
                times = 0
              } else if (j == 1) {
                tdId += "30M_" + i
                times = 30
              } else {
                tdId += "60M_" + i
                times = 60
              }

              let sumList = elasticityFilterList.filter((item) => {
                return item.times == times && item.fieldValue == i
              })
              document.getElementById(tdId).innerText = sumList.length
            }
          }

          /* 평균 */
          $("#elasticityTb")
            .find("tbody")
            .append('<tr><th style="border: 1px solid #DEE2E6;">평균</td></tr>')

          for (var i = 0; i < 45; i++) {
            var sum = 0
            $("#elasticityTb")
              .find("tbody tr")
              .each(function () {
                if (!isNaN(Number($(this).find("td").eq(i).text()))) {
                  sum = sum + Number($(this).find("td").eq(i).text())
                }
              })
            var avg = (sum / 11).toFixed(2)
            if (avg == 0) {
              avg = "-"
            }
            $("#elasticityTb")
              .find("tbody tr:last-child")
              .append(
                '<td style="border: 1px solid #DEE2E6; font-size: 0.8rem;">' +
                  avg +
                  "</td>"
              )
          }

          let elasticityTr = $("#elasticityTb").find("tbody tr:last")
          let elasticityTd = elasticityTr.children()

          let elasticityZeroArray = new Array() // 피부탄력감(즉시) chart 배열
          let elasticityThirtyArray = new Array() // 피부탄력감(30분) chart 배열
          let elasticitySixtyArray = new Array() // 피부탄력감(60분) chart 배열

          let ez = 1
          let et = 2
          let es = 3

          for (let i = 1; i <= 14; i++) {
            if (elasticityTd.eq(ez).text() == "-") {
              elasticityZeroArray.push(0)
            } else {
              elasticityZeroArray.push(elasticityTd.eq(ez).text())
            }
            ez += 3
          }

          for (let i = 2; i <= 15; i++) {
            if (elasticityTd.eq(et).text() == "-") {
              elasticityThirtyArray.push(0)
            } else {
              elasticityThirtyArray.push(elasticityTd.eq(et).text())
            }
            et += 3
          }

          for (let i = 3; i <= 16; i++) {
            if (elasticityTd.eq(es).text() == "-") {
              elasticitySixtyArray.push(0)
            } else {
              elasticitySixtyArray.push(elasticityTd.eq(es).text())
            }
            es += 3
          }

          // 데이터 비우기
          elasticityChart.destroy()

          // 피부탄력감
          var elasticityCtx = document
            .getElementById("static_elasticity")
            .getContext("2d")

          var elasticityData = {
            labels: [
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "J",
              "K",
              "L",
              "M",
              "N",
            ],
            datasets: [
              {
                label: "즉시",
                backgroundColor: "#F0D8D1",
                data: elasticityZeroArray,
              },
              {
                label: "30분",
                backgroundColor: "#EBD5F1",
                data: elasticityThirtyArray,
              },
              {
                label: "60분",
                backgroundColor: "#CDDEEE",
                data: elasticitySixtyArray,
              },
            ],
          }

          elasticityChart = new Chart(elasticityCtx, {
            type: "bar",
            data: elasticityData,
            options: {
              responsive: false,
              barValueSpacing: 20,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      min: 0,
                    },
                  },
                ],
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "피부탄력감",
                  font: {
                    size: 20,
                  },
                },
              },
            },
          })
        }

        /******************************************************************************************************************/

        // 피부색감, 피부톤
        let newSkinToneAppendHtml = ""

        $("#skinToneTb").find("tbody").empty()

        if (data.skinToneInstantList.length <= 0) {
          newSkinToneAppendHtml += "<tr>"
          newSkinToneAppendHtml += "<td colspan='46' class='no-data'>"
          newSkinToneAppendHtml += "등록된 데이터가 없습니다."
          newSkinToneAppendHtml += "</td>"
          newSkinToneAppendHtml += "</tr>"

          $("#skinToneTb").append(newSkinToneAppendHtml)

          skinToneChart.destroy()

          skinToneChart = new Chart(
            document.getElementById("static_skinTone"),
            {
              type: "bar",
              data: {
                labels: ["등록된 데이터 없음"],
                datasets: [
                  {
                    label: "등록된 데이터 없음",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: [1],
                  },
                ],
              },
              options: {
                responsive: false,
                barValueSpacing: 20,
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        min: 0,
                      },
                    },
                  ],
                },
                plugins: {
                  legend: {
                    display: true,
                    position: "right",
                  },
                  title: {
                    display: true,
                    text: "피부톤",
                    font: {
                      size: 20,
                    },
                  },
                },
              },
            }
          )
        } else {
          for (let i = 0; i <= 10; i++) {
            newSkinToneAppendHtml += "<tr>"
            newSkinToneAppendHtml += "<th style='border: 1px solid #DEE2E6;'>"
            newSkinToneAppendHtml += i
            newSkinToneAppendHtml += "</th>"

            for (let j = 0; j <= 44; j++) {
              ascii = 65 + j / 3
              apb = String.fromCharCode(ascii)

              isAfter = j % 3
              if (isAfter == 0) {
                tdNum = "0M"
              } else if (isAfter == 1) {
                tdNum = "30M"
              } else if (isAfter == 2) {
                tdNum = "60M"
              }
              newSkinToneAppendHtml +=
                "<td id='skinToneTb_" +
                apb +
                "_" +
                tdNum +
                "_" +
                i +
                "' style='border: 1px solid #DEE2E6;'>"
              newSkinToneAppendHtml += "-"
              newSkinToneAppendHtml += "</td>"
            }

            newSkinToneAppendHtml += "</tr>"
          }
          $("#skinToneTb").append(newSkinToneAppendHtml)

          let skinToneFilterList = []
          // 즉시
          let skinToneInstantList = data.skinToneInstantList
          for (let i = 0; i < skinToneInstantList.length; i++) {
            let item = skinToneInstantList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 0,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              skinToneFilterList.push(filteredData)

              let idName = "skinToneTb_" + product + "_0M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 30분
          let skinToneThirtyList = data.skinToneThirtyList
          for (let i = 0; i < skinToneThirtyList.length; i++) {
            let item = skinToneThirtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 30,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              skinToneFilterList.push(filteredData)

              let idName = "skinToneTb_" + product + "_30M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 60분
          let skinToneSixtyList = data.skinToneSixtyList
          for (let i = 0; i < skinToneSixtyList.length; i++) {
            let item = skinToneSixtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 60,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              skinToneFilterList.push(filteredData)

              let idName = "skinToneTb_" + product + "_60M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          /* 합계 */
          for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 3; j++) {
              let tdId = "skinToneTb_O_"
              let times
              if (j == 0) {
                tdId += "0M_" + i
                times = 0
              } else if (j == 1) {
                tdId += "30M_" + i
                times = 30
              } else {
                tdId += "60M_" + i
                times = 60
              }

              let sumList = skinToneFilterList.filter((item) => {
                return item.times == times && item.fieldValue == i
              })
              document.getElementById(tdId).innerText = sumList.length
            }
          }

          /* 평균 */
          $("#skinToneTb")
            .find("tbody")
            .append('<tr><th style="border: 1px solid #DEE2E6;">평균</td></tr>')

          for (var i = 0; i < 45; i++) {
            var sum = 0
            $("#skinToneTb")
              .find("tbody tr")
              .each(function () {
                if (!isNaN(Number($(this).find("td").eq(i).text()))) {
                  sum = sum + Number($(this).find("td").eq(i).text())
                }
              })
            var avg = (sum / 11).toFixed(2)
            if (avg == 0) {
              avg = "-"
            }
            $("#skinToneTb")
              .find("tbody tr:last-child")
              .append(
                '<td style="border: 1px solid #DEE2E6; font-size: 0.8rem;">' +
                  avg +
                  "</td>"
              )
          }

          let skinToneTr = $("#skinToneTb").find("tbody tr:last")
          let skinToneTd = skinToneTr.children()

          let skinToneZeroArray = new Array() // 피부톤(즉시) chart 배열
          let skinToneThirtyArray = new Array() // 피부톤(30분) chart 배열
          let skinToneSixtyArray = new Array() // 피부톤(60분) chart 배열

          let stz = 1
          let stt = 2
          let sts = 3

          for (let i = 1; i <= 14; i++) {
            if (skinToneTd.eq(stz).text() == "-") {
              skinToneZeroArray.push(0)
            } else {
              skinToneZeroArray.push(skinToneTd.eq(stz).text())
            }
            stz += 3
          }

          for (let i = 2; i <= 15; i++) {
            if (skinToneTd.eq(stt).text() == "-") {
              skinToneThirtyArray.push(0)
            } else {
              skinToneThirtyArray.push(skinToneTd.eq(stt).text())
            }
            stt += 3
          }

          for (let i = 3; i <= 16; i++) {
            if (skinToneTd.eq(sts).text() == "-") {
              skinToneSixtyArray.push(0)
            } else {
              skinToneSixtyArray.push(skinToneTd.eq(sts).text())
            }
            sts += 3
          }

          // 데이터 비우기
          skinToneChart.destroy()

          // 피부톤
          let skinToneCtx = document
            .getElementById("static_skinTone")
            .getContext("2d")

          let skinToneData = {
            labels: [
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "J",
              "K",
              "L",
              "M",
              "N",
            ],
            datasets: [
              {
                label: "즉시",
                backgroundColor: "#F0D8D1",
                data: skinToneZeroArray,
              },
              {
                label: "30분",
                backgroundColor: "#EBD5F1",
                data: skinToneThirtyArray,
              },
              {
                label: "60분",
                backgroundColor: "#CDDEEE",
                data: skinToneSixtyArray,
              },
            ],
          }

          skinToneChart = new Chart(skinToneCtx, {
            type: "bar",
            data: skinToneData,
            options: {
              responsive: false,
              barValueSpacing: 20,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      min: 0,
                    },
                  },
                ],
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "피부톤",
                  font: {
                    size: 20,
                  },
                },
              },
            },
          })
        }

        /******************************************************************************************************************/

        // 피부결
        let newSkinTextureAppendHtml = ""

        $("#skinTextureTb").find("tbody").empty()

        if (data.skinTextureInstantList.length <= 0) {
          newSkinTextureAppendHtml += "<tr>"
          newSkinTextureAppendHtml += "<td colspan='46' class='no-data'>"
          newSkinTextureAppendHtml += "등록된 데이터가 없습니다."
          newSkinTextureAppendHtml += "</td>"
          newSkinTextureAppendHtml += "</tr>"

          $("#skinTextureTb").append(newSkinTextureAppendHtml)

          skinTextureChart.destroy()

          skinTextureChart = new Chart(
            document.getElementById("static_skinTexture"),
            {
              type: "bar",
              data: {
                labels: ["등록된 데이터 없음"],
                datasets: [
                  {
                    label: "등록된 데이터 없음",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: [1],
                  },
                ],
              },
              options: {
                responsive: false,
                barValueSpacing: 20,
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        min: 0,
                      },
                    },
                  ],
                },
                plugins: {
                  legend: {
                    display: true,
                    position: "right",
                  },
                  title: {
                    display: true,
                    text: "피부결",
                    font: {
                      size: 20,
                    },
                  },
                },
              },
            }
          )
        } else {
          for (let i = 0; i <= 10; i++) {
            newSkinTextureAppendHtml += "<tr>"
            newSkinTextureAppendHtml +=
              "<th style='border: 1px solid #DEE2E6;'>"
            newSkinTextureAppendHtml += i
            newSkinTextureAppendHtml += "</th>"

            for (let j = 0; j <= 44; j++) {
              ascii = 65 + j / 3
              apb = String.fromCharCode(ascii)

              isAfter = j % 3
              if (isAfter == 0) {
                tdNum = "0M"
              } else if (isAfter == 1) {
                tdNum = "30M"
              } else if (isAfter == 2) {
                tdNum = "60M"
              }
              newSkinTextureAppendHtml +=
                "<td id='skinTextureTb_" +
                apb +
                "_" +
                tdNum +
                "_" +
                i +
                "' style='border: 1px solid #DEE2E6;'>"
              newSkinTextureAppendHtml += "-"
              newSkinTextureAppendHtml += "</td>"
            }

            newSkinTextureAppendHtml += "</tr>"
          }
          $("#skinTextureTb").append(newSkinTextureAppendHtml)

          let skinTextureFilterList = []

          // 즉시
          let skinTextureInstantList = data.skinTextureInstantList
          for (let i = 0; i < skinTextureInstantList.length; i++) {
            let item = skinTextureInstantList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 0,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              skinTextureFilterList.push(filteredData)

              let idName = "skinTextureTb_" + product + "_0M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 30분
          let skinTextureThirtyList = data.skinTextureThirtyList
          for (let i = 0; i < skinTextureThirtyList.length; i++) {
            let item = skinTextureThirtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 30,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              skinTextureFilterList.push(filteredData)

              let idName = "skinTextureTb_" + product + "_30M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 60분
          let skinTextureSixtyList = data.skinTextureSixtyList
          for (let i = 0; i < skinTextureSixtyList.length; i++) {
            let item = skinTextureSixtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 60,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              skinTextureFilterList.push(filteredData)

              let idName = "skinTextureTb_" + product + "_60M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          /* 합계 */
          for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 3; j++) {
              let tdId = "skinTextureTb_O_"
              let times
              if (j == 0) {
                tdId += "0M_" + i
                times = 0
              } else if (j == 1) {
                tdId += "30M_" + i
                times = 30
              } else {
                tdId += "60M_" + i
                times = 60
              }

              let sumList = skinTextureFilterList.filter((item) => {
                return item.times == times && item.fieldValue == i
              })
              document.getElementById(tdId).innerText = sumList.length
            }
          }

          /* 평균 */
          $("#skinTextureTb")
            .find("tbody")
            .append('<tr><th style="border: 1px solid #DEE2E6;">평균</td></tr>')

          for (var i = 0; i < 45; i++) {
            var sum = 0
            $("#skinTextureTb")
              .find("tbody tr")
              .each(function () {
                if (!isNaN(Number($(this).find("td").eq(i).text()))) {
                  sum = sum + Number($(this).find("td").eq(i).text())
                }
              })
            var avg = (sum / 11).toFixed(2)
            if (avg == 0) {
              avg = "-"
            }
            $("#skinTextureTb")
              .find("tbody tr:last-child")
              .append(
                '<td style="border: 1px solid #DEE2E6; font-size: 0.8rem;">' +
                  avg +
                  "</td>"
              )
          }

          let skinTextureTr = $("#skinTextureTb").find("tbody tr:last")
          let skinTextureTd = skinTextureTr.children()

          let skinTextureZeroArray = new Array() // 피부결감(즉시) chart 배열
          let skinTextureThirtyArray = new Array() // 피부결감(30분) chart 배열
          let skinTextureSixtyArray = new Array() // 피부결감(60분) chart 배열

          let stxz = 1
          let stxt = 2
          let stxs = 3

          for (let i = 1; i <= 14; i++) {
            if (skinTextureTd.eq(stxz).text() == "-") {
              skinTextureZeroArray.push(0)
            } else {
              skinTextureZeroArray.push(skinTextureTd.eq(stxz).text())
            }
            stxz += 3
          }

          for (let i = 2; i <= 15; i++) {
            if (skinTextureTd.eq(stxt).text() == "-") {
              skinTextureThirtyArray.push(0)
            } else {
              skinTextureThirtyArray.push(skinTextureTd.eq(stxt).text())
            }
            stxt += 3
          }

          for (let i = 3; i <= 16; i++) {
            if (skinTextureTd.eq(stxs).text() == "-") {
              skinTextureSixtyArray.push(0)
            } else {
              skinTextureSixtyArray.push(skinTextureTd.eq(stxs).text())
            }
            stxs += 3
          }

          // 데이터 비우기
          skinTextureChart.destroy()

          // 피부결감
          let skinTextureCtx = document
            .getElementById("static_skinTexture")
            .getContext("2d")

          let skinTextureData = {
            labels: [
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "J",
              "K",
              "L",
              "M",
              "N",
            ],
            datasets: [
              {
                label: "즉시",
                backgroundColor: "#F0D8D1",
                data: skinTextureZeroArray,
              },
              {
                label: "30분",
                backgroundColor: "#EBD5F1",
                data: skinTextureThirtyArray,
              },
              {
                label: "60분",
                backgroundColor: "#CDDEEE",
                data: skinTextureSixtyArray,
              },
            ],
          }

          skinTextureChart = new Chart(skinTextureCtx, {
            type: "bar",
            data: skinTextureData,
            options: {
              responsive: false,
              barValueSpacing: 20,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      min: 0,
                    },
                  },
                ],
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "피부결감",
                  font: {
                    size: 20,
                  },
                },
              },
            },
          })
        }

        /******************************************************************************************************************/

        // 민감도
        let newSensitivityAppendHtml = ""

        $("#sensitivityTb").find("tbody").empty()

        if (data.sensitivityInstantList.length <= 0) {
          newSensitivityAppendHtml += "<tr>"
          newSensitivityAppendHtml += "<td colspan='46' class='no-data'>"
          newSensitivityAppendHtml += "등록된 데이터가 없습니다."
          newSensitivityAppendHtml += "</td>"
          newSensitivityAppendHtml += "</tr>"

          $("#sensitivityTb").append(newSensitivityAppendHtml)

          sensitivityChart.destroy()

          sensitivityChart = new Chart(
            document.getElementById("static_sensitivity"),
            {
              type: "bar",
              data: {
                labels: ["등록된 데이터 없음"],
                datasets: [
                  {
                    label: "등록된 데이터 없음",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: [1],
                  },
                ],
              },
              options: {
                responsive: false,
                barValueSpacing: 20,
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        min: 0,
                      },
                    },
                  ],
                },
                plugins: {
                  legend: {
                    display: true,
                    position: "right",
                  },
                  title: {
                    display: true,
                    text: "민감도",
                    font: {
                      size: 20,
                    },
                  },
                },
              },
            }
          )
        } else {
          for (let i = 0; i <= 10; i++) {
            newSensitivityAppendHtml += "<tr>"
            newSensitivityAppendHtml +=
              "<th style='border: 1px solid #DEE2E6;'>"
            newSensitivityAppendHtml += i
            newSensitivityAppendHtml += "</th>"

            for (let j = 0; j <= 44; j++) {
              ascii = 65 + j / 3
              apb = String.fromCharCode(ascii)

              isAfter = j % 3
              if (isAfter == 0) {
                tdNum = "0M"
              } else if (isAfter == 1) {
                tdNum = "30M"
              } else if (isAfter == 2) {
                tdNum = "60M"
              }
              newSensitivityAppendHtml +=
                "<td id='sensitivityTb_" +
                apb +
                "_" +
                tdNum +
                "_" +
                i +
                "' style='border: 1px solid #DEE2E6;'>"
              newSensitivityAppendHtml += "-"
              newSensitivityAppendHtml += "</td>"
            }

            newSensitivityAppendHtml += "</tr>"
          }
          $("#sensitivityTb").append(newSensitivityAppendHtml)

          let sensitivityFilterList = []

          // 즉시
          let sensitivityInstantList = data.sensitivityInstantList
          for (let i = 0; i < sensitivityInstantList.length; i++) {
            let item = sensitivityInstantList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 0,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              sensitivityFilterList.push(filteredData)

              let idName = "sensitivityTb_" + product + "_0M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 30분
          let sensitivityThirtyList = data.sensitivityThirtyList
          for (let i = 0; i < sensitivityThirtyList.length; i++) {
            let item = sensitivityThirtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 30,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              sensitivityFilterList.push(filteredData)

              let idName = "sensitivityTb_" + product + "_30M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 60분
          let sensitivitySixtyList = data.sensitivitySixtyList
          for (let i = 0; i < sensitivitySixtyList.length; i++) {
            let item = sensitivitySixtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 60,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              sensitivityFilterList.push(filteredData)

              let idName = "sensitivityTb_" + product + "_60M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          /* 합계 */
          for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 3; j++) {
              let tdId = "sensitivityTb_O_"
              let times
              if (j == 0) {
                tdId += "0M_" + i
                times = 0
              } else if (j == 1) {
                tdId += "30M_" + i
                times = 30
              } else {
                tdId += "60M_" + i
                times = 60
              }

              let sumList = sensitivityFilterList.filter((item) => {
                return item.times == times && item.fieldValue == i
              })
              document.getElementById(tdId).innerText = sumList.length
            }
          }

          /* 평균 */
          $("#sensitivityTb")
            .find("tbody")
            .append('<tr><th style="border: 1px solid #DEE2E6;">평균</td></tr>')

          for (var i = 0; i < 45; i++) {
            var sum = 0
            $("#sensitivityTb")
              .find("tbody tr")
              .each(function () {
                if (!isNaN(Number($(this).find("td").eq(i).text()))) {
                  sum = sum + Number($(this).find("td").eq(i).text())
                }
              })
            var avg = (sum / 11).toFixed(2)
            if (avg == 0) {
              avg = "-"
            }
            $("#sensitivityTb")
              .find("tbody tr:last-child")
              .append(
                '<td style="border: 1px solid #DEE2E6; font-size: 0.8rem;">' +
                  avg +
                  "</td>"
              )
          }

          let sensitivityTr = $("#sensitivityTb").find("tbody tr:last")
          let sensitivityTd = sensitivityTr.children()

          let sensitivityZeroArray = new Array() // 피부민감도(즉시) chart 배열
          let sensitivityThirtyArray = new Array() // 피부민감도(30분) chart 배열
          let sensitivitySixtyArray = new Array() // 피부민감도(60분) chart 배열

          let senz = 1
          let sent = 2
          let sens = 3

          for (let i = 1; i <= 14; i++) {
            if (sensitivityTd.eq(senz).text() == "-") {
              sensitivityZeroArray.push(0)
            } else {
              sensitivityZeroArray.push(sensitivityTd.eq(senz).text())
            }
            senz += 3
          }

          for (let i = 2; i <= 15; i++) {
            if (sensitivityTd.eq(sent).text() == "-") {
              sensitivityThirtyArray.push(0)
            } else {
              sensitivityThirtyArray.push(sensitivityTd.eq(sent).text())
            }
            sent += 3
          }

          for (let i = 3; i <= 16; i++) {
            if (sensitivityTd.eq(sens).text() == "-") {
              sensitivitySixtyArray.push(0)
            } else {
              sensitivitySixtyArray.push(sensitivityTd.eq(sens).text())
            }
            sens += 3
          }

          sensitivityChart.destroy()

          // 피부민감도
          let sensitivityCtx = document
            .getElementById("static_sensitivity")
            .getContext("2d")

          let sensitivityData = {
            labels: [
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "J",
              "K",
              "L",
              "M",
              "N",
            ],
            datasets: [
              {
                label: "즉시",
                backgroundColor: "#F0D8D1",
                data: sensitivityZeroArray,
              },
              {
                label: "30분",
                backgroundColor: "#EBD5F1",
                data: sensitivityThirtyArray,
              },
              {
                label: "60분",
                backgroundColor: "#CDDEEE",
                data: sensitivitySixtyArray,
              },
            ],
          }

          sensitivityChart = new Chart(sensitivityCtx, {
            type: "bar",
            data: sensitivityData,
            options: {
              responsive: false,
              barValueSpacing: 20,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      min: 0,
                    },
                  },
                ],
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "피부민감도",
                  font: {
                    size: 20,
                  },
                },
              },
            },
          })
        }

        /******************************************************************************************************************/

        // 만족도
        let newSatisfyAppendHtml = ""

        $("#satisfyTb").find("tbody").empty()

        if (data.satisfyInstantList.length <= 0) {
          newSatisfyAppendHtml += "<tr>"
          newSatisfyAppendHtml += "<td colspan='46' class='no-data'>"
          newSatisfyAppendHtml += "등록된 데이터가 없습니다."
          newSatisfyAppendHtml += "</td>"
          newSatisfyAppendHtml += "</tr>"

          $("#satisfyTb").append(newSatisfyAppendHtml)

          satisfyChart.destroy()

          satisfyChart = new Chart(document.getElementById("static_satisfy"), {
            type: "bar",
            data: {
              labels: ["등록된 데이터 없음"],
              datasets: [
                {
                  label: "등록된 데이터 없음",
                  backgroundColor: "rgb(255, 99, 132)",
                  borderColor: "rgb(255, 99, 132)",
                  data: [1],
                },
              ],
            },
            options: {
              responsive: false,
              barValueSpacing: 20,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      min: 0,
                    },
                  },
                ],
              },
              plugins: {
                legend: {
                  display: true,
                  position: "right",
                },
                title: {
                  display: true,
                  text: "만족도",
                  font: {
                    size: 20,
                  },
                },
              },
            },
          })
        } else {
          for (let i = 0; i <= 10; i++) {
            newSatisfyAppendHtml += "<tr>"
            newSatisfyAppendHtml += "<th style='border: 1px solid #DEE2E6;'>"
            newSatisfyAppendHtml += i
            newSatisfyAppendHtml += "</th>"

            for (let j = 0; j <= 44; j++) {
              ascii = 65 + j / 3
              apb = String.fromCharCode(ascii)

              isAfter = j % 3
              if (isAfter == 0) {
                tdNum = "0M"
              } else if (isAfter == 1) {
                tdNum = "30M"
              } else if (isAfter == 2) {
                tdNum = "60M"
              }
              newSatisfyAppendHtml +=
                "<td id='satisfyTb_" +
                apb +
                "_" +
                tdNum +
                "_" +
                i +
                "' style='border: 1px solid #DEE2E6;'>"
              newSatisfyAppendHtml += "-"
              newSatisfyAppendHtml += "</td>"
            }

            newSatisfyAppendHtml += "</tr>"
          }
          $("#satisfyTb").append(newSatisfyAppendHtml)

          let satisfyFilterList = []

          // 즉시
          let satisfyInstantList = data.satisfyInstantList
          for (let i = 0; i < satisfyInstantList.length; i++) {
            let item = satisfyInstantList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 0,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              satisfyFilterList.push(filteredData)

              let idName = "satisfyTb_" + product + "_0M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 30분
          let satisfyThirtyList = data.satisfyThirtyList
          for (let i = 0; i < satisfyThirtyList.length; i++) {
            let item = satisfyThirtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 30,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              satisfyFilterList.push(filteredData)

              let idName = "satisfyTb_" + product + "_30M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          // 60분
          let satisfySixtyList = data.satisfySixtyList
          for (let i = 0; i < satisfySixtyList.length; i++) {
            let item = satisfySixtyList[i]
            let product = item.product

            for (let j = 0; j < item.staticList.length; j++) {
              let fieldValue = item.staticList[j].fieldValue
              let valueCount = item.staticList[j].valueCount

              let filteredData = {
                product: product,
                times: 60,
                fieldValue: fieldValue,
                valueCount: valueCount,
              }
              satisfyFilterList.push(filteredData)

              let idName = "satisfyTb_" + product + "_60M_" + fieldValue
              document.getElementById(idName).innerText = valueCount
            }
          }

          /* 합계 */
          for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 3; j++) {
              let tdId = "satisfyTb_O_"
              let times
              if (j == 0) {
                tdId += "0M_" + i
                times = 0
              } else if (j == 1) {
                tdId += "30M_" + i
                times = 30
              } else {
                tdId += "60M_" + i
                times = 60
              }

              let sumList = satisfyFilterList.filter((item) => {
                return item.times == times && item.fieldValue == i
              })
              document.getElementById(tdId).innerText = sumList.length
            }
          }

          /* 평균 */
          $("#satisfyTb")
            .find("tbody")
            .append('<tr><th style="border: 1px solid #DEE2E6;">평균</td></tr>')

          for (var i = 0; i < 45; i++) {
            var sum = 0
            $("#satisfyTb")
              .find("tbody tr")
              .each(function () {
                if (!isNaN(Number($(this).find("td").eq(i).text()))) {
                  sum = sum + Number($(this).find("td").eq(i).text())
                }
              })
            var avg = (sum / 11).toFixed(2)
            if (avg == 0) {
              avg = "-"
            }
            $("#satisfyTb")
              .find("tbody tr:last-child")
              .append(
                '<td style="border: 1px solid #DEE2E6; font-size: 0.8rem;">' +
                  avg +
                  "</td>"
              )
          }

          let satisfyTr = $("#satisfyTb").find("tbody tr:last")
          let satisfyTd = satisfyTr.children()

          let satisfyZeroArray = new Array() // 만족도(즉시) chart 배열
          let satisfyThirtyArray = new Array() // 만족도(30분) chart 배열
          let satisfySixtyArray = new Array() // 만족도(60분) chart 배열

          let satz = 1
          let satt = 2
          let sats = 3

          for (let i = 1; i <= 14; i++) {
            if (satisfyTd.eq(satz).text() == "-") {
              satisfyZeroArray.push(0)
            } else {
              satisfyZeroArray.push(satisfyTd.eq(satz).text())
            }
            satz += 3
          }

          for (let i = 2; i <= 15; i++) {
            if (satisfyTd.eq(satt).text() == "-") {
              satisfyThirtyArray.push(0)
            } else {
              satisfyThirtyArray.push(satisfyTd.eq(satt).text())
            }
            satt += 3
          }

          for (let i = 3; i <= 16; i++) {
            if (satisfyTd.eq(sats).text() == "-") {
              satisfySixtyArray.push(0)
            } else {
              satisfySixtyArray.push(satisfyTd.eq(sats).text())
            }
            sats += 3
          }

          // 데이터 비우기
          satisfyChart.destroy()

          // 만족도
          let satisfyCtx = document
            .getElementById("static_satisfy")
            .getContext("2d")

          let satisfyData = {
            labels: [
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "J",
              "K",
              "L",
              "M",
              "N",
            ],
            datasets: [
              {
                label: "즉시",
                backgroundColor: "#F0D8D1",
                data: satisfyZeroArray,
              },
              {
                label: "30분",
                backgroundColor: "#EBD5F1",
                data: satisfyThirtyArray,
              },
              {
                label: "60분",
                backgroundColor: "#CDDEEE",
                data: satisfySixtyArray,
              },
            ],
          }

          satisfyChart = new Chart(satisfyCtx, {
            type: "bar",
            data: satisfyData,
            options: {
              responsive: false,
              barValueSpacing: 20,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      min: 0,
                    },
                  },
                ],
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "만족도",
                  font: {
                    size: 20,
                  },
                },
              },
            },
          })
        }

        completeLoading()
      },
      error: function (xhr, status, error) {
        console.log("function fnSearch() error!")
      },
    })
  }
}
