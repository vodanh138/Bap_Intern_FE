import React, { useContext, useEffect, useState } from 'react';
import {
  Layout,
  Space,
  Avatar,
  Button,
  Form,
  Input,
  Radio,
  List,
  Popconfirm
} from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Popup from '../../components/Popup';
import { LoadingContext } from '../../contexts/LoadingContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import { logoutAsync, selectAuth } from '../auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getAllTemplates,
  chooseTemplate,
  deleteTemplate,
  addTemplate,
  cloneTemplate
} from './templatesSlice';
import useTemplateModals from '../../store/useTemplateModals';
import BackUpUI from '../templates/backUpUI';
import CardComponent from '../../components/Card';
import ChatBox from '../../components/Chatbox';

const { Header, Content } = Layout;

function Dashboard() {
  const { setIsLoading } = useContext(LoadingContext);
  const { openNotification } = useContext(NotificationContext);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { templates, chosen, status, error } = useAppSelector(
    (state) => state.templates
  );
  const [templateName, setTemplateName] = useState('');
  const [showBackupUI, setShowBackupUI] = useState(false);
  const { t } = useTranslation();
  const fetchTemplates = () => {
    setIsLoading(true);
    dispatch(getAllTemplates())
      .unwrap()
      .then((response) => {
        console.log('Fetched templates:', response);
        setSelectedTemplate(response.chosen);
      })
      .catch((err) => {
        console.error('Error fetching templates:', err);
        setShowBackupUI(true);
      })
      .finally(() => setIsLoading(false));
  };

  const {
    selectedTemplate,
    selectedTemplateId,
    selectedTemplatesToDelete,
    isAddTemplateModalOpen,
    isDeleteTemplateModalOpen,
    isConfigTemplateModalOpen,
    isCloneTemplate,
    form,
    handleTemplateChange,
    handleConfirmDelete,
    showAddTemplateModal,
    showDeleteTemplateModal,
    showConfigTemplateModal,
    handleCancel,
    handleOk,
    setIsCloneTemplate,
    setShowPopconfirm,
    setIsDeleteTemplateModalOpen,
    setIsAddTemplateModalOpen,
    setSelectedTemplate,
    setSelectedTemplatesToDelete,
    setSelectedTemplateId,
    handleTemplateIdChange
  } = useTemplateModals(fetchTemplates, chosen);

  const handleTemplateDelete = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedTemplatesToDelete((prev) => [...prev, value]);
    } else {
      setSelectedTemplatesToDelete((prev) =>
        prev.filter((item) => item !== value)
      );
    }
  };
  const handlePopconfirmConfirm = () => {
    setIsLoading(true);
    dispatch(deleteTemplate(selectedTemplatesToDelete))
      .unwrap()
      .then((response) => {
        openNotification({
          message: t('DELETE_TEMPLATE.Success', {ns: 'notification'}),
          type: 'success',
          title: t('NOTI.Success', {ns: 'notification'})
        });
        console.log('Template deleted:', response);
        fetchTemplates();
      })
      .catch((err) => {
        console.error('Error deleting template:', err);
        openNotification({
          message: t('DELETE_TEMPLATE.Error', {ns: 'notification'}),
          type: 'error',
          title: t('NOTI.Error', {ns: 'notification'})
        });
        fetchTemplates();
      })
      .finally(() => {
        setIsLoading(false);
        setShowPopconfirm(false);
        setIsDeleteTemplateModalOpen(false);
        setSelectedTemplatesToDelete([]);
      });
  };

  const handleAddTemplate = (templates) => {
    setIsLoading(true);
    dispatch(addTemplate(templates))
      .unwrap()
      .then((response) => {
        openNotification({
          message: t('ADD_TEMPLATE.Success', {ns: 'notification'}),
          type: 'success',
          title: 'Success'
        });
        fetchTemplates();
        setIsAddTemplateModalOpen(false);
        form.resetFields();
        onFinishComplete(response.id);
      })
      .catch((err) => {
        console.error('Error adding template:', err);
        let errorMessage = t('ADD_TEMPLATE.Duplicate', {ns: 'notification'});

        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }

        openNotification({
          message: errorMessage,
          type: 'error',
          title: t('NOTI.Error', {ns: 'notification'})
        });
      })
      .finally(() => {
        setIsLoading(false);
        setIsAddTemplateModalOpen(false);
      });
  };

  const handleCloneTemplate = (id, name) => {
    if (!selectedTemplateId) {
      openNotification({
        message: t('CLONE_TEMPLATE.Error', {ns: 'notification'}),
        type: 'error',
        title: 'Error'
      });
      return;
    }
    setIsLoading(true);
    dispatch(cloneTemplate({ id, name: { name } }))
      .unwrap()
      .then((response) => {
        openNotification({
          message: t('CLONE_TEMPLATE.Success', {ns: 'notification'}),
          type: 'success',
          title: t('NOTI.Success', {ns: 'notification'})
        });
        fetchTemplates();
        setIsAddTemplateModalOpen(false);
        form.resetFields();
        onFinishComplete(response.template.data.id);
      })
      .catch((err) => {
        console.error('Error cloning template:', err);
        openNotification({
          message: t('CLONE_TEMPLATE.Duplicate', {ns: 'notification'}),
          type: 'error',
          title: t('NOTI.Error', {ns: 'notification'})
        });
        setIsAddTemplateModalOpen(false);
        fetchTemplates();
      })
      .finally(() => setIsLoading(false));
  };

  const onFinishComplete = (id) => {
    window.open(`${window.location.origin}/admin/config-page/${id}`, '_blank');
  };

  const onFinish = (values) => {
    setIsAddTemplateModalOpen(false);
    if (isCloneTemplate) {
      handleCloneTemplate(selectedTemplateId, values.name);
    } else {
      handleAddTemplate(values);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setIsCloneTemplate(value === 'Clone Template');

    if (value === 'Clone Template' && templates.length > 0) {
      setSelectedTemplateId(templates[0].id);
    } else if (value === 'New Template') {
      setSelectedTemplateId(templates[0].id);
    } else {
      setSelectedTemplateId('');
    }
  };

  const handleSettingClick = (templateValue) => {
    window.open(
      `${window.location.origin}/admin/config-page/${templateValue}`,
      '_blank'
    );
  };

  const handleLogout = () => {
    setIsLoading(true);
    dispatch(logoutAsync())
      .unwrap()
      .then(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handlChooseTemplate = () => {
    setIsLoading(true);
    dispatch(chooseTemplate(selectedTemplate))
      .unwrap()
      .then((response) => {
        openNotification({
          message: t('CHOOSE_TEMPLATE.Success', {ns: 'notification'}),
          type: 'success',
          title: t('NOTI.Success', {ns: 'notification'})
        });
        console.log('Template chosen:', response);
        fetchTemplates();
      })
      .catch((err) => {
        console.error('Error choosing template:', err);
      })
      .finally(() => setIsLoading(false));
  };
  if (showBackupUI) {
    return <BackUpUI />;
  }
  return (
    <div className="min-h-screen">
      <Layout className="min-h-screen w-full">
        <Header className="bg-transparent z-40 mt-4 fixed w-full top-0 right-0 transition-all">
          <div className="rounded-lg h-full shadow-md px-4 bg-white text-end">
            <Space
              size="middle"
              align="center"
              className="text-black hover:text-slate-500"
            >
              <div className="flex">
                <Avatar shape="square" size="large" icon={<UserOutlined />} />
                <div className="ml-2">
                  <p className="text-lg text-start m-0 mb-2 leading-none font-semibold">
                              {user?.username}

                  </p>
                  <p className="m-0 leading-none text-start">{user?.role}</p>
                </div>
              </div>
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={() => {
                  handleLogout();
                  window.location.href = '/admin/login';
                }}
                className="w-full border-none bg-transparent text-start p-0 m-0"
              />
            </Space>
          </div>
        </Header>

        <Content className="bg-transparent rounded-lg mb-4 mx-4 md:mx-10 mt-[92px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {/* Template */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-semibold mb-4">{t('ADMIN/DASHBOARD.Template.Title')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {status === 'loading' && setIsLoading(true)}
                {status === 'succeeded' &&
                  templates?.map((item) => (
                    <CardComponent
                      key={item.id}
                      item={{ id: item.id, name: item.name }}
                      value={selectedTemplate}
                      onChange={handleTemplateChange}
                      type={1} // 'Radio'
                    />
                  ))}
              </div>
              <div className="w-full flex justify-end mt-4">
                <Button
                  className="!bg-primary-dominant hover:!bg-primary-dominant-dark focus:!bg-primary-dominant-light"
                  type="primary"
                  onClick={handlChooseTemplate}
                >
                  {t('BUTTON.Save')}
                </Button>
              </div>
            </div>
            {/* Config */}
            <div className="bg-white rounded-lg p-4 ml-4 shadow-md flex-1 h-[280px]">
              <h2 className="text-lg font-semibold items-start m-[4]">
                {t('ADMIN/DASHBOARD.CONFIG.Config')}
              </h2>
              <div className="flex flex-col space-y-4 justify-between items-center w-2/4 mx-auto">
                <Button
                  type="primary"
                  block
                  className="!bg-primary-dominant hover:!bg-primary-dominant-dark focus:!bg-primary-dominant-light"
                  onClick={showAddTemplateModal}
                >
                  {t('ADMIN/DASHBOARD.CONFIG.Add_Template.Title')}
                </Button>
                <Popup
                  title={t('ADMIN/DASHBOARD.CONFIG.Add_Template.Title')}
                  isOpen={isAddTemplateModalOpen}
                  onOk={onFinish}
                  onCancel={() => {
                    handleCancel();
                    setTemplateName('');
                  }}
                  footer={[
                    <Button
                      key="back"
                      onClick={() => {
                        setTemplateName('');
                        handleCancel();
                      }}
                    >
                      {t('BUTTON.Cancel')}
                    </Button>,
                    <Button
                      form="addConfigForm"
                      key="submit"
                      type="primary"
                      htmlType="submit"
                      disabled={
                        (!selectedTemplateId && isCloneTemplate) ||
                        (templateName.trim() === '' && !isCloneTemplate)
                      }
                    >
                      {t('BUTTON.Create')}
                    </Button>
                  ]}
                >
                  <Form
                    form={form}
                    id="addConfigForm"
                    initialValues={{
                      configValue: 'New Template'
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                  >
                    <Form.Item
                      label={t('ADMIN/DASHBOARD.CONFIG.Add_Template.Template_Name')}
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: t('ADMIN/DASHBOARD.CONFIG.Add_Template.Title_Required')
                        }
                      ]}
                    >
                      <Input
                        onChange={(e) => setTemplateName(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      label={t('ADMIN/DASHBOARD.CONFIG.Add_Template.Template_Option')}
                      name="configValue"
                      rules={[
                        { required: true, message: t('ADMIN/DASHBOARD.CONFIG.Add_Template.Choose_Option_Required') }
                      ]}
                    >
                      <Radio.Group
                        onChange={handleRadioChange}
                        value={
                          isCloneTemplate ? 'Clone Template' : 'New Template'
                        }
                      >
                        <Radio value="New Template">{t('ADMIN/DASHBOARD.CONFIG.Add_Template.New_Template')}</Radio>  
                        <Radio value="Clone Template">{t('ADMIN/DASHBOARD.CONFIG.Add_Template.Clone_Template')}</Radio>
                      </Radio.Group>
                    </Form.Item>

                    {isCloneTemplate && (
                      <div className="flex flex-wrap">
                        {status === 'loading' && setIsLoading(true)}
                        {status === 'failed' && <p>{error}</p>}
                        {status === 'succeeded' &&
                          templates?.map((item) => (
                            <div
                              className="w-full sm:w-1/2 lg:w-1/2 xl:w-1/2 mb-4"
                              key={item.id}
                            >
                              <div className="mx-2">
                                <CardComponent
                                  item={{ id: item.id, name: item.name }}
                                  value={selectedTemplateId}
                                  onChange={handleTemplateIdChange}
                                  type={1} // 'Radio'
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </Form>
                </Popup>

                <Button type="primary" block onClick={showConfigTemplateModal}>
                  {t('ADMIN/DASHBOARD.CONFIG.Config_Template')}
                </Button>
                <Popup
                  title={t('ADMIN/DASHBOARD.CONFIG.Config')}
                  isOpen={isConfigTemplateModalOpen}
                  onConfirm={handleOk}
                  onCancel={handleCancel}
                  footer={null}
                >
                  <div className="flex flex-wrap -mx-2">
                    {templates?.map((item) => (
                      <div className="w-full sm:w-1/2" key={item.id}>
                        <div className="m-2">
                          <List
                            itemLayout="horizontal"
                            dataSource={[item]}
                            bordered
                            renderItem={(item) => (
                              <List.Item
                                actions={[
                                  <Button
                                    key="setting"
                                    type="text"
                                    icon={<SettingOutlined />}
                                    onClick={() => handleSettingClick(item.id)}
                                    className="text-primary-dominant"
                                  />
                                ]}
                              >
                                <p>{item.name}</p>
                              </List.Item>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Popup>

                <Button type="primary" block onClick={showDeleteTemplateModal}>
                  {t('ADMIN/DASHBOARD.CONFIG.Delete_Template')}
                </Button>
              </div>
              <Popup
                title={t('ADMIN/DASHBOARD.CONFIG.Delete_Template')}
                isOpen={isDeleteTemplateModalOpen}
                onOk={handleConfirmDelete}
                onCancel={handleCancel}
                footer={[
                  <Button key="back" onClick={handleCancel}>
                    {t('BUTTON.Cancel')}
                  </Button>,
                  <Popconfirm
                    title={t('ADMIN/DASHBOARD.CONFIG.Delete_Template_Confirm')}
                    onConfirm={handlePopconfirmConfirm}
                    onCancel={() => setShowPopconfirm(false)}
                    okText={t('BUTTON.Yes')}
                    cancelText={t('BUTTON.No')}
                    key="confirm"
                  >
                    <Button
                      type="primary"
                      disabled={selectedTemplatesToDelete.length === 0}
                    >
                     {t('BUTTON.Delete')}
                    </Button>
                  </Popconfirm>
                ]}
              >
                <div className="flex flex-wrap space-y-0">
                  {templates?.map((item) => (
                    <div className="w-full sm:w-1/2 mt-0" key={item.id}>
                      <div className="m-2">
                        <CardComponent
                          item={{ id: item.id, name: item.name }}
                          value={item.id}
                          onChange={handleTemplateDelete}
                          checked={selectedTemplatesToDelete.includes(item.id)}
                          disabled={item.id === chosen}
                          type={2} // 'Checkbox'
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Popup>
            </div>
          </div>

        </Content>
        <ChatBox/>
      </Layout>
    </div>
  );
}

export default Dashboard;
