// Конфигурация игры
const TOTAL_DAYS = 3;
const CUSTOMERS_PER_DAY = 3;
const MAX_INGREDIENTS = 7;

// Состояние игры
let currentDay = 1;
let currentCustomerIndex = 0;
let correctDrinks = 0;
let specialDrinks = 0;
let storiesHeard = 0;
let currentDialogStep = 0;
let currentDialogue = [];
let drinkServed = false;
let currentCustomer = null;
let currentDrink = [];
let currentOrder = null;
let currentPreparation = "Нормальный";
let gameState = "bartender_intro";
let dayCorrectDrinks = 0;
let usedCharactersToday = [];
let dayCustomers = [];
let customerState = "normal";
let orderType = "specific";
let lastDrinkSuccess = false;

// База данных персонажей
const characters = {
    jill: {
        name: "Джилл",
        color: "#4cc9f0",
        dayDrinks: {
            1: "Адреналин",
            2: "Бренди", 
            3: "Пунктир"
        },
        dialogues: {
            greeting: [
                "Бармен: Привет, Джилл! Как твои дела?",
                "Джилл: Привет... День был тяжелым, как обычно.",
                "Бармен: Что-нибудь поднимет настроение?"
            ],
            vagueOrder: "Джилл: Мне нужно что-то крепкое...",
            specificOrder: "Джилл: Дай мне [drink], пожалуйста.",
            correct: [
                "Джилл: Отличный напиток! Как раз то, что нужно.",
                "Джилл: Вкусно... Ты действительно знаешь свое дело.",
                "Джилл: Идеально! Этот вкус напоминает мне кое-что...",
                "Бармен: Рад, что понравилось. Всегда стараюсь для постоянных клиентов."
            ],
            special: [
                "Джилл: Вау! Это именно то, что мне было нужно! Ты словно читаешь мои мысли.",
                "Джилл: Невероятно! Этот напиток идеально подходит к моему настроению.",
                "Джилл: Ты настоящий мастер! Это лучшее, что я пил в этом месяце.",
                "Бармен: Спасибо за высокую оценку! Всегда приятно, когда клиенты ценят работу."
            ],
            wrong: [
                "Джилл: Эм... Это не совсем то, что я хотел.",
                "Джилл: Хм... Думаю, я заказал другое.",
                "Джилл: Не то... Но ладно, выпью и это.",
                "Бармен: Извините, в следующий раз обязательно исправлюсь."
            ],
            stories: {
                1: "Джилл: Знаешь, я раньше работала в корпоративной безопасности... Но однажды я увидела, что они делают с людьми, и не смогла больше там оставаться.",
                2: "Джилл: Мы с подругой мечтали уехать отсюда, начать новую жизнь. Но она исчезла в один день. Как будто её и не было.",
                3: "Джилл: Иногда мне кажется, что этот город высасывает из тебя всю душу... Но твой бар - одно из немногих мест, где можно отдохнуть."
            },
            followUp: {
                1: "Бармен: Корпоративная безопасность? Звучит опасно...",
                2: "Бармен: Твоя подруга... что с ней случилось?",
                3: "Бармен: Этот город действительно может быть тяжелым..."
            },
            response: {
                1: "Джилл: Опаснее, чем кажется... Лучше не знать.",
                2: "Джилл: Не знаю... В этом городе люди просто исчезают.",
                3: "Джилл: Да... Но такие места, как твой бар, помогают выжить."
            },
            goodbye: "Джилл: Спасибо за беседу... Мне нужно идти.",
            bartenderGoodbye: "Бармен: Заходи ещё, Джилл. Всегда рад тебя видеть.",
            bartender_thoughts: {
                1: "Интересная клиентка... Кажется, у нее непростая история. Работа в корпоративной безопасности наверняка оставила шрамы.",
                2: "Джилл снова здесь... Ее история о пропавшей подруге заставляет задуматься. В этом городе люди исчезают каждый день.",
                3: "Джилл становится постоянным клиентом. Приятно видеть, что она находит здесь некоторое утешение."
            },
            bartender_wrong_thoughts: [
                "Неловкая ситуация... Надеюсь, Джилл не расстроилась слишком сильно.",
                "Жаль, что не угадал с напитком для Джилл. В следующий раз постараюсь лучше.",
                "Джилл ушла недовольной... Надо быть внимательнее к её предпочтениям."
            ]
        }
    },
    dorothy: {
        name: "Дороти",
        color: "#f72585",
        dayDrinks: {
            1: "Пунктир",
            2: "Сахарное небо",
            3: "Марс"
        },
        dialogues: {
            greeting: [
                "Бармен: Привет, Дороти! Как настроение?",
                "Дороти: Приветик! Сегодня просто замечательно!",
                "Бармен: Рад слышать! Чем угостим?"
            ],
            vagueOrder: "Дороти: Хочу чего-нибудь сладенького!",
            specificOrder: "Дороти: Мне [drink], пожалуйста!",
            correct: [
                "Дороти: О да! Именно это я и хотела!",
                "Дороти: Вкуснятина! Ты лучший бармен в городе!",
                "Дороти: Супер! Настроение сразу поднялось!",
                "Бармен: Всегда приятно готовить для таких позитивных клиентов!"
            ],
            special: [
                "Дороти: Боже! Это невероятно! Ты просто волшебник!",
                "Дороти: ОМГ! Этот напиток просто бомба! Как ты угадал?",
                "Дороти: Вау! Это именно то, что нужно для такого дня как сегодня!",
                "Бармен: Ваша улыбка - лучшая награда для бармена!"
            ],
            wrong: [
                "Дороти: Э-э-э... Это не совсем то, что я ожидала.",
                "Дороти: Хм... Думаю, я хотела что-то другое.",
                "Дороти: Не совсем... Но спасибо в любом случае.",
                "Бармен: Простите, в следующий раз приготовлю что-то получше."
            ],
            stories: {
                1: "Дороти: Я работаю стримером в нейросети... Люди думают, что это легкие деньги, но они не видят, что происходит за кадром.",
                2: "Дороти: Когда-то я мечтала стать певицей... Но в этом городе настоящему искусству нет места, только синтетическое.",
                3: "Дороти: Знаешь, самая страшная вещь в одиночестве - это когда тебя окружают тысячи людей, но никто не видит тебя настоящую."
            },
            followUp: {
                1: "Бармен: Стриминг в нейросети? Это должно быть интересно.",
                2: "Бармен: А почему не стала певицей?",
                3: "Бармен: Одиночество в толпе... знакомое чувство."
            },
            response: {
                1: "Дороти: Интересно, но утомительно... Постоянно нужно быть 'на позитиве'.",
                2: "Дороти: В этом городе искусство умерло. Осталась только коммерция.",
                3: "Дороти: Да... особенно когда все видят только твой образ, а не тебя."
            },
            goodbye: "Дороти: Ладно, нужно бежать на стрим! Пока!",
            bartenderGoodbye: "Бармен: Удачи с трансляцией! Заглядывай ещё!",
            bartender_thoughts: {
                1: "Дороти... За ее яркой внешностью скрывается одинокая душа. Стриминг в нейросети - не такая уж простая работа.",
                2: "Дороти снова здесь. Ее мечты о музыке... Жаль, что в этом городе нет места настоящему искусству.",
                3: "Дороти становится более открытой. Кажется, она начинает доверять этому месту... и мне."
            },
            bartender_wrong_thoughts: [
                "Дороти ушла немного разочарованной... Надо запомнить её вкусы.",
                "Не тот напиток для Дороти. Она такая жизнерадостная, заслуживает лучшего.",
                "Жаль, не угодил Дороти. В следующий раз приготовлю что-то особенное."
            ]
        }
    },
    alma: {
        name: "Альма",
        color: "#7209b7",
        dayDrinks: {
            1: "Горячий бренди",
            2: "Адреналин",
            3: "Лунный свет"
        },
        dialogues: {
            greeting: [
                "Бармен: Добрый вечер, Альма. Как прошел день?",
                "Альма: Вечер... День был долгим.",
                "Бармен: Может, что-нибудь освежающее?"
            ],
            vagueOrder: "Альма: Дайте мне что-нибудь согревающее...",
            specificOrder: "Альма: Я буду [drink].",
            correct: [
                "Альма: Да... Именно это мне и нужно.",
                "Альма: Хороший выбор... Спасибо.",
                "Альма: Подходящий напиток для такого дня...",
                "Бармен: Рад, что смог помочь. Возвращайтесь, когда захочется отдохнуть."
            ],
            special: [
                "Альма: Идеально... Ты словно знал, что мне нужно.",
                "Альма: Это именно то... Спасибо, что понимаешь.",
                "Альма: Потрясающе... Напиток, который лечит душу.",
                "Бармен: Ваши слова многое значат для меня. Спасибо."
            ],
            wrong: [
                "Альма: Не то... Но не важно.",
                "Альма: Думаю, я ошиблась в выборе...",
                "Альма: Не совсем понимаю этот вкус...",
                "Бармен: Приношу извинения. В следующий раз учту ваши предпочтения."
            ],
            stories: {
                1: "Альма: Я была исследователем на окраинах системы... Видела вещи, которые никто не должен видеть.",
                2: "Альма: Корпорации уничтожили мою планету... Они называют это 'прогрессом', но это просто жадность.",
                3: "Альма: Иногда я просыпаюсь ночью и слышу голоса тех, кого мы оставили там, среди звезд..."
            },
            followUp: {
                1: "Бармен: Исследователь... это звучит захватывающе.",
                2: "Бармен: Твоя планета... что с ней случилось?",
                3: "Бармен: Звезды... они кажутся такими далекими отсюда."
            },
            response: {
                1: "Альма: Захватывающе и опасно... Некоторые вещи лучше не видеть.",
                2: "Альма: Они выкачали все ресурсы и оставили пустыню... Во имя прогресса.",
                3: "Альма: Да... но иногда они кажутся ближе, чем этот город."
            },
            goodbye: "Альма: Мне пора... Спасибо.",
            bartenderGoodbye: "Бармен: Береги себя, Альма. Возвращайся.",
            bartender_thoughts: {
                1: "Альма... Загадочная женщина с тяжелым прошлом. Исследователь на окраинах системы - это звучит... опасно.",
                2: "Альма вернулась. Ее история о разрушенной планете... Корпорации действительно не знают границ.",
                3: "Альма становится менее закрытой. Ее истории о звездах заставляют задуматься о нашем месте во вселенной."
            },
            bartender_wrong_thoughts: [
                "Альма приняла напиток стоически, но было видно разочарование...",
                "Не угадал с выбором для Альмы. Её непросто понять.",
                "Альма ушла молча... Наверное, я ошибся с напитком."
            ]
        }
    },
    stella: {
        name: "Стелла",
        color: "#f8961e",
        dayDrinks: {
            1: "Сахарное небо",
            2: "Марс",
            3: "Пунктир"
        },
        dialogues: {
            greeting: [
                "Бармен: Привет, Стелла! Как ты сегодня?",
                "Стелла: Привет! Отлично, как всегда!",
                "Бармен: Что порадуем сегодня?"
            ],
            vagueOrder: "Стелла: Хочу чего-нибудь веселого и яркого!",
            specificOrder: "Стелла: Можно мне [drink]?",
            correct: [
                "Стелла: Вкусно! Как я и любила!",
                "Стелla: Отлично! Сладкое всегда поднимает настроение!",
                "Стелла: Супер! Именно такой вкус я хотела!",
                "Бармен: Всегда рад видеть вашу улыбку!"
            ],
            special: [
                "Стелла: Невероятно! Это самый лучший напиток в моей жизни!",
                "Стелла: Вау! Ты настоящий художник! Этот вкус... божественный!",
                "Стелла: О да! Это именно то, что нужно для полного счастья!",
                "Бармен: Такие отзывы вдохновляют на новые кулинарные эксперименты!"
            ],
            wrong: [
                "Стелла: Э-э-э... Не совсем сладко...",
                "Стелла: Хм... Думала, будет послаще.",
                "Стелла: Не мой вкус... Извини.",
                "Бармен: Постараюсь учесть ваши предпочтения в следующий раз."
            ],
            stories: {
                1: "Стелла: Я выросла в одном из вертикальных городов... Мы никогда не видели настоящего солнца, только голограммы.",
                2: "Стелла: Мои родители продали свои души корпорации, чтобы дать мне 'лучшую жизнь'... Но что в этом лучшего?",
                3: "Стелла: Иногда я крадусь на крыши небоскребов просто чтобы посмотреть на звезды... Они кажутся такими далекими."
            },
            followUp: {
                1: "Бармен: Вертикальные города... интересно, каково это?",
                2: "Бармен: А ты хотела бы другую жизнь?",
                3: "Бармен: Звезды с крыш... должно быть красиво."
            },
            response: {
                1: "Стелла: Как в аквариуме... только вместо воды - бетон и неон.",
                2: "Стелла: Иногда... но эта жизнь - единственная, что я знаю.",
                3: "Стелла: Да... особенно когда удается увидеть настоящие, а не голограммы."
            },
            goodbye: "Стелла: Спасибо! Было очень мило! Пока!",
            bartenderGoodbye: "Бармен: Рад был тебя видеть, Стелла! Заходи ещё!",
            bartender_thoughts: {
                1: "Стелла... Милая девушка, выросшая в искусственном мире. Интересно, видела ли она когда-нибудь настоящее солнце?",
                2: "Стелла снова здесь. Ее родители... Жаль, что они думали, что корпорация даст им лучшую жизнь.",
                3: "Стелла ищет красоту в этом сером городе. Ее походы на крыши за звездами... это трогательно."
            },
            bartender_wrong_thoughts: [
                "Стелла старалась не показывать разочарование, но было заметно...",
                "Не тот напиток для такой жизнерадостной девушки, как Стелла.",
                "Стелла заслуживала более веселого напитка. Жаль, что не угадал."
            ]
        }
    }
};

