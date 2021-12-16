import Cors from 'cors';
import initMiddleware from '../../utils/initMiddleware';
import { NextApiRequest, NextApiResponse } from 'next';
import { fetcher } from '../../lib/api/rest-client';
import env from '../../env';
import toml from '@iarna/toml';
import { BranchJSON } from '../../types';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST
    methods: ['GET', 'POST'],
  })
);

const getFile = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await cors(req, res);

  try {
    const [mainBranchTomlFileData, workingBranchTomlFileData] = await Promise.all([
      getMainBranchTomlFile(),
      getWorkingBranchTomlFile(),
    ]);

    const base64 = mainBranchTomlFileData.content;
    const tomlString = base64 && Buffer.from(base64, 'base64').toString();
    const mainBranchTomlJson: BranchJSON = (tomlString && (toml.parse(tomlString) as BranchJSON)) || {
      redirects: [],
    };

    const workingBranchBase64 = workingBranchTomlFileData.content;
    const workingBranchTomlString = workingBranchBase64 && Buffer.from(workingBranchBase64, 'base64').toString();
    const workingBranchTomlJson: BranchJSON = (workingBranchTomlString &&
      (toml.parse(workingBranchTomlString) as BranchJSON)) || {
      redirects: [],
    };

    const data: GetFileResponse = {
      mainBranchSha: mainBranchTomlFileData.sha,
      workingBranchSha: workingBranchTomlFileData.sha,
      mainBranchTomlJson,
      workingBranchTomlJson,
    };
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not get file.' });
  }
};

const getMainBranchTomlFile = (): Promise<RepoFileData> =>
  fetcher(`/repos/${env.githubOwner}/${env.githubRepo}/contents/${env.filePath}`);

const getWorkingBranchTomlFile = (): Promise<RepoFileData> =>
  fetcher(`/repos/${env.githubOwner}/${env.githubRepo}/contents/${env.filePath}?ref=a-new-branch`);

export type GetFileResponse = {
  mainBranchSha: string;
  workingBranchSha: string;
  mainBranchTomlJson: BranchJSON;
  workingBranchTomlJson: BranchJSON;
};

export type RepoFileData = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
  _links: Links;
};

export type Links = {
  self: string;
  git: string;
  html: string;
};

export type Obj = {
  sha: string;
  type: string;
  url: string;
};
export type BranchData = {
  ref: string;
  node_id: string;
  url: string;
  object: Obj;
};

export default getFile;
