export const BASE_HOST = {
  host:
    process.env.REACT_APP_MODE === 'PROD'
      ? 'http://223.130.134.235:8000'
      : 'http://dev2.dayludens.com:7040',
  file:
    process.env.REACT_APP_MODE === 'PROD'
      ? 'http://223.130.134.235:8080'
      : 'http://dev2.dayludens.com:8140',
};

export default BASE_HOST;