// База данных напитков с температурой и разным количеством ингредиентов
const drinks = {
    "Адреналин": {
        ingredients: ["Эликсир", "Дерзкая настойка", "Жидкий перец"],
        preparation: "Лёд",
        temperature: "холодный",
        type: "крепкий",
        description: "Заряд энергии для смелых душой"
    },
    "Лунный свет": {
        ingredients: ["Эликсир", "Сироп", "Жидкая мята"],
        preparation: "Фламбирование",
        temperature: "горячий",
        type: "сладкий",
        description: "Нежная сладость с огненным завершением"
    },
    "Пунктир": {
        ingredients: ["Эликсир", "Жидкий перец", "Сияющая шипучка"],
        preparation: "Взболтать",
        temperature: "обычный",
        type: "острый",
        description: "Ритмичный танец вкусов на грани"
    },
    "Сахарное небо": {
        ingredients: ["Сироп", "Дерзкая настойка", "Жидкая мята", "Сияющая шипучка"],
        preparation: "Лёд",
        temperature: "холодный",
        type: "сладкий",
        description: "Мечтательное сочетание сладости и горечи"
    },
    "Марс": {
        ingredients: ["Эликсир", "Жидкий перец", "Сироп", "Дерзкая настойка"],
        preparation: "Нормальный",
        temperature: "обычный",
        type: "сбалансированный",
        description: "Гармония противоположностей в одном бокале"
    },
    "Бренди": {
        ingredients: ["Эликсир", "Эликсир", "Дерзкая настойка"],
        preparation: "Лёд",
        temperature: "холодный",
        type: "очень крепкий",
        description: "Для тех, кто не ищет компромиссов"
    },
    "Горячий бренди": {
        ingredients: ["Эликсир", "Эликсир", "Дерзкая настойка"],
        preparation: "Фламбирование",
        temperature: "горячий",
        type: "очень крепкий",
        description: "Согревающий крепкий напиток"
    },
    "Неоновый взрыв": {
        ingredients: ["Сияющая шипучка", "Жидкая мята", "Сироп", "Эликсир"],
        preparation: "Лёд",
        temperature: "холодный",
        type: "освежающий",
        description: "Энергия неона в каждом глотке"
    },
    "Кибер-кофе": {
        ingredients: ["Эликсир", "Дерзкая настойка", "Сироп", "Жидкий перец"],
        preparation: "Фламбирование",
        temperature: "горячий",
        type: "бодрящий",
        description: "Утренний заряд для кибер-города"
    },
    "Кислотный дождь": {
        ingredients: ["Жидкий перец", "Сияющая шипучка", "Эликсир"],
        preparation: "Взболтать",
        temperature: "обычный",
        type: "острый",
        description: "Взрыв вкуса, как кислотный ливень"
    },
    "Огненный шар": {
        ingredients: ["Эликсир", "Эликсир", "Жидкий перец", "Дерзкая настойка"],
        preparation: "Фламбирование",
        temperature: "горячий",
        type: "очень острый",
        description: "Для настоящих смельчаков"
    },
    "Сладкая мечта": {
        ingredients: ["Сироп", "Сироп", "Эликсир", "Жидкая мята"],
        preparation: "Нормальный",
        temperature: "обычный",
        type: "очень сладкий",
        description: "Мечта сладкоежки"
    }
};

