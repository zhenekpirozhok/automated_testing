import { test, expect } from "@playwright/test";

const BASE_URL = "https://jsonplaceholder.typicode.com";

test("GET /posts: should return an array with more than 0 elements", async ({
  request,
}) => {
  const response = await request.get(`${BASE_URL}/posts`);
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();
  expect(data.length).toBeGreaterThan(0);
});

test("GET /comments with parameter: should return elements with postId equal to parameter", async ({
  request,
}) => {
  const parameter = 1;
  const response = await request.get(
    `${BASE_URL}/comments?postId=${parameter}`
  );
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(Array.isArray(data)).toBeTruthy();
  expect(data.length).toBeGreaterThan(0);

  for (const item of data) {
    expect(item.postId).toBe(parameter);
  }
});

test("POST /posts: should create a new post with expected data", async ({
  request,
}) => {
  const postData = {
    title: "test title",
    body: "test body",
    userId: 1,
  };

  // Create a new post
  const response = await request.post(`${BASE_URL}/posts`, {
    data: postData,
  });
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(data).toMatchObject({
    ...postData,
    id: expect.any(Number), // Allow any valid ID assigned by the API
  });

  const postId = data.id;

  // Cleanup: Delete the created post
  const deleteResponse = await request.delete(`${BASE_URL}/posts/${postId}`);
  expect(deleteResponse.ok()).toBeTruthy();
});

test('GraphQL /graphql: should fetch episodes containing "Rick" in the name', async ({
  request,
}) => {
  const graphqlQuery = {
    query: `
        query {
          episodes(filter: { name: "Rick" }) {
            results {
              name
            }
          }
        }
      `,
  };

  const response = await request.post("https://rickandmortyapi.com/graphql", {
    data: graphqlQuery,
  });
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  const episodes = data.data.episodes.results;

  expect(Array.isArray(episodes)).toBeTruthy();
  expect(episodes.length).toBeGreaterThan(0);

  for (const episode of episodes) {
    expect(episode.name.toLowerCase()).toContain("rick");
  }
});
