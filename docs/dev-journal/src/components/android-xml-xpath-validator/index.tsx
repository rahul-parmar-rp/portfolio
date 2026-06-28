import React, { ChangeEvent, ReactNode, useState } from "react";

import styles from "./styles.module.css";

const sampleXml = `<android.widget.FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.view.View
        android:id="@android:id/some_id"
        android:layout_width="50dp"
        android:layout_height="50dp"/>

    <android.widget.LinearLayout
        android:orientation="vertical"
        android:layout_height="wrap_content"
        android:layout_width="match_parent">

        <android.widget.TextView
            android:text="My apps &amp; games"
            android:content-description="Tab 1 of 2"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"/>

        <android.widget.FrameLayout
            android:id="@android:id/content"
            android:clickable="true"
            android:layout_width="match_parent"
            android:layout_height="200dp"/>

    </android.widget.LinearLayout>
</android.widget.FrameLayout>`;

const sampleXpath = `//android.widget.TextView[@android:text='My apps & games']`;

type StatusTone = "neutral" | "success" | "warning" | "error";
type ViewMode = "raw" | "tree";

type ResultState = {
  tone: StatusTone;
  title: string;
  message: string;
  rawMatches: string[];
  treeMatches: Element[];
};

const initialResult: ResultState = {
  tone: "neutral",
  title: "Ready to validate",
  message:
    "Paste Android XML, add an XPath, and inspect the matching nodes as raw XML or as a tree.",
  rawMatches: [],
  treeMatches: [],
};

function formatXml(xml: string) {
  let formatted = "";
  let indent = "";
  const tab = "    ";

  xml.split(/>\s*</).forEach((node) => {
    if (/^\/\w/.test(node)) {
      indent = indent.slice(tab.length);
    }

    formatted += `${indent}<${node}>\n`;

    if (/^<?\w[^>]*[^\/]$/.test(node)) {
      indent += tab;
    }
  });

  return formatted.slice(1, -2);
}

function statusClass(tone: StatusTone) {
  switch (tone) {
    case "success":
      return styles.statusSuccess;
    case "warning":
      return styles.statusWarning;
    case "error":
      return styles.statusError;
    default:
      return styles.statusNeutral;
  }
}

function nodeLabel(node: Element) {
  const attributes = Array.from(node.attributes);

  return (
    <span className={styles.line}>
      <span>&lt;</span>
      <span className={styles.tag}>{node.nodeName}</span>
      {attributes.map((attr) => (
        <React.Fragment key={`${node.nodeName}-${attr.name}`}>
          <span> </span>
          <span className={styles.attrName}>{attr.name}</span>
          <span>=</span>
          <span>"</span>
          <span className={styles.attrValue}>{attr.value}</span>
          <span>"</span>
        </React.Fragment>
      ))}
      <span>&gt;</span>
    </span>
  );
}

function TreeNode({ node }: { node: Element }) {
  const children = Array.from(node.children);

  if (children.length === 0) {
    return <div className={styles.treeNode}>{nodeLabel(node)}</div>;
  }

  return (
    <details className={styles.details} open>
      <summary className={styles.summaryNode}>{nodeLabel(node)}</summary>
      {children.map((child, index) => (
        <TreeNode key={`${child.nodeName}-${index}`} node={child} />
      ))}
    </details>
  );
}