// Напитки по типам для неопределенных заказов
const drinksByType = {
    "крепкий": ["Адреналин", "Бренди", "Горячий бренди"],
    "сладкий": ["Лунный свет", "Сахарное небо", "Сладкая мечта"],
    "острый": ["Пунктир", "Кислотный дождь", "Огненный шар"],
    "освежающий": ["Неоновый взрыв", "Сахарное небо"],
    "бодрящий": ["Кибер-кофе", "Адреналин"],
    "согревающее": ["Горячий бренди", "Огненный шар", "Лунный свет", "Кибер-кофе"],
    "веселый": ["Сахарное небо", "Неоновый взрыв", "Сладкая мечта"],
    "холодный": ["Адреналин", "Сахарное небо", "Неоновый взрыв", "Бренди"],
    "горячий": ["Лунный свет", "Горячий бренди", "Кибер-кофе", "Огненный шар"]
};

// Типы заказов для неопределенных запросов
const orderTypesMapping = {
    "крепкое": "крепкий",
    "крепкий": "крепкий", 
    "сладкое": "сладкий",
    "сладкий": "сладкий",
    "острое": "острый",
    "острый": "острый",
    "освежающее": "освежающий",
    "освежающий": "освежающий",
    "бодрящее": "бодрящий",
    "бодрящий": "бодрящий",
    "согревающее": "согревающее",
    "горячее": "горячий",
    "холодное": "холодный"
};

