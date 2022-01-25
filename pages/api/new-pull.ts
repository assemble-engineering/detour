import Cors from 'cors';
import initMiddleware from '../../utils/initMiddleware';
import { NextApiRequest, NextApiResponse } from 'next';
import { putter } from '../../lib/api/rest-client';
import env from '../../env';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with POST, PUT
    methods: ['POST', 'PUT'],
  })
);
const newPull = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await cors(req, res);
  // TODO: implement a way to name the new branch
  req.body = {
    title: 'Update Redirects title',
    head: 'detour-redirects',
    base: 'main',
  };
  const response = await putter(`/repos/${env.githubOwner}/${env.githubRepo}/pulls`, 'POST', req.body);

  const pullNumber = response.number;

  await fetch(`${env.githubRestApi}/repos/${env.githubOwner}/${env.githubRepo}/pulls/${pullNumber}/reviews`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_APP_GITHUB_API_KEY_2}`,
      'Content-Type': 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      event: 'APPROVE',
    }),
  })
    .then(res => {
      return res.json();
    })
    .catch(e => console.log(e));

  const data = await putter(`/repos/${env.githubOwner}/${env.githubRepo}/pulls/${pullNumber}/merge`, 'PUT', {});

  res.status(200).json({ data: data });
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

export default newPull;
