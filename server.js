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
        // const processedTickets = req.body.tickets.map(ticket => {
        //     return {
        //         ...ticket,
        //         ticketColor // Same color for all tickets in the event                   MALLON USELESS PREPEI NA EMEINE APO PROHGOUMENO TRY CHECK 
        //     };
        // });
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



// change username and password before use 
mongoose.
connect('mongodb+srv://name:password@eventappcluster.l1uub.mongodb.net/?retryWrites=true&w=majority&appName=EventAppCluster')
.then(() => {
    console.log('Connected to MongoDB')
}).catch((error)=>{
    console.log(error)
})