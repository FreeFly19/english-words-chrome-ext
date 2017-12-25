window.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener('dblclick', dblClickHandler);

    function dblClickHandler(e) {
        if (!getSelectionText()) return;

        const width = 300;
        let el = document.createElement("div");
        el.style.position = "absolute";

        el.style.top = e.clientY - e.currentTarget.getBoundingClientRect().top + getLineHeight(e.currentTarget) + "px";
        el.style.left = e.pageX - (width / 2) + "px";
        el.style.width = width + "px";
        el.style.minHeight = "50px";
        el.style.background = "white";
        el.style.border = "1px solid black";
        el.style.zIndex = "99999";

        const xhr = new XMLHttpRequest();

        xhr.open("GET", "https://localhost/plugin?translate=" + getSelectionText());
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            el.innerHTML = xhr.responseText;
            document.body.appendChild(el);
            document.body.addEventListener('click', function remover() {
                if (e.path.indexOf(el) === -1) {
                    el.remove();
                    document.body.removeEventListener('click', remover);
                }
            });
        };
    }
});

function getLineHeight(element){
    let temp = document.createElement(element.nodeName);
    temp.setAttribute("style","margin:0px;padding:0px;font-family:"+element.style.fontFamily+";font-size:"+element.style.fontSize);
    temp.innerHTML = "test";
    temp = element.parentNode.appendChild(temp);
    const ret = temp.clientHeight;
    temp.parentNode.removeChild(temp);
    return ret;
}

function getSelectionText() {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
        return document.selection.createRange().text;
    }
}