// Ингредиенты с описаниями
const ingredients = [
    { name: "Эликсир", color: "#ffffff", description: "Делает напиток крепким" },
    { name: "Сироп", color: "#ff6b9d", description: "Добавляет сладость" },
    { name: "Дерзкая настойка", color: "#8b0000", description: "Дает горьковатый вкус" },
    { name: "Жидкий перец", color: "#ff4500", description: "Добавляет остроту" },
    { name: "Жидкая мята", color: "#98fb98", description: "Освежает и успокаивает" },
    { name: "Сияющая шипучка", color: "#00ff00", description: "Добавляет энергичности" }
];

// Мысли бармена
const bartenderDayThoughts = {
    1: [
        "Начало новой недели... Время вливаться в работу.",
        "Город просыпается, а значит скоро появятся первые клиенты.",
        "Интересно, какие истории я услышу сегодня..."
    ],
    2: [
        "Второй день работы... Вчера было интересно.",
        "Надеюсь, сегодняшние клиенты будут такими же интересными."
    ],
    3: [
        "Последний день недели... Уже столько всего произошло.",
        "Интересно, какие истории я услышу сегодня."
    ]
};

// Итоги дня
const dayResults = {
    perfect: [
        "Отличный день! Все клиенты остались довольны.",
        "Сегодня я был в ударе - ни одной ошибки!",
        "Идеальная смена. Надеюсь, завтра будет так же хорошо."
    ],
    good: [
        "Неплохой день. Большинство клиентов ушли довольными.",
        "Сегодня были небольшие ошибки, но в целом хорошо.",
        "Нормальная смена. Есть над чем поработать, но результат неплохой."
    ],
    bad: [
        "Сегодня был не мой день... Слишком много ошибок.",
        "Нужно быть внимательнее. Многие клиенты ушли недовольными.",
        "Плохая смена. Завтра нужно исправиться."
    ]
};

// Основные функции игры
function startGame() {
    console.log("Запуск игры...");
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('tutorial-screen').style.display = 'block';
    initTutorial();
}

function initTutorial() {
    document.getElementById('tutorial-character-sprite').style.backgroundColor = "#4cc9f0";
    document.getElementById('tutorial-instructions').addEventListener('click', function() {
        this.classList.toggle('collapsed');
    });
    document.getElementById('tutorial-next-btn').addEventListener('click', startMainGame);
}

