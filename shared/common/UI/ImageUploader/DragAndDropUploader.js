import React from 'react';
import { IoIosCloudUpload } from 'react-icons/io';
import { Upload, message } from 'antd';
import styled from 'styled-components';
import { apiInstance } from '../../../../packages/hotel/src/context/AuthProvider';

const DraggerWrapper = styled.div``;

const { Dragger } = Upload;

const DragAndDropUploader = ({ onUploadChange, value }) => {
  const props = {
    name: 'file',
    defaultFileList: value,
    customRequest: async ({ file, onSuccess, onError }) => {
      const fmt = new FormData();
      fmt.append('file', file);
      try {
        const { data } = await apiInstance.post(
          'file/upload/hotel-images',
          fmt
        );
        onSuccess(data, file);
      } catch (error) {
        onError(error);
      }
    },
    onChange(info) {
      const { status } = info.file;
      console.log(info);
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
        onUploadChange(info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} photo uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} photo upload failed.`);
      }
    },
    onRemove: async file => {
      // console.log(file);
      try {
        await apiInstance.delete('file/delete', {
          data: {
            fileName: file.response.content.slice(
              file.response.content.indexOf('hotel-images')
            ),
          },
        });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  };

  return (
    <DraggerWrapper className="drag_and_drop_uploader">
      <Dragger {...props} className="uploader">
        <div className="ant-upload-drag-icon">
          <IoIosCloudUpload />
        </div>
        <p className="ant-upload-text">
          Drag & drop to your image assets or browse
        </p>
      </Dragger>
    </DraggerWrapper>
  );
};

export default DragAndDropUploader;
