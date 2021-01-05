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

function createData(count) {
    const arrName = creteListName(count)
    let arrRes = ['Name']

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
