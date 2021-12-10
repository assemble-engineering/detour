import env from '../../env';
import fetch from './fetch';

export const fetcher = (url?: string, method = 'GET', body?: any) =>
  fetch(`${env.githubRestApi}${url}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_APP_GITHUB_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? body : null,
  })
    .then(res => {
      return res.json();
    })
    .catch(error => {
      return error;
    });

export const putter = (url: string, method = 'PUT', body: any) => {
  return fetch(`${env.githubRestApi}${url}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_APP_GITHUB_API_KEY}`,
      'Content-Type': 'application/vnd.github.v3+json',
    },
    body: body,
  })
    .then(res => {
      return res.json();
    })
    .catch(error => {
      return error;
    });
};

export const poster = (url: string, method = 'POST', body: any) => {
  return fetch(`${env.githubRestApi}${url}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_APP_GITHUB_API_KEY}`,
      'Content-Type': 'application/vnd.github.v3+json',
    },
    body: body,
  })
    .then(res => {
      return res.json();
    })
    .catch(error => {
      return error;
    });
};
