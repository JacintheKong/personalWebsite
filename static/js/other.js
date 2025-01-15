function setupModal() {
    var buttons = document.querySelectorAll('.mers_tm_full_link'); // 所有触发按钮

    buttons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // 阻止链接默认行为
            var parent = this.closest('.list_inner'); // 找到最近的list_inner元素
            var imageSrc = parent.querySelector('.popup_service_image').src;
            var title = parent.querySelector('.title').textContent;
            var description = parent.querySelector('.descriptions').innerHTML;

            // 设置模态窗口内容
            var modal = document.querySelector('.modal_container');
            modal.querySelector('.modal_image').src = imageSrc;
            modal.querySelector('.modal_title').textContent = title;
            modal.querySelector('.modal_description').innerHTML = description;
            modal.style.display = 'flex'; // 显示模态窗口
        });
    });

    // 关闭按钮
    document.querySelector('.close').addEventListener('click', function() {
        document.querySelector('.modal_container').style.display = 'none'; // 隐藏模态窗口
    });
}

document.addEventListener('DOMContentLoaded', setupModal); // 页面加载完成后设置
