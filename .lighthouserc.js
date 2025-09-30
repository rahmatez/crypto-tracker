module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.7}],
        'categories:accessibility': ['warn', {minScore: 0.8}],
        'categories:best-practices': ['warn', {minScore: 0.8}],
        'categories:seo': ['warn', {minScore: 0.75}],
        'first-contentful-paint': ['warn', {maxNumericValue: 3000}],
        'largest-contentful-paint': ['warn', {maxNumericValue: 4000}]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};