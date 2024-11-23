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


// add new event + calculate kai fill ticketColor apo tis 2 function panw
app.post('/newEventA',async(req,res)=>{
    try{
        let totalQuantity = 0;
        let totalRemaining = 0;

        req.body.tickets.forEach(ticket => {
            totalQuantity += ticket.quantity;
            totalRemaining += ticket.remaining;
        });
        let percentageLeft = getPercentage(totalQuantity,totalRemaining);
        let ticketColor = getColor(percentageLeft);
        const event = await Event.create({
            ...req.body, 
            ticketColor, 
        });
        res.status(200).json(event);
    } catch (error) {
        console.log(error.message);
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
        const event = await Event.findByIdAndUpdate(id,req.body);
        if(!event){
            return res.status(404).json({message: `Cannot find event with id ${id}`})
        }
        const updatedEvent = await Event.findById(id);
        res.status(200).json(updatedEvent);
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

// Filter based on location
app.get(`/events/:location`,async(req,res)=>{
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



// change username and password before use 
mongoose.
connect('mongodb+srv://username:password@eventappcluster.l1uub.mongodb.net/?retryWrites=true&w=majority&appName=EventAppCluster')
.then(() => {
    console.log('Connected to MongoDB')
}).catch((error)=>{
    console.log(error)
})
