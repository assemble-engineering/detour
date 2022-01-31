# detour

User interface for managing redirects that are hosted in the netlify.toml file in the respective Github repo. The netlify.toml file is used by Netlify to handle multiple features with redirects being one of them. Netlify does not have a UI for redirects, the Detour app is built as the custom redirect app to allow users modify without having to work in the Github repository directly. Authentication is handled through Netlify Identity https://docs.netlify.com/visitor-access/identity/.

# Table of Contents

- [Stack](#stack)
- [Getting Started](#getting-started)
- [Deployment](#deployment)

# Stack <a name="stack"></a>

- React 17.0.2
- Next.js 11.1.2
- Netlify
- TypeScript
- Netlify Identity
- TailwindCSS

This project is written mainly in TypeScript and we require almost all styling to use TailwindCSS, if the designs are unable to be achieved through TailwindCSS, you may create `*.module.scss` files for specific components.

# Getting Started<a name="getting-started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## **Prerequisites**

Run these commands if you don't have Homebrew, node, and yarn.
NOTE: Because we require different versions of Node depending on the project, instead of installing node with brew, you may instead want to [install NVM](https://tecadmin.net/install-nvm-macos-with-homebrew/) (Node Version Manager).

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install node;
brew install yarn;
```

## **Set Up Environments**

Next, copy the `.example.env` file in this directory to `.env.local` in the main directory. The rest of the environments that are missing should be available on 1Password.


## Setup and run Next.js

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

# Deployment <a name="deployment"></a>

Netlify handles deployment information through access to the Github that you have linked the services to.

Sites currently autodeploy:

Production Site: https://gf-detour.netlify.app/
