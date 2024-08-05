import React, { useEffect, useState } from 'react';
import templateService from '../../services/template.service';
import Header from '../configPage/header';
import Footer from '../configPage/footer';
import Section from '../configPage/section';
import BackUpUI from './backUpUI';

function GuestUI() {
  const [template, setTemplate] = useState(null);
  const [error, setError] = useState('');
  const [showBackupUI, setShowBackupUI] = useState(false);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    templateService
      .getTemplate()
      .then((response) => {
        console.log('API data: ', response.data);
        if (response && response.data.section) {
          setSections(response.data.section);
          const updatedSections = response.data.section.map((sec) => ({
            ...sec,
            type: Number(sec.type)
          }));
          console.log('Updated Sections: ', updatedSections);
          setTemplate({ ...response.data, section: updatedSections });
        } else {
          setError('Invalid template data');
          setShowBackupUI(true);
        }
      })
      .catch(() => {
        setError('Failed to fetch template');
        setShowBackupUI(true);
      });
  }, []);

  if (showBackupUI) {
    return <BackUpUI />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!template) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="header-wrapper">
        <Header
          logo={template.logo}
          title={template.title}
          avaPath={template.avaPath}
          headerType={template.headerType}
          isEditable={false}
          sectionMenu={sections}
          headerBgColor={template.headerBgColor || '#64748B'}
          headerTextColor={template.headerTextColor || '#000000'}
        />
      </div>
      <div className="flex-1 mb-20 px-4">
        {template.section.map((sec, index) => (
          <Section
            key={index}
            sectionId={sec.id}
            type={sec.type}
            title={sec.title}
            content1={sec.content1}
            content2={sec.content2}
            isEditable={false}
            bgColor={sec.bgColor || '#F3F4F6'}
            textColor={sec.textColor || '#000000'}
          />
        ))}
      </div>
      <div className="footer-wrapper">
        <Footer
          footer={template.footer}
          footerType={template.footerType}
          isEditable={false}
          footerBgColor={template.footerBgColor || '#64748B'}
          footerTextColor={template.footerTextColor || '#000000'}
        />
      </div>
    </div>
  );
}

export default GuestUI;
