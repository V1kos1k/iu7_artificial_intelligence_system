# Artificial Intelligence System

BMSTU AIS course (2020)

Bauman Moscow State Technical University

## Как запустить

Установить необходимые пакеты

```
npm i
```

Запустить

```
nmp start
```

## Описание данных

Часть данных для лабораторной сгенерированны с помощью файла `app/src/data/create_data_user.js`

- Имя пользователя генерируется случайным образом из предложенных имен и фамилий

- Оценка пользователей – случайное число в диапазоне [0, 5), используется разреженная матрица

Данные для лабораторной представлены в виде массива объектов, в котором 1е свойство – имя пользователя {Name: 'Mark Smith'}, остальные впредставленны в виде {Название_игры: оценка}.

Полученные после генерации данных массив находится в файле `app/src/data/user_data.csv`, однако для использования его необходимо преобразовать в файл json `app/src/data/user_data.json`

## Описание алгоритма контент-ориентированной фильтрации

- Определяется текущая игра
- Определяется корреляция оценок игр с оценками текущей игры
- Отсекаются игры с неположительной оценкой корреляции оценок
- Для каждого пользователя определяется средняя оценка игр
- Определяются оценки игр, для этого создается вектор оценок игры с учетом вычета для каждого пользователя его средней оценки
- Выводятся лучшие совпадения

## Пример работы

![](https://sun9-55.userapi.com/impf/Fp1xrR_CyjMjWWZTMaqrtvZaasAGvAgRwPfbJw/rd3vP_ZZoJg.jpg?size=2560x1394&quality=96&proxy=1&sign=2ba3c301916b862e58bd8cd4773cf245&type=album)

![](https://sun9-30.userapi.com/impf/OHZyvxHDa_FP3lfd13gb2kCOc32s7z1eqk7VhQ/fsYoqQk5G9M.jpg?size=2560x1383&quality=96&proxy=1&sign=82ef94e2b6a96be9aa2bcaac07977f1f&type=album)

![](https://sun9-74.userapi.com/impf/AG2FPUm10WX6Z4v7EdbvmBmBReENQULRq9TBjw/NFMOYQQE-9U.jpg?size=2560x1399&quality=96&proxy=1&sign=2c557396585e6241f99f8c5608a82c08&type=album)
