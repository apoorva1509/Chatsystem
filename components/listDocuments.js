import React, { useCallback } from 'react';
import moment from 'moment';
import { debounce } from 'lodash';
import { gapi } from 'gapi-script';


import { Col, Drawer, Row, Button, Input, Table, Tooltip } from 'antd';
const { Search } = Input;


const ListDocuments = ({ visible, onClose, documents = [], onSearch, signedInUser, onSignOut, isLoading }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Last Modified Date',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
      render: (text) => <span>{moment(text).format('Do MMM YYYY HH:mm A')}</span>,
    },
    {
      title: 'Action',
      key: 'id',
      dataIndex: 'id',
      render: (tag) => (
        <span>
          <Tooltip title="View Document">
            <Button type="primary" onClick={handleDownload(tag)}>
              Select
            </Button>
          </Tooltip>
        </span>
      ),
    },
  ];
  const handleDownload = (fileId) => {
      gapi.client.drive.files.get({ fileId, alt: 'media'
    }, { responseType: 'blob' })
      .then(response => {
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'your_file_name.extension'); // Set the appropriate file name and extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Error fetching file:', error);
      });
  };
  const search = (value) => {
    delayedQuery(`name contains '${value}'`);
  };

  const delayedQuery = useCallback(
    debounce((q) => onSearch(q), 500),
    []
  );

  return (
    <Drawer
      title="Select Google Drive Document"
      placement="right"
      closable
      onClose={onClose}
      visible={visible}
      width={900}
    >
      <Row gutter={16}>
        <Col span={24}>
          <div style={{ marginBottom: 20 }}>
            <p>Signed In as: {`${signedInUser?.Ad} (${signedInUser?.zu})`}</p>
            <Button type="primary" onClick={onSignOut}>
              Sign Out
            </Button>
          </div>

          <div className="table-card-actions-container">
            <div className="table-search-container">
              <Search
                placeholder="Search Google Drive"
                onChange={(e) => search(e.target.value)}
                onSearch={(value) => search(value)}
                className="table-search-input"
                size="large"
                enterButton
              />
            </div>
          </div>
          <Table
            className="table-striped-rows"
            columns={columns}
            dataSource={documents}
            pagination={{ simple: true }}
            loading={isLoading}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default ListDocuments;
