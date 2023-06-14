const express = require('express');

require('./db/mongoose')
const userRouter = require('./routers/user')
const postRouter = require('./routers/post')

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(userRouter)
app.use(postRouter)

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
