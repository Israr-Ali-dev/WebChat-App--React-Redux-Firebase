import React, { useMemo, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Loaders from './Loaders';
import { useDispatch, useSelector, connect } from 'react-redux';
import { setUploadFiles } from '../../../actions/customerSupport/actionCreators';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#4e73df',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  width: 'calc(100% + 1px)',
  padding: '10px 18px',
  paddingTop: '16px',
  position: 'absolute',
  bottom: '10%',
  left: '-3%',
};

const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
  justifyContent: 'center',
  margin: '10px 0px',
};

const thumb = {
  display: 'block',
  flexBasis: '22%',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: 'auto',
  height: 'auto',
  maxWidth: '100%',
};

function CustomDropzone(props) {
  const [files, setFiles] = useState([]);

  let dispatch = useDispatch();

  const onDrop = React.useCallback((acceptedFiles) => {
    if (acceptedFiles) {
      dispatch(setUploadFiles(acceptedFiles));

      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: 'image/*',
    noKeyboard: true,
    multiple: false,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject]
  );

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <img src={file.preview} style={img} />
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  // const filepath = acceptedFiles.map((file) => (
  //   <li key={file.path}>
  //     {/* {console.log(file)} */}
  //     {file.path} - {file.size} bytes
  //   </li>
  // ));

  return (
    <div className='container'>
      <div {...getRootProps({ style })} className='dropzone-style'>
        <input {...getInputProps()} />
        <aside style={thumbsContainer}>{thumbs}</aside>
        <p style={{ textAlign: 'center' }}>Drag 'n' drop some files here</p>
        <button
          type='button'
          className='btn btn-primary btn-sm'
          id='uploadFile'>
          Upload Files
        </button>
      </div>

      {/* {files ? console.log(files) : null} */}
      {/* <aside>
        <h4>Files</h4>
        <ul>{filepath}</ul>
      </aside> */}
    </div>
  );
}

export default connect()(CustomDropzone);
