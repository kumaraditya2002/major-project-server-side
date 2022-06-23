const express=require('express');
const env=require('dotenv');
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');

const app=express();
env.config();

const hawkerAuth=require('./routes/hawkerAuth');
const inventory=require('./routes/inventory');
const hawkerProfile=require('./routes/hawkerprofile')
const userAuth=require('./routes/userAuth');
const userProfile=require('./routes/userprofile');
const hawkerReview=require('./routes/hawkerReview');
const userFavorites=require('./routes/userFav');

//middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use('/api',hawkerAuth);
app.use('/api',inventory);
app.use('/api',hawkerProfile);
app.use('/api',userAuth);
app.use('/api',userProfile);
app.use('/api',hawkerReview);
app.use('/api',userFavorites);

mongoose.connect(
    process.env.URL,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
).then(()=>{
    console.log(`Database connection established`);
}).catch(err=>console.log(err));


app.listen(process.env.PORT,()=>{
    console.log(`Server is running at port:${process.env.PORT}`);
});
