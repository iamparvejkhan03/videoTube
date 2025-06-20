import mongoose, {Schema} from "mongoose";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const commentSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }
}, {timestamps:true})

commentSchema.plugin(aggregatePaginate);

export const Comment = mongoose.model('Comment', commentSchema);