function startMainGame() {
    document.getElementById('tutorial-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    initGame();
}

function initGame() {
    createIngredientsGrid();
    updateRecipesList();
    updateProgress();
    updateDayInfo();
    setupEventListeners();
    startDayIntro();
}

function setupEventListeners() {
    document.getElementById('next-dialog-btn').addEventListener('click', showCurrentDialog);
    document.getElementById('serve-btn').addEventListener('click', serveDrink);
    document.getElementById('clear-btn').addEventListener('click', clearDrink);
    document.getElementById('restart-btn').addEventListener('click', function() {
        location.reload();
    });
    
    document.querySelectorAll('.prep-action').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            if (action === 'ice') addPreparation('Лёд');
            if (action === 'flame') addPreparation('Фламбирование');
            if (action === 'shake') addPreparation('Взболтать');
        });
    });
    
    document.getElementById('instructions').addEventListener('click', function() {
        this.classList.toggle('collapsed');
    });
}

function startDayIntro() {
    currentCustomer = null;
    gameState = "bartender_intro";
    currentDialogStep = 0;
    dayCorrectDrinks = 0;
    usedCharactersToday = [];
    dayCustomers = [];
    
    showBartenderCharacter();
    currentDialogue = bartenderDayThoughts[currentDay] || bartenderDayThoughts[1];
    showCurrentDialog();
}

function showBartenderCharacter() {
    document.getElementById('character-sprite').style.backgroundColor = "#4cc9f0";
    document.getElementById('character-name').textContent = "Бармен";
    document.getElementById('customer-satisfaction').textContent = "...";
    document.getElementById('customer-satisfaction').style.color = "#e6e6e6";
}

function showCurrentDialog() {
    const dialogText = document.getElementById('dialog-text');
    const thoughtsElement = document.getElementById('bartender-thoughts');
    const nextBtn = document.getElementById('next-dialog-btn');
    const satisfactionElement = document.getElementById('customer-satisfaction');
    
    if (currentDialogStep < currentDialogue.length) {
        if (gameState === "day_statistics") {
            dialogText.innerHTML = currentDialogue[currentDialogStep];
        } else {
            dialogText.textContent = currentDialogue[currentDialogStep];
        }
        currentDialogStep++;
        
        // Меняем текст кнопки в зависимости от состояния
        if (gameState === "day_results") {
            nextBtn.textContent = "Завершить день";
        } else if (gameState === "day_statistics" && currentDay < TOTAL_DAYS) {
            nextBtn.textContent = "Начать следующий день";
        } else if (gameState === "day_statistics" && currentDay === TOTAL_DAYS) {
            nextBtn.textContent = "Далее";
        } else {
            nextBtn.textContent = "Далее →";
        }
    } else {
        handleDialogComplete();
    }

    // Обновляем заказ когда клиент сделал его
    if (gameState === "customer_order") {
        if (orderType === "specific") {
            const drink = drinks[currentOrder.drink];
            const tempSymbol = drink.temperature === "холодный" ? " ❄️" : drink.temperature === "горячий" ? " 🔥" : "";
            document.getElementById('current-order').textContent = `${currentOrder.drink} - ${drinks[currentOrder.drink].type}${tempSymbol}`;
            thoughtsElement.style.display = 'block';
            thoughtsElement.textContent = `Клиент точно знает, что хочет - ${currentOrder.drink}. ${customerState === "sad" ? "Выглядит грустным, возможно, дополнительный Эликсир или Сироп поднимет настроение." : customerState === "excited" ? "Выглядит взбудораженным, освежающий ингредиент поможет успокоиться." : ""}`;
        } else {
            const possibleDrinks = drinksByType[currentOrder.drinkType] || [currentOrder.drink];
            const tempSymbol = drinks[currentOrder.drink].temperature === "холодный" ? " ❄️" : drinks[currentOrder.drink].temperature === "горячий" ? " 🔥" : "";
            document.getElementById('current-order').textContent = `Любой ${currentOrder.drinkType} напиток${tempSymbol}`;
            thoughtsElement.style.display = 'block';
            thoughtsElement.textContent = `Клиент не уверен в выборе. Подойдут: ${possibleDrinks.join(', ')}. ${customerState === "sad" ? "Выглядит грустным, возможно, дополнительный Эликсир или Сироп поднимет настроение." : customerState === "excited" ? "Выглядит взбудораженным, освежающий ингредиент поможет успокоиться." : ""}`;
        }
    } else {
        // Подсказка бармена исчезает только после подачи напитка
        if (gameState !== "customer_welcome" && gameState !== "drink_served") {
            thoughtsElement.style.display = 'none';
        }
        if (gameState !== "customer_welcome" && gameState !== "drink_served") {
            document.getElementById('current-order').textContent = "Ожидаем заказ...";
        }
    }

    // Обновляем поле удовлетворения клиента
    if (gameState === "drink_served" || gameState === "story" || gameState === "goodbye") {
        const result = checkRecipe();
        if (result.success) {
            if (result.special) {
                satisfactionElement.textContent = "✨ В восторге";
                satisfactionElement.style.color = "#9d4edd";
            } else {
                satisfactionElement.textContent = "✓ Доволен";
                satisfactionElement.style.color = "#4ade80";
            }
        } else {
            satisfactionElement.textContent = "✗ Недоволен";
            satisfactionElement.style.color = "#e94560";
        }
    } else if (gameState === "customer_welcome") {
        satisfactionElement.textContent = "⏳ Ожидает напиток";
        satisfactionElement.style.color = "#e6e6e6";
    } else {
        satisfactionElement.textContent = "...";
        satisfactionElement.style.color = "#e6e6e6";
    }
}

