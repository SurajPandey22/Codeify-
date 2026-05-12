require('dotenv').config();
const express=require("express");
const app=express();

const main=require('./config/db');
const cookieParser=require('cookie-parser');

const authRouter=require('./routes/userAuth');
const { redisClient } = require('./config/redis');
const problemRouter=require('./routes/problemCreator')
const submitResult=require('./routes/submit');
const submitRouter = require('./routes/submit');
const aiRouter = require("./routes/aiChatting")
const videoRouter = require("./routes/videoCreator");


const cors = require('cors')

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true 
}))

app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);



const inital= async ()=> {

    try {
          
        await Promise.all([main(),redisClient.connect()])
        console.log("DB CONNECTED");
        app.listen(process.env.PORT, () => {
            console.log(`Server running at PORT ${process.env.PORT}`);
        });

    }
     catch(err) {
        console.log("Error:"+err);
     }
}
inital();
// main()
//     .then( async () => {                    
//         app.listen(process.env.PORT, () => {
//             console.log(`Server running at PORT ${process.env.PORT}`);
//         });
//     })
//     .catch(err => {                    // fixed catch syntax
//         console.log("Error Occurred", err);
//     });