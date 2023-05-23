const _i18n = {
	'Если вы ввели ссылку на газету с Google диска или подобного зранилиша файлов то скачайте и отправте PDF-газету в виде файла.': ['If you have entered a link to a newspaper from Google Drive or a similar file store, then download and send the PDF newspaper as a file.', 'Егер сіз Google Drive немесе ұқсас файлдар дүкенінен газетке сілтеме енгізсеңіз, PDF газетін жүктеп алып, файл ретінде жіберіңіз.'],
	'Добавить газету в проект': ['Add a newspaper to a project', 'Жобаға газет қосыңыз'],
	'Дата публикаций газеты': ['Date of publication of the newspaper', 'Газеттің шыққан күні'],
	'Файл': ['File', 'Файл'],
	'Ссылка': ['Link', 'Сілтеме'],
	'Выбрать PDF-газету': ['Select PDF newspaper', 'PDF газетін таңдаңыз'],

	'Перетащите PDF-газету': ['Drag PDF Newspaper', 'PDF газетін сүйреңіз'],
	'Введите ссылку на PDF-газету': ['Enter link to PDF newspaper', 'PDF газетіне сілтемені енгізіңіз'],

	'Выбран': ['Selected', 'Таңдалған'],
	'Выбрано': ['Selected', 'Таңдалған'],
	'файла': ['file', 'файл'],
	'файл': ['file', 'файл'],
	'файлов': ['files', 'файлдар'],

	'Газета не выбрана': ['Newspaper not selected', 'Газет таңдалмаған'],
	'Источник': ['Source', 'Дереккөз'],
	'Выбрать': ['Choose', 'Таңдау'],
	'Добавить новый': ['Add new', 'Жаңасын қосыңыз'],
	'Ссылка на источник': ['Link to source', 'Дереккөзге сілтеме'],
	'Убедитесь, что ссылка на источник правильная': ['Make sure the link to the source is correct', 'Дереккөзге сілтеме дұрыс екеніне көз жеткізіңіз'],
	'Название источника': ['Source name', 'Дереккөз атауы'],
	'Убедитесь, что заголовок источника правильный': ['Make sure the source title is correct', 'Бастапқы тақырыптың дұрыс екеніне көз жеткізіңіз'],
	'Страна': ['A country', 'Мемлекет'],
	'Регион': ['Region', 'Аймақ'],
	'Город': ['City', 'Қала'],
	'Добавить источник': ['Add source', 'Дереккөзді қосыңыз'],
	'Добавить': ['Add', 'қосу'],

	'Газета успешна попала в систему!': ['The newspaper has successfully entered the system!', 'Газет жүйеге сәтті кірді!'],

	'Убедитесть что все поля заполнены!': ['Make sure all fields are filled in!', 'Барлық өрістер толтырылғанына көз жеткізіңіз!'],
	'Газета уже есть в системе!': ['The newspaper is already in the system!', 'Газет жүйеде қазірдің өзінде бар!'],
	'Данный формат газеты не поддерживается. Пожалуйста, прикрепите газету в виде pdf-файла.': ['This newspaper format is not supported. Please attach the newspaper as a pdf file.', 'Бұл газет пішіміне қолдау көрсетілмейді. Газетті pdf файлы ретінде тіркеңіз.'],
	'Серверная ошибка!': ['Server error!', 'Сервер қатесі!'],

	'Источник успешна попал в систему!': ['The source has successfully entered the system!', 'Дереккөз жүйеге сәтті кірді!'],
	'Попробуйте изменить название источника!': ['Try changing the name of the source!', 'Дереккөздің атын өзгертіп көріңіз!'],
	'Этот источник уже есть в системе!': ['This source is already in the system!', 'Бұл дереккөз жүйеде бұрыннан бар!'],

	'Введите ссылку на источник': ['Enter a link to the source', 'Дереккөзге сілтеме енгізіңіз'],
	'Введите заголовок источника': ['Enter source title', 'Дереккөз атауын енгізіңіз'],
	'Выберите страну': ['Choose the country', 'Елді таңдаңыз'],
	'Выберите регион': ['Choose region', 'Аймақты таңдаңыз'],
	'Выберите город': ['Choose city', 'Қаланы таңдаңыз'],

	'Выберите источник газеты': ['Select newspaper source', 'Газет көзін таңдаңыз'],
	'Добавьте новый источник газеты': ['Add a new newspaper source', 'Жаңа газет көзін қосыңыз'],

};

function getLang() {
    var params = {};

    let tmp_params = window.location.href
        .replace(/\?.*/, "")
        .split("//")
        .join("")
        .split("/");
    for (var p = 0; p < tmp_params.length; p++) {
        var _tmp = tmp_params[p].split("=");

        params[_tmp[0]] = _tmp[1];
    }
    let lang = Object.keys(params)[1];
    return lang;
}
function langIs(lang) {
    return getLang() === lang;
}
console.log(getLang() === 'en');

function getLangIndex() {
    if (langIs("en")) return 0;
    else if (langIs("kz")) return 1;
}

const i18n = (text) => {
    return langIs("ru") ? text : _i18n[text][getLangIndex()];
};

export default i18n;
