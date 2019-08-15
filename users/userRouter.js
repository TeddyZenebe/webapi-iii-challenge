const express = require('express');
const usersDb = require('./userDb');
const postDb = require('../posts/postDb');
const router = express.Router();

router.post('/',validateUser, (req, res) => {
        const newUser =req.body
        usersDb.insert(newUser)
               .then(newuser=>res.status(201).json(newuser))
               .catch(error=>{
                console.log(error)   
                res.status(500).json({message:'Error processing request'})})
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
      const id = req.params.id
      const text =req.body.text
      const newpost = { text, user_id: id}
       postDb.insert(newpost)
       .then(newpost=>{res.status(201).json(newpost)})
       .catch(error=>{
        console.log(error)   
        res.status(500).json({message:'There was an error while saving the post to the database'})})
            
});

router.get('/', (req, res) => {
   usersDb.get()
          .then(user=>{res.status(200).json(user)})
          .catch(error=>{
                  console.log(error)   
                  res.status(500).json({message:'The users information could not be retrieved.'})})
});

router.get('/:id', validateUserId, (req, res) => {
        const id = req.params.id
    usersDb.getById(id)
           .then(user=>res.status(200).json(user))
           .catch(error =>{
                   console.log(error)
                   res.status(500).json({message:'Error processing request'})
           })
});

router.get('/:id/posts', validateUserId, (req, res) => {
        const  id = req.params.id
        usersDb.getUserPosts(id)
                .then(userPosts=>res.status(200).json(userPosts))
                .catch(error =>{
                console.log(error)
                res.status(500).json({message:'Error processing request'})
        })

});

router.delete('/:id', validateUserId, (req, res) => {
        const id = req.params.id
        usersDb.remove(id)
        .then(deleted=>res.status(200).json(deleted))
        .catch(error =>{
                console.log(error)
                res.status(500).json({message:'The user could not be removed'})
        })
               
});

router.put('/:id', validateUserId, (req, res) => {
        const id = req.params.id
        const updated = req.body
        usersDb.update(id,updated)
        .then(updated=>res.status(201).json(updated))
        .catch(error =>{
                console.log(error)
                res.status(500).json({message:'The user information could not be modified.'})
        })

});

//custom middleware

function validateUserId (req, res, next) {
        const  id = req.params.id
        usersDb.getById(id)
        .then(user=>{
                if (user) {
                        req.use=user
                        next()
                        
                     } else {
                        res.status(400).json({ message: "invalid user id" })
                         } 
        })
        .catch(error =>{
                console.log(error)
                res.status(500).json({message:'Error processing request'})
        })
        
           
};

function validateUser(req, res, next) {
        if (!(Object.keys(req.body).length > 0 && Object.values(req.body).length > 0)) {
               res.status(400).json({ message: "missing user data" }) 
        }       
          else{ if(!req.body.name){
                res.status(404).json({  message: "missing required name field" })
                } else 
                    {  next()  }
                }
};

function validatePost(req, res, next) {
        if (!(Object.keys(req.body).length > 0 && Object.values(req.body).length > 0)) {
                res.status(400).json({message: "missing post data"  }) 
         }       
           else{ if(!req.body.text){
                 res.status(404).json({  message: "missing required text field" })
                 } else 
                     {  next()  }
                 }
};

module.exports = router;
