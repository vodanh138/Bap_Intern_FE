import { Button, Input, Modal } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { LoadingContext } from '../../contexts/LoadingContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import { useAppDispatch } from '../../store/hooks';
import {
  editFooter,
  editHeader,
  getTemplate
} from '../dashboard/templatesSlice';
import BackUpUI from '../templates/backUpUI';
import Footer from './footer';
import Header from './header';
import Section from './section';
import { addSection, deleteSection, editSection } from './sectionSlice';
import ColorPickerComponent from '../../components/ColorPicker';

function ConfigPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [templateData, setTemplateData] = useState({});
  const [sections, setSections] = useState([]);
  const { setIsLoading } = useContext(LoadingContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerAva, setHeaderAva] = useState('');
  const [headerLogo, setHeaderLogo] = useState('');
  const [headerBgColor, setHeaderBgColor] = useState('#64748B');
  const [headerTextColor, setHeaderTextColor] = useState('#000000');
  const [footerContent, setFooterContent] = useState('');
  const [footerBgColor, setFooterBgColor] = useState('#64748B');
  const [footerTextColor, setFooterTextColor] = useState('#000000');
  const { openNotification } = useContext(NotificationContext);
  const [showBackupUI, setShowBackupUI] = useState(false);
  const [headerType, setHeaderType] = useState('');
  const [footerType, setFooterType] = useState('');

  useEffect(() => {
    fetchSections();
  }, [id]);

  useEffect(() => {
    console.log('Header background: ', headerBgColor);
    console.log('Header text: ', headerTextColor);
    console.log('Footer background: ', footerBgColor);
    console.log('Footer text: ', footerTextColor);
  }, [headerBgColor, headerTextColor, footerBgColor, footerTextColor]);

  const fetchSections = () => {
    dispatch(getTemplate(id))
      .unwrap()
      .then((response) => {
        setTemplateData(response);
        setSections(response.section);
        setHeaderTitle(response.title);
        setHeaderAva(response.ava_path);
        setHeaderLogo(response.logo);
        setHeaderType(response.headerType);
        setFooterType(response.footerType);
        setFooterContent(response.footer);
        setHeaderBgColor(response.headerBgColor);
        setHeaderTextColor(response.headerTextColor);
        setFooterBgColor(response.footerBgColor);
        setFooterTextColor(response.footerTextColor);
        console.log('Response: ', response);
      })
      .catch((error) => {
        console.error('Failed to fetch sections:', error);
        setShowBackupUI(true);
      });
  };

  const handleAddSection = () => {
    const templateId = id;
    setIsLoading(true);
    dispatch(addSection(templateId))
      .unwrap()
      .then((response) => {
        setSections((prevSections) => [...prevSections, response.section]);
        openNotification({
          message: t('ADD_SECTION.Success', { ns: 'notification' }),
          type: 'success',
          title: t('NOTI.Success', { ns: 'notification' })
        });
        fetchSections();
      })
      .catch((error) => {
        console.error('Failed to add section:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const confirmDeleteSection = (sectionId) => {
    if (sections.length > 1) {
      setIsModalVisible(true);
      setSectionToDelete(sectionId);
      setModalContent('deleteSection');
    } else {
      openNotification({
        message: t('DELETE_SECTION.One_Section', { ns: 'notification' }),
        type: 'error',
        title: t('NOTI.Error', { ns: 'notification' })
      });
    }
  };

  const handleDeleteSection = () => {
    setIsLoading(true);
    dispatch(deleteSection(sectionToDelete))
      .unwrap()
      .then(() => {
        setSections((prevSections) =>
          prevSections.filter(
            (section) => section.section_id !== sectionToDelete
          )
        );
        openNotification({
          message: t('DELETE_SECTION.Success', { ns: 'notification' }),
          type: 'success',
          title: t('NOTI.Success', { ns: 'notification' })
        });
        fetchSections();
      })
      .catch((error) => {
        openNotification({
          message: t('DELETE_SECTION.Error', { ns: 'notification' }),
          type: 'error',
          title: t('NOTI.Error', { ns: 'notification' })
        });
        console.error('Failed to delete section:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    setIsModalVisible(false);
    setSectionToDelete(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSectionToDelete(null);
  };

  const handleEditSection = (
    sectionId,
    newTitle,
    newContent1,
    newContent2,
    newType,
    newBgColor,
    newTextColor
  ) => {
    console.log('Editing section:', {
      sectionId,
      newTitle,
      newContent1,
      newContent2,
      newType,
      newBgColor,
      newTextColor
    });

    const payload = {
      title: newTitle,
      content1: newContent1,
      content2: newContent2,
      type: Number(newType),
      bgColor: newBgColor,
      textColor: newTextColor
    };

    setIsLoading(true);
    const templateId = id;

    dispatch(
      editSection({
        templateId,
        sectionId,
        section: payload
      })
    )
      .unwrap()
      .then(() => {
        setSections((prevSections) =>
          prevSections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  title: newTitle,
                  content1: newContent1,
                  content2: newContent2,
                  type: newType,
                  bgColor: newBgColor,
                  textColor: newTextColor
                }
              : section
          )
        );
        openNotification({
          message: t('EDIT_SECTION.Success', { ns: 'notification' }),
          type: 'success',
          title: t('NOTI.Success', { ns: 'notification' })
        });
        fetchSections();
      })
      .catch((error) => {
        openNotification({
          message: t('EDIT_SECTION.Empty', { ns: 'notification' }),
          type: 'error',
          title: t('NOTI.Error', { ns: 'notification' })
        });
        console.error('Failed to edit section:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEditHeader = (
    newTitle,
    newHeaderType,
    newBgColor,
    newTextColor
  ) => {
    setIsLoading(true);
    dispatch(
      editHeader({
        id,
        header: {
          title: newTitle,
          headerType: newHeaderType,
          headerBgColor: newBgColor,
          headerTextColor: newTextColor
        }
      })
    )
      .unwrap()
      .then(() => {
        openNotification({
          message: t('EDIT_HEADER.Success', { ns: 'notification' }),
          type: 'success',
          title: t('NOTI.Success', { ns: 'notification' })
        });
        setHeaderTitle(newTitle);
        setHeaderType(newHeaderType);
        setHeaderBgColor(newBgColor);
        setHeaderTextColor(newTextColor);
        fetchSections();
      })
      .catch((error) => {
        openNotification({
          message: t('EDIT_HEADER.Empty', { ns: 'notification' }),
          type: 'error',
          title: t('NOTI.Error', { ns: 'notification' })
        });
        console.error('Failed to edit header:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    setIsModalVisible(false);
  };

  const handleEditFooter = (
    newContent,
    newFooterType,
    newBgColor,
    newTextColor
  ) => {
    setIsLoading(true);
    dispatch(
      editFooter({
        id,
        footer: {
          footer: newContent,
          footerType: newFooterType,
          footerBgColor: newBgColor,
          footerTextColor: newTextColor
        }
      })
    )
      .unwrap()
      .then(() => {
        openNotification({
          message: t('EDIT_FOOTER.Success', { ns: 'notification' }),
          type: 'success',
          title: t('NOTI.Success', { ns: 'notification' })
        });
        setFooterContent(newContent, newFooterType);
        setFooterBgColor(newBgColor);
        setFooterTextColor(newTextColor);
        fetchSections();
      })
      .catch((error) => {
        openNotification({
          message: t('EDIT_FOOTER.Empty', { ns: 'notification' }),
          type: 'error',
          title: t('NOTI.Error', { ns: 'notification' })
        });
        console.error('Failed to edit footer:', error);
      })
      .finally(() => {
        setIsLoading(false);
        setIsModalVisible(false);
      });
  };

  if (showBackupUI) {
    return <BackUpUI />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title={templateData.title || headerTitle}
        headerType={templateData.headerType || headerType}
        onEdit={handleEditHeader}
        ava_path={templateData.ava_path || headerAva}
        sectionMenu={sections}
        headerBgColor={templateData.headerBgColor || headerBgColor}
        headerTextColor={templateData.headerTextColor || headerTextColor}
      />
      <div className="flex-1 mb-20 px-4">
        {sections.map((section) => (
          <Section
            key={section.section_id}
            sectionId={section.id}
            type={Number(section.type)}
            title={section.title}
            content1={section.content1}
            content2={section.content2}
            bgColor={section.bgColor || '#F3F4F6'}
            textColor={section.textColor || '#000000'}
            isDeletable={sections.length > 1}
            onDelete={() => {
              console.log('Deleting section with id:', section.id);
              confirmDeleteSection(section.id);
            }}
            onEdit={(
              newTitle,
              newContent1,
              newContent2,
              newType,
              newBgColor,
              newTextColor
            ) =>
              handleEditSection(
                section.id,
                newTitle,
                newContent1,
                newContent2,
                newType,
                newBgColor,
                newTextColor
              )
            }
          />
        ))}
        <div className="flex justify-end mt-28">
          <Button type="primary" onClick={handleAddSection}>
            {t('CONFIG/PAGE.ADD_MORE_SECTION')}
          </Button>
        </div>
      </div>
      <Footer
        footer={templateData.footer || footerContent}
        footerType={templateData.footerType || footerType}
        footerBgColor={templateData.footerBgColor || footerBgColor}
        footerTextColor={templateData.footerTextColor || footerTextColor}
        onEdit={handleEditFooter}
      />
      <Modal
        title={
          modalContent === 'deleteSection'
            ? t('CONFIG/PAGE.DELETE_SECTION.Confirm')
            : modalContent === 'editHeader'
              ? 'Edit Header'
              : 'Edit Footer'
        }
        open={isModalVisible}
        onOk={
          modalContent === 'deleteSection'
            ? handleDeleteSection
            : modalContent === 'editHeader'
              ? () =>
                  handleEditHeader(
                    headerType,
                    headerTitle,
                    headerBgColor,
                    headerTextColor
                  )
              : () =>
                  handleEditFooter(
                    footerContent,
                    footerType,
                    footerBgColor,
                    footerTextColor
                  )
        }
        onCancel={handleCancel}
        okText={modalContent === 'deleteSection' ? 'Delete' : 'Save'}
        cancelText={t('BUTTON.Cancel')}
      >
        {modalContent === 'deleteSection' ? (
          <p>{t('CONFIG/PAGE.DELETE_SECTION.Content')}</p>
        ) : modalContent === 'editHeader' ? (
          <div>
            <Input
              placeholder="Logo"
              value={headerLogo}
              onChange={(e) => setHeaderLogo(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
            <Input
              placeholder={t('CONFIG/PAGE.EDIT_HEADER.Title_Placeholder')}
              rules={[
                {
                  required: true,
                  message: t('CONFIG/PAGE.EDIT_HEADER.Title_Required')
                }
              ]}
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
            />
            <div className="flex gap-4">
              <ColorPickerComponent
                label="Background color"
                initialColor={headerBgColor}
                onColorChange={(color) => setHeaderBgColor(color)}
              />
              <ColorPickerComponent
                label="Text color"
                initialColor={headerTextColor}
                onColorChange={(color) => setHeaderTextColor(color)}
              />
            </div>
          </div>
        ) : (
          <div>
            <Input
              placeholder="Footer Content"
              value={footerContent}
              onChange={(e) => setFooterContent(e.target.value)}
            />
            <div className="flex gap-4">
              <ColorPickerComponent
                label="Background color"
                initialColor={footerBgColor}
                onColorChange={(color) => setFooterBgColor(color)}
              />
              <ColorPickerComponent
                label="Text color"
                initialColor={footerTextColor}
                onColorChange={(color) => setFooterTextColor(color)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ConfigPage;
