let confirmModalArea = document.querySelector(".confirmModal"),
    confirmModalTitle = document.querySelector(".confirmModal-title"),
    confirmModalBtn = document.querySelector(".confirmModal-confirmBtn"),
    confirmModalInput = document.querySelector(".confirmModal-inputValue"),
    confirmModalCancelBtn = document.querySelector(".confirmModal-cancelBtn");

function initModal(title, actionCallback, isInputModal) {
    confirmModalTitle.innerHTML = title;
    confirmModalArea.classList.remove("modal__hide");
    ///Если модалка инициализируется с полем ввода
    if (isInputModal) {
        confirmModalInput.classList.remove("hide");
        confirmModalInput.value = "";
    }
    //Обработчики нажатий кнопок: "Подтвердить" и "Отменить"
    function confirmClickHandler() {
        if (isInputModal) {
            const inputValue = confirmModalInput.value.trim();
            if (inputValue.length > 0) {
                actionCallback(inputValue);
            }
        } else {
            actionCallback();
        }
        removeHandlers();
        confirmModalArea.classList.add("modal__hide");
        confirmModalInput.classList.add("hide");
    }
    function cancelClickHandler() {
        removeHandlers();
        confirmModalArea.classList.add("modal__hide");
        confirmModalInput.classList.add("hide");
    }
    confirmModalBtn.addEventListener("click", confirmClickHandler, false);
    confirmModalCancelBtn.addEventListener("click", cancelClickHandler, false);

    //Очистка обработчиков после скрытия формы;
    function removeHandlers() {
        confirmModalBtn.removeEventListener(
            "click",
            confirmClickHandler,
            false
        );
        confirmModalCancelBtn.removeEventListener(
            "click",
            cancelClickHandler,
            false
        );
    }
}

//Обработка модалки подтверждения какого-либо действия
function confirmActionModal(title, confirmCallback) {
    initModal(title, confirmCallback, false);
}

//Обработка модалки подтверждения какого-либо действия
function inputValueModal(title, setValueCallback) {
    initModal(
        title,
        (inputValue) => {
            setValueCallback(inputValue);
        },
        true
    );
}
