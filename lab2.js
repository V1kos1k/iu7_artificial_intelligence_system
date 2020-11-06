const data = require('./filename_nodes_full.json')

// эвклидова мера близости
function evklid(id1, id2) {
  let sumEvk = 0
  for (let key in data[id1].signs) {
    if (Number.isInteger(data[id1].signs[key])) {
      sumEvk += Math.pow((data[id1].signs[key] - data[id2].signs[key]), 2)
    }
  }

  return Math.pow(sumEvk, 1/2)
}

function manhet(id1, id2) {
  let sumEvk = 0
  for (let key in data[id1].signs) {
    if (Number.isInteger(data[id1].signs[key])) {
      sumEvk += Math.abs((data[id1].signs[key] - data[id2].signs[key]))
    }
  }

  return sumEvk
}

// рекусивный поиск роодителя от листа к корню запоминая название узлов в массив
// затем находимся первое совпадение в 2х массивах
function search_root(id, path) {
  if (id == 0)
    path.push(id)
  else {
    data.forEach((currentValue, index) => {
      if (currentValue.id == id) {
        path.push(id)
        search_root(currentValue.parent, path)
      }
    })
  }
}

function match_search(path1, path2) {
  for (let i = 0; i < path1.length; i++) 
    for (let j = 0; j < path2.length; j++)
      if (path1[i] == path2[j]) {
        return [i, j]
      }
}


// для 5й лабы при вычислении привести данные с диапозону [0, 10]
// иначе год и рейтинг все портят
function correlation(id1, id2) {
  let avg1 = 0, avg2 = 0, count = 0

  console.log(data[id1], data[id2])
  for (let key in data[id1].signs) {
    if (Number.isInteger(data[id1].signs[key]) && key != 'year_of_manufacture' && key != 'rating') {
      avg1 += data[id1].signs[key]
      avg2 += data[id2].signs[key]
      count++;
    }
  }

  avg1 /= count 
  avg2 /= count 

  let mul_numerator = 0, den_numerator1 = 0, den_numerator2 = 0
  for (let key in data[id1].signs) {
    if (Number.isInteger(data[id1].signs[key]) && key != 'year_of_manufacture' && key != 'rating') {
      mul_numerator += (data[id1].signs[key] - avg1)*(data[id2].signs[key] - avg2)
      den_numerator1 += Math.pow(data[id1].signs[key] - avg1, 2)
      den_numerator2 += Math.pow(data[id2].signs[key] - avg2, 2)
    }
  }

  const res = mul_numerator/Math.pow(den_numerator1*den_numerator2, 1/2)

  return res
}

const nodeID1 = 54
const nodeID2 = 47

const evklid = evklid(nodeID1, nodeID2)
const manhet = manhet(nodeID1, nodeID2)

console.log("эвклидова мера близости", evklid)
console.log("манхэтонская мера близости", manhet)

let pathRoot1 = []
let pathRoot2 = []
search_root(nodeID1, pathRoot1)
search_root(nodeID2, pathRoot2)

const distance = match_search(pathRoot1, pathRoot2)
console.log('Расстояние: ', Number(distance[0]) + Number(distance[1]))

const correlation = correlation(50, 66)
console.log("Корреляция", correlation)