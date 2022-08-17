try {
    //Если хоткей сработал, вызвать колбэк, чтобы сгенерировать пароль
    runOnKeys(async function (passwordLength) {
        const params = JSON.parse(await getStorageValue("params")) || [
            "engLang",
            "numbers",
        ];
        let password = generatePassword(passwordLength, params);
        savePassword(password);
        alertHotkeyedPassword(password);
    });
} catch (e) {
    console.log("Password generator extension initializing error: " + e);
}

//Обработка хоткеев для быстрой генерации пароля
function runOnKeys(callback) {
    let pressed = new Set();

    document.addEventListener("keydown", function (event) {
        pressed.add(event.code);
        if (
            (pressed.has("ShiftRight") || pressed.has("ShiftLeft")) &&
            (pressed.has("ControlLeft") || pressed.has("ControlRight"))
        ) {
            for (let i = 1; i <= 9; i++) {
                if (pressed.has("Digit" + i)) {
                    pressed.clear();
                    callback(i);
                    return;
                }
            }
        }
    });

    document.addEventListener("keyup", function (event) {
        pressed.delete(event.code);
    });
}

//Показать пароль, который создан с помощью хоткеев на экране
function alertHotkeyedPassword(password) {
    //Получаем время, чтобы id стилей случайно не совпал ни с каким элементом на странице
    const time = new Date().getTime();
    let style = document.createElement("style");
    let notification = document.createElement("div");
    copyToClipboard(password);
    style.innerHTML = `
    .passwordNotification_${time} {
        all: unset !important;
        position: fixed  !important;
        top: 5%  !important;
        right: 5%  !important;
        font-family: "Arial", sans-serif  !important;
        font-size: 1rem !important;
        color: #eeeef5  !important;
        background: black  !important;
        max-width: 30vw  !important;
        padding: 10px 15px  !important;
        border-radius: 5%  !important;
        box-shadow: 0px 5px 10px 2px rgb(128 128 128 / 20%) !important;
        transition: 0.3s ease-in-out all  !important;
        transform: translateY(-100px)  !important;
        opacity: 0  !important;
        z-index: 99999999999 !important;
    }
    .passwordNotification_${time}__active {
        transform: translateY(0px) !important;
        opacity: 1 !important;
    }
    `;
    notification.innerHTML = `Ваш пароль сгенерирован: ${password}`;
    notification.classList.add(`passwordNotification_${time}`);
    setTimeout(() => {
        notification.classList.add(`passwordNotification_${time}__active`);
    }, 10);
    setTimeout(() => {
        notification.classList.remove(`passwordNotification_${time}__active`);
    }, 3000);
    document.body.appendChild(style);
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
        document.body.removeChild(style);
    }, 3300);
}
