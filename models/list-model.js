const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const myListSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    position: { type: Number },
    owner:{
      type: Schema.Types.ObjectId,
      ref:'User'
    },
    cards: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Card' //this is the name of the model (this is the name thats saved in the end of the model's js file)
      }
    ]
  },
  {
    timestamps: true
  }
);

const ListModel = mongoose.model('List', myListSchema);


module.exports = ListModel;
