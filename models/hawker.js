const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const hawkerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    hash_password:{
        type:String,
        require:true
    },
    contact:{type:String},
    category:{
        type:String,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    locality:{
        type:String,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    lat:{
        type:String,
        require:true
    },
    long:{
        type:String,
        require:true
    },
    profileimage:{
        type:String
    }
},{timestamps:true});

hawkerSchema.virtual('password')
.set(function(password){
    this.hash_password=bcrypt.hashSync(password,10);
});


hawkerSchema.methods={
    authenticate:function(password){
        return bcrypt.compareSync(password,this.hash_password);
    }
}

module.exports = mongoose.model('Hawker',hawkerSchema);