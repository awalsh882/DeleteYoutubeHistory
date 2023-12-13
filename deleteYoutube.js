const ENABLED = false // Keep this false while testing to verify that it's working correctly
const DELETE_INTERVAL = 1000 // Amount of time in MS to wait between deletion (more likely to fail with a small number)


// This filter should return a boolean (true == delete video, false == keep video)
const MIN_DURATION_MS = 1000 * 60 * 1.5 // 1:30 mins
const SHOULD_DELETE = videoElement => {
    try {
        // Get the duration string
        const durationString = videoElement.querySelector('[aria-label="Video duration"]').textContent.trim()
        if(durationString.split(':').length > 2){ return false } // The video is > 1hr long
        const [mins, secs] = durationString.split(':').map(stringNum => parseInt(stringNum, 10))
        const durationMS = (mins * 60 * 1000) + (secs * 1000)

        // Return true if video is less than MIN_DURATION_MS in length
        return durationMS < MIN_DURATION_MS
    } catch(e){
        return false
    }
}


// This will start up the script
let DELETE_OFFSET = 0 // Offset to keep track of skipped (non-deleted) videos
deleteNext(SHOULD_DELETE) // Pass in the shouldDelete filter function


// Delete the next bad item and wait [DELETE_INTERVAL]ms before proceeding
// This is recursive and never-ending
async function deleteNext(shouldDelete){

    // Extract next item from page
    const nextItem = await getNextItem(DELETE_OFFSET)

    // If video does not pass filter, skip it, increment the offset
    if(!shouldDelete(nextItem)){
        DELETE_OFFSET += 1
        return deleteNext(shouldDelete)
    }

    // Find name and author of video & log it to console
    try {
        const [videoName, channelName] = [...nextItem.getElementsByTagName('a')].map(anchor => anchor.textContent.trim())
        console.log(`DELETE: ${videoName} by ${channelName}...`)
    } catch(e){}

    // Find the next menu button for the item & click it
    const nextButton = nextItem.getElementsByTagName('button')[0]
    nextButton.click()

    // Wait [DELETE_INTERVAL] ms
    setTimeout(() => {

        // Get the next delete button on the page & click it
        const nextMenu = nextItem.querySelector('[aria-label="Activity options menu"]')
        const nextDeleteButton = nextMenu.querySelector('[aria-label="Delete activity item"]')
        
        // If enabled, click delete button, else just increment offset
        if(ENABLED) nextDeleteButton.click()
        else DELETE_OFFSET += 1

        // Recurse
        deleteNext(shouldDelete)

    }, DELETE_INTERVAL)
}

async function getNextItem(offset){
    while(true){
        const nextItem = document.querySelectorAll('div[role="listitem"]')[offset]
        if(nextItem) return nextItem
        await sleep(200)
    }
}

async function sleep(ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
