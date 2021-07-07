/*
 * @Author: Shawn
 * @Date: 2021-06-10 10:54:47
 * @LastEditTime: 2021-07-06 13:19:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htmlc:\Users\Admin\Desktop\map\js\graphic.js
 */

var graphicTotalPage, graphicCurrentPageSize, graphicPageNum = 1, graphicPageSize = 3;

var graphic_data;

// 进入图文列表
$("#graphic").on("click", () => {
    $("#graphicList .list").empty();
    graphicList_downCallback();
    $("#graphicList").show();
});
// 退出图文列表
$("#graphicList .graphicList_back").on("click", () => {
    $("#graphicList").hide();
});
// 进入图文详情
function entrygraphicDetail() {
    $("#graphicList .main .list .item .cover").unbind("click");

    $("#graphicList .main .list .item .cover").on("click", (e) => {
        let temp = selectGraphic($(e.currentTarget).attr("data_id"));
        $("#graphicDetail video").attr("src", temp.video);
        $("#graphicDetail .title").text(temp.title);
        $("#graphicDetail .time").text(temp.updateDate);
        $("#graphicDetail .content").html(temp.content);

        $("#graphicList").hide();
        $("#graphicDetail").show();
    });
}

// 退出图文详情
$("#graphicDetail .graphicDetail_exit").on("click", () => {
    // 退出详情且暂停详情页面内的video
    if (!$("#graphicDetail video").get(0).paused) {
        $("#graphicDetail video").get(0).pause();
    }
    $("#graphicDetail").hide();
    $("#graphicList").show();
});

function selectGraphic(param) {
    for (let i = 0; i < graphic_data.length; i++) {
        if (param == graphic_data[i].id) {
            return graphic_data[i];
        }
    }
}