import React, { Fragment } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export const LeftMsgSkeleton = () => {
  return (
    <Fragment>
      <SkeletonTheme color='#ddd' highlightColor='#e8e8e8'>
        <li style={{ display: 'flex', margin: '0px 0px 0px 10px' }}>
          <p
            style={{
              flex: '1 1 20%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Skeleton count={1} circle={true} height={50} width={50} />
          </p>
          <p
            style={{
              flex: '1 1 70%',
              alignSelf: 'flex-end',
            }}>
            <Skeleton count={2} height={10} />
          </p>
        </li>
      </SkeletonTheme>
    </Fragment>
  );
};

export const RightMsgSkeleton = () => {
  return (
    <Fragment>
      <SkeletonTheme color='#ddd' highlightColor='#e8e8e8'>
        <li style={{ display: 'flex', margin: '0px 0px 0px 10px' }}>
          <p
            style={{
              flex: '1 1 70%',
              alignSelf: 'flex-end',
            }}>
            <Skeleton count={2} height={10} />
          </p>
          <p
            style={{
              flex: '1 1 20%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Skeleton count={1} circle={true} height={50} width={50} />
          </p>
        </li>
      </SkeletonTheme>
    </Fragment>
  );
};

export const UersListkeleton = () => {
  return (
    <Fragment>
      <SkeletonTheme color='#ddd' highlightColor='#e8e8e8'>
        <li style={{ display: 'flex', margin: '0px 0px 0px 10px' }}>
          <p
            style={{
              flex: '1 1 70%',
              alignSelf: 'flex-end',
            }}>
            <Skeleton count={2} height={10} />
          </p>
          <p
            style={{
              flex: '1 1 20%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Skeleton count={1} circle={true} height={50} width={50} />
          </p>
        </li>
      </SkeletonTheme>
    </Fragment>
  );
};
