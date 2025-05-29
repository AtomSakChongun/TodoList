const express = require('express');
const app = express();
const cors = require('cors')

const userRoutes = require('./routes/user_routes');
const tashRoutes = require('./routes/task_router')

app.use(cors())
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/task',tashRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
