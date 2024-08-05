import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginAsync, selectAuth } from './authSlice';
import { LoadingContext } from '../../contexts/LoadingContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import TokenService from '../../services/token.service';
import BackUpUI from '../templates/backUpUI';

export function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoggedIn } = useAppSelector(selectAuth);
  const { setIsLoading } = useContext(LoadingContext);
  const { openNotification } = useContext(NotificationContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationShown, setNotificationShown] = useState(false);
  const [showBackupUI, setShowBackupUI] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const onFinish = async (values) => {
    const { username, password } = values;

    setIsLoading(true);
    setIsSubmitting(true);

    try {
      const response = await dispatch(
        loginAsync({ username, password })
      ).unwrap();
      openNotification({
        message: t('LOGIN.Success', {ns: 'notification'}),
        type: 'success',
        title: t('NOTI.Success', {ns: 'notification'}),
      });
      TokenService.setUser(response.data);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (!notificationShown && error === 'Username or password incorrect') {
        openNotification({
          message: t('LOGIN.Error', {ns: 'notification'}),
          type: 'error',
          title: t('NOTI.Error', {ns: 'notification'}),
        });
        setNotificationShown(true);
      } else if (error === t('LOGIN.Title', {ns: 'notification'})) {
        setShowBackupUI(true);
      }
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  if (showBackupUI) {
    return <BackUpUI />;
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center">{t('ADMIN/LOGIN.Title')}</h2>
        <Form
          name="loginForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={() => {
            setNotificationShown(false);
          }}
        >
          <Form.Item
            label={t('ADMIN/LOGIN.Username')}
            name="username"
            rules={[{ required: true, message: t('ADMIN/LOGIN.Username_Required') }]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="mt-2"
          >
            <Input placeholder={t('ADMIN/LOGIN.Username_Placeholder')} />
          </Form.Item>
          <Form.Item
            label={t('ADMIN/LOGIN.Password')}
            name="password"
            rules={[{ required: true, message: t('ADMIN/LOGIN.Password_Required') }]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className='mt-2'
          >
            <Input.Password placeholder={t('ADMIN/LOGIN.Password_Placeholder')} />
          </Form.Item>

          <Form.Item className="flex justify-center ">
            <Button
              type="primary"
              htmlType="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {t('ADMIN/LOGIN.Submit')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </main>
  );
}
