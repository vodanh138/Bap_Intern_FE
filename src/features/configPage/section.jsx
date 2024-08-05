import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Input, Radio, Card } from 'antd';
import { SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import Popup from '../../components/Popup';
import ColorPickerComponent from '../../components/ColorPicker';

function Section({
  sectionId,
  type,
  title,
  content1,
  content2,
  onDelete,
  onEdit,
  isEditable = true,
  isDeletable = true,
  bgColor,
  textColor,
  isLastSection = false
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showContentOption, setShowContentOption] = useState(
    type === 2 ? 'show' : 'hide'
  );
  const { t } = useTranslation();
  const [newTitle, setNewTitle] = useState(title);
  const [newContent1, setNewContent1] = useState(content1);
  const [newContent2, setNewContent2] = useState(content2);
  const [titleError, setTitleError] = useState('');
  const [content1Error, setContent1Error] = useState('');
  const [content2Error, setContent2Error] = useState('');
  const [typeDraft, setTypeDraft] = useState(type);
  // const [contentColor, setContentColor] = useState(textColor || '#000000');
  // const [backgroundColor, setBackgroundColor] = useState(bgColor || '#ecf1f6');
  const [modalContentColor, setModalContentColor] = useState(
    textColor || '#000000'
  );
  const [modalBackgroundColor, setModalBackgroundColor] = useState(
    bgColor || '#ecf1f6'
  );

  useEffect(() => {
    setTypeDraft(type);
    setShowContentOption(type === 2 ? 'show' : 'hide');
    setModalContentColor(textColor);
    setModalBackgroundColor(bgColor);
    console.log('Section props updated:', { type, textColor, bgColor });
  }, [type, textColor, bgColor]);

  const showModal = () => {
    setIsModalVisible(true);
    setTypeDraft(type);
    setShowContentOption(type === 2 ? 'show' : 'hide');
    setModalContentColor(textColor);
    setModalBackgroundColor(bgColor);
  };

  const handleOk = () => {
    let valid = true;

    if (newTitle.length > 20) {
      setTitleError(t('EDIT_SECTION.Title_Error', { ns: 'notification' }));
      valid = false;
    } else if (!newTitle.trim()) {
      setTitleError('Title cannot be empty');
      valid = false;
    } else {
      setTitleError('');
    }

    if (!newContent1.trim()) {
      setContent1Error('Content 1 cannot be empty');
      valid = false;
    } else {
      setContent1Error('');
    }

    if (showContentOption === 'show' && !newContent2.trim()) {
      setContent2Error('Content 2 cannot be empty');
      valid = false;
    } else {
      setContent2Error('');
    }

    if (valid) {
      onEdit(
        newTitle,
        newContent1,
        newContent2,
        typeDraft,
        modalBackgroundColor,
        modalContentColor
      );
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewTitle(title);
    setNewContent1(content1);
    setNewContent2(content2);
    setTitleError('');
    setContent1Error('');
    setContent2Error('');
    setShowContentOption(type === 2 ? 'show' : 'hide');
    setModalBackgroundColor(bgColor);
    setModalContentColor(textColor);
  };

  const handleOptionChange = (e) => {
    const newValue = e.target.value;
    setTypeDraft(newValue);
    if (newValue === 1) {
      setNewContent2('');
    }
    setShowContentOption(newValue === 2 ? 'show' : 'hide');
  };

  const handleTitleChange = (e) => {
    const { value } = e.target;
    setNewTitle(value);
    // if (value.length <= 20) {
    //   message.error(t('EDIT_SECTION.Title_Error', { ns: 'notification' }));
    // } else if (value.trim()) {
    //   setTitleError('');
    // }
  };

  return (
    <section
      id={sectionId}
      className="p-2 mb-5 pb-4 relative top-24"
      style={{ background: bgColor }}
    >
      <div
        className="mb-2"
        style={{ padding: '0px 30%', borderRadius: '10px' }}
      >
        <h2
          className="text-xl font-semibold mb-4 text-center bg-white"
          style={{ color: textColor }}
        >
          {title}
        </h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {type === 1 ? (
          <Card style={{ flex: 1, background: bgColor }}>
            <p
              className="bg-white p-2"
              style={{ overflowWrap: 'break-word', color: textColor }}
            >
              {content1}
            </p>
          </Card>
        ) : (
          <>
            <Card
              style={{
                flex: 1,
                marginRight: showContentOption === 'show' ? '10px' : '0px',
                maxWidth:
                  showContentOption === 'show' ? 'calc(50% - 10px)' : '100%',
                background: bgColor
              }}
            >
              <p
                className="bg-white p-2"
                style={{ overflowWrap: 'break-word', color: textColor }}
              >
                {content1}
              </p>
            </Card>
            {showContentOption === 'show' && (
              <Card
                style={{
                  flex: 1,
                  marginLeft: '10px',
                  maxWidth: 'calc(50% - 10px)',
                  background: bgColor
                }}
              >
                <p
                  className="bg-white p-2"
                  style={{ overflowWrap: 'break-word', color: textColor }}
                >
                  {content2}
                </p>
              </Card>
            )}
          </>
        )}
      </div>
      {isEditable && (
        <div className="flex justify-end">
          <Button
            type="text"
            icon={<SettingOutlined />}
            className="text-gray-500"
            onClick={showModal}
          />
          {!isLastSection && (
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-gray-500"
              onClick={isDeletable ? onDelete : null}
              disabled={!isDeletable}
            />
          )}
        </div>
      )}
      <Popup
        title={t('CONFIG/PAGE.EDIT_SECTION.Title')}
        isOpen={isModalVisible}
        onConfirm={handleOk}
        onCancel={handleCancel}
        text={t('BUTTON.Save')}
      >
        <Input
          placeholder={t('CONFIG/PAGE.EDIT_SECTION.Section_Title')}
          value={newTitle}
          onChange={handleTitleChange}
          style={{ marginBottom: '10px' }}
        />
        {titleError && <p className="text-red-500">{titleError}</p>}
        <Input
          placeholder={t('CONFIG/PAGE.EDIT_SECTION.Section_Content_1')}
          value={newContent1}
          onChange={(e) => setNewContent1(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        {content1Error && <p className="text-red-500">{content1Error}</p>}
        {showContentOption === 'show' && (
          <Input
            placeholder={t('CONFIG/PAGE.EDIT_SECTION.Section_Content_2')}
            value={newContent2}
            onChange={(e) => setNewContent2(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
        )}
        {showContentOption === 'show' && content2Error && (
          <p className="text-red-500">{content2Error}</p>
        )}
        <Radio.Group
          onChange={handleOptionChange}
          value={typeDraft}
          style={{ marginBottom: '10px' }}
        >
          <Radio value={1}>{t('CONFIG/PAGE.EDIT_SECTION.Type_1')}</Radio>
          <Radio value={2}>{t('CONFIG/PAGE.EDIT_SECTION.Type_2')}</Radio>
        </Radio.Group>
        {/* Change color */}
        <ColorPickerComponent
          label="Content Color"
          initialColor={modalContentColor}
          onColorChange={setModalContentColor}
        />
        <ColorPickerComponent
          label="Background Color"
          initialColor={modalBackgroundColor}
          onColorChange={setModalBackgroundColor}
        />
        <Card
          className="mt-5 relative"
          style={{ background: modalBackgroundColor }}
        >
          <div
            className="mb-2"
            style={{ padding: '0px 30%', borderRadius: '10px' }}
          >
            <h2
              className="text-xl font-semibold mb-4 text-center bg-white"
              style={{ color: modalContentColor }}
            >
              {newTitle}
            </h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Card
              style={{
                flex: 1,
                marginRight: showContentOption === 'show' ? '10px' : '0px',
                maxWidth:
                  showContentOption === 'show' ? 'calc(50% - 10px)' : '100%',
                background: modalBackgroundColor
              }}
            >
              <p
                className="bg-white p-2"
                style={{ overflowWrap: 'break-word', color: modalContentColor }}
              >
                {newContent1}
              </p>
            </Card>
            {showContentOption === 'show' && (
              <Card
                style={{
                  flex: 1,
                  marginLeft: '10px',
                  maxWidth: 'calc(50% - 10px)',
                  background: modalBackgroundColor
                }}
              >
                <p
                  className="bg-white p-2"
                  style={{
                    overflowWrap: 'break-word',
                    color: modalContentColor
                  }}
                >
                  {newContent2}
                </p>
              </Card>
            )}
          </div>
        </Card>
      </Popup>
    </section>
  );
}

Section.propTypes = {
  sectionId: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  content1: PropTypes.string,
  content2: PropTypes.string,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  isEditable: PropTypes.bool,
  isDeletable: PropTypes.bool,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  isLastSection: PropTypes.bool
};

Section.defaultProps = {
  isEditable: true,
  isDeletable: true,
  bgColor: '#F3F4F6',
  textColor: '#000000',
  isLastSection: false
};

export default Section;
