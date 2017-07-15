const express = require('express');
const ensureLoggedInApiVersion = require('../lib/ensure-logged-in-api-version');
const ListModel = require('../models/list-model');
const CardModel = require('../models/card-model');

const router = express.Router();





router.post('/api/lists', ensureLoggedInApiVersion, (req, res, next)=>{
ListModel
  .findOne({owner: req.user._id})
  .sort({ position: -1 }) //opposite order (3-2-1)
  .exec((err, lastList)=>{
    if (err) {
        res.status(500).json({ message: 'Find List went to 💩' });
        return;
      }

      //default to 1 if there are no lists
    let newPosition = 1;
    if (lastList) {
      //but use the last list's position (+1) if we have one
      newPosition = lastList +1;
      }

    const theList = new ListModel({
      title: req.body.listTitle,
      position: newPosition,
      owner: req.user._id
    });
    theList.save((err)=>{
      if (err) {
          res.status(500).json({ message: 'List save went to 💩' });
          return;
        }
        res.status(200).json(theList);
    });

  }); //close 'exec()' callback

}); //close post '/api/lists'

router.get('/api/lists', ensureLoggedInApiVersion, (req, res, next)=>{
  ListModel
  .find({ owner: req.user._id })
  .populate('cards') // 'cards' -> this comes from the model list-> cards
  .exec((err, allTheLists)=>{
    if (err) {
      res.status(500).json({ message: 'List find went to 💩' });
      return;
    }
    res.status(200).json(allTheLists);
  }); //close 'exec()' callback
}); //close post '/api/lists'



module.exports = router;
