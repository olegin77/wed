/* global __ENV */
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL ?? 'http://localhost:3000';
const SEARCH_ENDPOINT = `${BASE_URL}/search`; // expected GET /search?q=
const HEALTH_ENDPOINT = `${BASE_URL}/health`;

const searchDuration = new Trend('search_duration');

const queries = new SharedArray('search-queries', () => [
  'ресторан',
  'фотограф',
  'ведущий',
  'декор',
  'выездная церемония',
  'dj',
  'фуршет',
  'аниматор',
]);

export const options = {
  scenarios: {
    warmup: {
      executor: 'constant-arrival-rate',
      exec: 'searchFlow',
      rate: 10,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 10,
      maxVUs: 40,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    search_duration: ['p(95)<900'],
  },
};

export function setup() {
  const res = http.get(HEALTH_ENDPOINT);
  check(res, { 'gateway healthy': (r) => r.status === 200 });
  return { baseUrl: BASE_URL };
}

export function searchFlow() {
  const query = queries[Math.floor(Math.random() * queries.length)];
  group(`search ${query}`, () => {
    const res = http.get(`${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}`);
    searchDuration.add(res.timings.duration);
    check(res, {
      'search ok': (r) => r.status === 200,
      'has results array': (r) => {
        try {
          const body = r.json();
          return Array.isArray(body?.results);
        } catch (error) {
          console.error('invalid json', error);
          return false;
        }
      },
    });
  });
  sleep(1);
}

export function handleSummary(data) {
  return {
    'k6-summary.json': JSON.stringify(data, null, 2),
  };
}
