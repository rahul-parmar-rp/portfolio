import React, { useMemo, useState } from "react";

import styles from "./styles.module.css";

type ExampleKey = "nested-anchor" | "nested-button" | "safe-layout";

const examples: Record<
  ExampleKey,
  {
    label: string;
    html: string;
    safe: boolean;
    description: string;
    live: React.ReactNode;
  }
> = {
  "nested-anchor": {
    label: "Nested links",
    safe: false,
    description:
      "This is invalid HTML. Browsers repair it into separate anchors or otherwise normalize the tree before React hydrates.",
    html: `<a href="/products">
  <a href="/products/123">View Product</a>
</a>`,
    live: (
      <div>
        <div className={styles.linkCard}>
          <a className={styles.actualLink} href="#outer-link-demo">
            Outer link shell
          </a>
        </div>
        <div className={styles.linkCard}>
          <a className={styles.actualLink} href="#inner-link-demo">
            Inner link that the browser separates into its own clickable node
          </a>
        </div>
      </div>
    ),
  },
  "nested-button": {
    label: "Nested buttons",
    safe: false,
    description:
      "Nested buttons are also invalid. Browsers split or ignore parts of the structure, which makes React hydration compare against a different DOM than the server output.",
    html: `<button>
  Click me
  <button>Nested button</button>
</button>`,
    live: (
      <div>
        <div className={styles.buttonCard}>
          <button className={styles.actualButton} type="button">
            Outer button shell
          </button>
        </div>
        <div className={styles.buttonCard}>
          <button className={styles.actualButton} type="button">
            Nested button that ends up detached
          </button>
        </div>
      </div>
    ),
  },
  "safe-layout": {
    label: "Safe alternative",
    safe: true,
    description:
      "This keeps only one interactive wrapper per action and moves secondary content into spans or separate controls.",
    html: `<div class="card">
  <a class="primary-link" href="/products/123">
    <span>View Product</span>
  </a>
  <button class="secondary-action" type="button">Save</button>
</div>`,
    live: (
      <div>
        <div className={styles.safeCard}>
          <a className={styles.actualLink} href="#safe-primary-demo">
            View product
          </a>
          <button className={styles.actualButton} type="button">
            Save
          </button>
        </div>
      </div>
    ),
  },
};

function renderNodeTree(node: Node, depth = 0): React.ReactNode {
  const key = `${node.nodeName}-${depth}-${node.textContent?.slice(0, 12) || ""}`;

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    if (!text) {
      return null;
    }

    return (
      <li className={styles.treeItem} key={key}>
        <span className={styles.line}>
          <span>{" ".repeat(depth * 2)}</span>
          <span>"{text}"</span>
        </span>
      </li>
    );
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as Element;
  const attributes = Array.from(element.attributes)
    .map((attribute) => `${attribute.name}="${attribute.value}"`)
    .join(" ");

  return (
    <li className={styles.treeItem} key={key}>
      <span className={styles.line}>
        <span>{" ".repeat(depth * 2)}</span>
        <span>&lt;</span>
        <span className={styles.nodeName}>{element.tagName.toLowerCase()}</span>
        {attributes ? <span> {attributes}</span> : null}
        <span>&gt;</span>
      </span>
      {element.childNodes.length > 0 ? (
        <ul className={styles.tree}>
          {Array.from(element.childNodes).map((child, index) => (
            <React.Fragment key={`${key}-${index}`}>
              {renderNodeTree(child, depth + 1)}
            </React.Fragment>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function NestedInteractiveElementsDemo() {
  const [selected, setSelected] = useState<ExampleKey>("nested-anchor");
  const [customHtml, setCustomHtml] = useState(examples["nested-anchor"].html);

  const selectedExample = examples[selected];
  const parsedDocument = useMemo(() => {
    if (typeof DOMParser === "undefined") {
      return null;
    }

    const parser = new DOMParser();
    return parser.parseFromString(customHtml, "text/html");
  }, [customHtml]);
  const normalizedDom = parsedDocument
    ? parsedDocument.body.innerHTML.trim() || "(empty body)"
    : "DOMParser becomes available after the page hydrates in the browser.";
  const topLevelNodes = parsedDocument
    ? Array.from(parsedDocument.body.childNodes)
    : [];

  function loadExample(exampleKey: ExampleKey) {
    setSelected(exampleKey);
    setCustomHtml(examples[exampleKey].html);
  }

  return (
    <div className={styles.shell}>
      <div className={styles.hero}>
        <h2>Browser DOM Repair Demo</h2>
        <p>
          Paste invalid nested interactive markup and compare the source string
          against the DOM the browser actually builds. This is the mismatch
          React later hydrates against.
        </p>
      </div>

      <div className={styles.layout}>
        <section className={styles.pane}>
          <div className={styles.controls}>
            {Object.entries(examples).map(([key, value]) => (
              <button
                key={key}
                className={`${styles.chip} ${selected === key ? styles.chipActive : ""}`}
                onClick={() => loadExample(key as ExampleKey)}
                type="button"
              >
                {value.label}
              </button>
            ))}
          </div>

          <div className={styles.section}>
            <label className={styles.label} htmlFor="nested-interactive-source">
              Source markup
            </label>
            <div className={styles.muted}>{selectedExample.description}</div>
            <textarea
              id="nested-interactive-source"
              className={styles.textarea}
              spellCheck={false}
              value={customHtml}
              onChange={(event) => setCustomHtml(event.target.value)}
            />
          </div>

          <div className={styles.notes}>
            <div className={styles.note}>
              <strong>What to look for</strong>
              The parser often closes the outer interactive element earlier than
              your source suggests, so the actual DOM tree is flatter or
              re-parented.
            </div>
            <div className={styles.note}>
              <strong>Why hydration fails</strong>
              React compares the browser DOM against the server markup string.
              If the browser repaired the tree, React sees a different structure
              and warns or re-renders.
            </div>
          </div>
        </section>

        <section className={styles.pane}>
          <div className={styles.section}>
            {selectedExample.safe ? (
              <span className={styles.safe}>Safe structure</span>
            ) : (
              <span className={styles.warning}>
                Invalid interactive nesting
              </span>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.title}>Browser-parsed HTML</div>
            <div className={styles.panel}>
              <pre className={styles.code}>{normalizedDom}</pre>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.title}>DOM tree the browser created</div>
            <div className={styles.panel}>
              <ul className={styles.tree}>
                {topLevelNodes.map((node, index) => (
                  <React.Fragment key={`top-${index}`}>
                    {renderNodeTree(node)}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.title}>Approximate live behavior</div>
            <div className={styles.liveZone}>{selectedExample.live}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
