/*
 * @Author: your name
 * @Date: 2021-05-08 11:46:52
 * @LastEditTime: 2021-07-05 11:34:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htmlc:\Users\Admin\Desktop\map\js\audio.js
 */
// 语音助手点击事件
$("#infoWindow #infoContainer .bottom .voiceAssistant").on("click", (e) => {
    assignVoice(e);
    $("#infoWindow").hide();
    $("#voice").show();
});
// 关闭语音助手 回到 信息弹窗
$("#voice .head .close").on("click", () => {
    $("#voice .voice_content .back").click();
    $("#voice").hide();
    $("#infoWindow").show();
})

// 退出audio,且还原到目录打开页面 + 暂停播放
$("#voice .voice_content .back").on("click", () => {
    if (!$("#voice .voice_content .audioBox audio").get(0).paused) {
        $("#voice .voice_content audio").get(0).pause();
    }
    $("#voice .voice_content").hide();
    $("#voice .voice_directory").fadeIn();
});

// 填充语音助手页面 
function assignVoice(e) {
    $("#voice .head img").attr("src", $("#infoWindow #infoContainer .head img").attr("src"));
    $("#voice .head .right .name").text($("#infoWindow #infoContainer .head .right .name").text());
    $("#voice .head .right .center").text($("#infoWindow #infoContainer .head .right .center").text());
    let temp = selectVoice(e.currentTarget.getAttribute("byid"));
    let parent = $("#voice .voice_directory");
    parent.empty();
    for (let i = 0; i < temp.length; i++) {
        let a = $(`<div class="title" file=` + temp[i].audio + ` data_id=` + temp[i].id + `>` + temp[i].name + `</div>`);
        parent.append(a);
    }

    // 生成目录 => 注册语音目录事件
    $("#voice .voice_directory .title").unbind("click");
    $("#voice .voice_directory .title").on("click", (e) => {
        $("#voice .voice_content audio").attr("src", $(e.currentTarget).attr('file'));
        for (let i = 0; i < temp.length; i++) {
            if ($(e.currentTarget).attr('data_id') == temp[i].id) {
                $("#voice .voice_content .text").html(temp[i].content);
            }
        }

        $("#voice .voice_directory").hide();
        $("#voice .voice_content").fadeIn();
    });
}

// 从marker_data数组里面查询对应点位questions
function selectVoice(param) {
    for (let i = 0; i < marker_data.length; i++) {
        if (param == marker_data[i].byid) {
            return marker_data[i].questions;
        }
    }
}