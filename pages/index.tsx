import { useCallback, useMemo, useReducer } from 'react';
import client from '../lib/api/apollo-client';
import { gql } from '@apollo/client';
import useSWR from 'swr';
import env from '../env';
import btoa from 'btoa';
import Table from '../components/Table/index';
import AddRedirectForm from '../components/AddRedirectForm';
import Loader from '../components/Loader';
import { BranchJSON, RedirectType } from '../types';
import toml from '@iarna/toml';
import { GetFileResponse } from './api/get-file';
import { v4 as uuid } from 'uuid';
import { Column, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import TableControls from '../components/Table/TableControls';
import redirectsAreEqual from '../utils/redirectsAreEqual';
import PublishedModal from '../components/PublishedModal';

// GITHUB v4 requires an API key
// See: https://github.community/t5/GitHub-API-Development-and/API-v4-Permit-access-without-token/td-p/20357
// GITHUB API DOCS: https://developer.github.com/v4/object/repository/

// NETLIFY REDIRECTS DOCUMENTATION
// https://docs.netlify.com/routing/redirects

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

export type State = {
  mainBranchTomlJson: BranchJSON;
  workingBranchTomlJson: BranchJSON;
  mainBranchSha: string | null;
  workingBranchSha: string | null;
  redirects: RedirectType[];
  updatesMade: boolean;
  isEditing: boolean;
  redirectFormData: RedirectType;
  unmergedChanges: boolean;
  saving: boolean;
  fetching: boolean;
  showPublishedModal: boolean;
};

export type Action =
  | { type: 'DATA_FETCH_START' }
  | { type: 'DATA_FETCH_END'; newData: GetFileResponse }
  | { type: 'OPEN_NEW_REDIRECT_FORM'; id: string }
  | { type: 'EDIT_NEW_REDIRECT_FORM'; newData: RedirectType }
  | { type: 'EDIT_REDIRECT'; newData: RedirectType }
  | { type: 'SAVE_NEW_REDIRECT' }
  | { type: 'CANCEL_EDIT' }
  | { type: 'ADD_REDIRECT' }
  | { type: 'DELETE_REDIRECT'; id: string }
  | { type: 'RESTORE_REDIRECT'; id: string }
  | { type: 'START_SAVING' }
  | { type: 'END_SAVING' }
  | { type: 'SHOW_PUBLISHED_MODAL' }
  | { type: 'CLOSE_PUBLISHED_MODAL' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'DATA_FETCH_START': {
      return {
        ...state,
        fetching: true,
      };
    }
    case 'DATA_FETCH_END': {
      const workingRedirects: RedirectType[] = action.newData.workingBranchTomlJson.redirects.map(redirect => {
        const liveRedirect = action.newData.mainBranchTomlJson.redirects.find(
          mainRedirect => mainRedirect.id === redirect.id
        );

        const status = !liveRedirect
          ? redirect.mergeStatus
          : redirectsAreEqual(redirect, liveRedirect)
          ? redirect.mergeStatus === 'DELETED'
            ? 'DELETED'
            : 'LIVE'
          : 'UPDATED';

        if (status === 'UPDATED') {
          const stateRedirect = state.redirects.find(stateRedirect => stateRedirect.id === redirect.id);

          if (stateRedirect) {
            return {
              ...stateRedirect,
            };
          }
        }

        return {
          ...redirect,
          id: redirect?.id || uuid(),
          mergeStatus: status,
        };
      });

      const newRedirects = state.redirects.filter(stateRedirect => {
        const savedRedirect = action.newData.workingBranchTomlJson.redirects.find(
          savedRedirect => savedRedirect.id === stateRedirect.id
        );
        if (savedRedirect || stateRedirect.mergeStatus === 'DELETED') {
          return false;
        }
        return true;
      });

      const areUnmergedChanges =
        workingRedirects.some(redirect => redirect.mergeStatus !== 'LIVE') || newRedirects.length > 0;

      return {
        ...state,
        ...action.newData,
        updatesMade: newRedirects.length > 0,
        unmergedChanges: areUnmergedChanges,
        redirects: [...newRedirects, ...workingRedirects],
        fetching: false,
      };
    }
    case 'OPEN_NEW_REDIRECT_FORM': {
      const updatedState: State = {
        ...state,
        isEditing: true,
      };
      const editRedirect = state.redirects.find(redirect => redirect.id === action.id);
      if (editRedirect) {
        updatedState.redirectFormData = { ...editRedirect };
      }

      return updatedState;
    }
    case 'EDIT_REDIRECT': {
      const updatedRedirects = [...state.redirects];
      const updatedRedirectIndex = updatedRedirects.findIndex(redirect => redirect.id === action.newData.id);
      const redirectToUpdate = updatedRedirects[updatedRedirectIndex];
      const updateMade = !redirectsAreEqual(redirectToUpdate, action.newData);
      if (updateMade) {
        updatedRedirects.splice(updatedRedirectIndex, 1, {
          ...action.newData,
          mergeStatus: action.newData.mergeStatus === 'NEW' ? 'NEW' : 'UPDATED',
        });
        return {
          ...state,
          updatesMade: true,
          unmergedChanges: true,
          redirects: updatedRedirects,
        };
      } else {
        return state;
      }
    }
    case 'EDIT_NEW_REDIRECT_FORM': {
      return {
        ...state,
        redirectFormData: {
          ...action.newData,
        },
      };
    }
    case 'SAVE_NEW_REDIRECT': {
      const updatedRedirects: RedirectType[] = [{ ...state.redirectFormData, mergeStatus: 'NEW' }, ...state.redirects];
      return {
        ...state,
        redirects: updatedRedirects,
        updatesMade: true,
        unmergedChanges: true,
        isEditing: false,
        redirectFormData: { from: '/', to: '/', status: 301, id: uuid(), mergeStatus: 'NEW' },
      };
    }
    case 'CANCEL_EDIT': {
      return {
        ...state,
        isEditing: false,
      };
    }
    case 'ADD_REDIRECT': {
      return {
        ...state,
        isEditing: true,
        redirectFormData: {
          to: '/',
          from: '/',
          status: 301,
          mergeStatus: 'NEW',
          id: uuid(),
        },
      };
    }
    case 'DELETE_REDIRECT': {
      const updatedRedirects = [...state.redirects];
      const deleteIndex = updatedRedirects.findIndex(redirect => redirect.id === action.id);
      updatedRedirects.splice(deleteIndex, 1, { ...updatedRedirects[deleteIndex], mergeStatus: 'DELETED' });
      return {
        ...state,
        redirects: updatedRedirects,
        updatesMade: true,
        unmergedChanges: true,
      };
    }
    case 'RESTORE_REDIRECT': {
      const updatedRedirects = [...state.redirects];
      const restoreIndex = updatedRedirects.findIndex(redirect => redirect.id === action.id);
      const existingRedirect = state.mainBranchTomlJson.redirects.find(redirect => redirect.id === action.id);
      const updatedRedirect = { ...updatedRedirects[restoreIndex] };
      if (existingRedirect && redirectsAreEqual(existingRedirect, updatedRedirect)) {
        updatedRedirect.mergeStatus = 'LIVE';
      } else {
        updatedRedirect.mergeStatus = 'UPDATED';
      }
      updatedRedirects.splice(restoreIndex, 1, updatedRedirect);
      return {
        ...state,
        redirects: updatedRedirects,
        updatesMade: true,
        unmergedChanges: true,
      };
    }
    case 'START_SAVING': {
      return { ...state, saving: true };
    }
    case 'END_SAVING': {
      return { ...state, saving: false };
    }
    case 'SHOW_PUBLISHED_MODAL': {
      return { ...state, showPublishedModal: true };
    }
    case 'CLOSE_PUBLISHED_MODAL': {
      return { ...state, showPublishedModal: false };
    }
    default: {
      return state;
    }
  }
};

