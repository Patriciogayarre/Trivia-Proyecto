
const express  = require('express');
const mongoose = require('mongoose');


const port = process.env.PORT        || 3000;
const db   = process.env.MONGODB_URI || 'mongodb://localhost/trivia';


const app = express();

mongoose.connect (db, {useNewUrlParser:true})
 .then(()=> {
console.log('conectado');
})
.catch (err =>console.log(err));

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
});

const Question = mongoose.model('Question', QuestionSchema);


const AnswerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isRight: { type: Boolean, default: false },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
});

const Answer = mongoose.model('Answer', AnswerSchema);

/
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', UserSchema);




app.set('view engine', 'pug');
app.set('views', './views');




app.post('/question', (req, res) => {
  let question = new Question({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.question
  });
  let answerA = new Answer({
    title: req.body.answerA,
    isRight: req.body.checkboxA,
    question: question._id
  });
  let answerB = new Answer({
    title: req.body.answerB,
    isRight: req.body.checkboxB,
    question: question._id
  });
  let answerC = new Answer({
    title: req.body.answerC,
    isRight: req.body.checkboxC,
    question: question._id
  });
  let answerD = new Answer({
    title: req.body.answerD,
    isRight: req.body.checkboxD,
    question: question._id
  });
  question.answers.push(answerA);
  question.answers.push(answerB);
  question.answers.push(answerC);
  question.answers.push(answerD);
  question.save(err => {
    answerA.save();
    answerB.save();
    answerC.save();
    answerD.save();
    res.redirect('/');
  });
});

app.get('/', (req, res) => {
  Question.find().populate('answers').exec((err, questions) => {
    res.render('index', { questions: questions, user: req.user });
  });
});




app.get('/api/questions', (req, res) => {
  Question.find().populate('answers').exec((err, questions) => {
    res.status(200).json(questions);
  });
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
