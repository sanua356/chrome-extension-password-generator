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

//Секретная фраза, по которой криптометоды будут проверять, валидный ли секретный ключ пользователя или нет
const checkValidSecretKey = "DMi984829E02C25eQg84";

//Функция генерации пароля. Аргумент - массив опций генерации (опция - строка)
function generateRandomSymbol(params) {
    const randomParam = params[Math.floor(Math.random() * params.length)];
    return generateSymbolInAlphabet(assocAlphabets[randomParam]);
}

//Функция получения случайного символа из алфавита, полученного как параметр
function generateSymbolInAlphabet(alphabet) {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}
//Генерация пароля
function generatePassword(length, params) {
    let password = "";
    for (let i = 0; i < length; i++) {
        password += String(generateRandomSymbol(params));
    }
    return password;
}

function encryptString(str, key) {
    return CryptoJS.AES.encrypt(str, key).toString();
}
function decryptString(str, key) {
    const bytes = CryptoJS.AES.decrypt(str, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

const getStorageValue = async function (key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function (value) {
                if (value[key] !== undefined) {
                    resolve(value[key]);
                } else {
                    resolve(null);
                }
            });
        } catch (ex) {
            reject(ex);
        }
    });
};
const setStorageValue = async function (obj) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set(obj, function () {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
};
const deleteStorageValue = async function (key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.remove(key, function () {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

//Функция сохранения готового пароля в LocalStorage
async function savePassword(password) {
    //Если хранилище ещё не создано
    const savedPasswords = await getStorageValue("passwordsHistory");
    if (savedPasswords !== null) {
        let passwordsHistory = JSON.parse(savedPasswords);
        //Если хранилище паролей переполнено
        if (passwordsHistory.length >= 100) {
            passwordsHistory.pop();
        }
        password = CryptoJS.AES.encrypt(
            password,
            await getStorageValue("secretKey")
        ).toString();
        passwordsHistory = [{ password, hint: "" }, ...passwordsHistory];
        setStorageValue({ passwordsHistory: JSON.stringify(passwordsHistory) });
    } else {
        setStorageValue({
            passwordsHistory: JSON.stringify([{ password, hint: "" }]),
        });
    }
}

function copyToClipboard(text) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
        return navigator.clipboard.writeText(text);
    return Promise.reject("The Clipboard API is not available.");
}