function handleDialogComplete() {
    const nextBtn = document.getElementById('next-dialog-btn');
    
    switch(gameState) {
        case "bartender_intro":
            nextCustomer();
            break;
        case "customer_greeting":
            gameState = "customer_order";
            orderType = Math.random() < 0.5 ? "specific" : "vague";
            if (orderType === "specific") {
                currentDialogue = [currentCustomer.dialogues.specificOrder.replace("[drink]", currentOrder.drink)];
            } else {
                currentDialogue = [currentCustomer.dialogues.vagueOrder];
                // Определяем тип напитка по запросу клиента
                const vagueOrderText = currentCustomer.dialogues.vagueOrder.toLowerCase();
                let foundType = "крепкий"; // по умолчанию
                
                for (const [key, value] of Object.entries(orderTypesMapping)) {
                    if (vagueOrderText.includes(key)) {
                        foundType = value;
                        break;
                    }
                }
                
                currentOrder.drinkType = foundType;
                // Выбираем случайный напиток этого типа для проверки рецепта
                const possibleDrinks = drinksByType[foundType];
                if (possibleDrinks && possibleDrinks.length > 0) {
                    currentOrder.drink = possibleDrinks[Math.floor(Math.random() * possibleDrinks.length)];
                }
            }
            currentDialogStep = 0;
            showCurrentDialog();
            break;
        case "customer_order":
            gameState = "customer_welcome";
            nextBtn.style.display = 'none';
            break;
        case "drink_served":
            const result = checkRecipe();
            lastDrinkSuccess = result.success;
            
            if (result.success) {
                gameState = "story";
                currentDialogue = [
                    currentCustomer.dialogues.stories[currentDay],
                    currentCustomer.dialogues.followUp[currentDay],
                    currentCustomer.dialogues.response[currentDay]
                ];
                storiesHeard++;
            } else {
                gameState = "goodbye";
                currentDialogue = [currentCustomer.dialogues.goodbye];
            }
            currentDialogStep = 0;
            showCurrentDialog();
            break;
        case "story":
            gameState = "goodbye";
            currentDialogue = [
                currentCustomer.dialogues.goodbye,
                currentCustomer.dialogues.bartenderGoodbye
            ];
            currentDialogStep = 0;
            showCurrentDialog();
            break;
        case "goodbye":
            gameState = "bartender_after_customer";
            currentDialogStep = 0;
            showBartenderCharacter();
            if (lastDrinkSuccess) {
                currentDialogue = [
                    currentCustomer.dialogues.bartender_thoughts[currentDay]
                ];
            } else {
                const wrongThoughts = currentCustomer.dialogues.bartender_wrong_thoughts || [
                    "Неловко вышло... Надеюсь, клиент вернётся.",
                    "Жаль, что не угодил... В следующий раз постараюсь лучше.",
                    "Не самый удачный заказ... Надо быть внимательнее к пожеланиям клиентов."
                ];
                currentDialogue = [wrongThoughts[Math.floor(Math.random() * wrongThoughts.length)]];
            }
            showCurrentDialog();
            break;
        case "bartender_after_customer":
            currentCustomerIndex++;
            if (currentCustomerIndex < CUSTOMERS_PER_DAY) {
                nextCustomer();
            } else {
                showDayResults();
            }
            break;
        case "day_results":
            showDayStatistics();
            break;
        case "day_statistics":
            currentDay++;
            currentCustomerIndex = 0;
            updateDayInfo();
            if (currentDay > TOTAL_DAYS) {
                showEnding();
            } else {
                startDayIntro();
            }
            break;
    }
}

function nextCustomer() {
    const availableCharacters = Object.keys(characters).filter(char => 
        !usedCharactersToday.includes(char)
    );
    
    if (availableCharacters.length === 0) {
        showDayResults();
        return;
    }

    const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    currentCustomer = characters[randomCharacter];
    usedCharactersToday.push(randomCharacter);
    
    // Определяем состояние клиента
    customerState = Math.random() < 0.3 ? (Math.random() < 0.5 ? "sad" : "excited") : "normal";
    
    const orderedDrink = currentCustomer.dayDrinks[currentDay];
    currentOrder = {
        drink: orderedDrink,
        hint: drinks[orderedDrink].type
    };

    gameState = "customer_greeting";
    currentDialogStep = 0;
    drinkServed = false;
    
    document.getElementById('character-sprite').style.backgroundColor = currentCustomer.color;
    document.getElementById('character-name').textContent = currentCustomer.name;
    document.getElementById('customer-satisfaction').textContent = "...";
    currentDialogue = currentCustomer.dialogues.greeting;
    
    clearDrink();
    showCurrentDialog();
}

function showDayResults() {
    gameState = "day_results";
    currentDialogStep = 0;
    
    const successRate = (dayCorrectDrinks / CUSTOMERS_PER_DAY) * 100;
    let results;
    
    if (successRate === 100) {
        results = dayResults.perfect;
    } else if (successRate >= 50) {
        results = dayResults.good;
    } else {
        results = dayResults.bad;
    }
    
    showBartenderCharacter();
    currentDialogue = [
        "Похоже, клиентов на сегодня не будет, нужно закрывать смену.",
        ...results
    ];
    
    showCurrentDialog();
}

