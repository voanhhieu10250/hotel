import React from 'react';
import ImageUploader from '@iso/ui/ImageUploader/ImageUploader';
import Button from '@iso/ui/Antd/Button/Button';
import Heading from '@iso/ui/Heading/Heading';
import { AgentPictureUploader, FormTitle } from './AccountSettings.style';

export default function AgentPictureChangeForm({ user }) {
  return (
    <AgentPictureUploader>
      <FormTitle>Profile Images</FormTitle>
      <Heading content="Cover Image" as="h4" />
      <ImageUploader
        defaultImage={user.coverPic}
        uploadUrl="user/upload-user-cover-pic"
        deleteUrl="user/delete-user-cover-pic"
      />
      <Heading content="Profile Image" as="h4" />
      <ImageUploader
        defaultImage={user.profilePic}
        uploadUrl="user/upload-user-profile-pic"
        deleteUrl="user/delete-user-profile-pic"
      />
      {/* 
      <div className="submit-container">
        <Button htmlType="submit" type="primary">
          Save Changes
        </Button>
      </div> */}
    </AgentPictureUploader>
  );
}
