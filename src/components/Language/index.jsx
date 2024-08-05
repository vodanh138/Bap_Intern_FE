import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, Button } from 'antd';

import VnImage from '../../assets/vietnam.png';
import UsImage from '../../assets/us.png';

function LanguagePicker() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'us'
  );
  const flag = language === 'vn' ? 'vn' : 'us';

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleLanguageChange = (lang) => {
    localStorage.setItem('language', lang);
    setLanguage(lang);
  };

  const menuItems = [
    {
      key: 'vn',
      label: (
        <div className='flex items-center'>
          <img src={VnImage} alt="Vietnamese" className="w-6 h-4 mr-2 rounded-sm" />
          Vietnamese
        </div>
      ),
      onClick: () => handleLanguageChange('vn')
    },
    {
      key: 'us',
      label: (
        <div className='flex items-center'>
          <img src={UsImage} alt="English" className="w-6 h-4 mr-2 rounded-sm " /> English
        </div>
      ),
      onClick: () => handleLanguageChange('us')
    }
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      className="shadow-2xl"
      placement="topRight"
      arrow
    >
      <Button size="large" shape="circle">
        <img
          src={flag === 'vn' ? VnImage : UsImage}
          alt="Language"
          className="w-6 h-4 rounded-sm"
        />
      </Button>
    </Dropdown>
  );
}

export default LanguagePicker;
