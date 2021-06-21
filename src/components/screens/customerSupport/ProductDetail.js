import React, { Fragment } from 'react';

function ProductDetail() {
  return (
    <Fragment>
      <div className='col-lg-3 col-md-3 col-sm-6 col-xs-12 col-8 detailbox-container'>
        <div className='users-container'>
          <h5>Product Detail</h5>
          <ul className='custom-data'>
            <li>
              <div className='site-name'>
                Website : <span className='site-n'> theMobileCover</span>
              </div>
            </li>
            <li>
              <div className='site-name'>
                Customer Location :{' '}
                <span className='site-n'> Product Page</span>
              </div>
            </li>
            <li>
              <div className='site-name'>
                Page Link :{' '}
                <span>
                  <span className='site-n'> Web Page Link Page</span>
                </span>
              </div>
            </li>
            <li>
              <h6>Product:</h6>
              <table className='table product-data'>
                <tbody>
                  <tr>
                    <th scope='row'>SKU</th>
                    <td>FB00070</td>
                  </tr>
                  <tr>
                    <th scope='row'>Title</th>
                    <td>Fast Charger</td>
                  </tr>
                  <tr>
                    <th scope='row'>Image</th>
                    <td>
                      <img
                        src='assets/img/image.png'
                        max-width='100px'
                        className='img-fluid'
                        alt='p-img'
                      />
                    </td>
                  </tr>
                  <tr>
                    <th scope='row'>Catgeory</th>
                    <td>Chargers</td>
                  </tr>
                  <tr>
                    <th scope='row'>Stock Available</th>
                    <td colSpan='2'>1002</td>
                  </tr>
                </tbody>
              </table>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default ProductDetail;
