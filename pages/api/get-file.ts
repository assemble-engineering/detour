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

const getFile = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await cors(req, res);
  let response = await fetcher(`/repos/${env.githubOwner}/${env.githubRepo}/contents/${env.filePath}`);
  const repoData = await response;

  response = await fetcher(`/repos/${env.githubOwner}/${env.githubRepo}/git/refs/heads/main`);
  let mainData = await response;
  const mainSha = mainData.object.sha;
  const body = {
    ref: "refs/heads/a-new-branch",
    sha: mainSha
  }

  // get or create branch
  response = await poster(`/repos/${env.githubOwner}/${env.githubRepo}/git/refs`, 'POST', body);
  let branchData = await response;
  if (branchData.message == "Reference already exists") {
    response = await fetcher(`/repos/${env.githubOwner}/${env.githubRepo}/git/matching-refs/heads/a-new-branch`);
    branchData = await response;
  }

  response = await fetcher(`/repos/${env.githubOwner}/${env.githubRepo}/contents/${env.filePath}?ref=a-new-branch`);
  const branchFileData = await response;

  const data = {
    repoData: repoData,
    mainData: mainData,
    branchData: branchData,
    branchFileData: branchFileData
  }
  res.status(200).json({ data: data });
  // @ts-ignore
  return data;
};

export default getFile;
