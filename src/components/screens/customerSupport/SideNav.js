import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';

function SideNav() {
  const customerHandler = () => {
    // Mobile chat-box hide/show
    $('.usersbox-container').toggleClass('show-list');
  };

  const productHandler = () => {
    // Product detail hide/show

    $('.detailbox-container').toggleClass('show-list');
  };

  return (
    <Fragment>
      {/* Sidebar */}
      <ul
        className='navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled'
        id='accordionSidebar'>
        {/* Sidebar - Logo */}
        <Link
          className='sidebar-brand d-flex align-items-center justify-content-center'
          to='/'>
          <div className='sidebar-brand-icon rotate-n-15'>
            <i className='fas fa-laugh-wink'></i>
          </div>
          <div className='sidebar-brand-text mx-3'>Chat App</div>
        </Link>

        {/* Divider */}
        <hr className='sidebar-divider my-0' />

        {/* Nav Item - Dashboard */}
        <li className='nav-item active'>
          <Link to='/' className='nav-link'>
            <i className='fas fa-fw fa-tachometer-alt'></i>
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Divider */}
        <hr className='sidebar-divider' />

        {/* Nav Item - Chat */}
        <li
          className='nav-item'
          id='customer-list--show'
          onClick={customerHandler}>
          <span className='nav-link'>
            <i className='fas fa-list'></i>
            <span>Customers</span>
          </span>
        </li>

        {/* Nav Item - Chat */}
        <li className='nav-item'>
          <Link to='/' className='nav-link'>
            <i className='far fa-comment-dots'></i>
            <span>Chat</span>
          </Link>
        </li>
        {/* Nav Item - Slider */}
        <li
          className='nav-item'
          id='detail-list--show'
          onClick={productHandler}>
          <span className='nav-link'>
            <i className='fas fa-sliders-h'></i>
            <span>Product</span>
          </span>
        </li>

        {/* Divider */}
        <hr className='sidebar-divider d-none d-md-block' />

        {/* Sidebar Toggler (Sidebar) */}
        <div className='text-center d-none d-md-inline'>
          <button
            className='rounded-circle border-0'
            id='sidebarToggle'></button>
        </div>
      </ul>
      {/* End of Sidebar */}
    </Fragment>
  );
}

export default SideNav;
