const noSecretKeyArea = document.querySelector(".noSecretKeyArea");

noSecretKeyArea.addEventListener("click", function () {
    inputValueModal(
        "Введите мастер-пароль для доступа ко всем функциям",
        async function (value) {
            const decryptedKey = decryptString(
                await getStorageValue("encryptedValidSecretKey"),
                value
            );
            if (decryptedKey === checkValidSecretKey) {
                noSecretKeyArea.classList.add("hide");
                setStorageValue({ secretKey: value });
            }
        }
    );
});

window.addEventListener("load", async function () {
    const isFirstStart = await getStorageValue("isFirstStart");
    if (isFirstStart === null) {
        inputValueModal(
            "Создайте мастер-пароль для защиты всех сгенерированных",
            async function (value) {
                setStorageValue({ isFirstStart: true });
                setStorageValue({
                    encryptedValidSecretKey: encryptString(
                        checkValidSecretKey,
                        value
                    ),
                });
                setStorageValue({ secretKey: value });
            }
        );
        return;
    }
    const secretKey = await getStorageValue("secretKey");
    if (secretKey === null) {
        noSecretKeyArea.classList.remove("hide");
    }
});

//Получение элемента блокировки расширения (удаления секретного ключа из хранилища)
const lockExtension = document.querySelector("#lockExtension");
lockExtension.addEventListener("click", function () {
    deleteStorageValue("secretKey");
    noSecretKeyArea.classList.remove("hide");
});

const changeSecretKeyBtn = document.querySelector("#changeSecretKey");
changeSecretKeyBtn.addEventListener("click", async function () {
    const secretKey = await getStorageValue("secretKey");
    const decryptedKey = decryptString(
        await getStorageValue("encryptedValidSecretKey"),
        secretKey
    );
    if (secretKey !== null && decryptedKey === checkValidSecretKey) {
        inputValueModal(
            "Введите в поле ниже новый мастер-пароль",
            async function (value) {
                let savedPasswords = JSON.parse(
                    await getStorageValue("passwordsHistory")
                );
                for (let i = 0; i < savedPasswords.length; i++) {
                    savedPasswords[i].password = encryptString(
                        decryptString(savedPasswords[i].password, secretKey),
                        value
                    );
                }
                setStorageValue({
                    passwordsHistory: JSON.stringify(savedPasswords),
                });
                setStorageValue({
                    encryptedValidSecretKey: encryptString(
                        checkValidSecretKey,
                        value
                    ),
                });
                setStorageValue({ secretKey: value });
            }
        );
    } else {
        lockExtension.classList.remove("hide");
    }
});

//Получение элемента поля вывода пароля
const inputPassword = document.querySelector("#passwordField");

//Обновление индикатора длины пароля
const passwordLengthInput = document.querySelector("#passwordLengthBtn");
const passwordLengthIndicator = document.querySelector(
    "#passwordLengthIndicator"
);
passwordLengthInput.addEventListener("input", function (e) {
    passwordLengthIndicator.textContent = e.target.value;
});

//Добавление подсветки на input пароля, пока поле ввода не пусто
inputPassword.addEventListener("input", function () {
    if (inputPassword.value.length > 0) {
        inputPassword.classList.add("passwordNotEmpty");
    } else {
        inputPassword.classList.remove("passwordNotEmpty");
    }
});
const generateParams = document.querySelectorAll(".param");
//Сохранение параметов генерации пароля при клике на "checkboxы"
generateParams.forEach((checkbox) => {
    checkbox.addEventListener("click", function () {
        let params = [];
        generateParams.forEach((param) => {
            if (param.checked) {
                params.push(param.name);
            }
        });
        setStorageValue({ params: JSON.stringify(params) });
    });
});

//Подгрузка последних сохранённых параметров
window.addEventListener("load", async function () {
    const savedParams = JSON.parse(await getStorageValue("params"));
    if (savedParams !== null) {
        for (let i = 0; i < generateParams.length; i++) {
            if (savedParams.includes(generateParams[i].name)) {
                generateParams[i].checked = true;
            } else {
                generateParams[i].checked = false;
            }
        }
    }
});

//Обработка клика по кнопке "Сгенерировать"
const generatePasswordBtn = document.querySelector(".generatePasswordBtn");

generatePasswordBtn.addEventListener("click", function () {
    let password = "";
    //Если генерация пароля происходит НЕ по маске
    if (!generateFromMaskBtn.checked) {
        copyMessage.classList.add("hide");
        const passwordLength = Number(passwordLengthIndicator.textContent);
        //Получение списка выбранных опций генерации от пользователя
        let params = [];
        generateParams.forEach((element) => {
            if (element.checked) {
                params.push(element.name);
            }
        });
        password = generatePassword(passwordLength, params);

        //Если выбран режим генерации по маске
    } else {
        const mask = maskValue.value;
        for (let i = 0; i < mask.length; i++) {
            password += String(
                generateSymbolInAlphabet(assocAlphabets[mask[i]])
            );
        }
    }
    if (password.length > 0) {
        inputPassword.classList.add("passwordNotEmpty");
        inputPassword.value = password;
        savePassword(password);
    }
});

//Обработка кнопки "Пароль по маске"
const generateFromMaskBtn = document.querySelector("#passwordFromMaskBtn");
const maskValue = document.querySelector("#maskField");
const maskOptionsArea = document.querySelector(".maskArea");
generateFromMaskBtn.addEventListener("click", function () {
    if (generateFromMaskBtn.checked) {
        generateParams.forEach((paramDOMNode) => {
            paramDOMNode.disabled = true;
            passwordLengthInput.disabled = true;
            passwordLengthIndicator.classList.add("disabled");
            maskOptionsArea.classList.remove("hide");
        });
    } else {
        generateParams.forEach((paramDOMNode) => {
            paramDOMNode.disabled = false;
            passwordLengthInput.disabled = false;
            passwordLengthIndicator.classList.remove("disabled");
            maskOptionsArea.classList.add("hide");
        });
    }
});

//Копирование готового пароля в буфер обмена
const copyBtn = document.querySelector("#copyBtn");
const copyMessage = document.querySelector("#copyMessage");
copyBtn.addEventListener("click", function () {
    if (inputPassword.value.length > 0) {
        inputPassword.select();
        copyToClipboard(inputPassword.value);
        copyMessage.classList.remove("hide");
    }
});
