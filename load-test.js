import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 1000, // virtual users
  duration: '1m', // test duration
};

export default function () {
  // Use the API path your backend exposes: /api/v1/blog (not /blogs)
  // If you're running nginx on port 80 (docker-compose), use http://localhost
  // If you're running the backend directly on port 3000, change to http://localhost:3000
  const base = 'http://localhost';
  const res = http.get(`${base}/api/v1/blog`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
