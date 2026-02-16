'use client';

import Link from 'next/link';
import React from 'react';

type ErrorMessageProps = {
  pageTitle?: string;
  contentTitle?: string;
  content: React.ReactNode;
};

export default function ErrorMessage({
  pageTitle = 'Ops! Algo deu errado.',
  content,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-slate-100 p-8 dark:bg-slate-900">
      {pageTitle && (
        <h1 className="text-7xl font-extrabold text-slate-900 dark:text-slate-100">
          {pageTitle}
        </h1>
      )}
      <p className="mb-4 text-slate-700 dark:text-slate-300">{content}</p>
      <Link
        href="/"
        className="rounded-lg bg-slate-900 px-6 py-3 text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
      >
        Voltar para Home
      </Link>
    </div>
  );
}
