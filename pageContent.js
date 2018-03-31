(function () {
    window.addEventListener("DOMContentLoaded", function () {
        document.body.addEventListener('dblclick', dblClickHandler);
    });

    class TranslationModal {

        constructor(xPos, yPos, parentElement = document.body, width = 360) {
            this.modalElement = document.createElement("div");

            this.modalElement.style.position = "absolute";
            this.modalElement.style.zIndex = "99999";

            this.modalElement.style.width = width + "px";
            this.modalElement.style.padding = "15px 20px";

            this.modalElement.style.background = "white";
            this.modalElement.style.border = "1px solid rgba(200, 200, 200, 0.8)";
            this.modalElement.style.borderRadius = "6px";

            this.modalElement.style.top = yPos + 10 + "px";
            this.modalElement.style.left = xPos - (width / 2) + "px";

            this.modalShadowRoot = this.modalElement.attachShadow({ mode: "closed" });

            this.spinnerElement = createSpinner();
            this.modalShadowRoot.innerHTML = '<style> :host { all: initial; } </style>';
            this.modalShadowRoot.appendChild(this.spinnerElement);

            parentElement.appendChild(this.modalElement);
            parentElement.addEventListener('click', e => this._destroy(e, parentElement));
        }

        addTranslations(translations) {
            translations.forEach(tr => {
                const translationOption = document.createElement("div");
                translationOption.className = "";
                translationOption.innerText = tr.value;
                this.modalShadowRoot.appendChild(translationOption);
            });
        }

        allTranslationsHaveBeenAdded() {
            this.modalShadowRoot.removeChild(this.spinnerElement);
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
            .then(({translations}) => {
                modal.addTranslations(translations);
                modal.allTranslationsHaveBeenAdded();
            });
    }


    function translate(textToTranslate) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();

            xhr.open("PUT", "https://freefly.life/api/phrases");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({phrase: textToTranslate}));
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

    function createSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.innerHTML = `
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
            
            <style>
            .spinner {
                height: 18px;
            
                text-align: center;
            }
            
            .spinner > div {
                width: 18px;
                height: 18px;
                background-color: #cccccc;
            
                border-radius: 100%;
                display: inline-block;
                -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
                animation: sk-bouncedelay 1.4s infinite ease-in-out both;
            }
            
            .spinner .bounce1 {
                -webkit-animation-delay: -0.32s;
                animation-delay: -0.32s;
            }
            
            .spinner .bounce2 {
                -webkit-animation-delay: -0.16s;
                animation-delay: -0.16s;
            }
            
            @-webkit-keyframes sk-bouncedelay {
                0%, 80%, 100% { -webkit-transform: scale(0) }
                40% { -webkit-transform: scale(1.0) }
            }
            
            @keyframes sk-bouncedelay {
                0%, 80%, 100% {
                    -webkit-transform: scale(0);
                    transform: scale(0);
                } 40% {
                      -webkit-transform: scale(1.0);
                      transform: scale(1.0);
                  }
            }
        `;

        return spinner;
    }
})();