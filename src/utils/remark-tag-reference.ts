// eslint-disable-next-line @typescript-eslint/no-explicit-any
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Parent, Text } from 'unist';

const mentionRegex = /@([a-zA-Z0-9_-]{3,32})/g;

/**
 * Remark plugin that transforms @mentions into link nodes with tag: prefix
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const remarkTagReference: Plugin = () => (tree: any) => {
  visit(tree, 'text', (node: Text, index: number, parent: Parent | undefined) => {
    if (!parent) return;
    const value = String(node.value);
    const matches = [...value.matchAll(mentionRegex)];
    if (matches.length === 0) return;
    const nodes: Array<Text | { type: 'link'; url: string; children: Text[] }> = [];
    let lastIndex = 0;
    for (const m of matches) {
      if (m.index! > lastIndex) {
        nodes.push({ type: 'text', value: value.slice(lastIndex, m.index) });
      }
      nodes.push({
        type: 'link',
        url: `tag:${m[1]}`,
        children: [{ type: 'text', value: `@${m[1]}` }],
      });
      lastIndex = m.index! + m[0].length;
    }
    if (lastIndex < value.length) {
      nodes.push({ type: 'text', value: value.slice(lastIndex) });
    }
    (parent.children as Array<Text | { type: 'link'; url: string; children: Text[] }>).splice(
      index,
      1,
      ...nodes
    );
  });
};

export default remarkTagReference;