export default function AndroidXmlXpathValidator() {
  const [xml, setXml] = useState(sampleXml);
  const [xpath, setXpath] = useState(sampleXpath);
  const [view, setView] = useState<ViewMode>("raw");
  const [result, setResult] = useState<ResultState>(initialResult);

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const text = String(loadEvent.target?.result || "");
      setXml(text);
      setResult(initialResult);
    };
    reader.onerror = () => {
      setResult({
        tone: "error",
        title: "File read failed",
        message:
          reader.error?.message ||
          "The XML file could not be read in the browser.",
        rawMatches: [],
        treeMatches: [],
      });
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function clearAll() {
    setXml("");
    setXpath("");
    setResult(initialResult);
    setView("raw");
  }

  function validate() {
    const xmlString = xml.trim();
    const xpathString = xpath.trim();

    if (!xmlString) {
      setResult({
        tone: "warning",
        title: "XML is empty",
        message: "Add Android XML before running the XPath validator.",
        rawMatches: [],
        treeMatches: [],
      });
      return;
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const errorNode = xmlDoc.querySelector("parsererror");

    if (errorNode) {
      setResult({
        tone: "error",
        title: "XML parsing error",
        message:
          errorNode.textContent?.trim() ||
          "The XML document is not well formed.",
        rawMatches: [],
        treeMatches: [],
      });
      return;
    }

    if (!xpathString) {
      setResult({
        tone: "warning",
        title: "XPath is empty",
        message:
          "The XML parsed correctly, but there is no XPath expression to evaluate.",
        rawMatches: [],
        treeMatches: [],
      });
      return;
    }

    const nsResolver = (prefix: string | null) => {
      if (prefix === "android") {
        return "http://schemas.android.com/apk/res/android";
      }

      return null;
    };

    try {
      const iterator = xmlDoc.evaluate(
        xpathString,
        xmlDoc,
        nsResolver,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null,
      );

      const matches: Element[] = [];
      let nextNode = iterator.iterateNext();

      while (nextNode) {
        if (nextNode.nodeType === Node.ELEMENT_NODE) {
          matches.push(nextNode as Element);
        }
        nextNode = iterator.iterateNext();
      }

      if (matches.length === 0) {
        setResult({
          tone: "warning",
          title: "No matches found",
          message:
            "The XML is valid, but the XPath expression did not return any element nodes.",
          rawMatches: [],
          treeMatches: [],
        });
        return;
      }

      const serializer = new XMLSerializer();
      setResult({
        tone: "success",
        title: `Found ${matches.length} matching node${matches.length === 1 ? "" : "s"}`,
        message:
          "The XML is well formed and the XPath expression evaluated successfully.",
        rawMatches: matches.map((match) =>
          formatXml(serializer.serializeToString(match)),
        ),
        treeMatches: matches,
      });
    } catch (error) {
      setResult({
        tone: "error",
        title: "XPath evaluation error",
        message:
          error instanceof Error
            ? error.message
            : "The XPath expression could not be evaluated.",
        rawMatches: [],
        treeMatches: [],
      });
    }
  }

  function renderResultContent(): ReactNode {
    if (view === "raw") {
      if (result.rawMatches.length === 0) {
        return <pre className={styles.pre}>{result.message}</pre>;
      }

      return result.rawMatches.map((match, index) => (
        <section className={styles.rawItem} key={`raw-${index}`}>
          <div className={styles.rawHeader}>Node {index + 1}</div>
          <pre className={styles.codeBlock}>{match}</pre>
        </section>
      ));
    }

    if (result.treeMatches.length === 0) {
      return <pre className={styles.pre}>{result.message}</pre>;
    }

    return result.treeMatches.map((match, index) => (
      <section className={styles.treeItem} key={`tree-${index}`}>
        <div className={styles.treeHeader}>Node {index + 1}</div>
        <TreeNode node={match} />
      </section>
    ));
  }

  return (
    <div className={styles.shell}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Interactive Tool</span>
        <h2>Android XML + XPath Playground</h2>
        <p>
          Paste layout XML, try XPath selectors against Android namespaces, and
          inspect the matches as either raw XML or a collapsible tree. This
          version lives directly inside the docs so it can be explained, linked,
          and improved alongside the written guide.
        </p>
      </div>

      <div className={styles.layout}>
        <section className={styles.pane}>
          <div className={styles.labelRow}>
            <div>
              <div className={styles.label}>Android XML</div>
              <div className={styles.subtle}>
                Paste a layout file or upload one from disk.
              </div>
            </div>
            <label className={styles.uploadButton}>
              Upload XML
              <input
                className={styles.hiddenInput}
                type="file"
                accept=".xml,text/xml"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <textarea
            className={styles.textarea}
            value={xml}
            onChange={(event) => setXml(event.target.value)}
            placeholder="Paste Android XML here"
            spellCheck={false}
          />

          <div style={{ marginTop: "1rem" }}>
            <div className={styles.label}>XPath Expression</div>
            <textarea
              className={`${styles.textarea} ${styles.xpathInput}`}
              value={xpath}
              onChange={(event) => setXpath(event.target.value)}
              placeholder="//android.widget.TextView"
              spellCheck={false}
            />
          </div>

          <div className={styles.actions} style={{ marginTop: "1rem" }}>
            <button
              className={`${styles.action} ${styles.primary}`}
              type="button"
              onClick={validate}
            >
              Validate XPath
            </button>
            <button
              className={`${styles.action} ${styles.secondary}`}
              type="button"
              onClick={clearAll}
            >
              Clear
            </button>
          </div>

          <div className={styles.tipGrid}>
            <div className={styles.tipCard}>
              <strong>Namespace reminder</strong>
              Android attributes are resolved through the `android` namespace
              URI, so selectors like `@android:text` will work in this
              playground.
            </div>
            <div className={styles.tipCard}>
              <strong>Best for layout debugging</strong>
              This is useful when you are testing selectors for UI automation,
              scraping, or accessibility inspection against real Android view
              hierarchies.
            </div>
          </div>
        </section>

        <section className={styles.pane}>
          <div className={styles.tabRow}>
            <div>
              <div className={styles.label}>Result Inspector</div>
              <div className={styles.subtle}>
                Switch between raw XML matches and a structural view.
              </div>
            </div>

            <div className={styles.tabGroup}>
              <button
                className={`${styles.tabButton} ${view === "raw" ? styles.tabActive : ""}`}
                type="button"
                onClick={() => setView("raw")}
              >
                Raw
              </button>
              <button
                className={`${styles.tabButton} ${view === "tree" ? styles.tabActive : ""}`}
                type="button"
                onClick={() => setView("tree")}
              >
                Tree
              </button>
            </div>
          </div>

          <div className={styles.resultPanel}>
            <div className={styles.statusRow}>
              <span className={`${styles.status} ${statusClass(result.tone)}`}>
                {result.title}
              </span>
            </div>
            <p className={styles.summary}>{result.message}</p>
            {renderResultContent()}
          </div>
        </section>
      </div>
    </div>
  );
}
