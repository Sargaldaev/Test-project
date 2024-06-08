import express from 'express';
import cors from 'cors';
import {promises as fs} from 'fs';
import {User} from './types';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

const filename = './users.json';
const abortControllers = new Map();

app.post('/users', async (req, res) => {
  const {clientId} = req.body;

  if (abortControllers.has(clientId)) {
    abortControllers.get(clientId).abort();
  }

  const abortController = new AbortController();
  abortControllers.set(clientId, abortController);

  let responseSent = false;

  try {
    const fileContents = await fs.readFile(filename);
    const data: User[] = JSON.parse(fileContents.toString());

    let {email, number} = req.body;
    number = number.replace(/-/g, '');

    const timeoutId = setTimeout(() => {
      if (abortController.signal.aborted || responseSent) {
        return;
      }

      responseSent = true;

      if (email && number) {
        const user = data.find(item => item.number === number && item.email === email);
        if (!user) {
          return res.send({message: 'User not found!'});
        } else {
          return res.send(user);
        }
      }

      const findByEmail = data.find(item => item.email === email);

      if (!findByEmail) {
        return res.send({message: 'User not found!'});
      } else {
        abortControllers.delete(clientId);
        return res.send(findByEmail);
      }

    }, 5000);

    abortController.signal.addEventListener('abort', () => {
      if (responseSent) return;

      responseSent = true;

      clearTimeout(timeoutId);
      return res.status(499).send('Request was aborted');
    });

  } catch (error) {
    if (!responseSent) {
      responseSent = true;
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