export async function getStaticProps() {
  const { data } = await client.query({
    query: repoDetailsQuery,
    variables: {
      owner: env.githubOwner,
      name: env.githubRepo,
    },
  });

  return {
    props: {
      repo: data.repository,
    },
  };
}

const Home = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, {
    mainBranchTomlJson: { redirects: [] },
    workingBranchTomlJson: { redirects: [] },
    mainBranchSha: null,
    workingBranchSha: null,
    redirects: [],
    updatesMade: false,
    isEditing: false,
    redirectFormData: {
      to: '',
      from: '',
      status: 301,
      id: uuid(),
      mergeStatus: 'NEW',
    },
    unmergedChanges: false,
    saving: false,
    fetching: false,
    showPublishedModal: false,
  });

  const fetcher = async (url: string) => {
    dispatch({ type: 'DATA_FETCH_START' });
    const response = await fetch(url);
    if (response.status !== 200) {
      throw new Error('Could not get file');
    }
    const newData = await response.json();
    dispatch({ type: 'DATA_FETCH_END', newData });
    return newData;
  };

  const mergePull = async () => {
    dispatch({ type: 'START_SAVING' });
    const cleanedRedirects: RedirectType[] = state.redirects
      .filter(redirect => redirect.mergeStatus !== 'DELETED')
      .map(redirect => ({ ...redirect, mergeStatus: 'LIVE' }));
    await saveRedirects(cleanedRedirects);
    await fetch('/api/new-pull', { method: 'POST' }).then(async () => {
      await refetchFile();
    });

    dispatch({ type: 'SHOW_PUBLISHED_MODAL' });
    dispatch({ type: 'END_SAVING' });
  };

  const { data, mutate: refetchFile, error } = useSWR<GetFileResponse, { error: string }>('api/get-file', fetcher);

  const saveRedirects = useCallback(
    async (updatedRedirects: RedirectType[]) => {
      const updatedToml = toml.stringify({ ...state.workingBranchTomlJson, redirects: updatedRedirects });
      const base64EncodedToml = btoa(updatedToml);
      const body = {
        message: 'Update redirects',
        content: `${base64EncodedToml}`,
        sha: state.workingBranchSha,
        branch: 'a-new-branch',
      };
      await fetch('/api/save-file', { method: 'PUT', body: JSON.stringify(body) }).then(
        async () => await refetchFile()
      );
    },
    [refetchFile, state]
  );

  // Table Config
  const columns: readonly Column<RedirectType>[] = useMemo(
    () => [
      { Header: 'Status', accessor: 'mergeStatus' },
      { Header: 'From', accessor: 'from' },
      { Header: 'To', accessor: 'to' },
      { Header: 'Status', accessor: 'status' },
    ],
    []
  );

  const tableData = useMemo(() => state.redirects, [state]);

  const useTableProps = useTable(
    {
      columns,
      data: tableData,
      autoResetSortBy: false,
      autoResetGlobalFilter: false,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  if (error) return <div>An error occurred</div>;

  if (!data) {
    return <Loader message="Loading..." />;
  }

  return (
    <div>
      <div className="max-w-screen-xl w-11/12 mx-auto">
        <TableControls
          unmergedChanges={state.unmergedChanges}
          updatesMade={state.updatesMade}
          saveRedirects={async () => {
            dispatch({ type: 'START_SAVING' });
            await saveRedirects(state.redirects);
            dispatch({ type: 'END_SAVING' });
          }}
          useTableProps={useTableProps}
          dispatch={dispatch}
          mergePull={mergePull}
          saving={state.saving}
        />
        <Table loading={state.saving || state.fetching} useTableProps={useTableProps} dispatch={dispatch} />
      </div>
      {state.isEditing && <AddRedirectForm data={state.redirectFormData} dispatch={dispatch} />}
      {state.showPublishedModal && <PublishedModal closeModal={() => dispatch({ type: 'CLOSE_PUBLISHED_MODAL' })} />}
    </div>
  );
};

export default Home;
