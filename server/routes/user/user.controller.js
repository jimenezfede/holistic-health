const { User } = require("../../models");

const saveUser = async (req, res) => {
  //   if the user already exists, but does not have a daily_info object for the current date, create a new daily_info object for the current date
  const { user } = req.body;
  try {
    const userExists = await User.findOne({ email: user.email });
    if (userExists) {
      // check if the user has a daily_info object for today and if not, create one new Date(Date.now()).toDateString()
      const today = new Date(Date.now()).toDateString();
      const dailyInfoExists = userExists.daily_info.find(
        (dailyInfo) => dailyInfo.date === today
      );
      if (!dailyInfoExists) {
        userExists.daily_info.push({ date: today });
        await userExists.save();
      }
      return res.status(200).json(userExists);
    } else {
      const newUser = await User.create({
        ...user,
        daily_info: [{ date: new Date(Date.now()).toDateString() }],
      });
      return res.status(200).json(newUser);
    }
  } catch (err) {
    console.log("This is the error from saveUser:\n", err);
    res.send(err).status(500);
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  const { user } = req.body;
  const { id } = req.params;
  try {
    await User.findOneAndUpdate({ _id: id }, user, { new: true });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getRecipes = async (req, res) => {
  // get the recipes in the recipesList array from the user
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    // checks if the user has any recipes in the recipeList array
    if (user.recipeList.length > 0) {
      res.status(200).json(user.recipeList);
    } else {
      res.status(200).json({ message: "No recipes found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const saveRecipe = async (req, res) => {
  const { recipe } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id });
    user.recipeList.push(recipe);
    await user.save();
    // send the saved recipe back to the client
    res.status(201).send(recipe);
  } catch (err) {
    console.log("could not save recipe", err);
    res.sendStatus(500);
  }
};

const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  const { currentUser } = req.body;
  // console.log(currentUser);
  try {
    const user = await User.findOne({ _id: currentUser._id });
    // find the recipe in the recipeList array by id and remove it from the array
    user.recipeList = user.recipeList.filter((recipe) => recipe.id !== id);
    await user.save();
    res.status(200).json(user.recipeList);
  } catch (err) {
    console.log("failed to delete recipe", err);
    res.sendStatus(500);
  }
};

const saveEmotion = async (req, res) => {
  const { emotion } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    // find the daily_info object in the daily_info array that matches the current date
    const today = user.daily_info.find(
      (info) => info.date === new Date(Date.now()).toDateString()
    );
    // if the daily_info object exists, set the emotion property to the emotion that was sent from the client
    if (today) {
      today.emotion_of_the_day = emotion;
      await user.save();
      res.sendStatus(201);
    }
  } catch (err) {
    console.log("could not save emotion", err);
    res.sendStatus(500);
  }
};

const getEmotion = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    // find the daily_info object in the daily_info array that matches the current date
    const today = user.daily_info.find(
      (info) => info.date === new Date(Date.now()).toDateString()
    );
    // if the daily_info object exists, send the emotion property back to the client
    if (today) {
      res.status(200).json(today.emotion_of_the_day);
    } else {
      res.status(200).json({ message: "No emotion found" });
    }
  } catch (err) {
    console.log("could not get emotion", err);
    res.sendStatus(500);
  }
};

const saveJournalEntry = async (req, res) => {
    const { journalEntry } = req.body;
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id });
        // find the daily_info object in the daily_info array that matches the current date
        const today = user.daily_info.find(
        (info) => info.date === new Date(Date.now()).toDateString()
        );
        // if the daily_info object exists, set the journal_entry property to the journalEntry that was sent from the client
        if (today) {
        today.journal_entries.push(journalEntry); 
        await user.save();
        res.sendStatus(201);
        }
    } catch (err) {
        console.log("could not save journal entry", err);
        res.sendStatus(500);
    }
};

const updateMeditate = async (req, res) => {
  const { id } = req.params;
  const { meditateLength } = req.body;
  console.log("This is the id:\n", id);
  try {
    let user = await User.findById(id);
    user.default_timer = meditateLength;
    let today = user.daily_info.find(
      (info) => info.date === new Date(Date.now()).toDateString()
    );
    today.did_meditate = true;
    today.meditate_length = meditateLength;
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.log("This is the error from updateMeditate:\n", err);
    res.send(err).status(500);
  }
};

const createWorkout = (req, res) => {
  const {params: {email}, body: {user}} = req;

    User.updateOne({email}, {user: {saved_workouts}}, {upsert: true})
    .then(({modifiedCount}) => {
      if ({modifiedCount}) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(() => res.sendStatus(500));

};

module.exports = {
  saveUser,
  getUser,
  getRecipes,
  saveRecipe,
  deleteRecipe,
  saveEmotion,
  getEmotion,
  saveJournalEntry,
  updateUser,
  updateMeditate,
  createWorkout,
};
