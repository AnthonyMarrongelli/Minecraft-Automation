import mineflayer from 'mineflayer'

export default class Minion {
    constructor(name, host, auth, port) {
        
        this.bot = mineflayer.createBot({
            username: name,
            host: host,
            auth: auth,
            port: port
        })

        this.busy = ''
        this.init()
    }

    init() {

        /* Listener for a chat that is pertaining to the bot */
        this.bot.on('whisper', (username, message) => {
            console.log(`${username}: ${message}`)
            if (username == this.bot.username) return
            switch (message) {
                case 'start fishing':

                    if (this.busy != '') return this.bot.whisper(username, "I'm busy!")

                    this.bot.whisper(username, 'Going fishing!')
                    this.busy = 'fishing'
                    this.fishingWrapper()

                    break
                case 'eat':

                    if (this.busy != '') return this.bot.whisper(username, "I'm busy!")
                    this.eat(username)

                    break
                case 'stop fishing':

                    if(this.busy != 'fishing') return this.bot.whisper(username, "I'm not fishing!") 
                    this.bot.whisper(username, 'Stopping fishing!')
                    this.busy = ''

                    break
                case 'list items':

                    this.inventoryCheck(username)

                    break
                case 'test fish':

                    this.fishing(username)

                    break
                case 'exit':

                    if (this.busy != '') return this.bot.whisper(username, "I'm busy!")

                    this.bot.whisper(username, 'See you next time!')
                    this.bot.end()

                default:

                    this.bot.whisper(username, "I don't understand that message!")

            }

        })
    }

    /* Wrapper for fishing function to keep from stacking multiple instances of the function */
    async fishingWrapper (username) {
        while(this.busy == 'fishing') {
            await this.goFishing(username)
        }
    }

    /* function written for fishing */
    async goFishing (username) {

        /* Equip Rod, if problem chat problem */
        try {
            await this.bot.equip(this.bot.registry.itemsByName.fishing_rod.id, 'hand')
        } catch (error) {
            return this.bot.bot.whisper(username, error.message)
        }

        /* Do the fishing, if problem chat problem */
        try { 
            await this.bot.fish()
        } catch (error) {
            this.bot.whisper(username, error.message)
        }    
        
    }

 

    /* function for making our minion eat, he only eats fish rn */
    async eat (username) {

        /* equip our fish */
        try {
            await this.bot.equip(this.bot.registry.itemsByName.cod.id, 'hand')
        } catch (error) {
            return this.bot.whisper(username, error.message)
        }

        /* eat them */
        try {
            await this.bot.consume()
        } catch (error) {
            this.bot.whisper(username, error.message)
        }

    }

    /* function to display what the minion has in its inventory */
    async inventoryCheck (username) {
        /* adding all elements to an object array */
        let items = this.bot.inventory.items()

        /* mapping each objects to count and name and outputting as one message */
        this.bot.whisper(username, items.map(item =>  {
            return `${item.count} ${item.name}`
            }).join(", "))
    }

    async fishing(username) {
        while(true) {
            try {
                await this.bot.fish()
            } catch (error) {
                console.log(error)
            } finally {
                console.log('done')
            }
        }
    }

}