function showDayStatistics() {
    gameState = "day_statistics";
    currentDialogStep = 0;
    
    let statsHTML = '<div class="day-stats">';
    statsHTML += '<h3>Статистика за день ' + currentDay + '</h3>';
    statsHTML += '<div class="day-stat-item">';
    statsHTML += '<strong>Правильных напитков:</strong> ' + dayCorrectDrinks + ' из ' + CUSTOMERS_PER_DAY;
    statsHTML += '</div>';
    statsHTML += '<div class="day-stat-item">';
    statsHTML += '<strong>Собранных историй:</strong> ' + dayCustomers.filter(c => c.storyHeard).length + ' из ' + dayCustomers.length;
    statsHTML += '</div>';
    statsHTML += '<div class="day-stat-item">';
    statsHTML += '<strong>Обслужено клиентов:</strong>';
    
    dayCustomers.forEach(customer => {
        let statusClass = 'status-wrong';
        let statusText = '✗ Ошибка';
        
        if (customer.status === 'correct') {
            statusClass = 'status-correct';
            statusText = '✓ Правильно';
        } else if (customer.status === 'special') {
            statusClass = 'status-special';
            statusText = '✨ Идеально';
        }
        
        statsHTML += '<div class="day-stat-customer">';
        statsHTML += '<span>' + customer.name + '</span>';
        statsHTML += '<span class="customer-status ' + statusClass + '">' + statusText + '</span>';
        statsHTML += '</div>';
    });
    
    statsHTML += '</div></div>';
    
    showBartenderCharacter();
    currentDialogue = [statsHTML];
    showCurrentDialog();
}

function createIngredientsGrid() {
    const grid = document.getElementById('ingredients-grid');
    grid.innerHTML = '';
    
    ingredients.forEach(ingredient => {
        const div = document.createElement('div');
        div.className = 'ingredient';
        div.setAttribute('data-color', ingredient.color);
        div.innerHTML = `
            <div class="ingredient-name">${ingredient.name}</div>
            <div class="ingredient-desc">${ingredient.description}</div>
        `;
        div.addEventListener('click', () => addIngredient(ingredient));
        grid.appendChild(div);
    });
}

function addIngredient(ingredient) {
    if (drinkServed || currentDrink.length >= MAX_INGREDIENTS) return;
    
    currentDrink.push(ingredient.name);
    updateDrinkVisual();
    updateCurrentComposition();
}

function addPreparation(prep) {
    if (drinkServed) return;
    
    currentPreparation = prep;
    updateCurrentComposition();
}

function updateDrinkVisual() {
    const glass = document.getElementById('drink-glass');
    glass.innerHTML = '';
    
    if (currentDrink.length === 0) {
        glass.innerHTML = '<div style="color: #666; text-align: center;">Бокал пуст</div>';
        return;
    }
    
    currentDrink.forEach((ingredient, index) => {
        const ing = ingredients.find(i => i.name === ingredient);
        if (ing) {
            const layer = document.createElement('div');
            layer.className = 'liquid-layer';
            layer.style.backgroundColor = ing.color;
            layer.style.height = `${80 / currentDrink.length}px`;
            layer.style.opacity = (1 - index * 0.1).toString();
            glass.appendChild(layer);
        }
    });
}

function updateCurrentComposition() {
    const compositionElement = document.getElementById('current-composition');
    let composition = "Состав: ";
    
    if (currentDrink.length > 0) {
        composition += currentDrink.join(' + ');
        if (currentPreparation !== "Нормальный") {
            composition += ` → ${currentPreparation}`;
        }
    } else {
        composition += "пусто";
    }
    
    compositionElement.textContent = composition;
}

function clearDrink() {
    currentDrink = [];
    currentPreparation = "Нормальный";
    updateDrinkVisual();
    updateCurrentComposition();
}

function serveDrink() {
    if (currentDrink.length === 0 || drinkServed) return;

    const result = checkRecipe();
    
    drinkServed = true;
    
    // Очищаем бокал и показываем эмодзи
    const glass = document.getElementById('drink-glass');
    glass.innerHTML = '<div class="glass-icon">🍸</div>';
    
    // Скрываем подсказку бармена после подачи напитка
    document.getElementById('bartender-thoughts').style.display = 'none';
    
    // Сохраняем информацию о клиенте дня
    dayCustomers.push({
        name: currentCustomer.name,
        status: result.special ? 'special' : result.success ? 'correct' : 'wrong',
        storyHeard: result.success
    });
    
    if (result.success) {
        correctDrinks++;
        dayCorrectDrinks++;
        if (result.special) {
            specialDrinks++;
            currentDialogue = [currentCustomer.dialogues.special[Math.floor(Math.random() * currentCustomer.dialogues.special.length)]];
        } else {
            currentDialogue = [currentCustomer.dialogues.correct[Math.floor(Math.random() * currentCustomer.dialogues.correct.length)]];
        }
    } else {
        currentDialogue = [currentCustomer.dialogues.wrong[Math.floor(Math.random() * currentCustomer.dialogues.wrong.length)]];
    }
    
    gameState = "drink_served";
    currentDialogStep = 0;
    document.getElementById('next-dialog-btn').style.display = 'block';
    showCurrentDialog();
    updateProgress();
}

