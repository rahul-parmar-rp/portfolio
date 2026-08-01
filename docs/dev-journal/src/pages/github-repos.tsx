import React, { useEffect, useState } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
};

const username = "rahul-parmar-rp";

export default function GitHubReposPage(): React.ReactElement {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadRepos() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=200`,
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = (await response.json()) as GitHubRepo[];

        if (isMounted) {
          setRepos(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Unable to fetch repositories",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadRepos();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout
      title="GitHub Repositories"
      description="A live list of Rahul Parmar's GitHub repositories"
    >
      <main style={{ padding: "2rem 1rem 4rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <Heading as="h1">My GitHub Repositories</Heading>
          <p style={{ fontSize: "1rem", marginBottom: "1.5rem" }}>
            These repositories are fetched directly from GitHub&apos;s official
            API and displayed with live links.
          </p>

          {loading && <p>Loading repositories…</p>}

          {error && (
            <p role="alert" style={{ color: "var(--ifm-color-danger)" }}>
              Unable to load repositories right now: {error}
            </p>
          )}

          {!loading && !error && (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: "1rem",
              }}
            >
              {repos.map((repo) => (
                <li
                  key={repo.id}
                  style={{
                    border: "1px solid var(--ifm-color-emphasis-300)",
                    borderRadius: "12px",
                    padding: "1rem 1.25rem",
                    background: "var(--ifm-background-surface-color)",
                  }}
                >
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "1.05rem", fontWeight: 600 }}
                  >
                    {repo.name}
                  </a>
                  <p style={{ margin: "0.5rem 0 0.25rem" }}>
                    {repo.description || "No description provided."}
                  </p>
                  <div style={{ color: "var(--ifm-color-emphasis-700)" }}>
                    {repo.language
                      ? `Language: ${repo.language}`
                      : "Language: N/A"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </Layout>
  );
}
