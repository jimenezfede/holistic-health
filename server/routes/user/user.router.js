const express = require('express');

const { saveUser, getUser, updateUser, saveRecipe, getRecipes, saveEmotion, deleteRecipe, updateMeditate, } = require('./user.controller');

const userRouter = express.Router();

userRouter.route('/:id').put(updateUser).get(getUser);


userRouter.post("/:id/emotionOfTheDay", saveEmotion);

userRouter.post('/googleAuth', saveUser);

userRouter.get('/myrecipes/:email', getRecipes);
userRouter.delete('/myrecipes/:id', deleteRecipe);

userRouter.post('/myrecipes/:id', saveRecipe);

userRouter.put('/meditate/:id', updateMeditate);



module.exports = userRouter;
