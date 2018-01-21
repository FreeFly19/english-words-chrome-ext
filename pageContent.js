(function () {
    window.addEventListener("DOMContentLoaded", function () {
        document.body.addEventListener('dblclick', dblClickHandler);
    });

    function createPopupElement(e, translations) {
        const width = 300;
        let el = document.createElement("div");
        el.style.position = "absolute";
        el.style.top = e.pageY + 10 + "px";
        el.style.left = e.pageX - (width / 2) + "px";
        el.style.width = width + "px";
        el.style.minHeight = "50px";
        el.style.background = "white";
        el.style.border = "1px solid black";
        el.style.zIndex = "99999";

        el.innerHTML = translations;
        return el;
    }

    function dblClickHandler(e) {
        let textToTranslate = getSelectionText();
        if (!textToTranslate || !e.altKey) return;

        translate(textToTranslate)
            .then(
                translations => {
                    const el = createPopupElement(e, translations);
                    document.body.appendChild(el);
                    document.body.addEventListener('click', function remover() {
                        if (e.path.indexOf(el) === -1) {
                            el.remove();
                            document.body.removeEventListener('click', remover);
                        }
                    });
                },
                err => console.log('Error!', err)
            );
    }


    function translate(textToTranslate) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();

            xhr.open("PUT", "https://freefly.life/translate");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({word: textToTranslate}));
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) return;
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr);
                }

            };
            xhr.onerror = () => reject(xhr);
        });
    }

    function getSelectionText() {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (document.selection && document.selection.type !== "Control") {
            return document.selection.createRange().text;
        }
    }
})();