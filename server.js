const express = require('express')
const app = express()
const Event = require('./Models/EventModel')
const mongoose = require('mongoose');

app.use(express.json())



app.listen(3000,()=>{
    console.log(`Running on port 3000`) // TO DELETE 
})


function getPercentage(totalTickets,available){
    if(totalTickets == 0){
        throw new Error(`Total tickets can't be zero. Please check data and try again`);
    }
    const percentageLeft = (available/totalTickets)*100
    return percentageLeft;
}

function getColor(percentageLeft){
    if(percentageLeft == 0){
        return "red"
    }else if(percentageLeft < 20){
        return "orange"
    }else if(percentageLeft < 50){
        return "yellow"
    }else{
        return "green"
    }
}

// xrhsh function gia na mporoume na allzoume xrwma kai sto transaction call

function help(tickets){
    let totalQuantity = 0;
    let totalRemaining = 0;

        tickets.forEach(ticket => {
            totalQuantity += ticket.quantity;
            totalRemaining += ticket.remaining;
        });
        let percentageLeft = getPercentage(totalQuantity,totalRemaining);
        let ticketColor = getColor(percentageLeft);
        return ticketColor;
}


// add new event + calculate kai fill ticketColor apo tis 2 function panw
app.post('/newEventA',async(req,res)=>{
    try{
        const tickets = req.body.tickets;
        let ticketColor = help(tickets)
        const event = await Event.create({
            ...req.body, 
            ticketColor, 
        });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


// gia ta routes twn 2 add new sto telos --> (M gia manually ticketColor) , (A gia auto ticketColor)


//Add new event (prepei na valeis ticketColor manually)
app.post('/newEventM',async(req,res)=>{
    try {
        const event = await Event.create(req.body)
        res.status(200).json(event)
    }catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
}
)

//Delete one event 
app.delete(`/deleteEvent/:id`,async(req,res)=>{
    try{
        const {id} = req.params;
        const event = await Event.findByIdAndDelete(id);
        if(!event){
            res.status(404).json({message: `Unable to find event with id ${id}`})
        }else{
            res.status(200).json(event)
        }
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//Delete all events
app.delete(`/deleteEvents`,async(req,res)=>{
    try {
        const event = await Event.deleteMany({})
        res.status(200).json({message: `All events deleted successfully`})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Update 
app.put('/updateEvent/:id',async(req,res)=>{
    try {
        const {id} = req.params;
        const event = await Event.findByIdAndUpdate(id,req.body, {new: true});
        if(!event){
            return res.status(404).json({message: `Cannot find event with id ${id}`})
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Find all events
app.get('/allEvents',async(req,res)=>{
    try {
        const event = await Event.find({});
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Find one event 
app.get(`/findEvent/:id`,async(req,res)=>{
    try {
        const {id} = req.params;
        const event = await Event.findById(id);
        if(!event){
            res.status(404).json({message:`Cannot find event with ID: ${id}`})
        }else{
            res.status(200).json(event)
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})



                                                // gia diples --> Typika no need giati to app tha einai me gnwsta all its ok i guess
const locationTranslate = {
    "thessaloniki": "ΘΕΣΣΑΛΟΝΙΚΗ",
    "thessalonikh": "ΘΕΣΣΑΛΟΝΙΚΗ",
    "athens": "ΑΘΗΝΑ",
    "larisa": "ΛΑΡΙΣΑ",
    "hrakleio": "ΗΡΑΚΛΕΙΟ",
    "heraklion": "ΗΡΑΚΛΕΙΟ",
    "patra": "ΠΑΤΡΑ",
    "volos": "ΒΟΛΟΣ",
    "ioannina": "ΓΙΑΝΝΕΝΑ",
    "giannena": "ΓΙΑΝΝΕΝΑ",
    "trikala": "ΤΡΙΚΑΛΑ",
    "chalkida": "ΧΑΛΚΙΔΑ",
    "serres": "ΣΕΡΡΕΣ",
    "alexandroupoli": "ΑΛΕΞΑΝΔΡΟΥΠΟΛΗ",
    "xanthi": "ΞΑΝΘΗ",
    "katerini": "ΚΑΤΕΡΙΝΗ",
    "kalamata": "ΚΑΛΑΜΑΤΑ",
    "kavala": "ΚΑΒΑΛΑ",
    "chania": "ΧΑΝΙΑ",
    "lamia": "ΛΑΜΙΑ",
    "komotini": "ΚΟΜΟΤΗΝΗ",
    "rhodes": "ΡΟΔΟΣ",
    "agrinio": "ΑΓΡΙΝΙΟ",
    "drama": "ΔΡΑΜΑ",
    "veria": "ΒΕΡΟΙΑ"
    // TO ADD MORE

};

// Filter based on location me help apo locationTranslate
app.get(`/events/location/:location`,async(req,res)=>{
    try {
        const {location} = req.params; 
        const rightLocation = locationTranslate[location.toLowerCase()];
        if(!rightLocation){
            res.status(404).json({message:`Invalid location: ${location}`})
        }
        const events = await Event.find({location: rightLocation});
        if(!events || events.length == 0){
            res.status(404).json({message:`There are currently no events in ${location}`})
        }else{
            res.status(200).json(events)
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


const typeTranslate = {
    "standupcomedy": "STAND-UP COMEDY",
    "mousikh" : "ΜΟΥΣΙΚΗ",
    "music" : "ΜΟΥΣΙΚΗ",
    "theater" : "ΘΕΑΤΡΟ",
    "theatro" : "ΘΕΑΤΡΟ",
    "artgallery" : "ΕΚΘΕΣΗ ΤΕΧΝΗΣ",
    "football" : "ΠΟΔΟΣΦΑΙΡΟ",
    "podosfairo" : "ΠΟΔΟΣΦΑΙΡΟ",
    "basketball" : "ΜΠΑΣΚΕΤ",
    "mpasket" : "ΜΠΑΣΚΕΤ",
    "volleyball" : "ΒΟΛΕΪ",
    "volley" : "ΒΟΛΕΪ"
    

};


// Filter based on location me help apo typeTranslate
app.get(`/events/type/:eventType`,async(req,res)=>{
    try {
        const {eventType} = req.params;
        const correctType = typeTranslate[eventType.toLowerCase()];
        if(!correctType){
            res.status(404).json({message:`Invalid event type: ${eventType}`})
        }
        const events = await Event.find({eventType: correctType});
        if(!events || events.length == 0){
            res.status(404).json({message:`There are no ${eventType}`})
        }else{
            res.status(200).json(events)
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


//Filter based on custom event
app.get(`/eventByCustomId/:customId`,async(req,res)=>{
    try{
        const {customId} = req.params;
        const event = await Event.find({customId :customId});
        const customIdRegex = /^[a-z]{1}_[a-z]{3}_[a-z]{2,}$/;
        if(!customIdRegex.test(customId)){
            return res.status(400).json({
                message: `${customId} is not a valid customId. Expected format: 1 letter, 3 letters, >1 letter.`
            });
        }
        if(!event || event.length ==0){
            res.status(404).json({message:`Event with id ${customId} does not exist`})
        }else{
            res.status(200).json(event)
        }
    }catch(error){
        res.status(500).json({error: error.message})
    }
})



app.get(`/transaction/:id/:ticketNum/:ticketType`,async(req,res)=>{
    try{
        const {ticketType} = req.params;
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `Invalid event ID format: ${id}` });
        }
        const {ticketNum} = req.params;
        const parsedTicketNum = parseInt(ticketNum, 10);
        if(isNaN(parsedTicketNum) || parsedTicketNum <= 0){
            return res.status(400).json({message: `Invalid number of tickets`});
        }
        const event = await Event.findById(id);
        if(!event || event.length == 0){
            res.status(404).json({message:`Unable to detect event with id:${id}`})
            return;
        }
        let k = false;
        for(let i = 0;i<event.tickets.length;i++){
            if(event.tickets[i].ticketType == ticketType){
                k = true;
            }
        }
        if(!k){
            return res.status(404).json({message: `Unable to detect ticket with ticketType:${ticketType}`})
        }
        if(event.tickets[ticketType].remaining >= parsedTicketNum){
            event.tickets[ticketType].remaining -= parsedTicketNum;
            event.ticketColor = help(event.tickets)
            await event.save();
            return res.status(200).json({message:`Transaction completed. You successfully purchased ${parsedTicketNum} ticket`})
        }else{
            return res.status(400).json({message:`Not enough tickets available.We are sorry!`})
        }
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get(`/`)

// change username and password before use 
mongoose.
connect('mongodb+srv://username:password@eventappcluster.l1uub.mongodb.net/?retryWrites=true&w=majority&appName=EventAppCluster')
.then(() => {
    console.log('Connected to MongoDB')
}).catch((error)=>{
    console.log(error)
})