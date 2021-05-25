import { app } from './app';

app.listen(process.env.EXPRESS_PORT || 3333, () => {
  console.log(`Server running on port ${process.env.EXPRESS_PORT || 3333}`);
});
