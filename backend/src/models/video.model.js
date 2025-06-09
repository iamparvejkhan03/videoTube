import mongoose, {Schema} from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema({
    video: {
        type: String,
        required:true
    },
    thumbnail: {
        type: String,
        required:true
    },
    title: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    duration: {
        type: String,
        required:true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps:true});

videoSchema.plugin(aggregatePaginate);

const Video = mongoose.model('Video', videoSchema);

export default Video;