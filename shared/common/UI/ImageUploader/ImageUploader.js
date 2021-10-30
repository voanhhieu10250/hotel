import React from 'react';
import Upload from '../Antd/Upload/Upload';
import Icon from '../Antd/Icon/Icon';
import Modal from '../Antd/Modal/Modal';
import { FaCamera } from 'react-icons/fa';
import { ImageUpload } from './imageUploader.style';
import { apiInstance } from '../../../../packages/hotel/src/context/AuthProvider';
export default class ImageUploader extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.props.defaultImage
      ? [
          {
            uid: '-1',
            name: this.props.defaultImage.name,
            status: 'done',
            url: this.props.defaultImage.url,
          },
        ]
      : [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    console.log(file);
    this.setState({
      previewImage: file.url || file.response.content.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    console.log(fileList);
    this.setState({ fileList });
  };

  handleRemove = async file => {
    console.log(file);
    try {
      await apiInstance.delete(this.props.deleteUrl);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const Dragger = Upload.Dragger;

    const uploadButton = (
      <ImageUpload>
        <div className="image-drag-area">
          <FaCamera />
        </div>
        <div className="ant-upload-text">Upload Photos</div>
      </ImageUpload>
    );
    return (
      <div className="clearfix">
        <Dragger
          customRequest={async ({ file, onSuccess, onError }) => {
            const fmt = new FormData();
            fmt.append('file', file);
            try {
              const { data } = await apiInstance.post(
                this.props.uploadUrl,
                fmt
              );
              onSuccess(data, file);
            } catch (error) {
              onError(error);
            }
          }}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
          className="image_uploader"
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Dragger>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
          width="max-content"
        >
          <img
            alt="image"
            style={{ maxWidth: '75vw', display: 'block' }}
            src={previewImage}
          />
        </Modal>
      </div>
    );
  }
}
