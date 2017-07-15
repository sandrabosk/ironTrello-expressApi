const ensureLoggedInApiVersion = require('../lib/ensure-logged-in-api-version');
const express = require('express');
const router = express.Router();
const ListModel = require('../models/list-model');
const CardModel = require('../models/card-model');
const mongoose = require('mongoose');


router.post('/lists/:id/cards', (res, req, next) =>{
  CardModel
  .findOne({ list: req.params.id })
  .sort({position: -1})
  .exec((err, lastCard) =>{
    if(err){
      res.status(500).json({ message: " find card didnt work"});
      return;
    }

    let newPosition = 1;

    if(lastCard) {
      newPosition = lastCard.position + 1;
    }

    const theCard = new CardModel ({
      title: req.body.cardTitle,
      position: newPosition,
      list: req.params.id
    });

    theCard.save((err)=>{
      if (err) {
        res.status(500).json({ message: " find card didnt work"});
        return;
      }

      ListModel.findByIdAndUpdate(
        req.params.id,
        { $push: { cards: theCard._id } },
        (err, listFromDb) => {
          if (err) {
          res.status(500).json({ message: " find card didnt work"});
          return;
          }
            res.status(200).json(theCard);
        }
      );
    });
  }); //close EXEC()
}); //close POST


router.patch('/api/cards/:id',(req, res, next)=>{
  CardModel.findById(
    req.param.id,
    (err, cardFromDB)=>{
      if (err) {
        res.status(500).json({message: 'Card find went to 💩'});
        return;
      }
// cardFromDB.title = req.body.cardTitle || cardFromDB.title => if you dont have title go to the default one

//separate if statements to avoid blanking ut fileds
//in case user sends just description
      if (req.body.cardTitle) {
        cardFromDB.cardTitle = req.body.cardTitle;
      }
      if (req.body.cardDescription) {
        cardFromDB.cardDescription = req.body.cardDescription;
      }
      if (req.body.cardDueDate) {
        cardFromDB.dueDate = req.body.carDueDate;
      }
      cardFromDB.save((err)=>{
        if (err) {
          res.status(500).json({message: 'Card save went to 💩'});
          return;
        }
        res.status(200).json(cardFromDB);
      });
    });
});


router.delete('/api/cards/:id', (req, res, next)=>{
  CardModel.findByIdAndRemove(
    req.params.id,
    (err, cardFromDB)=>{
      if (err) {
        res.status(500).json({message: 'Card remove went to 💩'});
        return;
      }
      ListModel.findByIdAndUpdate(
        cardFromDB.list,
        { $pull: { cards: cardFromDB._id } },
        (err)=>{
          if (err) {
            res.status(500).json({message: 'List update went to 💩'});
            return;
          }
          res.status(200).json(cardFromDB); //this is the card that has been removed
        }
      );
    }
  );
});//close delete '/api/cards/:id'


module.exports = router;
