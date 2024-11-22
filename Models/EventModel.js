const mongoose = require('mongoose')

const eventSchema = mongoose.Schema(
    {
        eventType:{
            type:String,
            required:true
        },
        artist: {
            type: String,
            required:true
        },
        location:{
            type: String,
            required:true,
        },
        date:{
            type:String,
            required: true
        },
        startTime: {
            type:String,
            required: true
        },
        venue: {
            type:String,
            required:true
        },
        venueLink: {
            type:String,
            required:false
        },
        availability:{
            type: Boolean,
            required:true,
        },
        // Ποσα διαφορετικά εισιτήρια έχει το event ( πχ απλο,αρένα,vip κλπ)
        ticketTypes:{
            type:Number,
            required: false,
            default: 1
        },
        tickets:[
            {   
                ticketType:{
                    type:Number,
                    required:false,
                    default: 0
                },
                ticketName:{
                    type: String,
                    required:false,
                },
                price:{
                    type:Number,
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true
                },
                remaining:{
                    type:Number,
                    required:true
                }


            }

        ],
        length:{
            type:String,
            required:true
        },
        // Μικρό κείμενο για τον καλλιτέχνη/παράσταση και το event
        eventPromo:{
            type:String,
            required:true
        },
        diorganwthsName:{
            type:String,
            required: true
        },
        // kokkino = sold out , portokali = sxedon sold out , kitrino = den paizei agxos yparxoyn tickets , prasino = sxedon ola apoylhta paei apato to event
        ticketColor:{
            type:String,
            required:true
        }

    },
    {
        timestamps: true
    }
)
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
