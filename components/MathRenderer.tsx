'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '', block = false }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // If whole string is meant to be rendered as block KaTeX
    if (block) {
      try {
        return katex.renderToString(content, { displayMode: true, throwOnError: false });
      } catch {
        return content;
      }
    }

    // Split text by $$ (display math) and $ (inline math)
    const displayRegex = /\$\$([\s\S]*?)\$\$/g;
    let replaced = content.replace(displayRegex, (_, math) => {
      try {
        return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
      } catch {
        return `$$${math}$$`;
      }
    });

    const inlineRegex = /\$([^\$]+?)\$/g;
    replaced = replaced.replace(inlineRegex, (_, math) => {
      try {
        return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
      } catch {
        return `$${math}$`;
      }
    });

    // Replace linebreaks with <br/> for prose paragraphs if not inside display equations
    return replaced.replace(/\n\n/g, '<div class="h-2"></div>').replace(/\n/g, '<br/>');
  }, [content, block]);

  return (
    <div
      className={`katex-rendered-content ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
