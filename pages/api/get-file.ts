import Cors from "cors";
import initMiddleware from "../../utils/initMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import { fetcher, poster } from "../../lib/api/rest-client";
import env from "../../env";

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST
    methods: ["GET", "POST"],
  })
);

const getFile = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await cors(req, res);
  // TODO: use promise.all to make all these calls in one promise
  const responseRepo = await fetcher(
    `/repos/${env.githubOwner}/${env.githubRepo}/contents/${env.filePath}`
  );
  const repoData = await responseRepo;

  const responseMain = await fetcher(
    `/repos/${env.githubOwner}/${env.githubRepo}/git/refs/heads/main`
  );
  const mainData = await responseMain;
  const mainSha = mainData.object.sha;
  const body = {
    ref: "refs/heads/a-new-branch",
    sha: mainSha,
  };

  // get or create branch
  let responseBranch = await poster(
    `/repos/${env.githubOwner}/${env.githubRepo}/git/refs`,
    "POST",
    body
  );
  let branchData = await responseBranch;
  if (branchData.message === "Reference already exists") {
    responseBranch = await fetcher(
      `/repos/${env.githubOwner}/${env.githubRepo}/git/matching-refs/heads/a-new-branch`
    );
    branchData = await responseBranch;
  }

  const responseBranchFile = await fetcher(
    `/repos/${env.githubOwner}/${env.githubRepo}/contents/${env.filePath}?ref=a-new-branch`
  );
  const branchFileData = await responseBranchFile;

  const data = {
    repoData: repoData,
    mainData: mainData,
    branchData: branchData,
    branchFileData: branchFileData,
  };
  res.status(200).json({ data: data });
};

export default getFile;
