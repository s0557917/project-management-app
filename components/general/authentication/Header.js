import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query'
import { getDefaultView } from '../../../utils/db/queryFunctions/settings';
import { Loader } from '@mantine/core';

const Header = ({}) => {
  const {data: defaultView, isLoading:isLoadingDefaultView, isError:errorDefaultView} = useQuery(['defaultView'], getDefaultView);

  const { data: session, status } = useSession();
  const router = useRouter();

  const isActive = (pathname) => router.pathname === pathname;

  const redirectToDefaultView = async () => {
    if(!isLoadingDefaultView && !errorDefaultView && defaultView) {
      router.push(`/${defaultView}`);
    }
  }

  let content = (<></>);

  if (!session) {
    content = (
      <div className="right">
        <Link href="/api/auth/signin">
          <a data-active={isActive('/signup')}>Log in</a>
        </Link>
      </div>
    );
  }

  if (session) {
    redirectToDefaultView();
    content = (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className='flex flex-col items-center'>
          <Loader color="green" size="xl" />
          <h1 className='pt-2'>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      {content}
    </div>
  );
};

export default Header;