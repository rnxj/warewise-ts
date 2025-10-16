import { createFileRoute, notFound } from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';

export const Route = createFileRoute('/_static/docs/$name')({
  component: RouteComponent,
  loader: async (event) => {
    const response = await fetch(`${event.location.url}.md`);
    if (!response.ok) {
      throw notFound();
    }
    const markdown = await response.text();
    return { markdown };
  },
});

const markdownStyles = {
  h1: 'text-2xl sm:text-3xl font-bold my-3 sm:my-4',
  h2: 'text-xl sm:text-2xl font-semibold my-2 sm:my-3 border-b border-border pb-2',
  h3: 'text-lg sm:text-xl font-medium my-2',
  p: 'my-2 leading-relaxed text-sm sm:text-base',
  a: 'text-primary underline break-words',
  ul: 'list-disc ml-4 sm:ml-6 my-2 text-sm sm:text-base',
  ol: 'list-decimal ml-4 sm:ml-6 my-2 text-sm sm:text-base',
  li: 'my-1',
  code: 'bg-muted px-1.5 py-0.5 rounded font-mono text-xs sm:text-sm text-muted-foreground border border-border',
  pre: 'bg-muted p-2 sm:p-4 rounded-b-lg overflow-x-auto text-xs sm:text-sm shadow-md border border-border',
  blockquote:
    'border-l-4 border-primary pl-3 sm:pl-4 italic my-3 sm:my-4 text-sm sm:text-base',
};

function RouteComponent() {
  const { markdown: content } = Route.useLoaderData();

  return (
    <div className="w-full">
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className={markdownStyles.h1}>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className={markdownStyles.h2}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className={markdownStyles.h3}>{children}</h3>
            ),
            p: ({ children }) => <p className={markdownStyles.p}>{children}</p>,
            a: ({ href, children }) => (
              <a
                className={markdownStyles.a}
                href={href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {children}
              </a>
            ),
            ul: ({ children }) => (
              <ul className={markdownStyles.ul}>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className={markdownStyles.ol}>{children}</ol>
            ),
            li: ({ children }) => (
              <li className={markdownStyles.li}>{children}</li>
            ),
            // biome-ignore lint/suspicious/noExplicitAny: we cant know the type of the node
            code: ({ className, children, ...props }: any) =>
              className?.includes('language-') ? (
                <code className={className} {...props}>
                  {children}
                </code>
              ) : (
                <code className={markdownStyles.code} {...props}>
                  {children}
                </code>
              ),
            blockquote: ({ children }) => (
              <blockquote className={markdownStyles.blockquote}>
                {children}
              </blockquote>
            ),
            br: () => <br className="my-2" />,
            hr: () => <hr className="my-9 border-border" />,
          }}
          rehypePlugins={[rehypeHighlight]}
          remarkPlugins={[remarkGfm, remarkBreaks]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
