const mongoose = require('mongoose')

const eventSchema = mongoose.Schema(
    {  
        
        eventType:{
            type:String,
            required:true
        },
        name:{
            type: String,
            required:false // gia theatrikes parastaseis klp
        },
        artist: {   // se periptwsh opou yparxei cast artist = prwtagwnisths h senariografos
            type: String,
            required:true
        },
        artist2:{
            type: String,
            required: false
        },
        cast:{
            type:String,
            required: false
        },
        genre:{
            type:String,
            required: false
        },
        imageLink:{
            type: String,
            required: false
        },
        location:{
            type: String,
            required:true,
        },
        customId:{
            type:String,
            required: true,
            unique: true,
            validate:{
                validator: function(val){
                    return /^[a-z]{1}_[a-z]{3}_[a-z]{2,}$/.test(val)
                },
                message:props=> `${props.value} is not a valid custom Id.Expected format: 3 letters_1 letter_>1 letters`
            },
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
        organizerName:{
            type:String,
            required: true
        },
        // kokkino = sold out , portokali = sxedon sold out , kitrino = den paizei agxos yparxoyn tickets , prasino = sxedon ola apoylhta paei apato to event
        ticketColor:{
            type:String,
            required:true
        },

    },
    {
        timestamps: true
    }
)
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
