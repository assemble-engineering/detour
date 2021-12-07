import Cors from 'cors';
import initMiddleware from '../../utils/initMiddleware';
import { NextApiRequest, NextApiResponse } from 'next';
import {fetcher, poster} from '../../lib/api/rest-client';
import env from '../../env';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST
    methods: ['GET', 'POST'],
  })
);

const createBranch = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await cors(req, res);
  let response = await fetcher(`/repos/${env.githubOwner}/${env.githubRepo}/git/refs/heads/main`);
  let data = await response;
  const mainSha = data.object.sha;
  const body = {
    ref: "refs/heads/a-new-branch",
    sha: mainSha
  }
  response = await poster(`/repos/${env.githubOwner}/${env.githubRepo}/git/refs`, 'POST', body);
  data = await response;

  res.status(200).json({ data: data });
};

export default createBranch;
