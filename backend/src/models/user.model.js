import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const userSchema = new Schema({
    username: {
        type: String,
        required:true,
        unique:true,
        lowecase:true,
        trim:true,
        index:true
    },
    email: {
        type: String,
        required:true,
        unique:true,
        lowecase:true,
        trim:true
    },
    fullName: {
        type: String,
        required:true,
        trim:true
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        trim:true
    },
    avatar: {
        type: String,
        required:true
    },
    refreshToken: {
        type: String
    },
    coverImage: {
        type: String
    },
    watchHistory: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ]
    }
}, {timestamps:true});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            fullName: this.fullName,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {_id: this._id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:REFRESH_TOKEN_EXPIRY}
    )
}

const User = mongoose.model('User', userSchema);

export default User;