#! /usr/bin/env python
# -*- coding: utf-8 -*-

import json
import shlex

filename = 'data.txt'

arr = []

out_file = open("test.json", "w")


with open(filename) as fh: 
    i = 0
    for line in fh:
        arr_parse_line = shlex.split(line)
        if (arr_parse_line[0] == 'node'):
          dict1 = {}
          # 1 бинарный (есть ли онлайн) , 4 коолличественных (воозрастное ограничение, год выпуска, рейтинг, количество игр в серии), 1 не переводимый в число (издатель)
          dict1['title'] = arr_parse_line[1]
          dict1['online'] = False
          dict1['age_restriction'] = 18
          dict1['year_of_manufacture'] = 2018
          dict1['rating'] = 97
          dict1['number_of_games_in_the_series'] = 3
          arr.append(dict1)


json.dump(arr, out_file, indent = 4, sort_keys = False, ensure_ascii=False) 
out_file.close() 
