import Cors from 'cors';
import initMiddleware from '../../utils/initMiddleware';
import { NextApiRequest, NextApiResponse } from 'next';
import {fetcher} from '../../lib/api/rest-client';
import env from '../../env';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST
    methods: ['GET'],
  })
);

const getFile = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await cors(req, res);
  const response = await fetcher(`/repos/${env.githubOwner}/${env.githubRepo}/contents/${env.filePath}`);
  const data = await response;

  res.status(200).json({ data: data });
};

export default getFile;
