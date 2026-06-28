import React, { ReactNode, useState } from "react";

import styles from "./styles.module.css";

type OrganizationType = "monthly" | "daily";
type TreeNode = {
  id: string;
  name: string;
  kind: "directory" | "file";
  path: string;
  children?: TreeNode[];
};

type FileInfo = {
  path: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  lastModifiedDate: string;
};

const supportedImagePattern = /\.(jpe?g|png|gif|bmp|webp|heic|raw|tiff?)$/i;

declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }
}

function formatBytes(bytes: number) {
  if (!bytes) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function getFolderName(date: Date, type: OrganizationType) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return type === "daily" ? `${year}-${month}-${day}` : `${year}-${month}`;
}

function getFolderDisplayName(folderName: string, type: OrganizationType) {
  if (type === "daily") {
    const [year, month, day] = folderName.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return `${folderName} (${date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })})`;
  }

  const [year, month] = folderName.split("-").map(Number);
  const date = new Date(year, month - 1);
  return `${folderName} (${date.toLocaleDateString("en-US", { year: "numeric", month: "long" })})`;
}

async function buildDirectoryTree(
  directoryHandle: FileSystemDirectoryHandle,
  currentPath = "",
): Promise<{ tree: TreeNode; files: FileInfo[] }> {
  const files: FileInfo[] = [];
  const children: TreeNode[] = [];

  for await (const entry of directoryHandle.values()) {
    const fullPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

    if (entry.kind === "directory") {
      const nested = await buildDirectoryTree(entry, fullPath);
      children.push(nested.tree);
      files.push(...nested.files);
    } else {
      const file = await entry.getFile();
      children.push({
        id: fullPath,
        kind: "file",
        name: entry.name,
        path: currentPath,
      });
      files.push({
        path: currentPath,
        name: file.name,
        size: file.size,
        type: file.type || "unknown",
        lastModified: file.lastModified,
        lastModifiedDate: new Date(file.lastModified).toLocaleString(),
      });
    }
  }

  return {
    tree: {
      id: currentPath || directoryHandle.name,
      kind: "directory",
      name: directoryHandle.name,
      path: currentPath,
      children,
    },
    files,
  };
}

