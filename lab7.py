import json
import random

import pymorphy2
import re

with open("./games.txt", encoding='utf-8') as file:
    games_title = [row.strip() for row in file]
with open("lab2.json", encoding='utf-8') as json_file:
    games = json.load(json_file)
morph = pymorphy2.MorphAnalyzer()
step = 0
scenarios = -1

attributes = [["title", "название", "\nНапиши название"], ["online", "онлайн", "\nОнлайн или оффлайн?"], ["age_restriction", "возраст", "\nКакой возраст?"], ["year_of_manufacture", "год", "\nНапиши год издания"], ["rating", "рейтинг", "\nКакой рейтинг?"], ["number_of_games_in_the_series", "серия", "\nСколько игр в серии?"], ["publisher", "издатель", "\nНапиши издателя"]]
selected_attributes = ''

def parser(s):
  phrase = re.sub(r'[^\w\s]', '', s.lower()).split()
  norm_phrase = list()
  for word in phrase:
    norm_phrase.append(morph.parse(word)[0].normal_form)
  return norm_phrase

def handle(phrase):
  global step, scenarios, attributes, selected_attributes
  if len(set(phrase) & {'привет', 'добрый', 'приветствовать', 'здравствуй', 'здравствуйте'}) != 0:
    greeting()
    return

  elif len(set(phrase) & {'пока', 'нет'}) != 0:
    print('\nПока!')
    exit(0)

  elif (len(set(phrase) & {'какой', 'вывести', 'показать', 'написать', 'перечислить', 'список'}) != 0
        and len(set(phrase) & {'всё' , 'все', 'перечень', 'каталог', 'список'}) != 0
        and len(set(phrase) & {'игра'}) != 0):
    show_all()
    return

  elif (len(set(phrase) & {'случайный', 'рандомный'}) != 0):
    show_random()
    return

  elif (len(set(phrase) & {'какой', 'вывести', 'показать', 'написать', 'найти', 'подсказать'}) != 0
        and len(set(phrase) & {'игра'}) != 0) or scenarios >= 3:
    if scenarios == -1:
      scenarios = 3

    if step == 0:
      print('\nТы ищешь конкретную игру или по какому-то критерию?')
      string = input()
      string_parser = parser(string)

      if 'конкретный' in string_parser:
        step = 2
        scenarios = 4
        print('\nКак она называется?')
        string = input()
        step = 0
        scenarios = -1

        game = search_game(string)
        if game == -1:
          not_found()
        else:
          print_game(game)
          more()
      elif 'критерий' in string_parser:
        step = 2
        scenarios = 5
        print('\nПо какому критерию?')
      else:
        step = 0
        scenarios = -1

        print(string)
        game = search_game(string)
        print(game)
        if game == -1:
          not_found()
        else:
          print_game(game)
          more()
      return
    elif step == 2:
      if scenarios == 5:
        attr = ''
        for i in range(len(attributes)):
          if attributes[i][1].lower() in set(phrase):
            attr = attributes[i][0]
            selected_attributes = attributes[i][0]
            print(attributes[i][2])
            step = 3
            scenarios = 5
        if attr == '':
          print('\nМмм... не понятно... повтори атрибут еще раз)')
    elif step == 3:
      step = 0
      scenarios = -1

      print_games(phrase)
      more()

  
  else:
    not_found()
    more()

def search_game(phrase):
  for i in range(len(games)):
    if games[i]['title'].lower() == phrase.lower():
      return i
  return -1

def print_game(index):
  print('\nНазвание игры:\t', games[index]['title'])
  print('Это ', 'онлайн ' if games[index]['online'] else 'оффлайн ', 'игра')
  print('Возрастное ограничение:\t', games[index]['age_restriction'])
  print('Год выпуска:\t', games[index]['year_of_manufacture'])
  print('Рейтинг:\t', games[index]['rating'])
  print('Количество игр в серии:\t', games[index]['number_of_games_in_the_series'])
  print('Издатель:\t', games[index]['publisher'])

def print_games(phrase):
  count = 0
  for i in range(len(games)):
    if selected_attributes in ('online'):
      count = 1
      print_game(games[i]['online'])
      print('---------------------\n')

    elif selected_attributes in ('age_restriction', 'year_of_manufacture', 'rating', 'number_of_games_in_the_series'):
      if str(games[i][selected_attributes]) in set(phrase): 
        count = 1
        print_game(i)
        print('---------------------\n')

    elif games[i][selected_attributes].lower() in set(phrase):
      count = 1
      print_game(i)
      print('---------------------\n')
  if count == 0:
    print('\nНичего не смогла найти(((')

def more():
  print('\nМогу ли я еще чем-нибудь помочь?')

def not_found():
  print('\nПрости, я не понимаю, что ты говоришь. Повтори еще раз)')

def greeting():
  print('Привет, чем могу помочь?')

def show_random():
  print_game(random.randint(0, 74))

def show_all():
  print('\nВсе игры о которых мне известно:')
  for game in games_title:
    print(game)

def main():
  p = True
  while p:
    string = input()
    norm_phrase = parser(string)
    handle(norm_phrase)


if __name__ == "__main__":
    main()