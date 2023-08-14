const mineflayer = require('mineflayer');

/* Instantiating bot */
const minion = mineflayer.createBot({
    host: 'localhost',  // used for singleplayer (LAN)
    username: 'Bot',   // subject to change??  
    auth: 'offline'
})


/* Need an adjustment in current status 
    Planning on implementing other activities, therefor current activity
    needs to be more descriptive so we know what the bot is doing
    and can stop that specific action only
*/
let busy = false


/* Listener for a chat that is pertaining to the bot */
minion.on('chat', (username, message) => {
    console.log(`${username}: ${message}`)
    if (username == minion.username) return
    //minion.chat(`I saw your message ${username}!`);
    switch (message) {
        case 'start fishing':

            if (busy) return minion.chat("I'm busy!")
            beginFishing()

            break
        case 'eat':

            if (busy) return minion.chat("I'm busy!")
            eat()

            break
        case 'stop fishing':

            //if (busy) return minion.chat("I'm busy!")
            stopFishing()

            break
        case 'list items':

            if (busy) return minion.chat("I'm busy!")
            inventoryCheck()

            break
        case 'exit':

            if (busy) return minion.chat("I'm busy!")

            minion.chat('See you next time!')
            minion.end()

        default:

            minion.chat("I don't understand that message!")

    }

})


/* function written for fishing */
async function beginFishing () {

    /* Equip Rod, if problem chat problem */
    try {
        await minion.equip(minion.registry.itemsByName.fishing_rod.id, 'hand')
    } catch (error) {
        return minion.chat(error.message)
    }

    minion.chat('Fishing')
    busy = true
    minion.on('playerCollect', onCollect)

    /* Do the fishing, if problem chat problem */
    try { 
        await minion.fish()
    } catch (error) {
        minion.chat(error.message)
    }

    busy = false
    
}

/* function to keep fishing going */
function onCollect (player, entity) {
    /* if the thing the minion obtained was a drop, we continue fishing -- filters out other players */
    if(player === minion.entity && entity.type === 'other') {
        minion.chat(`Collected ${entity.name}.`)
        minion.removeListener('playerCollect', onCollect)
        beginFishing()
    }
}

/* function written to stop the fishing */
async function stopFishing () {

    minion.removeListener('playerCollect', onCollect)

    /* if the rod is out pull it in */
    if(busy) {
        minion.activateItem()
    }
}

/* function for making our minion eat, he only eats baked potatos rn */
async function eat () {

    /* equip our baked potatos */
    try {
        await minion.equip(minion.registry.itemsByName.baked_potato.id, 'hand')
    } catch (error) {
        return minion.chat(error.message)
    }

    /* eat them */
    try {
        await minion.consume()
    } catch (error) {
        minion.chat(error.message)
    }

}

/* function to display what the minion has in its inventory */
async function inventoryCheck () {
    /* adding all elements to an object array */
    items = minion.inventory.items()

    /* mapping each objects to count and name and outputting as one message */
    minion.chat(items.map(item =>  {
       return `${item.count} ${item.name}`
    }).join(", "))
        
}

