import Minion from "./minion.js"

let names = ["Adrian", "Tony", "Ryan", "Evan", "Eric", "Connor", "Lauren", "Sebastian", "Cooper", "Elliot", "Josh"]

for(const name in names) {
    let test = new Minion(names[name], 'localhost', 'offline', '25565')
}