const fs = require('fs')
const data = require('./filename_nodes_full.json')

const separator = ";"

const name = [
    "Allen","Bob","Carlton",
    "David","Ernie","Foster",
    "George","Howard","Ian",
    "Jeffery","Kenneth","Lawrence",
    "Michael","Nathen","Orson",
    "Peter","Quinten","Reginald",
    "Stephen","Thomas","Morris",
    "Victor","Walter","Xavier",
    "Charles","Anthony","Gordon",
    "Percy","Conrad","Quincey",
    "Armand","Jamal","Andrew",
    "Matthew","Mark","Gerald",

    "Alice","Bonnie","Cassie",
    "Donna","Ethel","Grace",
    "Heather","Jan","Katherine",
    "Julie","Marcia","Patricia",
    "Mabel","Jennifer","Dorthey",
    "Mary Ellen","Jacki","Jean",
    "Betty","Diane","Annette",
    "Dawn","Jody","Karen",
    "Mary Jane","Shannon","Stephanie",
    "Kathleen","Emily","Tiffany",
    "Angela","Christine","Debbie",
    "Karla","Sandy","Marilyn",
    "Brenda","Hayley","Linda"
]

const lastname = [
    "Adams","Bowden","Conway",
    "Darden","Edwards","Flynn",
    "Gilliam","Holiday","Ingram",
    "Johnson","Kraemer","Hunter",
    "McDonald","Nichols","Pierce",
    "Sawyer","Saunders","Schmidt",
    "Schroeder","Smith","Douglas",
    "Ward","Watson","Williams",
    "Winters","Yeager","Ford",
    "Forman","Dixon","Clark",
    "Churchill","Brown","Blum",
    "Anderson","Black","Cavenaugh",
    "Hampton","Jenkins","Prichard"
]

function randomName() {
    const r = Math.floor(Math.random() * lastname.length)
    const i = Math.floor(Math.random() * name.length)
    return name[i] + ' ' +lastname[r]
}

function creteListName(count) {
    arrName = []
    for (let i = 0; i < count; i++) {
        arrName.push(randomName())
    }

    return arrName
}

// function createData(count) {
//     // const arrName = creteListName(count)
//     const arrName = [
//         'Anthony Hampton',    'Mabel Sawyer',
//         'Jan Forman',         'Gordon Douglas',
//         'Gerald Schmidt',     'Mabel Forman',
//         'Debbie Anderson',    'Peter Jenkins',
//         'Thomas Pierce',      'Lawrence Black',
//         'Bob Schmidt',        'Bonnie McDonald',
//         'Percy Holiday',      'Linda Nichols',
//         'Christine Ford',     'Anthony Blum',
//         'Quinten Winters',    'Karla Prichard',
//         'Orson Holiday',      'Jacki Yeager',
//         'Diane Edwards',      'Matthew Pierce',
//         'Diane McDonald',     'Nathen Hunter',
//         'Diane Winters',      'Quincey Yeager',
//         'Morris Jenkins',     'Marilyn Conway',
//         'Mary Jane Anderson', 'Michael Ward'
//     ]
//     console.log(arrName)
//     let arrRes = ['Name']

//     for (let i = 40 ; i <= 109; i++) {
//         arrRes.push(data[i].title)
//     }

//     arrRes = [arrRes.join(separator)]

//     for (let i = 0; i < arrName.length; i++) {
//         let arrStr = [arrName[i]]
//         for (let j = 0; j < 70; j++) {
//             if (Math.random() * 5 < 4) arrStr.push(0)
//             else arrStr.push((Math.random() * 5).toFixed(2))
//         }
//         arrRes.push(arrStr.join(separator))
//     }

//     return arrRes
// }

function createData(count) {
    // const arrName = creteListName(count)
    let arrRes = ['Name']
    const arrName = [
        'Anthony Hampton',    'Mabel Sawyer',
        'Jan Forman',         'Gordon Douglas',
        'Gerald Schmidt',     'Mabel Forman',
        'Debbie Anderson',    'Peter Jenkins',
        'Thomas Pierce',      'Lawrence Black',
        'Bob Schmidt',        'Bonnie McDonald',
        'Percy Holiday',      'Linda Nichols',
        'Christine Ford',     'Anthony Blum',
        'Quinten Winters',    'Karla Prichard',
        'Orson Holiday',      'Jacki Yeager',
        'Diane Edwards',      'Matthew Pierce',
        'Diane McDonald',     'Nathen Hunter',
        'Diane Winters',      'Quincey Yeager',
        'Morris Jenkins',     'Marilyn Conway',
        'Mary Jane Anderson', 'Michael Ward'
    ]

    arrRes = arrName.map(item => item)
    arrRes.unshift('Game')
    arrRes = [arrRes.join(separator)]

    for (let i = 40; i <= 109; i++) {
        let arrStr = [data[i].title]
        for (let j = 0; j < count; j++) {
            if (Math.random() * 5 < 4) arrStr.push(0)
            else arrStr.push((Math.random() * 5).toFixed(2))
        }
        arrRes.push(arrStr.join(separator))
    }

    return arrRes
}

let arrRes = createData(30)

fs.writeFileSync("src/data/user_data.csv", arrRes.join("\n"))
