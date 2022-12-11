import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import { useRouter } from 'next/router';
// import { SearchIcon } from '@heroicons/react/24/solid';
import { FiSearch } from 'react-icons/fi';

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const [query, setQuery] = useState('');

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <>
      <Head>
        <title>{title ? title + ' - Amazon' : 'Amazon'}</title>
        <meta name='description' content='E-commerce Website' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <ToastContainer position='bottom-center' limit={1} />

      <div className='flex min-h-screen flex-col justify-between '>
        <header>
          <nav className='flex h-16 items-center px-4 justify-between shadow-xl'>
            <Link href='/' legacyBehavior>
              <a className='text-4xl font-bold'>Amazon</a>
            </Link>
            <form
              onSubmit={submitHandler}
              className='mx-auto  hidden w-full justify-center md:flex'
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type='text'
                className='rounded-tr-none rounded-br-none p-2 text-base   focus:ring-0'
                placeholder='Search products'
              />
              <button
                className='rounded rounded-tl-none rounded-bl-none bg-amber-300 p-2 text-base dark:text-black'
                type='submit'
                id='button-addon2'
              >
                <FiSearch className='h-5 w-5'></FiSearch>
              </button>
            </form>
            <div className='flex'>
              <Link href='/about' legacyBehavior>
                <a className='p-2 text-lg'>About Us</a>
              </Link>
              <Link href='/blog' legacyBehavior>
                <a className='p-2 text-lg'>Blog</a>
              </Link>


              <Link href='/cart' legacyBehavior>
                <a className='p-2 text-lg'>
                  Cart
                  {cartItemsCount > 0 && (
                    <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>

              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as='div' className=''>
                  <Menu.Button className='text-blue-600 mt-2 font-bold text-lg'>
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className='absolute right-0 w-56 origin-top-right bg-white  shadow-lg '>
                    <Menu.Item>
                      <DropdownLink className='dropdown-link' href='/profile'>
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className='dropdown-link'
                        href='/order-history'
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className='dropdown-link'
                          href='/admin/dashboard'
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className='dropdown-link'
                        href='#'
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href='/login' legacyBehavior>
                  <a className='p-2'>Login</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className='container m-auto mt-4 px-4'>{children}</main>
        <footer className='flex h-10 justify-center items-center shadow-inner'>
          <p>Copyright © 2022 Amazon</p>
        </footer>
      </div>
    </>
  );
}
