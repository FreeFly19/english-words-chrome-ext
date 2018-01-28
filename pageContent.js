(function () {
    window.addEventListener("DOMContentLoaded", function () {
        document.body.addEventListener('dblclick', dblClickHandler);
    });

    class TranslationModal {

        constructor(xPos, yPos, parentElement = document.body, width = 300, minHeight = 50) {
            this.modalElement = document.createElement("div");

            this.modalElement.style.position = "absolute";
            this.modalElement.style.zIndex = "99999";

            this.modalElement.style.width = width + "px";
            this.modalElement.style.minHeight = minHeight + "px";

            this.modalElement.style.background = "white";
            this.modalElement.style.border = "1px solid black";

            this.modalElement.style.top = yPos + 10 + "px";
            this.modalElement.style.left = xPos - (width / 2) + "px";

            parentElement.appendChild(this.modalElement);
            parentElement.addEventListener('click', e => this._destroy(e, parentElement));
        }

        addTranslations(translations) {
            const ol = document.createElement("ol");
            translations.forEach(tr => {
                const li = document.createElement("li");
                li.innerText = tr.value;
                ol.appendChild(li);
            });
            this.modalElement.appendChild(ol);
        }


        _destroy(e, parentElement) {
            if (e.path.indexOf(this.modalElement) === -1) {
                this.modalElement.remove();
                parentElement.removeEventListener('click', this._destroy);
            }
        }
    }

    function dblClickHandler(e) {
        let textToTranslate = getSelectionText();
        if (!textToTranslate || !e.altKey) return;

        const modal = new TranslationModal(e.pageX, e.pageY);

        translate(textToTranslate)
            .then(translations => {
                modal.addTranslations(translations);
            });
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
                    resolve(JSON.parse(xhr.responseText));
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