function DirectoryTree({ node }: { node: TreeNode }) {
  const [expanded, setExpanded] = useState(true);

  if (node.kind === "file") {
    return (
      <li className={styles.treeItem}>
        <span className={styles.file}>• {node.name}</span>
      </li>
    );
  }

  return (
    <li className={styles.treeItem}>
      <button
        className={styles.folderButton}
        onClick={() => setExpanded((value) => !value)}
        type="button"
      >
        {expanded ? "▾" : "▸"} {node.name}
      </button>
      {expanded && node.children && node.children.length > 0 ? (
        <ul className={styles.subtree}>
          {node.children.map((child) => (
            <DirectoryTree key={child.id} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function OfflineImageOrganizer() {
  const [status, setStatus] = useState(
    "Pick a folder to inspect local files without uploading anything.",
  );
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [imageFiles, setImageFiles] = useState<FileInfo[]>([]);
  const [organizationType, setOrganizationType] =
    useState<OrganizationType>("monthly");

  const supportsPicker =
    typeof window !== "undefined" &&
    typeof window.showDirectoryPicker === "function";

  async function selectFolder() {
    if (!supportsPicker) {
      setStatus(
        "This browser does not support the File System Access API. Use a Chromium-based browser for the live picker.",
      );
      return;
    }

    try {
      setStatus("Reading folder structure and file metadata...");
      const rootHandle = await window.showDirectoryPicker!();
      const result = await buildDirectoryTree(rootHandle);
      setTree(result.tree);
      setFiles(result.files);
      setImageFiles([]);
      setStatus(
        `Loaded ${result.files.length} files from ${rootHandle.name}. You can now filter the images and preview organization.`,
      );
    } catch {
      setStatus("Folder selection was cancelled or the browser denied access.");
    }
  }

  function readImages() {
    const nextImages = files.filter((file) =>
      supportedImagePattern.test(file.name),
    );
    setImageFiles(nextImages);
    setStatus(
      `Found ${nextImages.length} image files. Choose monthly or daily grouping and inspect the preview.`,
    );
  }

  const groupedImages = imageFiles.reduce<Record<string, FileInfo[]>>(
    (groups, file) => {
      const folderName = getFolderName(
        new Date(file.lastModified),
        organizationType,
      );
      if (!groups[folderName]) {
        groups[folderName] = [];
      }
      groups[folderName].push(file);
      return groups;
    },
    {},
  );

  const previewFolders = Object.keys(groupedImages).sort();

  function renderPreview(): ReactNode {
    if (imageFiles.length === 0) {
      return (
        <p className={styles.muted}>
          Read images first to see a monthly or daily organization preview.
        </p>
      );
    }

    return (
      <ul className={styles.previewTree}>
        {previewFolders.map((folderName) => (
          <li className={styles.previewItem} key={folderName}>
            <div className={styles.previewTitle}>
              📁 {getFolderDisplayName(folderName, organizationType)} (
              {groupedImages[folderName].length} images)
            </div>
            <ul className={styles.subtree}>
              {groupedImages[folderName].map((file) => (
                <li
                  className={styles.previewItem}
                  key={`${folderName}-${file.name}`}
                >
                  • {file.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Interactive Tool</span>
        <h2>Offline Image Organizer</h2>
        <p>
          Browse a local folder, inspect file metadata, isolate image files, and
          preview how they would be grouped by month or day. The workflow stays
          read-only and browser-local.
        </p>
      </div>

      <div className={styles.layout}>
        <section className={styles.pane}>
          <div className={styles.toolbar}>
            <button
              className={`${styles.button} ${styles.primary}`}
              onClick={selectFolder}
              type="button"
            >
              1. Select Folder
            </button>
            <button
              className={styles.button}
              disabled={files.length === 0}
              onClick={readImages}
              type="button"
            >
              2. Read Images
            </button>
          </div>

          <div className={styles.summaryGrid}>
            <div className={styles.statCard}>
              <strong>Total files</strong>
              <div className={styles.muted}>{files.length}</div>
            </div>
            <div className={styles.statCard}>
              <strong>Image files</strong>
              <div className={styles.muted}>{imageFiles.length}</div>
            </div>
            <div className={styles.statCard}>
              <strong>Folder groups</strong>
              <div className={styles.muted}>{previewFolders.length}</div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.statusRow}>
              <span
                className={`${styles.status} ${supportsPicker ? styles.ok : styles.warn}`}
              >
                {supportsPicker
                  ? "File picker supported"
                  : "File picker unavailable"}
              </span>
              <span className={styles.muted}>{status}</span>
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Folder tree</label>
            <div className={styles.panel}>
              {tree ? (
                <ul className={styles.tree}>
                  <DirectoryTree node={tree} />
                </ul>
              ) : (
                <p className={styles.muted}>No folder selected yet.</p>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>File details</label>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Path</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  {files.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={styles.muted}>
                        Pick a folder to load file metadata.
                      </td>
                    </tr>
                  ) : (
                    files.map((file) => (
                      <tr key={`${file.path}/${file.name}`}>
                        <td>{file.name}</td>
                        <td>{file.path || "/"}</td>
                        <td>{file.type}</td>
                        <td>{formatBytes(file.size)}</td>
                        <td>{file.lastModifiedDate}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={styles.pane}>
          <div className={styles.section}>
            <label className={styles.label}>Organization mode</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioCard}>
                <input
                  checked={organizationType === "monthly"}
                  name="organization"
                  onChange={() => setOrganizationType("monthly")}
                  type="radio"
                />
                Monthly albums
              </label>
              <label className={styles.radioCard}>
                <input
                  checked={organizationType === "daily"}
                  name="organization"
                  onChange={() => setOrganizationType("daily")}
                  type="radio"
                />
                Daily albums
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Preview</label>
            <div className={styles.panel}>{renderPreview()}</div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>Key details</label>
            <div className={styles.panel}>
              <pre className={styles.code}>{`Supported image pattern:
${supportedImagePattern}

Notes:
- Files are processed locally in the browser.
- The current tool is read-only.
- Browser support is best in Chromium-based browsers.`}</pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