function checkRecipe() {
    const targetDrink = drinks[currentOrder.drink];
    const targetIngredients = targetDrink.ingredients;
    
    // Для неопределенных заказов проверяем любой подходящий напиток
    if (orderType === "vague") {
        const possibleDrinks = drinksByType[currentOrder.drinkType] || [currentOrder.drink];
        let success = false;
        let special = false;
        
        for (const drinkName of possibleDrinks) {
            const drink = drinks[drinkName];
            const currentDrinkCopy = [...currentDrink];
            const hasAllIngredients = drink.ingredients.every(ingredient => {
                const index = currentDrinkCopy.indexOf(ingredient);
                if (index > -1) {
                    currentDrinkCopy.splice(index, 1);
                    return true;
                }
                return false;
            });
            
            const preparationMatch = currentPreparation === drink.preparation;
            
            if (hasAllIngredients && preparationMatch) {
                success = true;
                // Проверка специального ингредиента - только если у клиента есть особое состояние
                const hasSpecialIngredient = checkSpecialIngredient();
                special = hasSpecialIngredient && (customerState === "sad" || customerState === "excited");
                break;
            }
        }
        
        return { success: success, special: special };
    }
    
    // Для конкретных заказов проверяем точный рецепт
    const currentDrinkCopy = [...currentDrink];
    const hasAllIngredients = targetIngredients.every(ingredient => {
        const index = currentDrinkCopy.indexOf(ingredient);
        if (index > -1) {
            currentDrinkCopy.splice(index, 1);
            return true;
        }
        return false;
    });
    
    const preparationMatch = currentPreparation === targetDrink.preparation;
    const success = hasAllIngredients && preparationMatch;
    
    // Проверка специального ингредиента - только если у клиента есть особое состояние
    const hasSpecialIngredient = checkSpecialIngredient();
    const special = success && hasSpecialIngredient && (customerState === "sad" || customerState === "excited");
    
    return { 
        success: success,
        special: special
    };
}

function checkSpecialIngredient() {
    if (customerState === "sad") {
        return currentDrink.includes("Эликсир") || currentDrink.includes("Сироп");
    } else if (customerState === "excited") {
        return currentDrink.includes("Жидкая мята") || currentDrink.includes("Сияющая шипучка");
    }
    return false;
}

function updateRecipesList() {
    const recipesList = document.getElementById('recipes-list');
    recipesList.innerHTML = '';
    
    Object.entries(drinks).forEach(([name, info]) => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'drink-recipe';
        const prepText = info.preparation !== "Нормальный" ? ` → ${info.preparation}` : '';
        const tempSymbol = info.temperature === "холодный" ? " ❄️" : info.temperature === "горячий" ? " 🔥" : "";
        recipeDiv.innerHTML = `
            <strong>${name}</strong>: ${info.ingredients.join(' + ')}${prepText}
            <div class="drink-description">${info.type} - ${info.description}${tempSymbol}</div>
        `;
        recipesList.appendChild(recipeDiv);
    });
}

function updateDayInfo() {
    document.getElementById('day-info').textContent = `День ${currentDay} из ${TOTAL_DAYS}`;
}

function updateProgress() {
    const totalStories = TOTAL_DAYS * CUSTOMERS_PER_DAY;
    document.getElementById('story-progress').textContent = 
        `День: ${currentDay}/${TOTAL_DAYS} | Клиенты: ${currentCustomerIndex}/${CUSTOMERS_PER_DAY} | Историй: ${storiesHeard}/${totalStories}`;
}

function showEnding() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('end-screen').style.display = 'flex';
    
    const totalCustomers = TOTAL_DAYS * CUSTOMERS_PER_DAY;
    const successRate = (correctDrinks / totalCustomers) * 100;
    document.getElementById('ending-stats').textContent = 
        `Статистика: ${correctDrinks}/${totalCustomers} правильных напитков (${successRate.toFixed(0)}%) | ${storiesHeard}/${totalCustomers} историй | ${specialDrinks} специальных приготовлений`;
    
    if (specialDrinks === totalCustomers && storiesHeard === totalCustomers) {
        document.getElementById('ending-title').textContent = "ЛЕГЕНДАРНЫЙ БАРМЕН";
        document.getElementById('ending-text').textContent = "Вы не просто приготовили все напитки правильно - вы почувствовали души своих клиентов. Каждый дополнительный ингредиент был идеальным жестом заботы. Вы услышали все истории и помогли каждому клиенту. Ваш бар стал легендой города!";
    } else if (successRate === 100 && storiesHeard === totalCustomers) {
        document.getElementById('ending-title').textContent = "МАСТЕР СВОЕГО ДЕЛА";
        document.getElementById('ending-text').textContent = "Идеальная неделя! Все клиенты получили именно то, что заказывали и рассказали все свои истории. Ваш бар славится надежностью и качеством. Вы доказали, что являетесь настоящим профессионалом!";
    } else if (successRate >= 50) {
        document.getElementById('ending-title').textContent = "НАДЕЖНЫЙ БАРМЕН";
        document.getElementById('ending-text').textContent = "Хорошая работа! Большинство клиентов остались довольны. Кое-где были небольшие ошибки, но в целом вы справились хорошо. Бар продолжает работать, клиенты возвращаются.";
    } else {
        document.getElementById('ending-title').textContent = "НОВИЧОК";
        document.getElementById('ending-text').textContent = "Эта неделя была не самой удачной... Слишком много ошибок в заказах. Клиенты уходили недовольными. Возможно, стоит повторить рецепты и больше практиковаться. Каждый мастер когда-то начинал - не сдавайтесь!";
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-btn').addEventListener('click', startGame);
});