import { useState } from "react";
import client from "../lib/api/apollo-client";
import { gql } from "@apollo/client";
import useSWR from 'swr'
import env from '../env';
import atob from 'atob';
import btoa from 'btoa';
import toml from '@iarna/toml';
import netlifyAuth from "../netlifyAuth";

import Table from "../components/Table";
import Button from "../components/Button";
import AddRedirectForm from "../components/AddRedirectForm";
import Loader from "../components/Loader";
import Detour from "../components/icons/Detour";
import Pencil from "../components/icons/Pencil";
import ConfirmButton from "../components/ConfirmButton";
import NetlifyIdentity from "../components/NetlifyIdentity";


// GITHUB v4 requires an API key
// See: https://github.community/t5/GitHub-API-Development-and/API-v4-Permit-access-without-token/td-p/20357
// GITHUB API DOCS: https://developer.github.com/v4/object/repository/

// NETLIFY REDIRECTS DOCUMENTATION
// https://docs.netlify.com/routing/redirects
const fetcher = (url: string) => fetch(url).then(res => res.json());

const repoDetailsQuery = gql`
    query repository($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        id
        name
        description
        viewerCanAdminister
        projectsResourcePath
        interactionAbility {
          expiresAt
        }
        collaborators {
          totalCount
        }
      }
    }
  `;

export async function getStaticProps() {
  const { data } = await client.query({
    query: repoDetailsQuery,
    variables: {
      owner: env.githubOwner,
      name: env.githubRepo,
    }
  });

  return {
    props: {
      repo: data.repository,
    },
  };
}

type RedirectType = {
  from: string;
  to: string;
  status: string;
}

const Home = ({ repo }: { repo: any }): JSX.Element => {
  const { data, mutate: refetchFile } = useSWR('api/get-file', fetcher);

  const [activeForm, setActiveForm] = useState(null);
  const [loggedIn, setLoggedIn] = useState(netlifyAuth.isAuthenticated)

  const base64 = data?.data.repoData.content;
  const tomlString = base64 && atob(base64);
  const json = tomlString && toml.parse(tomlString);
  const redirects = json?.redirects;

  const branchBase64 = data?.data.branchFileData.content;
  const branchTomlString = branchBase64 && atob(branchBase64);
  const branchJson = branchTomlString && toml.parse(branchTomlString);
  const branchRedirects = branchJson?.redirects;
  const mergePull = () => {
    fetch('/api/new-pull', { method: 'POST' }).then((resp) => {
      refetchFile();
      setActiveForm(null);
    })
  }

  const prepareAndSend = (branchJson) => {
    const updatedToml= toml.stringify(branchJson);
    const base64EncodedToml = btoa(updatedToml);
    const branch = data?.data.branchData[0].url.split('/')
    console.log('sha',data?.data.repoData.sha)
    const body = {
      message: "Update redirects",
      content: `${base64EncodedToml}`,
      sha: `${data?.data.branchFileData.sha}`,
      branch: branch[branch.length - 1]
    };
    console.log(body)
    // @ts-ignore
    fetch('/api/save-file', { method: 'PUT', body: JSON.stringify(body) }).then((resp) => {
      console.log(resp)
      refetchFile();
      setActiveForm(null);
    })
  }

  const handleDelete = (i: number) => {
    const updatedJson = {...branchJson};
    // @ts-ignore
    updatedJson.redirects.splice(i, 1);
    prepareAndSend(updatedJson);
  }

  const handleEdit = (i: number) => {
    setActiveForm(i)
  }

  const handleSubmit = (formData) => {
    const updatedJson = {...branchJson};
    console.log('active form',activeForm)
    if (activeForm !== 'new') {
      // @ts-ignore
      updatedJson.redirects.splice(activeForm, 1, {to: formData.to, from: formData.from, status: formData.status})
    } else {
      // @ts-ignore
      updatedJson.redirects.unshift({to: formData.to, from: formData.from, status: formData.status})
    }
    prepareAndSend(updatedJson);
  }

  const isEditing = activeForm !== 'new' && activeForm !== null;

  const getRows = () => {
    // @ts-ignore
    var unmergedRediects = branchRedirects.filter((obj) => {
      // @ts-ignore
      return !redirects.some((obj2) => {
          return (obj.to == obj2.to && obj.from == obj2.from);
      });
    });
    // @ts-ignore
    const tableRows = (i, redirect, isMerged) => {
      return [
        <div className={`rounded-full w-5 h-5 ${isMerged ? 'bg-green-500' : 'bg-yellow-300' }`}></div>,
        <p key={`from-${i}`}>{redirect.from}</p>,
        <p key={`to-${i}`}>{redirect.to}</p>,
        <p key={`status-${i}`}>{redirect.status}</p>,
        <div key={`actions-${i}`} className='flex items-center justify-end'>
          <Button
            size='small'
            color={isEditing && activeForm === i ? 'black' : 'transparent'}
            onClick={() => isEditing && activeForm === i ?
              setActiveForm(null) : handleEdit(i)}
            title={isEditing && activeForm === i ? 'Cancel' : 'Edit'}
          >
            <span className='sr-only'>{isEditing && activeForm === i ? 'Cancel' : 'Edit'}</span>
            <Pencil />
          </Button>
          <ConfirmButton onConfirmClick={() => handleDelete(i)} />
        </div>
      ]
    }
    // @ts-ignore
    const merged =  redirects.map((redirect: RedirectType, i: number) => (
        tableRows(i,redirect, true)
      ))
    const unmerged = unmergedRediects.map((redirect: RedirectType, i: number) => (
        tableRows(i,redirect, false)
      ))
    return unmerged.concat(merged)
    }
  const renderLogo = () => {
    return (
      <div>
          <div className='flex items-center'>
            <Detour size='xl' colorClassName='text-yellow-500'  />
            <h1 className='font-bold text-5xl'>
              Detour
            </h1>
          </div>
          <h2 className='pl-10 text-2xl'>{repo.name.toUpperCase()}</h2>
          <h3 className='pl-10'>{repo.description}</h3>
        </div>
    );
  }

  if (!redirects) {
    return <Loader message='Loading...' />
  }
  else if (loggedIn) {
    return (    
    <>
      <div className='flex items-end justify-between mb-10'>
        {renderLogo()}
        <div>
          <NetlifyIdentity loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
          <Button
            disabled={isEditing}
            onClick={() => activeForm ?
              setActiveForm(null) : setActiveForm('new')
            }
          >
            {activeForm
              ? `- Cancel ${activeForm !== 'new' ? 'Update' : 'New'} Redirect`
              : '+ New Redirect'
            }
          </Button>
          <button onClick={mergePull}>
            merge pull
          </button>
        </div>
      </div>
      {activeForm !== null &&
        <AddRedirectForm
          data={redirects[activeForm]}
          onSubmit={handleSubmit}
          onCancel={() => setActiveForm(null)}
        />
      }
      <Table
        headers={['Merged','From', 'To', 'Status', '']}
        rows={getRows()}
      />
    </>);
  }
  return (
      <div className='flex items-end justify-between mb-10'>
        {renderLogo()}
        <NetlifyIdentity loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
      </div>
    );
}

export default Home;
