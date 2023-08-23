import mineflayer from 'mineflayer'

export class Minion {

    constructor(name, host, auth, port) {

        this = mineflayer.createBot({
            username: name,
            host: host,
            auth: auth,
            port: port
        })
    }
}