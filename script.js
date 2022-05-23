//Константы генерации символов
const englishAlphabetUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const englishAlphabetLower = "abcdefghijklmnopqrstuvwxyz";
const russianAlphabetUpper = "АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ";
const russianAlphabetLower = "абвгдеёжзиклмнопрстуфхцчшщьыъэюя";
const numbersAlphabet = "0123456789";
const specialCharsAlphabet = "!@#$%^&*()-=_+.,";
const assocAlphabets = {
    rusLang: russianAlphabetUpper + russianAlphabetLower,
    engLang: englishAlphabetUpper + englishAlphabetLower,
    numbers: numbersAlphabet,
    specialChars: specialCharsAlphabet,
    T: englishAlphabetUpper,
    t: englishAlphabetLower,
    R: russianAlphabetUpper,
    r: russianAlphabetLower,
    N: numbersAlphabet,
    S: specialCharsAlphabet,
}; //Объект с ассоциациями: название параметра - алфавит

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

//Обработка клика по кнопке "Сгенерировать"
const generateParams = document.querySelectorAll(".param");
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

        //Генерация пароля
        for (let i = 0; i < passwordLength; i++) {
            password += String(generateRandomSymbol(params));
        }
    } else {
        const mask = maskValue.value;
        for (let i = 0; i < mask.length; i++) {
            password += String(
                generateSymbolInAlphabet(assocAlphabets[mask[i]])
            );
        }
    }
    inputPassword.value = password;
    if (password.length > 0) {
        inputPassword.classList.add("passwordNotEmpty");
        //Сохранение пароля в хранилище
        if (localStorage.getItem("passwordsHistory") !== null) {
            let passwordsHistory = JSON.parse(
                localStorage.getItem("passwordsHistory")
            );
            if (passwordsHistory.length >= 100) {
                passwordsHistory.pop();
            }
            passwordsHistory = [{ password, hint: "" }, ...passwordsHistory];
            localStorage.setItem(
                "passwordsHistory",
                JSON.stringify(passwordsHistory)
            );
        } else {
            localStorage.setItem(
                "passwordsHistory",
                JSON.stringify([{ password, hint: "" }])
            );
        }
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
        document.execCommand("copy");
        copyMessage.classList.remove("hide");
    }
});

//Функция генерации пароля. Аргумент - массив опций генерации (опция - строка)
function generateRandomSymbol(params) {
    const randomParam = params[Math.floor(Math.random() * params.length)];
    return generateSymbolInAlphabet(assocAlphabets[randomParam]);
}

//Функция получения случайного символа из алфавита, полученного как параметр
function generateSymbolInAlphabet(alphabet) {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}
