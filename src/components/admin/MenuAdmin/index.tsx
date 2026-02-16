'use client';

import { logoutAction } from '@/actions/login/logout-action';
import clsx from 'clsx';
import {
  FileTextIcon,
  HomeIcon,
  HourglassIcon,
  HouseIcon,
  LogOutIcon,
  PlusIcon,
  UserPenIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export default function MenuAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navClasses = clsx(
    'bg-slate-900, text-slate-100 rounded-lg',
    'flex flex-col mb-4',
    'sm:flex-row sm:flex-wrap sm:gap-2 sm:justify-center',
    !isOpen && 'overflow-hidden',
    !isOpen && 'h-10',
    'sm:overflow-visible sm:h-auto'
  );
  const linkClasses = clsx(
    `[&>svg]:w-[16px] [&>svg]:h-[16px] px-4 bg-slate-800`,
    'flex items-center justify-start gap-2 cursor-pointer',
    'hover:bg-slate-700 rounded-md',
    'h-10',
    'shrink-0'
  );
  const openButtonClasses = clsx(
    linkClasses,
    'text-blue-200 italic',
    'sm:hidden'
  );

  function handleLogout(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <nav className={navClasses}>
      <button
        className={openButtonClasses}
        onClick={() => setIsOpen((s) => !s)}
      >
        {!isOpen && (
          <>
            <HomeIcon className="inline-block h-4 w-4" />
            Menu
          </>
        )}

        {isOpen && (
          <>
            <HomeIcon className="inline-block h-4 w-4" />
            Close
          </>
        )}
      </button>

      <a className={linkClasses} href="/" target="_blank">
        <HouseIcon className="inline-block h-4 w-4" />
        Home
      </a>

      <Link className={linkClasses} href="/admin/post">
        <FileTextIcon className="inline-block h-4 w-4" />
        Posts
      </Link>

      <Link className={linkClasses} href="/admin/user">
        <UserPenIcon className="inline-block h-4 w-4" />
        Seus dados
      </Link>

      <Link className={linkClasses} href="/admin/post/new">
        <PlusIcon className="inline-block h-4 w-4" />
        Criar Post
      </Link>

      <a href="#" onClick={handleLogout} className={linkClasses}>
        {isPending ? (
          <>
            <HourglassIcon className="inline-block h-4 w-4 animate-spin" />
            Saindo...
          </>
        ) : (
          <>
            <LogOutIcon className="inline-block h-4 w-4" />
            Sair
          </>
        )}
      </a>
    </nav>
  );
}
