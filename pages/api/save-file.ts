import Cors from 'cors';
import initMiddleware from '../../utils/initMiddleware';
import { NextApiRequest, NextApiResponse } from 'next';
import { putter } from '../../lib/api/rest-client';
import env from '../../env';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with PUT
    methods: ['PUT'],
  })
);

const saveFile = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await cors(req, res);
  const response = await putter(`/repos/${env.githubOwner}/${env.githubRepo}/contents/${env.filePath}`, 'PUT', req.body);
  const data = await response;

  res.status(200).json({ data: data });
};

export default saveFile;
